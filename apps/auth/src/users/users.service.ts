import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRepository } from './user.repository';
import { QueryFilter } from 'mongoose';
import { UserDocument } from './models/user.schema';
import bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly userRepo: UserRepository) {}
  async create(createUserDto: CreateUserDto) {
    const { firstName, lastName, email, password } = createUserDto;
    const existingUser = await this.userRepo.find({
      email,
    });
    if (existingUser.length) {
      throw new BadRequestException('Email already signed up. Please login.');
    }
    // Hashing the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return this.userRepo.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });
  }

  findOne(queryFilter: QueryFilter<UserDocument>) {
    return this.userRepo.findOne(queryFilter);
  }

  findAll(queryFilter: QueryFilter<UserDocument>) {
    return this.userRepo.find(queryFilter);
  }

  delete(userId: string) {
    return this.userRepo.findOneAndDelete({
      _id: userId,
    });
  }
}
