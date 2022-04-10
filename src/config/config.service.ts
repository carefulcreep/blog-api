import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as Joi from 'joi';
import { join } from 'path';

export interface IEnvConfig {
  PORT?: number;
  NODE_ENV?: string;
  DOT_DEBUG?: boolean;

  POSTGRES_HOST: string;
  POSTGRES_PORT: number;
  POSTGRES_USER: string;
  POSTGRES_PASSWORD: string;
  POSTGRES_DB: string;
  POSTGRES_SYNC: boolean;

  JWT_ACCESS_TOKEN_SECRET: string;
  JWT_ACCESS_TOKEN_EXPIRATION_TIME: string;
}

export interface postgresConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  synchronize: boolean;
}

export interface JwtConfig {
  secret: string;
  expiresIn: string;
}

@Injectable()
export class ConfigService {
  private readonly envConfig: IEnvConfig;

  private readonly propsMap: { [key: string]: any } = {
    PORT: Joi.number().default(6007),
    NODE_ENV: Joi.string()
      .valid('dev', 'production', 'staging', 'test')
      .default('dev'),
    DOT_DEBUG: Joi.boolean().optional(),

    POSTGRES_HOST: Joi.string().required(),
    POSTGRES_PORT: Joi.number().required(),
    POSTGRES_USER: Joi.string().required(),
    POSTGRES_PASSWORD: Joi.string().required(),
    POSTGRES_DB: Joi.string().required(),
    POSTGRES_SYNC: Joi.boolean().required(),

    JWT_ACCESS_TOKEN_SECRET: Joi.string().required(),
    JWT_ACCESS_TOKEN_EXPIRATION_TIME: Joi.string().required(),
  };

  readonly schema: Joi.ObjectSchema = Joi.object(this.propsMap);

  constructor(filePath = 'dev.env') {
    const dotenvPath = join(__dirname, '../../env', filePath);
    const config = dotenv.parse(fs.readFileSync(dotenvPath, 'utf8'));
    dotenv.config({
      path: dotenvPath,
      debug: process.env.DOT_DEBUG === 'true',
    });

    const systemEnv = process.env;

    Object.keys(systemEnv).forEach((key: string) => {
      if (this.propsMap[key]) {
        config[key] = systemEnv[key];
      }
    });

    this.envConfig = this.validateInput(config as unknown as IEnvConfig);
  }

  validateInput(envConfig: IEnvConfig): IEnvConfig {
    const { error, value: validatedEnvConfig } =
      this.schema.validate(envConfig);
    if (error) {
      throw new Error(`Config validation error: ${error.message}`);
    }
    return validatedEnvConfig;
  }

  get port(): number {
    return this.envConfig.PORT;
  }

  get postgresConfig(): postgresConfig {
    return {
      host: this.envConfig.POSTGRES_HOST,
      port: this.envConfig.POSTGRES_PORT,
      password: this.envConfig.POSTGRES_PASSWORD,
      username: this.envConfig.POSTGRES_USER,
      database: this.envConfig.POSTGRES_DB,
      synchronize: this.envConfig.POSTGRES_SYNC,
    };
  }

  get jwtAccessConfig(): JwtConfig {
    return {
      secret: this.envConfig.JWT_ACCESS_TOKEN_SECRET,
      expiresIn: this.envConfig.JWT_ACCESS_TOKEN_EXPIRATION_TIME,
    };
  }
}
