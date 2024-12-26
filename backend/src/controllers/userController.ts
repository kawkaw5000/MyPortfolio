import { Request, Response } from 'express';
import { BaseController } from './baseController';
import { ErrorCode } from '../utils/constants';

export class UserController extends BaseController {
  /**
   * Constructor to initialize the UserController.
   * Binds the Register and Login methods to the controller instance.
   */
  constructor() {
    super();
    this.Register = this.Register.bind(this);
    this.Login = this.Login.bind(this);
  }

  /**
   * Registers a new user by creating an account with the provided username and password.
   * 
   * @param req - The request object containing the user's data in the body (username and password).
   * @param res - The response object used to send the success or error response.
   * @returns {Promise<Response>} - The response object containing either the success message or an error message.
   */
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

  /**
   * Authenticates a user by verifying the provided username and password, and returns a JWT token if successful.
   * 
   * @param req - The request object containing the user's login credentials (username and password).
   * @param res - The response object used to send the success or error response.
   * @returns {Promise<Response>} - The response object containing either the success message and token or an error message.
   */
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
