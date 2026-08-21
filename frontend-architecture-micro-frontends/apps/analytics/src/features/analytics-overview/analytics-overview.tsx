import { useQuery } from "@tanstack/react-query";
import { fetchAnalyticsOverview } from "../../api/analytics.api";
import { LoadingState } from "@commerceos/shared/components/feedback/loading-state";
import { PageHeader } from "@commerceos/shared/components/page-header";
import { StatCard } from "@commerceos/shared/components/stat-card";
import { formatCurrency, formatNumber } from "@commerceos/shared/lib/utils";
import { formatAnalyticsMonth, formatAnalyticsWeek } from "../../utils/analytics-date";
import { RevenueOrdersMomentumChart } from "./components/revenue-orders-momentum-chart";
import { ConversionEfficiencyChart } from "./components/conversion-efficiency-chart";
import { MerchandisingRevenueMixChart } from "./components/merchandising-revenue-mix-chart";
import { CustomerSegmentMixChart } from "./components/customer-segment-mix-chart";
import { OrderStatusDistributionChart } from "./components/order-status-distribution-chart";

export default function AnalyticsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["analytics", "overview"],
    queryFn: fetchAnalyticsOverview,
  });

  if (isLoading || !data) {
    return <LoadingState label="Loading analytics..." />;
  }

  const performanceTrend = data.performanceTrend.map((item) => ({
    ...item,
    label: formatAnalyticsMonth(item.label),
  }));

  const conversionTrend = data.conversionTrend.map((item) => ({
    ...item,
    label: formatAnalyticsWeek(item.label),
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics"
        description="Five polished reports covering revenue momentum, funnel efficiency, merchandising mix, customer makeup, and order flow."
      />

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard title="Revenue" value={formatCurrency(data.revenue)} detail="Paid order revenue" />
        <StatCard title="AOV" value={formatCurrency(data.aov)} detail="Average order value" />
        <StatCard title="Orders" value={formatNumber(data.orders)} detail="Total orders tracked" />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <RevenueOrdersMomentumChart data={performanceTrend} />
        <ConversionEfficiencyChart data={conversionTrend} />
        <MerchandisingRevenueMixChart data={data.categoryRevenue} />
        <CustomerSegmentMixChart data={data.customerSegments} />
        <OrderStatusDistributionChart data={data.orderStatusMix} />
      </div>
    </div>
  );
}
