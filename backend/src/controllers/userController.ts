import { Request, Response } from 'express';
import { BaseController } from './baseController';
import { ErrorCode } from '../utils/constants';

export class UserController extends BaseController {
  constructor() {
    super();
    this.Register = this.Register.bind(this);
    this.Login = this.Login.bind(this);
  }

  public async Register(req: Request, res: Response): Promise<Response> {
    const { Username, Password } = req.body;

    try {
      const newUser = await this.userMgr.createAccount(Username, Password);

      if (newUser.errorCode !== ErrorCode.Success) {
        return this.sendError(res, newUser.message);
      }

      return this.sendSuccess(res, { message: 'User created successfully', user: newUser });
    } catch (error) {
      return this.sendError(res, 'An error occurred during sign-up');
    }
  }

  public async Login(req: Request, res: Response): Promise<Response> {
    const { Username, Password } = req.body;

    try {
      const result = await this.userMgr.authorize(Username, Password);
      
      if (result.errorCode !== ErrorCode.Success) {
        return this.sendError(res, result.message);
      }

      return this.sendSuccess(res, { message: result.message, token: result.token });
    } catch (error) {
      return this.sendError(res, 'An error occurred during sign-in');
    }
  }
}

export const userController = new UserController();
