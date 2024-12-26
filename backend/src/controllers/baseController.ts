import { Response, Request } from 'express';
import { UserManager } from '../services/userManager';

/**
 * A string to store error messages.
 * An instance of the UserManager class to handle user-related operations.
 */
export class BaseController {
  public errorMessage: string;
  public userMgr: UserManager;

  /**
   * Constructor to initialize the BaseController.
   * Sets up the errorMessage to an empty string and creates a new instance of UserManager.
   */
  constructor() {
    this.errorMessage = '';
    this.userMgr = new UserManager();
  }

  /**
   * Sends an error response with a given message.
   * 
   * @param res - The response object from Express to send the error response.
   * @param message - The error message to send in the response body.
   * @returns {Response} - The Express response object with a 400 status code and the error message.
   */
  public sendError(res: Response, message: string) {
    this.errorMessage = message;
    return res.status(400).json({ error: this.errorMessage });
  }

  /**
   * Sends a success response with the provided data.
   * 
   * @param res - The response object from Express to send the success response.
   * @param data - The data to be included in the response body.
   * @returns {Response} - The Express response object with a 200 status code and the data.
   */
  public sendSuccess(res: Response, data: any) {
    return res.status(200).json({ data });
  }
}
