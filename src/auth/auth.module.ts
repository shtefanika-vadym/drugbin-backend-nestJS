import { forwardRef, Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { PharmacyModule } from "src/pharmacies/pharmacy.module";
import { JwtModule } from "@nestjs/jwt";

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    forwardRef(() => PharmacyModule),
    JwtModule.register({
      secret: "SECRET",
      signOptions: {
        expiresIn: "1min",
      },
    }),
  ],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
