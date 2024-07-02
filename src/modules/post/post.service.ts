import { Injectable } from '@nestjs/common';
import { GeminiAiService } from '../../services/gemini-ai/gemini-ai.service';
import { AIUserDTO } from '../../dtos/ai-user.dto';
import { StableDiffusionService } from '../../services/stable-diffusion/stable-diffusion.service';
import { PostDTO } from '../../dtos/post.dto';
import { AiUserService } from '../ai-user/ai-user.service';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PostService {
  constructor(
    private geminiService: GeminiAiService,
    private stableDiffusionService: StableDiffusionService,
    private aiUserService: AiUserService,
    private httpService: HttpService,
    private configService: ConfigService,
  ) {}

  async generateCaption(aiUserDTO: AIUserDTO): Promise<string> {
    const prompt = `Generate a caption for a post created by an AI user with the following attributes: personality_type: ${aiUserDTO.personality_type}, content_preferences: [${aiUserDTO.content_preferences}], region: ${aiUserDTO.region}. The caption should reflect the user's personality and interests. JSON format: {caption: string}`;

    const model = this.geminiService.genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
    });

    const propmtResponse = await model.generateContent(prompt);

    console.log(prompt, propmtResponse);

    const caption = JSON.parse(
      propmtResponse.response.text().replace(/```json|```/g, ''),
    );

    return caption;
  }

  async generateLocation(aiUserDTO: AIUserDTO): Promise<string> {
    const prompt = `Generate a location for a post created by an AI user with the following attributes: region: ${aiUserDTO.region}. The location should be a well-known place within the specified region. JSON format: {location: string}`;

    const model = this.geminiService.genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
    });

    const propmtResponse = await model.generateContent(prompt);

    const location = JSON.parse(
      propmtResponse.response.text().replace(/```json|```/g, ''),
    );

    return location;
  }

  async generateImage(aiUserDTO: AIUserDTO): Promise<string> {
    const prompt = `Generate an image URL for a post created by an AI user with the following attributes: content_preferences: [${aiUserDTO.content_preferences}], region: ${aiUserDTO.region}.`;
    return await this.stableDiffusionService.createPhotoForPost(prompt);
  }

  async generatePost(aiUserDTO: AIUserDTO): Promise<PostDTO> {
    const caption = await this.generateCaption(aiUserDTO);
    const location = await this.generateLocation(aiUserDTO);
    const image = await this.generateImage(aiUserDTO);

    const post = new PostDTO({
      image_url: image,
      caption: caption,
      location: location,
    });

    return post;
  }

  async createPost(): Promise<Partial<PostDTO>> {
    const aiUser = await this.aiUserService.getRandomUser();
    const post = await this.generatePost(aiUser);

    const postResponse = await firstValueFrom(
      this.httpService.post(
        `${this.configService.get<string>('endpoints.timeline')}/social/post/create`,
        {
          user_id: aiUser.user_id,
          image_url: post.image_url,
          caption: post.caption,
          location: post.location,
        },
      ),
    );

    return postResponse.data;
  }
}
