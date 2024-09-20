import { plainToInstance } from 'class-transformer';
import { IsNumber, IsString, validateSync } from 'class-validator';

class EnvironmentVariables {
  @IsNumber()
  APPLICATION_PORT: number;

  @IsString()
  APP_JWT_ACCESS_SECRET: string;

  @IsString()
  APP_JWT_ACCESS_EXPIRE_TIME: string;

  @IsString()
  APP_JWT_REFRESH_SECRET: string;

  @IsString()
  APP_JWT_REFRESH_EXPIRE_TIME: string;

  @IsString()
  APP_2FA_Token_EXPIRE_TIME: string;

  @IsString()
  DATABASE_URL: string;
}

export function validateEnv(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
