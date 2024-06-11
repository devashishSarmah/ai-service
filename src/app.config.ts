import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as fs from 'fs';

export const appConfig = () => ({
  mode: process.env.MODE,
  ssl: {
    ca: process.env.SSL_CA,
    key: process.env.SSL_KEY,
    cert: process.env.SSL_CERT,
  },
  database: {
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    username: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  },
});

function provideSSL(configService: ConfigService) {
  return isProduction(configService)
    ? {
        rejectUnauthorized: true,
        ca: fs.readFileSync(configService.get<string>('ssl.ca')),
        key: fs.readFileSync(configService.get<string>('ssl.key')),
        cert: fs.readFileSync(configService.get<string>('ssl.cert')),
      }
    : false;
}

function isProduction(configService: ConfigService) {
  const mode = configService.get<string>('mode');
  return mode === 'PROD';
}

function getMigrationDirectory() {
  return `./migrations/**/*{.ts,.js}`;
}

export const typeOrmConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => ({
  type: 'mysql',
  host: configService.get<string>('database.host'),
  port: configService.get<number>('database.port'),
  username: configService.get<string>('database.username'),
  password: configService.get<string>('database.password'),
  database: configService.get<string>('database.database'),
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrationsTableName: 'migration',
  migrations: [getMigrationDirectory()],
  ssl: provideSSL(configService),
  synchronize: !isProduction(configService),
});
