import { Controller, Get, Post } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {

    constructor(private chatService: ChatService) {}

    @Post()
    postChat() {
        return this.chatService.streamChat();
    }
}

