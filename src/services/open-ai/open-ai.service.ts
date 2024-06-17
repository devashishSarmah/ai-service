import { Injectable } from '@nestjs/common';
import { OpenAI } from 'openai';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class OpenAiService {
  private openai: OpenAI;

  constructor(private configService: ConfigService) {
    this.openai = new OpenAI({ apiKey: this.configService.get<string>('openAIKey') });
  }

  async generateUserProfile(): Promise<any> {
    const prompt = `
    Generate a realistic user profile in JSON format with the following structure:
    {
      "username": "unique_username",
      "email": "unique_email@example.com",
      "password": "strong_password",
      "full_name": "Full Name",
      "bio": "Short biography",
      "profile_picture_url": "URL to profile picture",
      "website": "URL to personal website",
      "ai": {
        "personality_type": "personality type",
        "activity_pattern": "activity pattern",
        "language_preference": "preferred language",
        "region": "region",
        "content_preferences": "content preferences"
      }
    }
    `;

    const response = await this.openai.completions.create({
      model: 'davinci-002',
      prompt: prompt,
      max_tokens: 300,
    });

    const userProfile = JSON.parse(response.choices[0].text);
    userProfile.profile_picture_url = await this.generateProfilePicture();

    return userProfile;
  }


  async generateProfilePicture(): Promise<string> {
    const response = await this.openai.images.generate({
      prompt: 'Generate a realistic profile picture of a person',
      n: 1,
      size: '512x512',
    });

    return <string>response.data[0].url;
  }
}
