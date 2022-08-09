import { Injectable, NotFoundException } from '@nestjs/common';

export type UserEntity = {
  id: string;
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
};
export type UserDetails = Omit<UserEntity, 'password'>;

@Injectable()
export class UsersService {
  private readonly users: UserEntity[] = [];

  async getAllUsers(): Promise<UserEntity[]> {
    return [...this.users];
  }
  async getUserDetails(id: string): Promise<UserDetails> {
    const user = await this.findByID(id);

    if (!user) throw new NotFoundException('User not found with id');

    const { password, ...userDetails } = user;
    
    return userDetails;
  }
  async findByEmail(email: string): Promise<UserEntity | undefined> {
    const user = this.users.find((user) => user.email === email);
    return user;
  }
  async findByID(uid: string): Promise<UserEntity | undefined> {
    const user = this.users.find((user) => user.id === uid);

    return user;
  }

  async create(user: UserEntity): Promise<UserEntity> {
    this.users.push(user);
    return user;
  }
  async update(uid: string, newPassword: string): Promise<UserEntity> {
    const user = await this.findByID(uid);
    if (user) {
      user.password = newPassword;
    }
    return user;
  }
  async verifyUserID(uid: string): Promise<UserEntity> {
    const user = await this.findByID(uid);
    if (!user) throw new NotFoundException('User not found with id');
    return user;
  }
  async verifyEmail(email: string): Promise<UserEntity> {
    const user = await this.findByEmail(email);
    if (!user) throw new NotFoundException('User not found with email');
    return user;
  }
}
