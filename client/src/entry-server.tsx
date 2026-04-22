import { trpc } from "@/lib/trpc";
import { QueryClient, QueryClientProvider, dehydrate } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import React from "react";
import ReactDOMServer from "react-dom/server";
import { HelmetProvider } from "react-helmet-async";
import superjson from "superjson";
import { Router, type BaseLocationHook } from "wouter";
import App from "./App";

export async function render(url: string) {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
                refetchOnWindowFocus: false,
                staleTime: 1000 * 60 * 5, // 5 minutes
            },
        },
    });

    const port = process.env.PORT || 3000;
    const trpcClient = trpc.createClient({
        links: [
            httpBatchLink({
                url: `http://localhost:${port}/api/trpc`,
                transformer: superjson,
                fetch(input, init) {
                    return globalThis.fetch(input, init);
                },
            }),
        ],
    });

    // Prefetch critical data for the Shop and Home pages
    try {
        if (url === "/" || url.startsWith("/shop")) {
            console.log(`[SSR] Prefetching data for ${url}...`);
            await Promise.all([
                queryClient.prefetchQuery({
                    queryKey: [["product", "list"], { input: { limit: 48, offset: 0 }, type: "query" }],
                    queryFn: () => trpcClient.product.list.query({ limit: 48, offset: 0 }),
                }),
                queryClient.prefetchQuery({
                    queryKey: [["category", "listWithSubs"], { type: "query" }],
                    queryFn: () => trpcClient.category.listWithSubs.query(),
                })
            ]);
            console.log(`[SSR] Prefetching complete for ${url}.`);
        }
    } catch (err) {
        console.error("[SSR] Prefetch error:", err);
    }

    const helmetContext: any = {};
    const hook: BaseLocationHook = () => [url, () => { }];

    const html = ReactDOMServer.renderToString(
        <React.StrictMode>
            <HelmetProvider context={helmetContext}>
                <Router hook={hook}>
                    <trpc.Provider client={trpcClient} queryClient={queryClient}>
                        <QueryClientProvider client={queryClient}>
                            <App />
                        </QueryClientProvider>
                    </trpc.Provider>
                </Router>
            </HelmetProvider>
        </React.StrictMode>
    );

    const { helmet } = helmetContext;
    const dehydratedState = dehydrate(queryClient);

    return { html, helmet, dehydratedState };
}
