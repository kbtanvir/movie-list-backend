import { Injectable } from '@nestjs/common';

export type UserEntity = {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};
export type UserDetails = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
};

@Injectable()
export class UsersService {
  private readonly users: UserEntity[] = [
    {
      firstName: 'John',
      lastName: 'Smith',
      email: 'john@gmail.com',
      password: 'admin',
      id: 'v33e8654qg8',
    },
  ];

  async getAllUsers(): Promise<UserEntity[]> {
    return [...this.users];
  }
  async getUserDetails(user: UserEntity): Promise<UserDetails> {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    };
  }
  async findByEmail(email: string): Promise<UserEntity | undefined> {
    return this.users.find((user) => user.email.toString() === email);
  }
  async findByID(uid: string): Promise<UserEntity | undefined> {
    return this.users.find((user) => user.id === uid);
  }
  async create(user: UserEntity): Promise<UserEntity> {
    this.users.push(user);
    return user;
  }
}
