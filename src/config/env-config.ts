import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string(),
  PORT: z.string().transform(Number).default("3000"),
  HOST: z.string().default("0.0.0.0"),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error(
    "❌ Invalid environment variables:",
    parsedEnv.error.toString()
  );
  process.exit(1);
}

export const envConfig = {
  database: {
    url: parsedEnv.data.DATABASE_URL,
  },
  server: {
    port: parsedEnv.data.PORT,
    host: parsedEnv.data.HOST,
    env: parsedEnv.data.NODE_ENV,
  },
} as const;
