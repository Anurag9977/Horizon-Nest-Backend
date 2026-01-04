import {
  Body,
  Controller,
  Get,
  Post,
  Session,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '@app/common/decorators';
import { UserDocument } from './users/models/user.schema';
import { CreateUserDto } from './users/dto/create-user.dto';
import { UsersService } from './users/users.service';
import { AuthService } from './auth.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Post('/signup')
  signup(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Post('/login')
  @UseGuards(AuthGuard('local'))
  login(@CurrentUser() user: UserDocument, @Session() session: any) {
    const accessToken = this.authService.createJwt(user);
    session.accessToken = accessToken;
    return accessToken;
  }

  @Get('/current-user')
  @UseGuards(AuthGuard('jwt'))
  getCurrentUser(@CurrentUser() user: UserDocument) {
    return user;
  }

  @MessagePattern('authenticate')
  @UseGuards(AuthGuard('jwt'))
  authenticate(@Payload() payload: any) {
    return payload.user;
  }
}
