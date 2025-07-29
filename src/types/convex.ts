// Mock Convex Id type for development
export type Id<T extends string> = string & { __tableName: T };

export type UserRole = "admin" | "manager" | "user" | "viewer";

export type User = {
  _id: Id<"users">;
  name: string;
  email: string;
  avatar?: string;
  role: UserRole;
  organizationId: Id<"organizations">;
  isActive: boolean;
  lastLoginAt?: number;
  createdAt: number;
  updatedAt: number;
};

export type Organization = {
  _id: Id<"organizations">;
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  settings: {
    allowSelfRegistration: boolean;
    defaultRole: Exclude<UserRole, "admin">;
    maxUsers?: number;
  };
  isActive: boolean;
  createdAt: number;
  updatedAt: number;
};

export type TaskStatus = "todo" | "in_progress" | "completed";
export type TaskPriority = "low" | "medium" | "high";

export type Task = {
  _id: Id<"tasks">;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignedTo?: Id<"users">;
  createdBy: Id<"users">;
  organizationId: Id<"organizations">;
  dueDate?: number;
  completedAt?: number;
  createdAt: number;
  updatedAt: number;
};

export type Session = {
  _id: Id<"sessions">;
  userId: Id<"users">;
  token: string;
  expiresAt: number;
  isActive: boolean;
  ipAddress?: string;
  userAgent?: string;
  createdAt: number;
};

export type AuditLog = {
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

export type TaskStats = {
  total: number;
  todo: number;
  inProgress: number;
  completed: number;
  overdue: number;
  highPriority: number;
};

export type OrganizationStats = {
  totalUsers: number;
  activeUsers: number;
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
};