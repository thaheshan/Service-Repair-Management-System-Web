"use client";

import { useAuthStore } from "@/store/authStore";

/**
 * Central hook for role-based access control (RBAC).
 * Use this everywhere instead of inline role checks.
 */
export function useRoleAccess() {
  const { user } = useAuthStore();

  const role = user?.role?.toLowerCase() ?? "";

  const isAdmin = role === "admin";
  const isTechnician = role === "technician";
  const isAuthenticated = !!user;

  /**
   * Check if the current user can access a specific feature.
   * Returns true if allowed, false if not.
   */
  const can = (feature: RbacFeature): boolean => {
    return PERMISSIONS[feature]?.includes(role) ?? false;
  };

  return { isAdmin, isTechnician, isAuthenticated, role, can };
}

// All features that have role-based restrictions
export type RbacFeature =
  | "view:revenue"
  | "view:reports"
  | "view:staff"
  | "view:settings"
  | "view:invoices"
  | "view:shop-id"
  | "view:revenue-trend"
  | "view:top-technicians"
  | "view:inventory"
  | "manage:settings";

// Explicit allowlist per feature
const PERMISSIONS: Record<RbacFeature, string[]> = {
  "view:revenue":          ["admin"],
  "view:reports":          ["admin"],
  "view:staff":            ["admin"],
  "view:settings":         ["admin"],
  "view:invoices":         ["admin"],
  "view:shop-id":          ["admin"],
  "view:revenue-trend":    ["admin"],
  "view:top-technicians":  ["admin"],
  "view:inventory":        ["admin", "technician"],
  "manage:settings":       ["admin"],
};
