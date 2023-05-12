import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Controller, Get } from "@nestjs/common";
import { MessageResponse } from "src/reponses/message-response";

@ApiTags("Main")
@Controller("")
export class AppController {
  // App health check
  @ApiOperation({ summary: "App health check" })
  @ApiResponse({ status: 200, type: MessageResponse })
  @Get("/health")
  getHealthCheck(): MessageResponse {
    return { message: "Health check" };
  }
}
