import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchProfile, updateProfile } from "../../api/profile.api";
import { AvatarField } from "../../components/avatar-field";
import { LoadingState } from "@commerceos/shared/components/feedback/loading-state";
import { PageHeader } from "@commerceos/shared/components/page-header";
import { SectionCard } from "@commerceos/shared/components/section-card";
import { Button } from "@commerceos/ui/button";
import { Input } from "@commerceos/ui/input";
import { Label } from "@commerceos/ui/label";
import type { AuthUser } from "../../domain/users.types";

export default function ProfilePage() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["me"],
    queryFn: fetchProfile,
  });
  const [form, setForm] = useState<AuthUser | null>(null);

  useEffect(() => {
    if (data) setForm(data);
  }, [data]);

  const mutation = useMutation({
    mutationFn: (payload: Partial<AuthUser>) => updateProfile(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["me"] });
      await queryClient.invalidateQueries({ queryKey: ["auth", "session"] });
      await queryClient.invalidateQueries({ queryKey: ["accounts"] });
    },
  });

  if (isLoading || !form) {
    return <LoadingState label="Loading profile..." />;
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Profile" description="Customize your own account details and avatar." />

      <SectionCard title="Your Profile" contentClassName="space-y-6">
        <AvatarField
          avatarUrl={form.avatarUrl}
          initials={form.initials}
          onChange={(avatarUrl) => setForm({ ...form, avatarUrl })}
        />

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
          </div>
        </div>

        <div className="flex justify-end">
          <Button disabled={mutation.isPending} onClick={() => void mutation.mutateAsync(form)}>
            {mutation.isPending ? "Saving..." : "Save profile"}
          </Button>
        </div>
      </SectionCard>
    </div>
  );
}
