import { ApiProperty } from "@nestjs/swagger";

export class MessageResponse {
  @ApiProperty({ description: "Message" })
  readonly message: string;
}
