import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Controller, Get, Res } from "@nestjs/common";
import { MessageResponse } from "src/reponses/message-response";

@ApiTags("Main")
@Controller("")
export class AppController {
  // App health check
  @ApiOperation({ summary: "App health check" })
  @ApiResponse({ status: 200, type: MessageResponse })
  @Get("/health")
  async getHealthCheck(@Res() res: Response): Promise<MessageResponse> {
    return { message: "Hello" };
  }
}
