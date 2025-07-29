import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const create = mutation({
  args: {
    name: v.string(),
    slug: v.string(),
    description: v.optional(v.string()),
    logo: v.optional(v.string()),
    settings: v.optional(v.object({
      allowSelfRegistration: v.boolean(),
      defaultRole: v.union(v.literal("manager"), v.literal("user"), v.literal("viewer")),
      maxUsers: v.optional(v.number()),
    })),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    
    // Check if organization with this slug already exists
    const existingOrg = await ctx.db
      .query("organizations")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
    
    if (existingOrg) {
      throw new Error("Organization with this slug already exists");
    }

    const defaultSettings = {
      allowSelfRegistration: false,
      defaultRole: "user" as const,
      maxUsers: undefined,
    };

    const organizationId = await ctx.db.insert("organizations", {
      ...args,
      settings: args.settings || defaultSettings,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    });

    return organizationId;
  },
});

export const get = query({
  args: { id: v.id("organizations") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("organizations")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
  },
});

export const update = mutation({
  args: {
    id: v.id("organizations"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    logo: v.optional(v.string()),
    settings: v.optional(v.object({
      allowSelfRegistration: v.boolean(),
      defaultRole: v.union(v.literal("manager"), v.literal("user"), v.literal("viewer")),
      maxUsers: v.optional(v.number()),
    })),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const now = Date.now();
    
    await ctx.db.patch(id, {
      ...updates,
      updatedAt: now,
    });

    return id;
  },
});

export const deleteOrganization = mutation({
  args: { id: v.id("organizations") },
  handler: async (ctx, args) => {
    // Check if organization has users
    const users = await ctx.db
      .query("users")
      .withIndex("by_organization", (q) => q.eq("organizationId", args.id))
      .collect();

    if (users.length > 0) {
      throw new Error("Cannot delete organization with existing users");
    }

    await ctx.db.delete(args.id);
    return args.id;
  },
});

export const list = query({
  args: {
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const organizations = await ctx.db.query("organizations").collect();
    
    return organizations.filter(org => {
      if (args.isActive !== undefined && org.isActive !== args.isActive) return false;
      return true;
    });
  },
});

export const getStats = query({
  args: { id: v.id("organizations") },
  handler: async (ctx, args) => {
    const users = await ctx.db
      .query("users")
      .withIndex("by_organization", (q) => q.eq("organizationId", args.id))
      .collect();

    const tasks = await ctx.db
      .query("tasks")
      .withIndex("by_organization", (q) => q.eq("organizationId", args.id))
      .collect();

    return {
      totalUsers: users.length,
      activeUsers: users.filter(u => u.isActive).length,
      totalTasks: tasks.length,
      completedTasks: tasks.filter(t => t.status === "completed").length,
      pendingTasks: tasks.filter(t => t.status !== "completed").length,
    };
  },
});