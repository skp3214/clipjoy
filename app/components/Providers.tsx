"use client"

import { ImageKitProvider } from "imagekitio-next";
import { SessionProvider } from "next-auth/react";
import { NotificationProvider } from "./Notification";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { trpc } from '@/lib/trpc-client';
import { useState } from 'react';

const urlEndpoint = process.env.NEXT_PUBLIC_URL_ENDPOINT;
const publicKey = process.env.NEXT_PUBLIC_PUBLIC_KEY;

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

    const authenticator = async () => {
        try {
            const response = await fetch("/api/imagekit-auth");

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Request failed with status ${response.status}: ${errorText}`);
            }

            const data = await response.json();
            const { signature, expire, token } = data;
            return { signature, expire, token };
        } catch (error) {
            throw new Error(`Imagekit Authentication request failed`);
        }
    };

    return (
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
            <QueryClientProvider client={queryClient}>
                <SessionProvider>
                    <NotificationProvider>
                        <ImageKitProvider
                            urlEndpoint={urlEndpoint}
                            publicKey={publicKey}
                            authenticator={authenticator}
                        >
                            {children}
                        </ImageKitProvider>
                    </NotificationProvider>
                </SessionProvider>
            </QueryClientProvider>
        </trpc.Provider>
    );
}