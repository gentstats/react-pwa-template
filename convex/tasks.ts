import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const create = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    priority: v.union(v.literal("low"), v.literal("medium"), v.literal("high")),
    assignedTo: v.optional(v.id("users")),
    createdBy: v.id("users"),
    organizationId: v.id("organizations"),
    dueDate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    
    const taskId = await ctx.db.insert("tasks", {
      ...args,
      status: "todo",
      createdAt: now,
      updatedAt: now,
    });

    return taskId;
  },
});

export const get = query({
  args: { id: v.id("tasks") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const getByOrganization = query({
  args: { 
    organizationId: v.id("organizations"),
    status: v.optional(v.union(v.literal("todo"), v.literal("in_progress"), v.literal("completed"))),
    assignedTo: v.optional(v.id("users")),
  },
  handler: async (ctx, args) => {
    let query = ctx.db
      .query("tasks")
      .withIndex("by_organization", (q) => q.eq("organizationId", args.organizationId));

    const tasks = await query.collect();
    
    return tasks.filter(task => {
      if (args.status && task.status !== args.status) return false;
      if (args.assignedTo && task.assignedTo !== args.assignedTo) return false;
      return true;
    });
  },
});

export const getByUser = query({
  args: { 
    userId: v.id("users"),
    includeCreated: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const assignedTasks = await ctx.db
      .query("tasks")
      .withIndex("by_assignee", (q) => q.eq("assignedTo", args.userId))
      .collect();

    if (!args.includeCreated) {
      return assignedTasks;
    }

    const createdTasks = await ctx.db
      .query("tasks")
      .withIndex("by_creator", (q) => q.eq("createdBy", args.userId))
      .collect();

    // Combine and deduplicate
    const allTasks = [...assignedTasks];
    createdTasks.forEach(task => {
      if (!allTasks.find(t => t._id === task._id)) {
        allTasks.push(task);
      }
    });

    return allTasks;
  },
});

export const update = mutation({
  args: {
    id: v.id("tasks"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    status: v.optional(v.union(v.literal("todo"), v.literal("in_progress"), v.literal("completed"))),
    priority: v.optional(v.union(v.literal("low"), v.literal("medium"), v.literal("high"))),
    assignedTo: v.optional(v.id("users")),
    dueDate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, status, ...updates } = args;
    const now = Date.now();
    
    const updateData: any = {
      ...updates,
      updatedAt: now,
    };

    if (status) {
      updateData.status = status;
      if (status === "completed") {
        updateData.completedAt = now;
      }
    }
    
    await ctx.db.patch(id, updateData);

    return id;
  },
});

export const deleteTask = mutation({
  args: { id: v.id("tasks") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return args.id;
  },
});

export const getStats = query({
  args: { 
    organizationId: v.optional(v.id("organizations")),
    userId: v.optional(v.id("users")),
  },
  handler: async (ctx, args) => {
    let tasks;
    
    if (args.organizationId) {
      tasks = await ctx.db
        .query("tasks")
        .withIndex("by_organization", (q) => q.eq("organizationId", args.organizationId))
        .collect();
    } else if (args.userId) {
      tasks = await ctx.db
        .query("tasks")
        .withIndex("by_assignee", (q) => q.eq("assignedTo", args.userId))
        .collect();
    } else {
      tasks = await ctx.db.query("tasks").collect();
    }

    const now = Date.now();
    const overdueTasks = tasks.filter(t => t.dueDate && t.dueDate < now && t.status !== "completed");

    return {
      total: tasks.length,
      todo: tasks.filter(t => t.status === "todo").length,
      inProgress: tasks.filter(t => t.status === "in_progress").length,
      completed: tasks.filter(t => t.status === "completed").length,
      overdue: overdueTasks.length,
      highPriority: tasks.filter(t => t.priority === "high" && t.status !== "completed").length,
    };
  },
});