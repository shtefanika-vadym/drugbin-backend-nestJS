import { JwtService } from "@nestjs/jwt";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";

class TokenException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.BAD_REQUEST);
  }
}

@Injectable()
export class TokenUtils {
  constructor(private readonly jwtService: JwtService) {}

  getCompanyIdFromToken(token: string): number {
    try {
      if (!token) {
        throw new TokenException("Token is missing or empty");
      }

      const tokenParts = token.split(" ");

      if (tokenParts.length < 2) {
        throw new TokenException("Token format is not correct");
      }

      const decodedToken = this.jwtService.verify(tokenParts[1]);

      if (!decodedToken || !decodedToken.id) {
        throw new TokenException("Cannot read companyId from token");
      }

      return decodedToken.id;
    } catch (error) {
      if (error instanceof TokenException) {
        throw error;
      } else {
        throw new TokenException(
          `Error occurred while getting companyId from token: ${error.message}`
        );
      }
    }
  }
}
