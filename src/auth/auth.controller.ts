// auth.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';

class TokenRequestDto {
  userId: string;
}

class TokenResponseDto {
  access_token: string;
}

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('token')
  @ApiOperation({ summary: 'Generate JWT Token' })
  @ApiBody({ type: TokenRequestDto })
  @ApiResponse({ status: 201, description: 'Token generated', type: TokenResponseDto })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  getToken(@Body() body: TokenRequestDto): TokenResponseDto {
    return this.authService.generateToken(body.userId);
  }
}
