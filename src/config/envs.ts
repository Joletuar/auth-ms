import 'dotenv/config';

import * as joi from 'joi';

interface EnvVars {
  PORT: number;
  RABBITMQ_SERVER: string;
  JWT_SECRET: string;
}

const envVarsSchema = joi
  .object({
    PORT: joi.number().required(),
    RABBITMQ_SERVER: joi.string().required(),
    JWT_SECRET: joi.string().required(),
  })
  .unknown(true);

const { error, value } = envVarsSchema.validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const envVars: EnvVars = value;

export const envs = {
  PORT: envVars.PORT,

  RABBITMQ_SERVER: envVars.RABBITMQ_SERVER,

  JWT_SECRET: envVars.JWT_SECRET,
};
