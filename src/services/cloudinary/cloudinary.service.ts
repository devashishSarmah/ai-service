import { Injectable } from '@nestjs/common';

import * as Cloudinary from 'cloudinary';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CloudinaryService {
  constructor(private configService: ConfigService) {
    Cloudinary.v2.config({
      secure: true,
      api_key: this.configService.get<string>('cloudinaryAPIKey'),
      api_secret: this.configService.get<string>('cloudinaryAPISecret'),
      cloud_name: this.configService.get<string>('cloudinaryCloudName'),
    });
  }

  async uploadImage(imageBase64: string): Promise<string | undefined> {
    try {
      // Upload the image
      const result: Cloudinary.UploadApiResponse | undefined =
        await new Promise((resolve, reject) => {
          Cloudinary.v2.uploader.upload(
            `data:image/webp;base64,${imageBase64}`,
            { resource_type: 'image' },
            (err, result) => {
              console.log(err, result);
              if (err) {
                reject(err);
              } else {
                resolve(result);
              }
            },
          );
        });
      return String(result?.secure_url);
    } catch (error) {
      console.error('Error uploading image:', error);
      return undefined;
    }
  }
}
