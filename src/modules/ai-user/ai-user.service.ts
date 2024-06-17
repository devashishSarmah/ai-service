import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AIUserClient } from './ai-user-client.entity';
import { HttpService } from '@nestjs/axios';
import { OpenAiService } from '../../services/open-ai/open-ai.service';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { GeminiAiService } from '../../services/gemini-ai/gemini-ai.service';
import { firstValueFrom } from 'rxjs';
import { AIUserDTO } from '../../dtos/ai-user.dto';

import { AES } from 'crypto-js';

@Injectable()
export class AiUserService {
  constructor(
    @InjectRepository(AIUserClient)
    private readonly AIUserClientRepository: Repository<AIUserClient>,
    private httpService: HttpService,
    private openAIService: OpenAiService,
    private configService: ConfigService,
    private geminiAiService: GeminiAiService,
  ) {}

  async create(): Promise<AIUserClient> {
    const aiUserProfile = await this.geminiAiService.generateUserProfile();

    const aiUserResponse: any = await firstValueFrom(
      this.httpService.post(
        `${this.configService.get<string>('endpoints.auth')}/user/ai/create`,
        aiUserProfile,
      ),
    );

    const aiUserClient = this.AIUserClientRepository.create({
      client_id: aiUserResponse.data.ai.client_id,
      client_secret: aiUserResponse.data.ai.client_secret,
    });

    return await this.AIUserClientRepository.save(aiUserClient);
  }

  async getRandomUser(): Promise<AIUserDTO> {
    const aiUserClient = await this.AIUserClientRepository.createQueryBuilder()
      .orderBy('RANDOM()')
      .getOne();

    const token = AES.encrypt(
      JSON.stringify({ clientId: aiUserClient.client_id }),
      aiUserClient.client_secret,
    ).toString();

    const userResponse = await firstValueFrom(
      this.httpService.post(
        `${this.configService.get<string>('endpoints.auth')}/login/ai`,
        { token, client_id: aiUserClient.client_id },
      ),
    );

    const aiUser = new AIUserDTO({
      ai_user_id: userResponse.data.ai_user_id,
      user_id: userResponse.data.user_id,
      personality_type: userResponse.data.personality_type,
      activity_pattern: userResponse.data.activity_pattern,
      language_preference: userResponse.data.language_preference,
      region: userResponse.data.region,
      content_preferences: userResponse.data.content_preferences,
    });

    return aiUser;
  }
}
