import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, DollarSign, ShoppingCart, Users } from "lucide-react";
import { Area, Bar, BarChart, CartesianGrid, Cell, ComposedChart, LabelList, Line, XAxis, YAxis } from "recharts";
import { fetchDashboardSummary } from "../../api/dashboard.api";
import { LoadingState } from "@commerceos/shared/components/feedback/loading-state";
import { PageHeader } from "@commerceos/shared/components/page-header";
import { StatCard } from "@commerceos/shared/components/stat-card";
import { StatusBadge } from "@commerceos/shared/components/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@commerceos/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@commerceos/ui/chart";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@commerceos/ui/table";
import { formatCurrency, formatDate, formatNumber } from "@commerceos/shared/lib/utils";

const SEGMENT_COLORS = ["hsl(217 91% 60%)", "hsl(173 58% 39%)", "hsl(38 92% 50%)", "hsl(262 83% 58%)", "hsl(8 84% 60%)"];

function formatStatusLabel(value: string) {
  return value
    .split("_")
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
}

export default function DashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard", "summary"],
    queryFn: fetchDashboardSummary,
  });

  if (isLoading || !data) {
    return <LoadingState label="Loading dashboard..." />;
  }

  const recentOrderRevenueTrend = data.recentOrderRevenueTrend.map((item) => ({
    ...item,
    label: new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(new Date(`${item.label}T00:00:00`)),
  }));

  const orderDistribution = data.orderDistribution.map((item, index) => ({
    ...item,
    label: formatStatusLabel(item.label),
    fill: SEGMENT_COLORS[index % SEGMENT_COLORS.length],
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Overview of revenue, order flow, customer activity, and inventory risk."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Revenue" value={formatCurrency(data.revenue)} detail="Paid orders to date" icon={<DollarSign className="h-4 w-4" />} />
        <StatCard title="Orders" value={formatNumber(data.orders)} detail="Across all statuses" icon={<ShoppingCart className="h-4 w-4" />} />
        <StatCard title="Customers" value={formatNumber(data.customers)} detail="Tracked customer records" icon={<Users className="h-4 w-4" />} />
        <StatCard title="Low Stock" value={formatNumber(data.lowStockItems)} detail="Inventory rows below threshold" icon={<AlertTriangle className="h-4 w-4" />} />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Orders And Revenue · Last 14 Days</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                revenue: { label: "Revenue", color: "hsl(217 91% 60%)" },
                orders: { label: "Orders", color: "hsl(173 58% 39%)" },
              }}
              className="h-[220px]"
            >
              <ComposedChart data={recentOrderRevenueTrend}>
                <defs>
                  <linearGradient id="dashboard-revenue-fill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-revenue)" stopOpacity={0.24} />
                    <stop offset="95%" stopColor="var(--color-revenue)" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="label" tickLine={false} axisLine={false} minTickGap={24} />
                <YAxis yAxisId="left" tickLine={false} axisLine={false} tickFormatter={(value) => `$${Math.round(Number(value))}`} />
                <YAxis yAxisId="right" orientation="right" tickLine={false} axisLine={false} allowDecimals={false} />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      formatter={(value, name) => {
                        if (name === "revenue") return formatCurrency(Number(value));
                        if (name === "orders") return `${value} orders`;
                        return String(value);
                      }}
                    />
                  }
                />
                <Bar yAxisId="right" dataKey="orders" fill="var(--color-orders)" radius={[8, 8, 0, 0]} barSize={16} />
                <Area yAxisId="left" type="monotone" dataKey="revenue" stroke="var(--color-revenue)" strokeWidth={3} fill="url(#dashboard-revenue-fill)" />
                <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="var(--color-revenue)" strokeWidth={3} dot={false} activeDot={{ r: 4 }} />
              </ComposedChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Order Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{ value: { label: "Orders", color: "hsl(217 91% 60%)" } }} className="h-[220px]">
              <BarChart data={orderDistribution} layout="vertical" margin={{ left: 8, right: 32 }}>
                <CartesianGrid horizontal={false} />
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="label" hide />
                <ChartTooltip content={<ChartTooltipContent hideLabel formatter={(value) => `${value} orders`} />} />
                <Bar dataKey="value" radius={10}>
                  {orderDistribution.map((entry) => (
                    <Cell key={entry.label} fill={entry.fill} />
                  ))}
                  <LabelList
                    dataKey="label"
                    position="insideLeft"
                    offset={12}
                    className="fill-white text-[12px] font-medium"
                  />
                  <LabelList
                    dataKey="value"
                    position="right"
                    offset={8}
                    className="fill-muted-foreground text-[12px] font-medium"
                    formatter={(value) => `${value ?? ""}`}
                  />
                </Bar>
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[2fr,1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.recentOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      <Link to="/orders/$orderId" params={{ orderId: order.id }} className="font-medium text-primary hover:underline">
                        {order.orderNumber}
                      </Link>
                    </TableCell>
                    <TableCell>{order.customerName}</TableCell>
                    <TableCell className="table-cell-muted">{formatDate(order.date)}</TableCell>
                    <TableCell>
                      <StatusBadge status={order.status} />
                    </TableCell>
                    <TableCell className="text-right">{formatCurrency(order.total)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Operational Alerts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="text-sm font-medium">Low Stock</div>
              {data.notifications.lowStock.map((item) => (
                <div key={item.id} className="rounded-md border p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="font-medium">{item.productName}</div>
                      <div className="text-sm text-muted-foreground">
                        {item.location} · reorder at {item.reorderThreshold}
                      </div>
                    </div>
                    <StatusBadge status={item.status} />
                  </div>
                </div>
              ))}
            </div>
            <div className="space-y-3">
              <div className="text-sm font-medium">Expiring Discounts</div>
              {data.notifications.expiringDiscounts.map((discount) => (
                <div key={discount.id} className="rounded-md border p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="font-medium">{discount.code}</div>
                      <div className="text-sm text-muted-foreground">
                        Ends {formatDate(discount.endDate)}
                      </div>
                    </div>
                    <StatusBadge status={discount.active ? "active" : "inactive"} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top Products</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {data.topProducts.map((product) => (
            <div key={product.productId} className="rounded-md border p-4">
              <div className="font-medium">{product.name}</div>
              <div className="text-sm text-muted-foreground">{product.unitsSold} units sold</div>
              <div className="mt-3 text-sm font-medium">{formatCurrency(product.revenue)}</div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
