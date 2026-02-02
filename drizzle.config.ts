import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    host: "ep-restless-pond-agideosw-pooler.c-2.eu-central-1.aws.neon.tech",
    port: 5432,
    user: "neondb_owner",
    password: "npg_kYycH1NuDKR2",
    database: "neondb",
    ssl: { rejectUnauthorized: false }, // required for Neon
  },
});
