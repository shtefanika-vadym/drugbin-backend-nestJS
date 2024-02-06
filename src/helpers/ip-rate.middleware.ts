import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";

@Injectable()
export class IpRateLimitMiddleware implements NestMiddleware {
  private ipRequests = new Map<string, number[]>();

  private readonly MAX_REQUESTS = 2;
  private readonly WINDOW_MS = 60000;

  use(req: Request, res: Response, next: NextFunction) {
    const ip = req.ip;

    const currentTimestamp = Date.now();
    const requests: number[] = this.ipRequests.get(ip) || [];

    // Remove expired requests
    const recentRequests = requests.filter(
      (timestamp) => currentTimestamp - timestamp <= this.WINDOW_MS
    );

    if (recentRequests.length >= this.MAX_REQUESTS) {
      return res.status(429).send("Too Many Requests");
    }

    this.ipRequests.set(ip, [...recentRequests, currentTimestamp]);
    next();
  }
}
