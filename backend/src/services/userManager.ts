import { ErrorCode, Constant } from '../utils/constants';
import prisma from '../config/dbConfig';
import { User } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export class UserManager {

  /**
   * Generates a JWT (JSON Web Token) for the user.
   * 
   * @param user - The user object that will be used to generate the token.
   * @returns {string} - The generated JWT token and will also expire for 1hr lifespan.
   */
  private generateJWT(user: User): string {
    const payload = {
      sub: user.UserId, 
      username: user.Username,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: process.env.JWT_EXPIRATION || '1h' });
    return token;
  }

  /**
   * Retrieves a user by their username from the database.
   * 
   * @param username - The username of the user to retrieve.
   * @returns {Promise<User | null>} - The user object if found, or null if the user does not exist.
   */
  public async getUserByUsername(username: string): Promise<User | null> {
    return await prisma.user.findFirst({
      where: { Username: username },
    });
  }

  /**
   * Retrieves a user by their UserId from the database.
   * 
   * @param userId - The userId of the user to retrieve.
   * @returns {Promise<User | null>} - The user object if found, or null if the user does not exist.
   */
  public async getUserById(userId: number): Promise<User | null> {
    return await prisma.user.findUnique({
      where: {UserId: userId}
    });
  };

  /**
   * Authorizes a user by validating their username and password.
   * 
   * @param username - The username of the user trying to log in.
   * @param password - The password of the user trying to log in.
   * @returns {Promise<{ errorCode: ErrorCode; message: string; token?: string }>} - An object containing the result of the authorization process:
   * - errorCode: Success or Error code.
   * - message: A message providing information about the result.
   * - token: The JWT token if the login is successful.
   */
  public async authorize(username: string, password: string): Promise<{ errorCode: ErrorCode; message: string; token?: string }> {
    let errMsg: string = '';
    try {
      const user = await this.getUserByUsername(username);

      if (!user) {
        errMsg = 'User does not exist or Incorrect password.';
        return { errorCode: ErrorCode.Error, message: errMsg };
      }

      const isPasswordValid = await bcrypt.compare(password, user.Password);
      if (!isPasswordValid) {
        errMsg = 'User does not exist or Incorrect password.';
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

  /**
   * Creates a new user account.
   * 
   * @param username - The username of the new user.
   * @param password - The password for the new user.
   * @returns {Promise<{ errorCode: ErrorCode; message: string }>} - An object containing the result of the account creation process:
   * - errorCode: Success or Error code.
   * - message: A message providing information about the result.
   */
  public async createAccount(username: string, password: string): Promise<{ errorCode: ErrorCode; message: string }> {
    let errMsg: string = '';
    const existingUser = await this.getUserByUsername(username);

    if (existingUser) {
      errMsg = "Username is already exist";
      return { errorCode: ErrorCode.Error, message: errMsg};
    }

    try {
      const hashedPass = await bcrypt.hash(password, 10);
    
      await prisma.user.create({
        data: {
          Username: username,
          Password: hashedPass
        }
      });

      errMsg = 'User created successfully.';
      return { errorCode: ErrorCode.Success, message: errMsg };

    } catch (error) {
      console.error("Error updating user:", error);
      errMsg = "Error updating user.";
      return { errorCode: ErrorCode.Error, message: errMsg };
    }
  }

  /**
   * Update the User info for changing its username and password
   * 
   * @param userId 
   * @param username 
   * @param password 
   * @returns {Promise<{ errorCode: ErrorCode; message: string }>} - An object containing the result of the account update process:
   * - errorCode: Success or Error code.
   * - message: A message providing information about the result.
   */
  public async editAccount(userId: number, username: string, password: string): Promise<{ errorCode: ErrorCode; message: string }> {
    let errMsg: string = '';
  
    const existingUser = await this.getUserById(userId);
    const existingUsername = await this.getUserByUsername(username);

    if (!existingUser) {
      errMsg = "Error: User not found.";
      return { errorCode: ErrorCode.Error, message: errMsg };
    }

    if (existingUsername) {
      errMsg = "Username is already exist.";
      return { errorCode: ErrorCode.Error, message: errMsg };
    }
 
    const hashedPass = await bcrypt.hash(password, 10);
  
    try {
      await prisma.user.update({
        where: {
          UserId: existingUser.UserId,
        },
        data: {
          Username: username,
          Password: hashedPass,
        },
      });

      errMsg = "User updated successfully.";
      return { errorCode: ErrorCode.Success, message: errMsg };

    } catch (error) {

      console.error("Error updating user:", error);
      errMsg = "Error updating user.";
      return { errorCode: ErrorCode.Error, message: errMsg };
    }
  }
  
}
