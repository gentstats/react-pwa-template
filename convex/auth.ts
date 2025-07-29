import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Simple session-based authentication for demo purposes
export const createSession = mutation({
  args: {
    userId: v.id("users"),
    token: v.string(),
    expiresAt: v.number(),
    ipAddress: v.optional(v.string()),
    userAgent: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    
    const sessionId = await ctx.db.insert("sessions", {
      ...args,
      isActive: true,
      createdAt: now,
    });

    // Update user's last login
    await ctx.db.patch(args.userId, {
      lastLoginAt: now,
      updatedAt: now,
    });

    return sessionId;
  },
});

export const getSession = query({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();

    if (!session || !session.isActive || session.expiresAt < Date.now()) {
      return null;
    }

    return session;
  },
});

export const getUserBySession = query({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();

    if (!session || !session.isActive || session.expiresAt < Date.now()) {
      return null;
    }

    const user = await ctx.db.get(session.userId);
    return user;
  },
});

export const revokeSession = mutation({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();

    if (session) {
      await ctx.db.patch(session._id, { isActive: false });
    }

    return session?._id;
  },
});

export const revokeAllUserSessions = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const sessions = await ctx.db
      .query("sessions")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    for (const session of sessions) {
      if (session.isActive) {
        await ctx.db.patch(session._id, { isActive: false });
      }
    }

    return sessions.length;
  },
});

export const cleanExpiredSessions = mutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    const expiredSessions = await ctx.db
      .query("sessions")
      .withIndex("by_expiry", (q) => q.lt("expiresAt", now))
      .collect();

    let cleanedCount = 0;
    for (const session of expiredSessions) {
      if (session.isActive) {
        await ctx.db.patch(session._id, { isActive: false });
        cleanedCount++;
      }
    }

    return cleanedCount;
  },
});

// Audit logging for security
export const logAction = mutation({
  args: {
    userId: v.id("users"),
    organizationId: v.id("organizations"),
    action: v.string(),
    resource: v.string(),
    resourceId: v.optional(v.string()),
    metadata: v.optional(v.object({})),
    ipAddress: v.optional(v.string()),
    userAgent: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    
    const logId = await ctx.db.insert("auditLogs", {
      ...args,
      createdAt: now,
    });

    return logId;
  },
});

export const getAuditLogs = query({
  args: {
    organizationId: v.optional(v.id("organizations")),
    userId: v.optional(v.id("users")),
    action: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let query = ctx.db.query("auditLogs");

    if (args.organizationId) {
      query = query.withIndex("by_organization", (q) => 
        q.eq("organizationId", args.organizationId)
      );
    } else if (args.userId) {
      query = query.withIndex("by_user", (q) => 
        q.eq("userId", args.userId)
      );
    }

    const logs = await query
      .order("desc")
      .take(args.limit || 100);

    return logs.filter(log => {
      if (args.action && log.action !== args.action) return false;
      return true;
    });
  },
});