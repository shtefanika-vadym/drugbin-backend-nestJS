import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const RequestTime = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): void => {
    const request = ctx.switchToHttp().getRequest();
    const startTime: number = Date.now();

    request.res.on("finish", (): void => {
      const endTime: number = Date.now();
      const duration: number = endTime - startTime;
      console.info(`Request duration: (${duration}ms) - (${duration/1000}s)`);
    });

    return;
  }
);
