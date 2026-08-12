import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('8083'),
  YTDLP_PATH: z.string().default('yt-dlp'),
  FFMPEG_PATH: z.string().default('ffmpeg'),
  MAX_DOWNLOAD_SIZE_MB: z.string().default('500'),
  MAX_DOWNLOAD_TIME_SECONDS: z.string().default('600'),
  MAX_CONCURRENT_DOWNLOADS: z.string().default('2'),
  RATE_LIMIT_MAX: z.string().default('5'),
  RATE_LIMIT_WINDOW: z.string().default('60000'),
  CORS_ORIGIN: z.string().default('http://localhost:8083'),
});

type EnvSchema = z.infer<typeof envSchema>;

function validateEnv(): EnvSchema {
  const env = envSchema.safeParse(process.env);

  if (!env.success) {
    console.error('❌ Invalid environment variables:');
    console.error(env.error.flatten());
    process.exit(1);
  }

  return env.data;
}

export const env = validateEnv();
