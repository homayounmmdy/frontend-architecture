import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchAccountPermissions, updateAccountPermissions } from "../../api/account-access.api";
import { useAuth } from "@commerceos/authentication/providers/use-auth";
import { LoadingState } from "@commerceos/shared/components/feedback/loading-state";
import { PageHeader } from "@commerceos/shared/components/page-header";
import { Button } from "@commerceos/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@commerceos/ui/card";
import { Switch } from "@commerceos/ui/switch";
import { PERMISSION_GROUPS, ROLE_LABELS } from "../../lib/permissions";
import type { AccountPermissionPolicy } from "../../domain/users.types";

export default function RolesPermissionsPage() {
  const { session, hasPermission } = useAuth();
  const queryClient = useQueryClient();
  const accountId = session?.activeAccount.id ?? "";
  const canManagePermissions = hasPermission("settings.permissions.manage");

  const { data, isLoading } = useQuery({
    queryKey: ["accounts", accountId, "permissions"],
    queryFn: () => fetchAccountPermissions(accountId),
    enabled: Boolean(accountId) && canManagePermissions,
  });

  const [permissionForm, setPermissionForm] = useState<AccountPermissionPolicy | null>(null);

  useEffect(() => {
    if (data) setPermissionForm(data);
  }, [data]);

  const mutation = useMutation({
    mutationFn: (payload: Partial<AccountPermissionPolicy>) => updateAccountPermissions(accountId, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["accounts", accountId, "permissions"] });
      await queryClient.invalidateQueries({ queryKey: ["auth", "session"] });
    },
  });

  if (isLoading || !permissionForm) {
    return <LoadingState label="Loading permissions..." />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Roles & Permissions"
        description={`Customize Admin and User role access for ${session?.activeAccount.name}.`}
        actions={
          <Link to="/users">
            <Button variant="outline">Back to users</Button>
          </Link>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>Account Owner</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Account Owners always keep full access and cannot be customized.
        </CardContent>
      </Card>

      {(["admin", "user"] as const).map((role) => (
        <Card key={role}>
          <CardHeader>
            <CardTitle>{ROLE_LABELS[role]}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {PERMISSION_GROUPS.map((group) => (
              <div key={group.title} className="space-y-3">
                <div className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">{group.title}</div>
                <div className="grid gap-3 md:grid-cols-2">
                  {group.items.map((permission) => {
                    const checked = permissionForm[role].includes(permission.key);
                    return (
                      <label key={permission.key} className="flex items-start justify-between gap-4 rounded-md border p-3">
                        <div>
                          <div className="font-medium">{permission.label}</div>
                          <div className="text-sm text-muted-foreground">{permission.description}</div>
                        </div>
                        <Switch
                          disabled={!canManagePermissions}
                          checked={checked}
                          onCheckedChange={(nextChecked) =>
                            setPermissionForm((current) => {
                              if (!current) return current;
                              const nextPermissions = nextChecked
                                ? [...current[role], permission.key]
                                : current[role].filter((entry) => entry !== permission.key);
                              return {
                                ...current,
                                [role]: nextPermissions,
                              };
                            })
                          }
                        />
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}

            <div className="flex justify-end">
              <Button
                disabled={!canManagePermissions || mutation.isPending}
                onClick={() => void mutation.mutateAsync({ [role]: permissionForm[role] })}
              >
                {mutation.isPending ? "Saving..." : `Save ${ROLE_LABELS[role]}`}
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
