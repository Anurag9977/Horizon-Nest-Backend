import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Session,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser, Public, Roles } from '@app/common/decorators';
import { UserDocument } from './users/models/user.schema';
import { CreateUserDto } from './users/dto/create-user.dto';
import { UsersService } from './users/users.service';
import { AuthService } from './auth.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserRoles } from '@app/common';
import { JwtAuthGuard } from './guards/jwt-auth-guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Post('/signup')
  @Public()
  signup(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Post('/login')
  @UseGuards(AuthGuard('local'))
  @Public()
  login(@CurrentUser() user: UserDocument, @Session() session: any) {
    const accessToken = this.authService.createJwt(user);
    session.accessToken = accessToken;
    return accessToken;
  }

  @Get('/current-user')
  getCurrentUser(@CurrentUser() user: UserDocument) {
    return user;
  }

  @MessagePattern('authenticate')
  @UseGuards(JwtAuthGuard)
  authenticate(@Payload() payload: any) {
    return payload.user;
  }

  @Get('/users')
  @Roles(UserRoles.ADMIN)
  getAllUsers() {
    return this.userService.findAll({});
  }

  @Delete('/users/:id')
  @Roles(UserRoles.ADMIN)
  deleteUser(@Param('id') id: string) {
    return this.userService.delete(id);
  }
}
