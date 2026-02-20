import axios from 'axios';
import * as jose from 'jose';
import sharp from 'sharp';
import {
  PDF_GENERATOR_BASE_URL,
  PDF_GENERATOR_WORKSPACE_ID,
} from '../graphql/constants';

export async function createJsonWebToken(
  iss: string,
  sub: string,
  secret: string,
) {
  return new jose.SignJWT({
    iss,
    sub,
    exp: Math.round(Date.now() / 1000) + 60,
  })
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .sign(new TextEncoder().encode(secret));
}

export async function webpToBase64(url: string) {
  const { data } = await axios.get(url, { responseType: 'arraybuffer' });
  const pngBuffer = await sharp(Buffer.from(data)).png().toBuffer();
  return `data:image/png;base64,${pngBuffer.toString('base64')}`;
}

export async function pdfApiRequest(
  endpoint: string,
  token: string,
  payload?: object,
  method: 'delete' | 'get' | 'put' | 'post' = 'post',
  documentType?: 'url' | 'file',
) {
  const api = axios.create({
    baseURL: PDF_GENERATOR_BASE_URL,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'X-Workspace-Id': PDF_GENERATOR_WORKSPACE_ID,
    },
    responseType: documentType === 'file' ? 'arraybuffer' : 'json',
  });

  try {
    const response = await api.request({
      url: endpoint,
      method,
      data: ['post', 'put'].includes(method) ? payload : undefined,
      params: method === 'get' ? payload : undefined,
    });

    if (documentType === 'file') {
      return response.data;
    }

    return response.data.response;
  } catch (err: any) {
    console.error(
      `PDF API Error (${method} ${endpoint}):`,
      err.response?.data || err.message,
    );
    throw new Error(err.response?.data?.message || 'PDF API request failed');
  }
}
