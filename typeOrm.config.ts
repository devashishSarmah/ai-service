import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { typeOrmConfig, appConfig } from './src/app.config';
import { ConfigModule } from '@nestjs/config';
import * as dotenv from 'dotenv';

dotenv.config();

ConfigModule.forRoot({
  isGlobal: true,
  load: [appConfig],
});

const configService = new ConfigService(appConfig());
console.log(appConfig(), typeOrmConfig(configService));
const dataSource = new DataSource(<any>typeOrmConfig(configService));

export default dataSource;
