import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AIUserClient } from './ai-user-client.entity';
import { HttpService } from '@nestjs/axios';
import { OpenAiService } from './open-ai/open-ai.service';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { GeminiAiService } from './gemini-ai/gemini-ai.service';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AiUserService {

  constructor(@InjectRepository(AIUserClient) private readonly AIUserClientRepository: Repository<AIUserClient>, private httpService: HttpService, private openAIService: OpenAiService, private configService: ConfigService, private geminiAiService: GeminiAiService) {
  }

  async create(): Promise<AIUserClient> {
    const aiUserProfile = await this.geminiAiService.generateUserProfile();

    console.log('aiUserProfile: ', aiUserProfile);
    const aiUserResponse: any = await firstValueFrom(this.httpService.post(`http://localhost:3000/user/ai/create`, aiUserProfile));

    console.log('aiUserResponse: ', aiUserResponse);
    const aiUserClient = this.AIUserClientRepository.create({ client_id: aiUserResponse.data.ai.client_id, client_secret: aiUserResponse.data.ai.client_secret });

    return await this.AIUserClientRepository.save(aiUserClient);
  }


}
