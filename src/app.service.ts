import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from './user.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class AppService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  getHello(): string {
    return 'Hello World!';
  }

  async testApi(): Promise<any> {
    try {
      const userRes = await this.userModel.find();
      return userRes;
    } catch (error) {
      console.log('Error', error);
      throw new NotFoundException('Resource not found');
    }
  }
}
