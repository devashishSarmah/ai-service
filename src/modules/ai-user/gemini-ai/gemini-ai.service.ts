import { Injectable } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { ConfigService } from '@nestjs/config';
import { StableDiffusionService } from '../stable-diffusion/stable-diffusion.service';

@Injectable()
export class GeminiAiService {
  genAI: GoogleGenerativeAI;
  constructor(private configService: ConfigService, private stableDiffusionService: StableDiffusionService) {
    this.genAI = new GoogleGenerativeAI(<string>this.configService.get<string>('geminiAPIKey'));
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

    const model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' } );

    const propmtResponse = await model.generateContent(prompt);

    const userProfile = JSON.parse(propmtResponse.response.text().replace(/```json|```/g, ''));
    userProfile.profile_picture_url = await this.generateProfilePicture();

    return userProfile;
  }

  async generateProfilePicture(): Promise<string> {
    const prompt = `Generate a photo of a person with a neutral expression, suitable for a profile picture`;
    return String(await this.stableDiffusionService.createUserProfileImage(prompt));
  }

}
