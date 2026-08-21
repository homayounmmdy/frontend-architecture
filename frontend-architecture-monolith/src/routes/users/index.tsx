import { Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchAccountUsers, updateAccountUser } from "@/api/accounts";
import { useAuth } from "@/app/providers/use-auth";
import { LoadingState } from "@/components/feedback/loading-state";
import { PageHeader } from "@/components/shared/page-header";
import { SectionCard } from "@/components/shared/section-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { StatCard } from "@/components/shared/stat-card";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ROLE_LABELS } from "@/lib/auth";
import type { RoleKey } from "@/types";

export default function UsersPage() {
  const { session, hasPermission } = useAuth();
  const queryClient = useQueryClient();
  const accountId = session?.activeAccount.id ?? "";
  const canManageUsers = hasPermission("settings.users.manage");
  const canManagePermissions = hasPermission("settings.permissions.manage");

  const { data, isLoading } = useQuery({
    queryKey: ["accounts", accountId, "users"],
    queryFn: () => fetchAccountUsers(accountId),
    enabled: Boolean(accountId) && canManageUsers,
  });

  const mutation = useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: RoleKey }) => updateAccountUser(accountId, userId, { role }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["accounts", accountId, "users"] });
      await queryClient.invalidateQueries({ queryKey: ["auth", "session"] });
    },
  });

  const roleSummaries = useMemo(() => {
    if (!data) return { account_owner: 0, admin: 0, user: 0 };
    return data.reduce(
      (counts, member) => ({ ...counts, [member.role]: counts[member.role] + 1 }),
      { account_owner: 0, admin: 0, user: 0 },
    );
  }, [data]);

  if (isLoading || !data) {
    return <LoadingState label="Loading users..." />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Users"
        description={`Manage account members and role access for ${session?.activeAccount.name}.`}
        actions={
          canManagePermissions ? (
            <Link to="/users/roles-permissions">
              <Button variant="outline">Roles & permissions</Button>
            </Link>
          ) : null
        }
      />

      <div className="grid gap-3 md:grid-cols-3">
        <StatCard title="Account Owners" value={String(roleSummaries.account_owner)} detail="Members with full access" />
        <StatCard title="Admins" value={String(roleSummaries.admin)} detail="Operational managers" />
        <StatCard title="Users" value={String(roleSummaries.user)} detail="Standard workspace access" />
      </div>

      <SectionCard title="Account Members">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Active</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((member) => (
                <TableRow key={member.userId}>
                  <TableCell>
                    <Link to="/users/$userId" params={{ userId: member.userId }} className="font-medium text-primary hover:underline">
                      {member.name}
                    </Link>
                    <div className="text-xs text-muted-foreground">{member.title}</div>
                  </TableCell>
                  <TableCell className="table-cell-muted">{member.email}</TableCell>
                  <TableCell className="w-[180px]">
                    <Select
                      disabled={!canManageUsers || member.role === "account_owner" || mutation.isPending}
                      value={member.role}
                      onChange={(event) =>
                        void mutation.mutateAsync({ userId: member.userId, role: event.target.value as RoleKey })
                      }
                    >
                      <option value="account_owner">{ROLE_LABELS.account_owner}</option>
                      <option value="admin">{ROLE_LABELS.admin}</option>
                      <option value="user">{ROLE_LABELS.user}</option>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={member.status} />
                  </TableCell>
                  <TableCell className="table-cell-muted">{member.lastActiveAt}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
      </SectionCard>
    </div>
  );
}
