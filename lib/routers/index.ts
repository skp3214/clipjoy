import { createTRPCRouter } from '../trpc';
import { authRouter } from './auth';
import { videoRouter } from './video';

export const appRouter = createTRPCRouter({
  auth: authRouter,
  video: videoRouter,
});

export type AppRouter = typeof appRouter;