import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, ip } = req;
    
    const start = Date.now();
    
    res.on('finish', () => {
      const responseTime = Date.now() - start;
      const statusCode = res.statusCode;
      
      console.log(`[${new Date().toISOString()}] ${method} ${originalUrl} ${statusCode} - ${responseTime}ms - ${ip}`);
    });
    
    next();
  }
} 