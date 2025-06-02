import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { posts } from "@/server/db/schema";
import { desc } from "drizzle-orm";

export const postRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const allPosts = await ctx.db.query.posts.findMany({
      orderBy: [desc(posts.createdAt)],
    });
    return allPosts;
  }),
});
