import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Body,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { FaceService } from './face.service';

@Controller('face')
@ApiTags('face')
export class FaceController {
  constructor(private readonly faceService: FaceService) {}

  @Post('encode')
  @UseInterceptors(FileInterceptor('file')) // ✅ In-memory (no `dest`)
  @ApiOperation({ summary: 'Encode a face from uploaded image and store in FastAPI' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: 'Unique ID for the person',
        },
        file: {
          type: 'string',
          format: 'binary',
          description: 'Image file to be encoded',
        },
      },
      required: ['id', 'file'],
    },
  })
  async encodeFace(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { id: string },
  ) {
    if (!file || !file.buffer || !body.id) {
      console.error(`Missing file or ID: ${file}`);
      throw new BadRequestException('Missing image file or ID');
    }

    const result = await this.faceService.encodeFace(file.buffer, body.id);
    return result;
  }

  @Post('recognize')
  @UseInterceptors(FileInterceptor('file')) // ✅ In-memory
  @ApiOperation({ summary: 'Recognize a face from uploaded image' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Image file to be recognized',
        },
      },
      required: ['file'],
    },
  })
  async recognizeFace(@UploadedFile() file: Express.Multer.File) {
    if (!file || !file.buffer) {
      console.error(`Missing image buffer: ${JSON.stringify(file)}`);
      throw new BadRequestException('No file uploaded or file buffer missing');
    }

    const result = await this.faceService.recogniseService(file.buffer);
    return result;
  }
}
