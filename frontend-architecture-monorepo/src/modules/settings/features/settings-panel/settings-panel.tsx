import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchAccount,
  fetchAccountSettings,
  updateAccount,
  updateAccountSettings,
} from "../../api/settings.api";
import { useAuth } from "@/modules/authentication/providers/use-auth";
import { LoadingState } from "@/shared/components/feedback/loading-state";
import { PageHeader } from "@/shared/components/page-header";
import { SectionCard } from "@/shared/components/section-card";
import { ToggleSettingRow } from "@/shared/components/toggle-setting-row";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import type { Account, SettingsData } from "../../domain/settings.types";

export default function SettingsPage() {
  const { session, hasPermission } = useAuth();
  const queryClient = useQueryClient();
  const accountId = session?.activeAccount.id ?? "";

  const accountQuery = useQuery({
    queryKey: ["accounts", accountId],
    queryFn: () => fetchAccount(accountId),
    enabled: Boolean(accountId),
  });
  const settingsQuery = useQuery({
    queryKey: ["accounts", accountId, "settings"],
    queryFn: () => fetchAccountSettings(accountId),
    enabled: Boolean(accountId),
  });
  const [accountForm, setAccountForm] = useState<Account | null>(null);
  const [settingsForm, setSettingsForm] = useState<SettingsData | null>(null);

  useEffect(() => {
    if (accountQuery.data) setAccountForm(accountQuery.data);
  }, [accountQuery.data]);

  useEffect(() => {
    if (settingsQuery.data) setSettingsForm(settingsQuery.data);
  }, [settingsQuery.data]);

  const accountMutation = useMutation({
    mutationFn: (payload: Partial<Account>) => updateAccount(accountId, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["accounts", accountId] });
      await queryClient.invalidateQueries({ queryKey: ["auth", "session"] });
    },
  });
  const settingsMutation = useMutation({
    mutationFn: (payload: Partial<SettingsData>) => updateAccountSettings(accountId, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["accounts", accountId, "settings"] });
    },
  });
  const canManageProfile = hasPermission("settings.account_profile.manage");
  const canManageShipping = hasPermission("settings.shipping.manage");
  const canManageTaxes = hasPermission("settings.tax.manage");
  const canManageNotifications = hasPermission("settings.notifications.manage");

  if (!accountForm || !settingsForm || accountQuery.isLoading || settingsQuery.isLoading) {
    return <LoadingState label="Loading settings..." />;
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description={`Operational settings for ${accountForm.name}.`} />

      <div className="grid gap-6 xl:grid-cols-2">
        <SectionCard id="store-profile" title="Account Profile" contentClassName="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="storeName">Store name</Label>
              <Input
                id="storeName"
                disabled={!canManageProfile}
                value={accountForm.profile.storeName}
                onChange={(event) =>
                  setAccountForm({ ...accountForm, profile: { ...accountForm.profile, storeName: event.target.value } })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="supportEmail">Support email</Label>
              <Input
                id="supportEmail"
                disabled={!canManageProfile}
                value={accountForm.profile.supportEmail}
                onChange={(event) =>
                  setAccountForm({ ...accountForm, profile: { ...accountForm.profile, supportEmail: event.target.value } })
                }
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Input
                  id="currency"
                  disabled={!canManageProfile}
                  value={accountForm.profile.currency}
                  onChange={(event) =>
                    setAccountForm({ ...accountForm, profile: { ...accountForm.profile, currency: event.target.value } })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Input
                  id="timezone"
                  disabled={!canManageProfile}
                  value={accountForm.profile.timezone}
                  onChange={(event) =>
                    setAccountForm({ ...accountForm, profile: { ...accountForm.profile, timezone: event.target.value } })
                  }
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button
                disabled={!canManageProfile || accountMutation.isPending}
                onClick={() => void accountMutation.mutateAsync({ profile: accountForm.profile })}
              >
                {accountMutation.isPending ? "Saving..." : "Save profile"}
              </Button>
            </div>
        </SectionCard>

        <SectionCard id="shipping" title="Shipping" contentClassName="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="carrier">Default carrier</Label>
              <Input
                id="carrier"
                disabled={!canManageShipping}
                value={settingsForm.shipping.defaultCarrier}
                onChange={(event) =>
                  setSettingsForm({ ...settingsForm, shipping: { ...settingsForm.shipping, defaultCarrier: event.target.value } })
                }
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="standardRate">Standard rate</Label>
                <Input
                  id="standardRate"
                  type="number"
                  disabled={!canManageShipping}
                  value={settingsForm.shipping.standardRate}
                  onChange={(event) =>
                    setSettingsForm({ ...settingsForm, shipping: { ...settingsForm.shipping, standardRate: Number(event.target.value) } })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="expressRate">Express rate</Label>
                <Input
                  id="expressRate"
                  type="number"
                  disabled={!canManageShipping}
                  value={settingsForm.shipping.expressRate}
                  onChange={(event) =>
                    setSettingsForm({ ...settingsForm, shipping: { ...settingsForm.shipping, expressRate: Number(event.target.value) } })
                  }
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button
                disabled={!canManageShipping || settingsMutation.isPending}
                onClick={() => void settingsMutation.mutateAsync({ shipping: settingsForm.shipping })}
              >
                {settingsMutation.isPending ? "Saving..." : "Save shipping"}
              </Button>
            </div>
        </SectionCard>

        <SectionCard id="taxes" title="Taxes" contentClassName="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nexus">Nexus region</Label>
              <Input
                id="nexus"
                disabled={!canManageTaxes}
                value={settingsForm.taxes.nexusRegion}
                onChange={(event) =>
                  setSettingsForm({ ...settingsForm, taxes: { ...settingsForm.taxes, nexusRegion: event.target.value } })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="taxRate">Default rate</Label>
              <Input
                id="taxRate"
                type="number"
                disabled={!canManageTaxes}
                value={settingsForm.taxes.defaultRate}
                onChange={(event) =>
                  setSettingsForm({ ...settingsForm, taxes: { ...settingsForm.taxes, defaultRate: Number(event.target.value) } })
                }
              />
            </div>
            <ToggleSettingRow
              title="Prices include tax"
              description="Toggle inclusive pricing for storefront display."
              disabled={!canManageTaxes}
              checked={settingsForm.taxes.pricesIncludeTax}
              onCheckedChange={(checked) =>
                setSettingsForm({ ...settingsForm, taxes: { ...settingsForm.taxes, pricesIncludeTax: checked } })
              }
            />
            <div className="flex justify-end">
              <Button
                disabled={!canManageTaxes || settingsMutation.isPending}
                onClick={() => void settingsMutation.mutateAsync({ taxes: settingsForm.taxes })}
              >
                {settingsMutation.isPending ? "Saving..." : "Save tax settings"}
              </Button>
            </div>
        </SectionCard>

        <SectionCard id="notifications" title="Notifications" contentClassName="space-y-4">
            <ToggleSettingRow
              title="Low stock"
              description="Alert merchants when inventory dips below thresholds."
              disabled={!canManageNotifications}
              checked={settingsForm.notifications.lowStock}
              onCheckedChange={(checked) =>
                setSettingsForm({ ...settingsForm, notifications: { ...settingsForm.notifications, lowStock: checked } })
              }
            />
            <ToggleSettingRow
              title="Order alerts"
              description="Send updates for new and delayed orders."
              disabled={!canManageNotifications}
              checked={settingsForm.notifications.orderAlerts}
              onCheckedChange={(checked) =>
                setSettingsForm({ ...settingsForm, notifications: { ...settingsForm.notifications, orderAlerts: checked } })
              }
            />
            <ToggleSettingRow
              title="Weekly digest"
              description="Send one summary report each week."
              disabled={!canManageNotifications}
              checked={settingsForm.notifications.weeklyDigest}
              onCheckedChange={(checked) =>
                setSettingsForm({ ...settingsForm, notifications: { ...settingsForm.notifications, weeklyDigest: checked } })
              }
            />
            <div className="flex justify-end">
              <Button
                disabled={!canManageNotifications || settingsMutation.isPending}
                onClick={() => void settingsMutation.mutateAsync({ notifications: settingsForm.notifications })}
              >
                {settingsMutation.isPending ? "Saving..." : "Save notifications"}
              </Button>
            </div>
        </SectionCard>

      </div>
    </div>
  );
}
