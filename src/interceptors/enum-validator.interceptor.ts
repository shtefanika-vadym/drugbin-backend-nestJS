import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadRequestException,
} from "@nestjs/common";
import { Observable } from "rxjs";

@Injectable()
export class EnumValidatorInterceptor implements NestInterceptor {
  constructor(private enumType: any) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const paramName = Object.keys(request.params)[0];
    const enumValue = request.params[paramName];

    if (!this.isValidEnumValue(enumValue)) {
      throw new BadRequestException(`Invalid ${paramName} value`);
    }

    return next.handle();
  }

  private isValidEnumValue(value: string): boolean {
    return Object.values(this.enumType).includes(value);
  }
}
