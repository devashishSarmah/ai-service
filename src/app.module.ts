import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from "@nestjs/config";
import { appConfig, typeOrmConfig } from "./app.config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AiUserModule } from "./modules/ai-user/ai-user.module";

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    load: [appConfig],
  }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) =>
        typeOrmConfig(configService),
      inject: [ConfigService],
    }), AiUserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
