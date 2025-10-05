import { z } from 'zod';
import { createTRPCRouter, publicProcedure, protectedProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';

const videoCreateInput = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  videoUrl: z.url('Valid video URL is required'),
  thumbnailUrl: z.url('Valid thumbnail URL is required'),
  controls: z.boolean().optional().default(true),
  height: z.number().optional().default(1920),
  width: z.number().optional().default(1080),
  quality: z.number().min(1).max(100).optional().default(100),
});

const videoUpdateInput = z.object({
  id: z.string(),
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  controls: z.boolean().optional(),
  height: z.number().optional(),
  width: z.number().optional(),
  quality: z.number().min(1).max(100).optional(),
});

export const videoRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const videos = await ctx.prisma.video.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        likes: {
          select: {
            userId: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return videos.map((video: any) => ({
      ...video,
      likesCount: video.likes.length,
      isLiked: ctx.session?.user?.id 
        ? video.likes.some((like: { userId: string }) => like.userId === ctx.session?.user?.id)
        : false,
    }));
  }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const video = await ctx.prisma.video.findUnique({
        where: { id: input.id },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          likes: {
            select: {
              userId: true,
            },
          },
        },
      });

      if (!video) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Video not found',
        });
      }

      return {
        ...video,
        likesCount: video.likes.length,
        isLiked: ctx.session?.user?.id 
          ? video.likes.some((like: { userId: string }) => like.userId === ctx.session?.user?.id)
          : false,
      };
    }),

  create: protectedProcedure
    .input(videoCreateInput)
    .mutation(async ({ ctx, input }) => {
      const video = await ctx.prisma.video.create({
        data: {
          ...input,
          userId: ctx.session.user.id,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          likes: true,
        },
      });

      return {
        ...video,
        likesCount: video.likes.length,
        isLiked: false,
      };
    }),

  update: protectedProcedure
    .input(videoUpdateInput)
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;

      const existingVideo = await ctx.prisma.video.findUnique({
        where: { id },
        select: { userId: true },
      });

      if (!existingVideo) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Video not found',
        });
      }

      if (existingVideo.userId !== ctx.session.user.id) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'You can only update your own videos',
        });
      }

      const video = await ctx.prisma.video.update({
        where: { id },
        data,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          likes: {
            select: {
              userId: true,
            },
          },
        },
      });

      return {
        ...video,
        likesCount: video.likes.length,
        isLiked: video.likes.some((like: { userId: string }) => like.userId === ctx.session.user.id),
      };
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const existingVideo = await ctx.prisma.video.findUnique({
        where: { id: input.id },
        select: { userId: true },
      });

      if (!existingVideo) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Video not found',
        });
      }

      if (existingVideo.userId !== ctx.session.user.id) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'You can only delete your own videos',
        });
      }

      await ctx.prisma.video.delete({
        where: { id: input.id },
      });

      return { success: true };
    }),

  toggleLike: protectedProcedure
    .input(z.object({ videoId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const existingLike = await ctx.prisma.like.findUnique({
        where: {
          userId_videoId: {
            userId: ctx.session.user.id,
            videoId: input.videoId,
          },
        },
      });

      if (existingLike) {
        await ctx.prisma.like.delete({
          where: {
            userId_videoId: {
              userId: ctx.session.user.id,
              videoId: input.videoId,
            },
          },
        });
        return { liked: false };
      } else {
        await ctx.prisma.like.create({
          data: {
            userId: ctx.session.user.id,
            videoId: input.videoId,
          },
        });
        return { liked: true };
      }
    }),
});