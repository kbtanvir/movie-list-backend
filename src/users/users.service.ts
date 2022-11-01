import { Injectable, NotFoundException } from '@nestjs/common';
import { SerializableService } from 'lib/utils/serializer/serializable.class';
import { Types } from 'mongoose';
import { UserEntity } from './entity/users.entity';
import { UserRepository } from './repo/users.repo';

export type UserDetails = Omit<UserEntity, 'password'>;

@Injectable()
export class UsersService extends SerializableService<UserEntity> {
  constructor(private readonly userRepo: UserRepository) {
    super(UserEntity);
  }

  async getAllUsers() {
    this.userRepo.findAll();
  }
  async getUserDetails(id: Types.ObjectId): Promise<UserDetails> {
    const user = await this.findByID(id);

    if (!user) throw new NotFoundException('User not found with id');

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userDetails } = user;

    return userDetails;
  }
  async findByEmail(email: string): Promise<UserEntity | undefined> {
    return this.userRepo.findByEmail(email);
  }
  async findByID(uid: Types.ObjectId): Promise<UserEntity | undefined> {
    return this.userRepo.findByID(uid);
  }

  async create(user: UserEntity) {
    return this.userRepo.create(user);
  }
  async update(uid: Types.ObjectId, newPassword: string) {
    const user = await this.findByID(uid);
    if (user) {
      user.password = newPassword;
    }
    return user;
  }
  async verifyUserID(uid: Types.ObjectId) {
    const user = await this.findByID(uid);
    if (!user) throw new NotFoundException('User not found with id');
    return user;
  }
  async verifyEmail(email: string) {
    const user = await this.findByEmail(email);
    if (!user) throw new NotFoundException('User not found with email');
    return user;
  }
}
