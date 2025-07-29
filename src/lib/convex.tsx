import { ConvexProvider, ConvexReactClient } from "convex/react";

// For development, we'll use a mock URL since the network setup failed
// In production, this would be your actual Convex deployment URL
const convexUrl = import.meta.env.VITE_CONVEX_URL || "https://api.convex.dev";

export const convex = new ConvexReactClient(convexUrl);

export function ConvexClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}