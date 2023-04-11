import { JwtService } from "@nestjs/jwt";

export class TokenUtils {
  constructor(private readonly jwtService: JwtService) {}

  getCompanyIdFromToken(token: string): number {
    const { id: companyId } = this.jwtService.verify(token.split(" ")[1]);
    return companyId;
  }
}
