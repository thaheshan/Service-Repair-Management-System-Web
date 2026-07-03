"use client";

import React, { useState, useCallback } from "react";
import { DashboardSidebar } from "@/components/admin/dashboard/sidebar";
import { DashboardHeader } from "@/components/admin/dashboard/header";
import {
  useGetActivityLogsQuery,
  useGetLogsSummaryQuery,
} from "@/services/api/logsApiSlice";
import {
  Activity,
  Search,
  Filter,
  RefreshCw,
  Calendar,
  User,
  TrendingUp,
  Clock,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Download,
  DollarSign,
  Zap,
  Eye,
} from "lucide-react";
import { format } from "date-fns";

const ACTION_COLORS: Record<string, string> = {
  CREATE: "bg-emerald-100 text-emerald-800 border-emerald-200",
  UPDATE: "bg-blue-100 text-blue-800 border-blue-200",
  DELETE: "bg-red-100 text-red-800 border-red-200",
  LOGIN: "bg-purple-100 text-purple-800 border-purple-200",
};

function getActionColor(action: string): string {
  const prefix = action.split("_")[0];
  return ACTION_COLORS[prefix] ?? "bg-gray-100 text-gray-800 border-gray-200";
}

function formatAction(action: string): string {
  return action
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

const ROLE_BADGE: Record<string, string> = {
  ADMIN: "bg-violet-100 text-violet-800",
  MANAGER: "bg-blue-100 text-blue-800",
  TECHNICIAN: "bg-amber-100 text-amber-800",
};

function generateHumanReadableDetails(log: any): string[] {
  const body = log.details?.body || {};
  if (Object.keys(body).length === 0) return [];

  const changes: string[] = [];
  const actionPrefix = log.action.split("_")[0]; // CREATE, UPDATE, DELETE

  if (log.action.includes("NOTE") && body.text) {
    changes.push(`Added a note: "${body.text}"`);
    return changes;
  }

  for (const [key, value] of Object.entries(body)) {
    // Skip empty or complex objects in the sentence, just handle strings/numbers/booleans
    if (value === null || value === undefined) continue;
    
    const formattedKey = key.replace(/([A-Z])/g, ' $1').toLowerCase().trim();
    
    if (key === "status") {
      changes.push(`Changed status to "${String(value).replace(/_/g, " ")}"`);
    } else if (key === "amount" || key === "estimatedCost" || key === "finalCost") {
      changes.push(`Set ${formattedKey} to Rs. ${value}`);
    } else if (typeof value === "string" || typeof value === "number") {
      // Don't show super long strings like base64 images
      const valStr = String(value);
      if (valStr.length > 50) {
        changes.push(`Updated the ${formattedKey}`);
      } else {
        changes.push(`Set ${formattedKey} to "${valStr}"`);
      }
    } else if (typeof value === "boolean") {
      changes.push(value ? `Enabled ${formattedKey}` : `Disabled ${formattedKey}`);
    } else if (Array.isArray(value)) {
      changes.push(`Updated ${formattedKey} (${value.length} items)`);
    }
  }

  return changes;
}

export default function LogsPage() {
  const [search, setSearch] = useState("");
  const [userId, setUserId] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [page, setPage] = useState(1);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const LIMIT = 50;

  // Build query params
  const queryParams = {
    search: search || undefined,
    userId: userId || undefined,
    fromDate: fromDate || undefined,
    toDate: toDate || undefined,
    page,
    limit: LIMIT,
  };

  const { data, isLoading, isFetching, refetch } = useGetActivityLogsQuery(queryParams, {
    pollingInterval: 30000, // Live updates every 30 seconds
  });

  const { data: summary } = useGetLogsSummaryQuery(undefined, {
    pollingInterval: 30000,
  });

  const logs = data?.data ?? [];
  const meta = data?.meta;
  const staffList = data?.staff ?? [];

  // Export as CSV
  const handleExport = useCallback(() => {
    if (!logs.length) return;
    const headers = ["Date & Time", "Staff Name", "Role", "Action", "Entity", "Entity ID", "Amount", "Amount Label"];
    const rows = logs.map((l) => [
      format(new Date(l.createdAt), "yyyy-MM-dd HH:mm:ss"),
      l.userName,
      l.userRole,
      l.action,
      l.entity,
      l.entityId ?? "",
      l.amount ?? "",
      l.amountLabel ?? "",
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `activity-logs-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [logs]);

  const clearFilters = () => {
    setSearch("");
    setUserId("");
    setFromDate("");
    setToDate("");
    setPage(1);
  };

  const hasFilters = !!(search || userId || fromDate || toDate);

  return (
    <div className="flex bg-background h-screen overflow-hidden">
      <DashboardSidebar />
      <div className="flex flex-1 flex-col lg:ml-[200px] ml-0 min-w-0">
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto px-4 lg:px-8 py-6">
          {/* Page Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-black text-foreground tracking-tight flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-xl">
                  <Activity className="h-6 w-6 text-primary" />
                </div>
                Activity Logs
              </h1>
              <p className="text-sm text-muted-foreground font-medium mt-1">
                Complete audit trail of all staff actions in your shop
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => refetch()}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border text-sm font-semibold text-muted-foreground hover:bg-muted transition-colors"
              >
                <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
                Refresh
              </button>
              <button
                onClick={handleExport}
                disabled={!logs.length}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                <Download className="h-4 w-4" />
                Export CSV
              </button>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-card rounded-2xl border border-border p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Today's Actions</span>
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <Zap className="h-4 w-4 text-emerald-600" />
                </div>
              </div>
              <p className="text-3xl font-black text-foreground">{summary?.data.totalToday ?? "—"}</p>
              <p className="text-xs text-muted-foreground font-medium mt-1">Actions logged today</p>
            </div>
            <div className="bg-card rounded-2xl border border-border p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Total Logs</span>
                <div className="p-2 bg-primary/10 rounded-lg">
                  <TrendingUp className="h-4 w-4 text-primary" />
                </div>
              </div>
              <p className="text-3xl font-black text-foreground">{summary?.data.totalAll?.toLocaleString() ?? "—"}</p>
              <p className="text-xs text-muted-foreground font-medium mt-1">All-time activity entries</p>
            </div>
            <div className="bg-card rounded-2xl border border-border p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Showing</span>
                <div className="p-2 bg-amber-100 rounded-lg">
                  <Filter className="h-4 w-4 text-amber-600" />
                </div>
              </div>
              <p className="text-3xl font-black text-foreground">{meta?.total?.toLocaleString() ?? "—"}</p>
              <p className="text-xs text-muted-foreground font-medium mt-1">Matching your current filters</p>
            </div>
          </div>

          {/* Filters Bar */}
          <div className="bg-card rounded-2xl border border-border p-4 mb-4 shadow-sm">
            <div className="flex flex-col lg:flex-row gap-3">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search by staff name, action, entity..."
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  className="w-full h-10 pl-9 pr-4 rounded-lg border border-border bg-muted/40 text-sm font-medium outline-none focus:bg-card focus:ring-1 focus:ring-primary transition-all"
                />
              </div>

              {/* Staff Filter */}
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <select
                  value={userId}
                  onChange={(e) => { setUserId(e.target.value); setPage(1); }}
                  className="h-10 pl-9 pr-8 rounded-lg border border-border bg-muted/40 text-sm font-medium outline-none focus:bg-card min-w-[180px]"
                >
                  <option value="">All Staff</option>
                  {staffList.map((s) => (
                    <option key={s.userId} value={s.userId}>
                      {s.userName} ({s.userRole})
                    </option>
                  ))}
                </select>
              </div>

              {/* Date Range */}
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="date"
                    value={fromDate}
                    onChange={(e) => { setFromDate(e.target.value); setPage(1); }}
                    className="h-10 pl-9 pr-3 rounded-lg border border-border bg-muted/40 text-sm font-medium outline-none focus:bg-card"
                  />
                </div>
                <span className="text-muted-foreground text-sm font-medium">to</span>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="date"
                    value={toDate}
                    onChange={(e) => { setToDate(e.target.value); setPage(1); }}
                    className="h-10 pl-9 pr-3 rounded-lg border border-border bg-muted/40 text-sm font-medium outline-none focus:bg-card"
                  />
                </div>
              </div>

              {hasFilters && (
                <button
                  onClick={clearFilters}
                  className="h-10 px-4 rounded-lg border border-border text-sm font-semibold text-muted-foreground hover:bg-muted transition-colors whitespace-nowrap"
                >
                  Clear Filters
                </button>
              )}
            </div>

            {isFetching && (
              <div className="flex items-center gap-2 mt-2 text-xs text-primary font-medium">
                <RefreshCw className="h-3 w-3 animate-spin" />
                Syncing live updates...
              </div>
            )}
          </div>

          {/* Logs Table */}
          <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-left px-4 py-3 text-xs font-black text-muted-foreground uppercase tracking-wider">
                      <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> Date & Time</span>
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-black text-muted-foreground uppercase tracking-wider">
                      <span className="flex items-center gap-1"><User className="h-3.5 w-3.5" /> Staff Member</span>
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-black text-muted-foreground uppercase tracking-wider">Action</th>
                    <th className="text-left px-4 py-3 text-xs font-black text-muted-foreground uppercase tracking-wider">Entity</th>
                    <th className="text-left px-4 py-3 text-xs font-black text-muted-foreground uppercase tracking-wider">Reference</th>
                    <th className="text-left px-4 py-3 text-xs font-black text-muted-foreground uppercase tracking-wider">
                      <span className="flex items-center gap-1"><DollarSign className="h-3.5 w-3.5" /> Amount</span>
                    </th>
                    <th className="text-right px-4 py-3 text-xs font-black text-muted-foreground uppercase tracking-wider">Details</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    Array.from({ length: 8 }).map((_, i) => (
                      <tr key={i} className="border-b border-border/50">
                        {Array.from({ length: 7 }).map((_, j) => (
                          <td key={j} className="px-4 py-3">
                            <div className="h-4 bg-muted animate-pulse rounded-md w-3/4" />
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : logs.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-16 text-center text-muted-foreground">
                        <Activity className="h-10 w-10 mx-auto mb-3 opacity-20" />
                        <p className="font-semibold">No activity logs found</p>
                        <p className="text-xs mt-1">Activity will appear here as your staff uses the system</p>
                      </td>
                    </tr>
                  ) : (
                    logs.map((log, i) => (
                      <React.Fragment key={log.id}>
                      <tr
                        className={`border-b border-border/50 hover:bg-muted/30 transition-colors ${i % 2 === 0 ? "" : "bg-muted/10"} ${expandedRow === log.id ? "bg-muted/30" : ""}`}
                      >
                        {/* Date & Time */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="font-semibold text-foreground">
                            {format(new Date(log.createdAt), "dd MMM yyyy")}
                          </span>
                          <span className="text-muted-foreground ml-2 text-xs">
                            {format(new Date(log.createdAt), "HH:mm:ss")}
                          </span>
                        </td>

                        {/* Staff Member */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black text-xs flex-shrink-0">
                              {log.userName?.charAt(0)?.toUpperCase() ?? "?"}
                            </div>
                            <div>
                              <p className="font-semibold text-foreground leading-none">{log.userName}</p>
                              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md mt-0.5 inline-block ${ROLE_BADGE[log.userRole] ?? "bg-gray-100 text-gray-700"}`}>
                                {log.userRole}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Action */}
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold border ${getActionColor(log.action)}`}>
                            {formatAction(log.action)}
                          </span>
                        </td>

                        {/* Entity */}
                        <td className="px-4 py-3">
                          <span className="font-semibold text-foreground">{log.entity}</span>
                        </td>

                        {/* Reference / Entity ID */}
                        <td className="px-4 py-3">
                          {log.entityId ? (
                            <span className="font-mono text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md">
                              {log.entityId.length > 12 ? `...${log.entityId.slice(-8)}` : log.entityId}
                            </span>
                          ) : (
                            <span className="text-muted-foreground/50">—</span>
                          )}
                        </td>

                        {/* Amount */}
                        <td className="px-4 py-3">
                          {log.amount != null ? (
                            <div>
                              <span className="font-bold text-foreground">
                                Rs. {log.amount.toLocaleString()}
                              </span>
                              {log.amountLabel && (
                                <p className="text-[10px] text-muted-foreground">{log.amountLabel}</p>
                              )}
                            </div>
                          ) : (
                            <span className="text-muted-foreground/50">—</span>
                          )}
                        </td>

                        {/* Details Toggle */}
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => setExpandedRow(expandedRow === log.id ? null : log.id)}
                            className="p-1.5 rounded-lg border border-border text-muted-foreground hover:bg-background hover:text-foreground transition-colors inline-flex items-center gap-1 text-xs font-semibold"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            {expandedRow === log.id ? "Hide" : "View"}
                          </button>
                        </td>
                      </tr>
                      
                      {/* Expanded Details Row */}
                      {expandedRow === log.id && (
                        <tr className="bg-muted/5 border-b border-border/50">
                          <td colSpan={7} className="px-0 py-0">
                            <div className="p-5 bg-card/50 border-l-4 border-primary shadow-inner">
                              <h4 className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-3">Action Details</h4>
                              
                              <div className="bg-background border border-border rounded-xl p-4">
                                {log.details?.body && Object.keys(log.details.body).length > 0 ? (
                                  <ul className="space-y-2">
                                    {generateHumanReadableDetails(log).map((change, idx) => (
                                      <li key={idx} className="flex items-start gap-2 text-sm text-foreground font-medium">
                                        <span className="text-primary mt-0.5">•</span>
                                        <span>{change}</span>
                                      </li>
                                    ))}
                                    {generateHumanReadableDetails(log).length === 0 && (
                                      <li className="text-sm text-muted-foreground italic">Updated internal data fields.</li>
                                    )}
                                  </ul>
                                ) : (
                                  <p className="text-sm text-muted-foreground italic">No specific field changes were logged for this action.</p>
                                )}
                              </div>
                              
                              <div className="flex gap-4 mt-4 text-xs text-muted-foreground/70 font-mono">
                                <span>API Route: {log.details?.method || 'UNKNOWN'} {log.details?.path || 'UNKNOWN'}</span>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                      </React.Fragment>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {meta && meta.pages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-muted/20">
                <p className="text-xs text-muted-foreground font-medium">
                  Showing {((page - 1) * LIMIT) + 1}–{Math.min(page * LIMIT, meta.total)} of {meta.total.toLocaleString()} entries
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="p-1.5 rounded-lg border border-border hover:bg-muted disabled:opacity-40 transition-colors"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <span className="text-sm font-bold text-foreground px-2">
                    Page {page} / {meta.pages}
                  </span>
                  <button
                    onClick={() => setPage((p) => Math.min(meta.pages, p + 1))}
                    disabled={page >= meta.pages}
                    className="p-1.5 rounded-lg border border-border hover:bg-muted disabled:opacity-40 transition-colors"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
