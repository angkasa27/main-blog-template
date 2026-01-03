// import { betterAuth } from "better-auth";
// import { Pool } from "pg";

// export const auth = betterAuth({
//   database: new Pool({
//     connectionString:
//       "postgresql://angkasa:1sampai8@localhost:5432/better-auth-sample?schema=public",
//   }),
//   emailAndPassword: {
//     enabled: true,
//   },
//   socialProviders: {},
// });

import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "@/lib/prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
});
