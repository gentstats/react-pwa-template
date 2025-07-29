// Mock Convex generated types for development
export type Id<T extends string> = string & { __tableName: T };

export interface DataModel {
  users: {
    _id: Id<"users">;
    name: string;
    email: string;
    avatar?: string;
    role: "admin" | "manager" | "user" | "viewer";
    organizationId: Id<"organizations">;
    isActive: boolean;
    lastLoginAt?: number;
    createdAt: number;
    updatedAt: number;
  };
  organizations: {
    _id: Id<"organizations">;
    name: string;
    slug: string;
    description?: string;
    logo?: string;
    settings: {
      allowSelfRegistration: boolean;
      defaultRole: "manager" | "user" | "viewer";
      maxUsers?: number;
    };
    isActive: boolean;
    createdAt: number;
    updatedAt: number;
  };
  tasks: {
    _id: Id<"tasks">;
    title: string;
    description?: string;
    status: "todo" | "in_progress" | "completed";
    priority: "low" | "medium" | "high";
    assignedTo?: Id<"users">;
    createdBy: Id<"users">;
    organizationId: Id<"organizations">;
    dueDate?: number;
    completedAt?: number;
    createdAt: number;
    updatedAt: number;
  };
  sessions: {
    _id: Id<"sessions">;
    userId: Id<"users">;
    token: string;
    expiresAt: number;
    isActive: boolean;
    ipAddress?: string;
    userAgent?: string;
    createdAt: number;
  };
  auditLogs: {
    _id: Id<"auditLogs">;
    userId: Id<"users">;
    organizationId: Id<"organizations">;
    action: string;
    resource: string;
    resourceId?: string;
    metadata?: Record<string, any>;
    ipAddress?: string;
    userAgent?: string;
    createdAt: number;
  };
}