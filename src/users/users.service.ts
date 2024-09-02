import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { User } from './schema/users.schema';
import ApiFeatures from '~/common/api-features.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}
  async getUserById(id: string) {
    const user = await this.userModel.findOne({ _id: id });

    return user;
  }

  async getAllUsers(queryString: any) {
    const query = this.userModel.find();
    const apiFeatures = new ApiFeatures(query, queryString);

    apiFeatures.filter().sort().limitFields().paginate();

    // Execute the query to get the filtered products
    const users = await apiFeatures.query;

    const totalCount = await this.userModel.countDocuments(apiFeatures.q);

    return {
      users,
      totalCount,
    };
  }
}
