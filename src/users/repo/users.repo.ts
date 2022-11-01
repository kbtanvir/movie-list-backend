import { Injectable } from '@nestjs/common';
import { DocumentType, ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';

import { FilterQuery } from 'mongoose';
import { UserEntity } from '../entity/users.entity';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(UserEntity)
    private readonly model: ReturnModelType<typeof UserEntity>,
  ) {}
  async findByID(id: string) {
    return this.model.findById(id);
  }

  async findByEmail(email: string) {
    return this.findOne({ email });
  }

  async create(user: UserEntity): Promise<DocumentType<UserEntity>> {
    return await this.model.create(user);
  }

  async findAll(): Promise<DocumentType<UserEntity>[]> {
    return this.model.find();
  }

  async findOne(
    query: FilterQuery<UserEntity>,
  ): Promise<DocumentType<UserEntity> | null> {
    return this.model.findOne(query);
  }
  async updateItem(id: string, dto: Partial<UserEntity>): Promise<UserEntity> {
    return this.model.findOneAndUpdate({ _id: id }, dto, { new: true });
  }
}
