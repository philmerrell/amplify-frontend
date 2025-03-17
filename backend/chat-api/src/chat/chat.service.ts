import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ChatBedrockConverse } from "@langchain/aws";


@Injectable()
export class ChatService {

    constructor(private configService: ConfigService) {}

    async streamChat() {
        const llm = new ChatBedrockConverse({
            model: 'anthropic.claude-3-5-sonnet-20240620-v1:0',
            region: this.configService.get<string>('BEDROCK_AWS_REGION'),
          });

        const message = await llm.invoke([
            { role: 'system', content: 'You are a helpful assistant that understands both French and English. Please answer any questions to the best of your ability.' },
            { role: 'user', content: 'Does saying, "ChatGPT" in French sound similar to "Cat I Farted" in French?' },
        ])
        return message;
        
    }

    async handleChat(model: string) {
        const llm = new ChatBedrockConverse({
            model: model,
            region: this.configService.get<string>('BEDROCK_AWS_REGION'),
        });

        const stream = llm.stream([
            { role: 'system', content: 'You are a helpful assistant that understands both French and English. Please answer any questions to the best of your ability.' },
            { role: 'user', content: 'Does saying, "ChatGPT" in French sound similar to "Cat I Farted" in French?' },
        ]);

        return stream;
    }

    async handleConversation(model: string, conversation: any) {

    }

    
}
