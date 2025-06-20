import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FaceService } from './face.service';
import {
  ApiTags,
  ApiOperation,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';

@Controller('face')
@ApiTags('face')
export class FaceController {
  constructor(private readonly faceService: FaceService) {}

  @Post('encode')
  @UseInterceptors(FileInterceptor('file'))
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
    const filePath = file.path;
    const result = await this.faceService.encodeFace(filePath, body.id);
    return result;
  }
}
