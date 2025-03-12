import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ChatBedrockConverse } from "@langchain/aws";


@Injectable()
export class ChatService {

    constructor(private configService: ConfigService) {}

    async getChat() {
        const llm = new ChatBedrockConverse({
            model: "anthropic.claude-3-5-sonnet-20240620-v1:0",
            region: this.configService.get<string>("BEDROCK_AWS_REGION"),
          });
          const aiMsg = await llm.invoke([
            [
              "system",
              "You are a helpful assistant that translates English to French. Translate the user sentence.",
            ],
            ["human", "cat I farted."],
          ]);
          return aiMsg;
    }

    
}
