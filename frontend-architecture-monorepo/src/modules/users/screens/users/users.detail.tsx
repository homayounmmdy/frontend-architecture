import { useEffect, useState } from "react";
import { Link, useParams } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchAccountUser, updateAccountUser } from "../../api/account-access.api";
import { useAuth } from "@/modules/authentication/providers/use-auth";
import { AvatarField } from "../../components/avatar-field";
import { LoadingState } from "@/shared/components/feedback/loading-state";
import { PageHeader } from "@/shared/components/page-header";
import { SectionCard } from "@/shared/components/section-card";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Select } from "@/shared/ui/select";
import { ROLE_LABELS } from "../../lib/permissions";
import type { AccountMember, RoleKey } from "../../domain/users.types";

export default function UserDetailPage() {
  const { session, hasPermission } = useAuth();
  const { userId } = useParams({ from: "/users/$userId" });
  const queryClient = useQueryClient();
  const accountId = session?.activeAccount.id ?? "";
  const canManageUsers = hasPermission("settings.users.manage");

  const { data, isLoading } = useQuery({
    queryKey: ["accounts", accountId, "users", userId],
    queryFn: () => fetchAccountUser(accountId, userId),
    enabled: Boolean(accountId) && canManageUsers,
  });

  const [form, setForm] = useState<AccountMember | null>(null);

  useEffect(() => {
    if (data) setForm(data);
  }, [data]);

  const mutation = useMutation({
    mutationFn: (payload: Partial<AccountMember>) => updateAccountUser(accountId, userId, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["accounts", accountId, "users"] });
      await queryClient.invalidateQueries({ queryKey: ["accounts", accountId, "users", userId] });
      await queryClient.invalidateQueries({ queryKey: ["auth", "session"] });
    },
  });

  if (isLoading || !form) {
    return <LoadingState label="Loading user..." />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={form.name}
        description={`Edit account access and profile details for ${form.email}.`}
        actions={
          <Link to="/users">
            <Button variant="outline">Back to users</Button>
          </Link>
        }
      />

      <SectionCard title="User Details" contentClassName="space-y-6">
        <AvatarField
          avatarUrl={form.avatarUrl}
          initials={form.initials}
          disabled={!canManageUsers}
          onChange={(avatarUrl) => setForm({ ...form, avatarUrl })}
        />

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" disabled={!canManageUsers} value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" disabled={!canManageUsers} value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" disabled={!canManageUsers} value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select
              id="role"
              disabled={!canManageUsers || form.role === "account_owner"}
              value={form.role}
              onChange={(event) => setForm({ ...form, role: event.target.value as RoleKey })}
            >
              <option value="account_owner">{ROLE_LABELS.account_owner}</option>
              <option value="admin">{ROLE_LABELS.admin}</option>
              <option value="user">{ROLE_LABELS.user}</option>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              id="status"
              disabled={!canManageUsers}
              value={form.status}
              onChange={(event) => setForm({ ...form, status: event.target.value as AccountMember["status"] })}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastActiveAt">Last active</Label>
            <Input id="lastActiveAt" disabled value={form.lastActiveAt} />
          </div>
        </div>

        <div className="flex justify-end">
          <Button disabled={!canManageUsers || mutation.isPending} onClick={() => void mutation.mutateAsync(form)}>
            {mutation.isPending ? "Saving..." : "Save user"}
          </Button>
        </div>
      </SectionCard>
    </div>
  );
}
