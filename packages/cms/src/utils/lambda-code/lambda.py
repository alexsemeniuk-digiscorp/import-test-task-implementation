from posixpath import join
import time
import boto3
import botocore
import glob
import json
import logging
import os
import pwd
import subprocess
import shutil
from urllib.parse import unquote_plus
from aws_lambda_powertools import Logger, Metrics
import tarfile
import csv
import uuid
import psycopg2
import secrets
import string
from PIL import Image
import blurhash
import mimetypes

logger = Logger()
metrics = Metrics()

s3_resource = boto3.resource("s3")
s3_client = boto3.client("s3")

SOURCE_BUCKET = 'caratiqdemo'
DEST_BUCKET = 'caratiqdemo-infected'

INPROGRESS = "IN PROGRESS"
CLEAN = "CLEAN"
INFECTED = "INFECTED"
ERROR = "ERROR"
SKIP = "N/A"

MAX_BYTES = 4000000000


class ClamAVException(Exception):
    """Raise when ClamAV returns an unexpected exit code"""

    def __init__(self, message):
        self.message = message

    def __str__(self):
        return str(self.message)


class ArchiveException(Exception):
    """Raise when 7za exits with an unexpected code"""

    def __init__(self, message):
        self.message = message

    def __str__(self):
        return str(self.message)


class FileTooBigException(Exception):
    """Raise when file(s) is/are too large for ClamAV to scan"""

    def __init__(self, message):
        self.message = message

    def __str__(self):
        return str(self.message)


@metrics.log_metrics(capture_cold_start_metric=True)
@logger.inject_lambda_context(log_event=True)
def lambda_handler(event, context):
    logger.info(json.dumps(event))
    bucket_info = event["Records"][0]["s3"]
    input_bucket = bucket_info["bucket"]["name"]
    input_key = unquote_plus(bucket_info["object"]["key"])
    summary = ""
    if not input_key.endswith("/"):
        mount_path = os.environ["EFS_MOUNT_PATH"]
        definitions_path = f"{mount_path}/{os.environ['EFS_DEF_PATH']}"
        payload_path = f"{mount_path}/{context.aws_request_id}"
        tmp_path = f"{payload_path}-tmp"
        file_path = os.path.join(payload_path, input_key)
        set_status(input_bucket, input_key, INPROGRESS)
        create_dir(input_bucket, input_key, payload_path)
        create_dir(input_bucket, input_key, tmp_path)
        download_object(input_bucket, input_key, payload_path )

        handle_tar_file(file_path, payload_path, input_bucket, input_key)
        expand_if_large_archive(
            input_bucket,
            input_key,
            payload_path,
            bucket_info["object"]["size"],
        )
        create_dir(input_bucket, input_key, definitions_path)
        summary = scan(
            input_bucket, input_key, payload_path, definitions_path, tmp_path
        )
        delete(payload_path)
        delete(tmp_path)
    else:
        summary = {
            "source": "serverless-clamscan",
            "input_bucket": input_bucket,
            "input_key": input_key,
            "status": SKIP,
            "message": "S3 Event trigger was for a non-file object",
        }
    logger.info(summary)
    return summary


def set_status(bucket, key, status):
    """Set the scan-status tag of the S3 Object"""
    old_tags = {}
    try:
        response = s3_client.get_object_tagging(Bucket=bucket, Key=key)
        old_tags = {i["Key"]: i["Value"] for i in response["TagSet"]}
    except botocore.exceptions.ClientError as e:
        logger.debug(e.response["Error"]["Message"])
    new_tags = {"scan-status": status}
    tags = {**old_tags, **new_tags}
    s3_client.put_object_tagging(
        Bucket=bucket,
        Key=key,
        Tagging={
            "TagSet": [
                {"Key": str(k), "Value": str(v)} for k, v in tags.items()
            ]
        },
    )
    metrics.add_metric(name=status, unit="Count", value=1)
    if status == INFECTED:
        copy_source = {'Bucket': SOURCE_BUCKET, 'Key': key}
        s3_client.copy_object(CopySource=copy_source, Bucket=DEST_BUCKET, StorageClass='GLACIER', Key=key)
        s3_client.put_object_tagging(
            Bucket=DEST_BUCKET,
            Key=key,
            Tagging={
                "TagSet": [
                    {"Key": str(k), "Value": str(v)} for k, v in tags.items()
                ]
            },
        )
        s3_client.delete_object(Bucket=bucket, Key=key)


def create_dir(input_bucket, input_key, download_path):
    """Creates a directory at the specified location
    if it does not already exists"""
    sub_dir = os.path.dirname(input_key)
    full_path = download_path
    if len(sub_dir) > 0:
        full_path = os.path.join(full_path, sub_dir)
    if not os.path.exists(full_path):
        try:
            os.makedirs(full_path, exist_ok=True)
        except OSError as e:
            report_failure(input_bucket, input_key, download_path, str(e))

def extract_tar_info(file_name):
    """Парсит TAR имя файла как [importingSessionId:tenantId:userId:fileTotal:sessionId].tar"""
    try:
        base = os.path.splitext(os.path.basename(file_name))[0]

        parts = base.split(":")

        if len(parts) != 5:
            raise ValueError(f"Invalid TAR name format, expected format [importingSessionId:tenantId:userId:fileTotal:sessionId].tar, got {len(parts)} parts.")

        return {
            "importing_session_id": parts[0],
            "tenant_id": parts[1],
            "user_id": parts[2],
            "file_total": int(parts[3]),
            "process_id": parts[4],
        }
    except Exception as e:
        logger.error(f"Failed to parse TAR file name {file_name}: {str(e)}")
        raise

def get_db_connection():
    return psycopg2.connect(
        host=os.environ['RDS_HOST'],
        port=os.environ.get('RDS_PORT', 5432),
        database=os.environ['RDS_DB'],
        user=os.environ['RDS_USER'],
        password=os.environ['RDS_PASSWORD']
    )

def example_query():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT now();")
    result = cursor.fetchone()
    cursor.close()
    conn.close()
    logger.info(f"RDS query result (current time): {result}")

def download_object(input_bucket, input_key, download_path):
    """Downloads the specified file from S3 to EFS"""
    try:
        s3_resource.Bucket(input_bucket).download_file(
            input_key, f"{download_path}/{input_key}"
        )
        logger.info("FILES DOWNLOADED")
    except botocore.exceptions.ClientError as e:
        report_failure(
            input_bucket,
            input_key,
            download_path,
            e.response["Error"]["Message"],
        )

def is_tar_file(file_path):
    return tarfile.is_tarfile(file_path)


def get_image_metadata(file_path):
    """Получает метаданные изображения"""
    with Image.open(file_path) as img:
        width, height = img.size
        mime = Image.MIME[img.format]
        size = os.path.getsize(file_path) / 1024  # KB
        return width, height, mime, size

def generate_blurhash(file_path):
    """Генерирует BlurHash изображения"""
    with Image.open(file_path) as img:
        img = img.convert("RGB")
        return blurhash.encode(img, x_components=4, y_components=3)

def create_db_report_record(file_name, unique_id, bucket, key, file_path, tenant_id, importing_session_id, rds_conn):
    """Создает запись в RDS базе данных с метаданными для CSV, обновляет использование хранилища арендатора и добавляет связь (related morph)"""
    cursor = rds_conn.cursor()
    # === 1. Get CSV file metadata ===
    size = os.path.getsize(file_path)  # Get the file size in bytes
    mime = 'text/csv'  # CSV MIME type
    row_count = get_csv_row_count(file_path)  # You might want to calculate row count for CSV files
    column_count = get_csv_column_count(file_path)  # Optional: Get column count for additional metadata

    # === 2. Insert file metadata into `files` table ===
    insert_query = """
        INSERT INTO files (
            name, alternative_text, width, height,
            mime, size, url, provider, hash, folder_path, blurhash
        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        RETURNING id
    """
    # For CSV, there’s no width/height or blurhash, so set them to None
    width = None
    height = None
    blur_hash = None
    url = f"https://{bucket}.s3.amazonaws.com/{key}"
    provider = "aws-s3"
    folder_path = "/1"
    file_hash = unique_id

    cursor.execute(insert_query, (
        file_name,
        unique_id,
        width,
        height,
        mime,
        size,
        url,
        provider,
        file_hash,
        folder_path,
        blur_hash
    ))

    file_id = cursor.fetchone()[0]

    # === 3. Update tenant storage usage ===
    cursor.execute("SELECT storage_usage FROM tenants WHERE id = %s", (tenant_id,))
    result = cursor.fetchone()
    current_usage = float(result[0]) if result and result[0] is not None else 0.0
    new_usage = round(current_usage + size, 2)

    cursor.execute(
        "UPDATE tenants SET storage_usage = %s WHERE id = %s",
        (new_usage, tenant_id)
    )

    # === 4. Insert into `related_morph` table ===
    morph_query = """
        INSERT INTO files_related_morphs (
            file_id, related_id, related_type, field, "order"
        ) VALUES (%s, %s, %s, %s, %s)
    """
    cursor.execute(morph_query, (
        file_id,
        importing_session_id,
        'api::importing-session.importing-session',
        'srcFile',
        1
    ))

    rds_conn.commit()
    logger.info(f"DB record created for {file_name}, tenant {tenant_id} storage updated to {new_usage}, morph relation added.")

def get_csv_row_count(file_path):
    """Returns the number of rows in the CSV file."""
    with open(file_path, 'r') as f:
        return sum(1 for row in f)

def get_csv_column_count(file_path):
    """Returns the number of columns in the first row of the CSV file."""
    with open(file_path, 'r') as f:
        first_row = f.readline()
        return len(first_row.split(','))


def create_db_record(file_name, unique_id, bucket, key, file_path, tenant_id, rds_conn):
    """Создает запись в RDS базе данных с метаданными и обновляет использование хранилища арендатора"""

    width, height, mime, size = get_image_metadata(file_path)
    blur_hash = generate_blurhash(file_path)
    cursor = rds_conn.cursor()

    # === 1. Insert file metadata into `files` table ===
    insert_query = """
        INSERT INTO files (
            name, alternative_text, width, height,
            mime, size, url, provider, hash, folder_path, blurhash
        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """

    url = f"https://{bucket}.s3.amazonaws.com/{key}"
    provider = "aws-s3"
    folder_path = "/1"
    file_hash = unique_id  # Or calculate the actual hash

    cursor.execute(insert_query, (
        file_name,
        unique_id,
        width,
        height,
        mime,
        size,
        url,
        provider,
        file_hash,
        folder_path,
        blur_hash
    ))

    # === 2. Update tenant storage usage ===
    cursor.execute("SELECT storage_usage FROM tenants WHERE id = %s", (tenant_id,))
    result = cursor.fetchone()
    current_usage = float(result[0]) if result and result[0] is not None else 0.0
    new_usage = round(current_usage + size, 2)

    cursor.execute(
        "UPDATE tenants SET storage_usage = %s WHERE id = %s",
        (new_usage, tenant_id)
    )

    rds_conn.commit()
    logger.info(f"DB record created for {file_name}, tenant {tenant_id} storage updated to {new_usage}")


def update_individual_csv_report(report_folder, file_name, unique_id, status):
    """Создает отдельный CSV отчет для каждого файла"""
    try:
        sanitized_name = os.path.splitext(file_name)[0].replace(" ", "_")
        csv_filename = f"{sanitized_name}_{unique_id}.csv"
        csv_path = os.path.join(report_folder, csv_filename)

        # Запись данных в CSV
        with open(csv_path, mode="w", newline="") as csvfile:
            writer = csv.writer(csvfile)
            writer.writerow(["file_name", "unique_id", "status"])  # Заголовки
            writer.writerow([file_name, unique_id, status])        # Данные

        logger.info(f"Individual CSV created for {file_name} at {csv_path}")
    except Exception as e:
        logger.error(f"Failed to create CSV for {file_name}: {str(e)}")

def generate_custom_id(length=11):
    characters = string.ascii_uppercase + string.digits
    id = "#"
    for _ in range(length):
        id += secrets.choice(characters)
    return id


def insert_notification(process_id, user_id, rds_conn):
    cursor = rds_conn.cursor()
    try:
        # Insert into bulk_images_notifies
        query = """
            INSERT INTO bulk_images_notifies (updated_at, created_at)
            VALUES (NOW(), NOW())
            RETURNING id;
        """
        cursor.execute(query)
        bulk_images_notify_id = cursor.fetchone()[0]  # Get the inserted ID

 # Insert into user_notifications (requires has_been_seen and type)
        query = """
            INSERT INTO user_notifications (has_been_seen, type)
            VALUES (%s, %s)
            RETURNING id;
        """
        cursor.execute(query, (False, "BulkUpload"))
        user_notification_id = cursor.fetchone()[0]  # Get the inserted ID

        # Insert into user_notification_id (requires user_notification_id, user_id)
        query = """
            INSERT INTO user_notifications_user_links (user_notification_id, user_id)
            VALUES (%s, %s)
            RETURNING id;
        """
        cursor.execute(query, (user_notification_id, user_id))
        user_notification_id = cursor.fetchone()[0]  # Get the inserted ID

        # Insert into user_notifications_images_notify_links
        query = """
            INSERT INTO user_notifications_images_notify_links (user_notification_id, bulk_images_notify_id, user_notification_order)
            VALUES (%s, %s, %s)
        """
        cursor.execute(query, (
            user_notification_id,
            bulk_images_notify_id,
            1
        ))

        rds_conn.commit()
        logger.info(f"Notification created for process {process_id}")

    except Exception as e:
        rds_conn.rollback()  # Rollback if there is an error
        logger.error(f"Error inserting notification: {e}")
        raise


def check_and_notify_if_complete(report_csv_path, expected_total, process_id, user_id, rds_conn ):
    with open(report_csv_path, "r") as f:
        reader = csv.reader(f)
        next(reader)
        rows = list(reader)

    if len(rows) >= expected_total:
        insert_notification(process_id, user_id, rds_conn)

def update_csv_report_by_process_id(report_dir, process_id, file_name, file_uid, status):
    """Creates or appends to the report CSV."""
    os.makedirs(report_dir, exist_ok=True)
    report_name = f"{process_id}_report.csv"
    report_path = os.path.join(report_dir, report_name)

    is_new = not os.path.exists(report_path)

    with open(report_path, "a", newline="") as csvfile:
        writer = csv.writer(csvfile)

        if is_new:
            writer.writerow(["file_name", "unique_id", "status"])

        if file_name and file_uid:
            writer.writerow([file_name, file_uid, status])

    return report_path, report_name

def handle_tar_file(file_path, payload_path, input_bucket, input_key):
    """Распаковывает TAR файл, обрабатывает каждый файл и обновляет отчет"""
    try:
        tar_info = extract_tar_info(os.path.basename(file_path))
        importing_session_id = tar_info["importing_session_id"]
        process_id = tar_info["process_id"]
        tenant_id = tar_info["tenant_id"]
        user_id = tar_info["user_id"]
        expected_file_count = tar_info["file_total"]
        rds_conn = get_db_connection()

        logger.info(f"Processing TAR file {file_path} with expected {expected_file_count} files")

        report_csv_path, report_csv_name = update_csv_report_by_process_id(
            "/tmp/reports", process_id, None, None, "INITIAL"
        )
        logger.info(f"REPORT CSV created")
        create_db_report_record(report_csv_name, process_id, input_bucket, input_key, report_csv_path, tenant_id, importing_session_id, rds_conn)
        logger.info(f"Created record of REPORT FILE")
        example_query()
        with tarfile.open(file_path, "r") as tar:
            tar.extractall(path=payload_path)
            logger.info(f"Extracted TAR file {file_path} to {payload_path}")

        for extracted_file in os.listdir(payload_path):
            extracted_file_path = os.path.join(payload_path, extracted_file)
            unique_id = generate_custom_id()

            upload_to_s3(input_bucket, extracted_file, extracted_file_path)

            create_db_record(extracted_file, unique_id, input_bucket, input_key, extracted_file_path, tenant_id, rds_conn)

            report_csv_path, report_csv_name = update_csv_report_by_process_id(
                "/tmp/reports", process_id, extracted_file, unique_id, "SUCCESS"
            )

            upload_to_s3(input_bucket, f"reports/{report_csv_name}", report_csv_path)
            logger.info(f"UPDATED ROW")
            check_and_notify_if_complete(report_csv_path, expected_file_count, process_id, user_id, rds_conn )
            logger.info(f"NOTIFICATION CREATED")
        delete(payload_path, input_key)
    except Exception as e:
        logger.error(f"Error processing TAR file {file_path}: {str(e)}")


def upload_to_s3(bucket, file_name, file_path):
    """Загружает файл в S3"""
    try:
        s3_client.upload_file(file_path, bucket, file_name)
        logger.info(f"Uploaded {file_name} to S3 bucket {bucket}")
    except Exception as e:
        logger.error(f"Failed to upload {file_name} to S3: {str(e)}")

def expand_if_large_archive(input_bucket, input_key, download_path, byte_size):
    """Expand the file if it is an archival type and larger than ClamAV Max Size"""
    if byte_size > MAX_BYTES:
        file_name = f"{download_path}/{input_key}"
        try:
            command = ["7za", "x", "-y", f"{file_name}", f"-o{download_path}"]
            archive_summary = subprocess.run(
                command,
                stderr=subprocess.STDOUT,
                stdout=subprocess.PIPE,
            )
            if archive_summary.returncode not in [0, 1]:
                raise ArchiveException(
                    f"7za exited with unexpected code: {archive_summary.returncode}."
                )
            delete(download_path, input_key)
            large_file_list = []
            for root, dirs, files in os.walk(download_path, topdown=False):
                for name in files:
                    size = os.path.getsize(os.path.join(root, name))
                    if size > MAX_BYTES:
                        large_file_list.append(name)
            if large_file_list:
                raise FileTooBigException(
                    f"Archive {input_key} contains files {large_file_list} "
                    f"which are at greater than ClamAV max of {MAX_BYTES} bytes"
                )
        except subprocess.CalledProcessError as e:
            report_failure(
                input_bucket, input_key, download_path, str(e.stderr)
            )
        except ArchiveException as e:
            report_failure(input_bucket, input_key, download_path, e.message)
        except FileTooBigException as e:
            report_failure(input_bucket, input_key, download_path, e.message)
    else:
        return

def scan(input_bucket, input_key, download_path, definitions_path, tmp_path):
    """Scans the object from S3"""
    # Max file size support by ClamAV
    try:
        command = [
            "clamscan",
            "-v",
            "--stdout",
            f"--max-filesize={MAX_BYTES}",
            f"--max-scansize={MAX_BYTES}",
            f"--database={definitions_path}",
            "-r",
            f"--tempdir={tmp_path}",
            f"{download_path}",
        ]
        logger.info("INIT SCAN")
        scan_summary = subprocess.run(
            command,
            stderr=subprocess.STDOUT,
            stdout=subprocess.PIPE,
        )
        status = ""
        if scan_summary.returncode == 0:
            status = CLEAN
        elif scan_summary.returncode == 1:
            status = INFECTED
        else:
            raise ClamAVException(
                f"ClamAV exited with unexpected code: {scan_summary.returncode}."
                f"\nOutput: {scan_summary.stdout.decode('utf-8')}"
            )
        set_status(input_bucket, input_key, status)
        return {
            "source": "serverless-clamscan",
            "input_bucket": input_bucket,
            "input_key": input_key,
            "status": status,
            "message": scan_summary.stdout.decode("utf-8"),
        }
    except subprocess.CalledProcessError as e:
        report_failure(input_bucket, input_key, download_path, str(e.stderr))
    except ClamAVException as e:
        report_failure(input_bucket, input_key, download_path, e.message)


def delete(download_path, input_key=None):
    """Deletes the file/folder from the EFS File System"""
    if input_key:
        file = f"{download_path}/{input_key}"
        if os.path.exists(file):
            os.remove(file)
    else:
        for obj in glob.glob(os.path.join(download_path, "*")):
            if os.path.isdir(obj):
                shutil.rmtree(obj)
            else:
                os.remove(obj)


def report_failure(input_bucket, input_key, download_path, message):
    """Set the S3 object tag to ERROR if scan function fails"""
    set_status(input_bucket, input_key, ERROR)
    delete(download_path)
    exception_json = {
        "source": "serverless-clamscan",
        "input_bucket": input_bucket,
        "input_key": input_key,
        "status": ERROR,
        "message": message,
    }
    raise Exception(json.dumps(exception_json))
