"use client"

import { SessionProvider } from "next-auth/react";
import { NotificationProvider } from "./Notification";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { trpc } from '@/lib/trpc-client';
import { useState } from 'react';

export default function Providers({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(() => new QueryClient());
    const [trpcClient] = useState(() =>
        trpc.createClient({
            links: [
                httpBatchLink({
                    url: '/api/trpc',
                }),
            ],
        })
    );

    return (
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
            <QueryClientProvider client={queryClient}>
                <SessionProvider>
                    <NotificationProvider>
                        {children}
                    </NotificationProvider>
                </SessionProvider>
            </QueryClientProvider>
        </trpc.Provider>
    );
}