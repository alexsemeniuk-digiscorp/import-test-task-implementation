export const fetchFileAsBlob = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch file from URL: ${response.statusText}`);
  }
  const blob = await response.blob();
  return blob;
};

export const downloadFromBlob = (
  blob: Blob | MediaSource,
  fileName?: string,
) => {
  const blobURL = window.URL.createObjectURL(blob);
  const aTag: HTMLAnchorElement = document.createElement('a');
  aTag.href = blobURL;
  aTag.setAttribute('download', fileName ?? 'downloaded file');
  document.body.appendChild(aTag);
  aTag.click();
  aTag.remove();
};
export const downloadFile = async (url: string, fileName?: string) => {
  const blob = await fetchFileAsBlob(url);
  downloadFromBlob(blob, fileName);
};

// add rule for headers - don't have ,

export const handleCSVExport = async (
  csvData: string,
  handleFileUpload: (file: File) => Promise<void>,
  fileName: string,
) => {
  const blob = new Blob([csvData as BlobPart], { type: 'text/csv' });
  const file = new File([blob], 'data.csv', { type: 'text/csv' });
  await handleFileUpload(file);

  downloadFromBlob(blob, fileName);
};

//Todo(Vanya) use this function in reports module

export const base64ToBlob = (base64String: string, contentType: string) => {
  const parts = base64String.split(';base64,');
  const type = parts[0].split(':')[1];
  const base64Data = parts[1];

  const binaryData = atob(base64Data);

  // Create a Blob object
  const arrayBuffer = new ArrayBuffer(binaryData.length);
  const uint8Array = new Uint8Array(arrayBuffer);
  for (let i = 0; i < binaryData.length; i++) {
    uint8Array[i] = binaryData.charCodeAt(i);
  }

  return new Blob([arrayBuffer], { type: contentType || type });
};
