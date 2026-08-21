import { Switch } from "@commerceos/ui/switch";

interface ToggleSettingRowProps {
  title: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export function ToggleSettingRow({
  title,
  description,
  checked,
  disabled,
  onCheckedChange,
}: ToggleSettingRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-md border p-3">
      <div>
        <div className="font-medium">{title}</div>
        <div className="text-sm text-muted-foreground">{description}</div>
      </div>
      <Switch disabled={disabled} checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}
