import axios from 'axios';
import { handleError } from '../../../helpers/errors';

export async function downloadImageToBase64(imageUrl) {
  try {
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    const mimeType = response.headers['content-type'];

    if (!mimeType.startsWith('image/')) {
      throw new Error(`Unsupported image MIME type: ${mimeType}`);
    }
    const imageData = Buffer.from(response.data, 'binary').toString('base64');
    return { base64: imageData, mimeType };
  } catch (error) {
    handleError('Magento :: downloadImageToBase64', error);
  }
}
