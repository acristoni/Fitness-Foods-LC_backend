import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    const headers = req.headers;

    if (!headers.api_key) {
      return res.status(401).json({ message: 'API_KEY não fornecida' });
    }

    if (headers.api_key === process.env.API_KEY) {
      next();
    } else {
      return res.status(401).json({ message: 'API_KEY inválida' });
    }
  }
}
