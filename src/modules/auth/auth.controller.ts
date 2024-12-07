import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { Public } from 'src/modules/auth/public-strategy';
import { CreateUserDto, SignInUserDto } from 'src/dtos/user/create-user.dto';
import { UserService } from 'src/modules/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from 'src/entities/user.entity';
import { compare } from 'bcrypt';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}

  @ApiOperation({ summary: 'User Login' })
  @ApiBody({ type: SignInUserDto })
  @ApiResponse({
    status: 200,
    description: 'The record found',
    type: [User],
  })
  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Body() signInDto: SignInUserDto) {
    const { password, email } = signInDto;
    const user = await this.userService.findOneByEmail(email);

    const matchingPassword = await compare(password, user.password);

    if (!matchingPassword) throw new UnauthorizedException();

    const payload = { sub: user.id, email: user.email };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  @ApiOperation({ summary: 'User Register' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 200,
    description: 'The record found',
    type: [User],
  })
  @Public()
  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  async signUp(@Body() payload: CreateUserDto) {
    return await this.userService.create(payload);
  }
}
