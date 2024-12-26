import { Response, Request } from 'express';
import { UserManager } from '../services/userManager';

export class BaseController {
  public errorMessage: string;
  public userMgr: UserManager;

  constructor() {
    this.errorMessage = '';
    this.userMgr = new UserManager();
  }

  public sendError(res: Response, message: string) {
    this.errorMessage = message;
    return res.status(400).json({ error: this.errorMessage });
  }

  public sendSuccess(res: Response, data: any) {
    return res.status(200).json({ data });
  }
}
