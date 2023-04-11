import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { JwtService } from "@nestjs/jwt";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "src/auth/roles.decorator";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private jwtService: JwtService, private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const requiredRoles = this.reflector.getAllAndOverride<string[]>(
        ROLES_KEY,
        [context.getHandler(), context.getClass()]
      );
      if (!requiredRoles) {
        return true;
      }
      const req = context.switchToHttp().getRequest();
      const authHeader = req.headers.authorization;
      const bearer = authHeader?.split(" ")[0];
      const token = authHeader?.split(" ")[1];

      if (bearer !== "Bearer" || !token) {
        throw new UnauthorizedException({
          message: "Company unauthenticated",
        });
      }

      const company = this.jwtService.verify(token);
      req.user = company;
      return requiredRoles.includes(company.role);
    } catch (e) {
      console.log(e);
      throw new ForbiddenException("Forbidden");
    }
  }
}
