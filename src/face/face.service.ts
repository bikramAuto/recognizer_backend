import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as fs from 'fs/promises'; // Use promise version of fs
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config();
const faceUri = process.env.FACE_URI;

@Injectable()
export class FaceService {
  async encodeFace(imagePath: string, id: string): Promise<any> {
    try {
      // 1. Read the image file as a buffer
      const imageBuffer = await fs.readFile(imagePath);

      // 2. Convert to base64 string with prefix
      const base64Image = `data:image/jpeg;base64,${imageBuffer.toString('base64')}`;

      // 3. Create payload as expected by FastAPI
      const payload = {
        id,
        image_base64: base64Image,
      };

      // 4. Send POST request to FastAPI
      const response = await axios.post(`${faceUri}/register`, payload);

      // 5. Optional: delete file after processing
      await fs.unlink(imagePath);

      // 6. Return FastAPI response
      return response.data;
    } catch (error) {
      console.error('Face encoding failed:', error.message);
      throw new Error('Face encoding service failed');
    }
  }
}
