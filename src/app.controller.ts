import { ApiTags } from "@nestjs/swagger";
import { Controller, Get } from "@nestjs/common";

@ApiTags("Main")
@Controller("")
export class AppController {
  // App health check
  @Get("/health")
  getHealthCheck() {
    return { message: "Health check" };
  }
}
