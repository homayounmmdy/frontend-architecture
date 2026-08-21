import { format, parseISO } from "date-fns";

export function formatAnalyticsMonth(value: string) {
  return format(parseISO(value), "MMM");
}

export function formatAnalyticsWeek(value: string) {
  return format(parseISO(value), "MMM d");
}
