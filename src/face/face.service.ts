import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as dotenv from 'dotenv';

dotenv.config();
const faceUri = process.env.FACE_URI;

@Injectable()
export class FaceService {
  async encodeFace(imageBuffer: Buffer, id: string): Promise<any> {
    try {
      const base64Image = imageBuffer.toString('base64');
      const payload = {
        id,
        image_base64: base64Image,
      };

      const response = await axios.post(`${faceUri}/register`, payload, {
        timeout: 10000,
        validateStatus: (status) => true,
      });

      if (response.status !== 200 || !response.data) {
        console.error('API error:', response.status, response.data);
        throw new Error(`Face API responded with ${response.status}`);
      }
      console.log(`responce: ${JSON.stringify(response.data)}`)
      return response.data;
    } catch (error: any) {
      console.error('Face encoding failed:', error.message);
      throw new Error('Face encoding service failed');
    }
  }

  async recogniseService(imageBuffer: Buffer): Promise<any> {
    try {
      const base64Image = imageBuffer.toString('base64');
      const payload = {
        image_base64: base64Image,
      };

      const response = await axios.post(`${faceUri}/recognize`, payload);

      if (response.status !== 200 || !response.data) {
        throw new Error(`Face API responded with ${response.status}`);
      }

      return response.data;
    } catch (err: any) {
      console.error('Face recognition failed:', err.message);
      throw new Error('Face recognition service failed');
    }
  }
}
