import { trpc } from "@/lib/trpc";
import { UNAUTHED_ERR_MSG } from '@shared/const';
import { QueryClient, QueryClientProvider, HydrationBoundary } from "@tanstack/react-query";
import { httpBatchLink, TRPCClientError } from "@trpc/client";
import { createRoot, hydrateRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import superjson from "superjson";
import App from "./App";
import { getLoginUrl } from "./const";
import "./index.css";

// Declare the global variable from SSR
declare global {
    interface Window {
        __TRPC_DEHYDRATED_STATE__?: any;
    }
}

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
            refetchOnWindowFocus: false,
            staleTime: 1000 * 60 * 5, // 5 minutes (same as server)
        },
    },
});

const redirectToLoginIfUnauthorized = (error: unknown) => {
    if (!(error instanceof TRPCClientError)) return;
    if (typeof window === "undefined") return;

    const isUnauthorized = error.message === UNAUTHED_ERR_MSG;

    if (!isUnauthorized) return;

    window.location.href = getLoginUrl();
};

queryClient.getQueryCache().subscribe(event => {
    if (event.type === "updated" && event.action.type === "error") {
        const error = event.query.state.error;
        redirectToLoginIfUnauthorized(error);
        console.error("[API Query Error]", error);
    }
});

queryClient.getMutationCache().subscribe(event => {
    if (event.type === "updated" && event.action.type === "error") {
        const error = event.mutation.state.error;
        redirectToLoginIfUnauthorized(error);
        console.error("[API Mutation Error]", error);
    }
});

const trpcClient = trpc.createClient({
    links: [
        httpBatchLink({
            url: "/api/trpc",
            transformer: superjson,
            fetch(input, init) {
                return globalThis.fetch(input, {
                    ...(init ?? {}),
                    credentials: "include",
                });
            },
        }),
    ],
});

const rootEl = document.getElementById("root")!;
const dehydratedState = typeof window !== "undefined" ? window.__TRPC_DEHYDRATED_STATE__ : undefined;

const appJsx = (
    <HelmetProvider>
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
            <QueryClientProvider client={queryClient}>
                <HydrationBoundary state={dehydratedState}>
                    <App />
                </HydrationBoundary>
            </QueryClientProvider>
        </trpc.Provider>
    </HelmetProvider>
);

// If the root has SSR content, hydrate it. Otherwise, do a fresh client render.
if (rootEl.innerHTML.trim().length > 0) {
    hydrateRoot(rootEl, appJsx);
} else {
    createRoot(rootEl).render(appJsx);
}

