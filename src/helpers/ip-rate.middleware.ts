import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import * as process from "process";

@Injectable()
export class IpRateLimitMiddleware implements NestMiddleware {
  private ipRequests = new Map<string, number[]>();

  use(req: Request, res: Response, next: NextFunction) {
    const ip = req.ip;

    const currentTimestamp = Date.now();
    const requests: number[] = this.ipRequests.get(ip) || [];

    const recentRequests = requests.filter(
      (timestamp) => currentTimestamp - timestamp <= +process.env.IP_LIMIT_MS
    );

    if (recentRequests.length >= +process.env.MAX_REQUESTS) {
      return res.status(429).send("Too Many Requests");
    }

    this.ipRequests.set(ip, [...recentRequests, currentTimestamp]);
    next();
  }
}
