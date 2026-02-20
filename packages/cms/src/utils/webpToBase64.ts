import axios from 'axios';
import sharp from 'sharp';

export async function webpToBase64(url: string) {
  const { data } = await axios.get(url, { responseType: 'arraybuffer' });
  const pngBuffer = await sharp(Buffer.from(data)).png().toBuffer();
  return `data:image/png;base64,${pngBuffer.toString('base64')}`;
}
