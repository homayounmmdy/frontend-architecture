import { Check, Monitor, Moon, Sun } from "lucide-react";
import { type Theme } from "@commerceos/shared/theme/theme-context";
import { useTheme } from "@commerceos/shared/theme/use-theme";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@commerceos/ui/dropdown-menu";
import { Button } from "@commerceos/ui/button";
import { cn } from "@commerceos/ui/lib/utils";

const themeOptions: Array<{ value: Theme; label: string; icon: typeof Sun }> = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
];

export function ThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const TriggerIcon = resolvedTheme === "dark" ? Moon : Sun;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" aria-label="Toggle theme">
          <TriggerIcon className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {themeOptions.map((option) => {
          const Icon = option.icon;
          const isActive = theme === option.value;

          return (
            <DropdownMenuItem key={option.value} onClick={() => setTheme(option.value)} className="justify-between">
              <span className="flex items-center gap-2">
                <Icon className="h-4 w-4 text-muted-foreground" />
                <span>{option.label}</span>
              </span>
              <Check className={cn("h-4 w-4", isActive ? "opacity-100" : "opacity-0")} />
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
