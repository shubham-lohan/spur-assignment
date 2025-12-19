import { Request, Response } from 'express';

export interface IChatController {
  sendMessage(req: Request): Promise<any>;
  getHistory(req: Request): Promise<any>;
}
