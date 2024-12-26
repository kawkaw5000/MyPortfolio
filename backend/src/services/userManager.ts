import { ErrorCode, Constant } from '../utils/constants';
import prisma from '../config/dbConfig';
import { User } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export class UserManager {
  private generateJWT(user: User): string {
    const payload = {
      sub: user.UserId, 
      username: user.Username,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: process.env.JWT_EXPIRATION || '1h' });
    return token;
  }

  public async getUserByUsername(username: string): Promise<User | null> {
    return await prisma.user.findFirst({
      where: { Username: username },
    });
  }

  public async authorize(username: string, password: string): Promise<{ errorCode: ErrorCode; message: string; token?: string }> {
    let errMsg: string = '';
    try {
      const user = await this.getUserByUsername(username);

      if (!user) {
        errMsg = 'User does not exist.';
        return { errorCode: ErrorCode.Error, message: errMsg };
      }

      const isPasswordValid = await bcrypt.compare(password, user.Password);
      if (!isPasswordValid) {
        errMsg = 'Incorrect password.';
        return { errorCode: ErrorCode.Error, message: errMsg };
      }

      const token = this.generateJWT(user);

      errMsg = 'Login successful';
      return { errorCode: ErrorCode.Success, message: errMsg, token };
    } catch (error) {
      console.error('Error during sign-in:', error);
      errMsg = 'An unexpected error occurred during sign-in.';
      return { errorCode: ErrorCode.Error, message: errMsg };
    }
  }

  public async createAccount(username: string, password: string): Promise<{ errorCode: ErrorCode; message: string }> {
    let errMsg: string = '';
    const existingUser = await this.getUserByUsername(username);

    if (existingUser) {
      errMsg = "Username is already exist";
      return { errorCode: ErrorCode.Error, message: errMsg};
    }

    const hashedPass = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        Username: username,
        Password: hashedPass
      }
    });

    errMsg = 'User created successfully.';
    return { errorCode: ErrorCode.Success, message: errMsg };
  }
}
