import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';

import { User } from './schema/users.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}
  async getUserById(id: string) {
    const user = await this.userModel.findOne({ _id: id });

    return { id: user, ...user };
  }
}
