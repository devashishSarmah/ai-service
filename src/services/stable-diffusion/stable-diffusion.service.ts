import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class StableDiffusionService {
  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
    private cloudinaryService: CloudinaryService,
  ) {}

  async createUserProfileImage(
    prompt: string,
    format = 'webp',
  ): Promise<string | undefined> {
    const formData = new FormData();
    formData.append('prompt', prompt);
    formData.append('output_format', format);

    const response = await firstValueFrom(
      this.httpService.post(
        `https://api.stability.ai/v2beta/stable-image/generate/core`,
        formData,
        {
          validateStatus: undefined,
          responseType: 'json',
          headers: {
            Authorization: `Bearer ${this.configService.get<string>('diffusionAPIKey')}`,
            Accept: 'application/json',
          },
        },
      ),
    );
    const url = await this.cloudinaryService.uploadImage(response.data.image);
    return url;
  }

  async createPhotoForPost(
    prompt: string,
    format = 'webp',
  ): Promise<string | undefined> {
    return await this.createUserProfileImage(prompt, format);
  }
}
