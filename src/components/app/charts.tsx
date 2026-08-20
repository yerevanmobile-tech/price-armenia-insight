import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatAmd } from "@/lib/format";

const axis = {
  stroke: "var(--muted-foreground)",
  fontSize: 10,
  tickLine: false,
  axisLine: false,
};

function tooltipStyle() {
  return {
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: 14,
    fontSize: 12,
    color: "var(--foreground)",
    padding: "8px 10px",
  } as const;
}

export function PriceLineChart({
  data,
  height = 200,
}: {
  data: { label: string; price: number }[];
  height?: number;
}) {
  return (
    <div style={{ height }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
          <CartesianGrid vertical={false} stroke="var(--border)" />
          <XAxis dataKey="label" {...axis} minTickGap={24} />
          <YAxis
            {...axis}
            width={54}
            tickFormatter={(v: number) => `${Math.round(v / 1000)}k`}
            domain={["dataMin - 20000", "dataMax + 20000"]}
          />
          <Tooltip
            contentStyle={tooltipStyle()}
            formatter={(v: number) => [formatAmd(v), ""]}
            labelStyle={{ color: "var(--muted-foreground)" }}
          />
          <Line
            type="monotone"
            dataKey="price"
            stroke="var(--primary)"
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function TrendChart({
  data,
  height = 180,
}: {
  data: { label: string; drops: number; raises: number }[];
  height?: number;
}) {
  return (
    <div style={{ height }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 4, bottom: 0, left: -18 }} barGap={2}>
          <CartesianGrid vertical={false} stroke="var(--border)" />
          <XAxis dataKey="label" {...axis} />
          <YAxis {...axis} width={34} />
          <Tooltip contentStyle={tooltipStyle()} cursor={{ fill: "var(--surface-2)" }} />
          <Bar dataKey="drops" fill="var(--success)" radius={[6, 6, 0, 0]} />
          <Bar dataKey="raises" fill="var(--danger)" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function CountBarChart({
  data,
  height = 200,
}: {
  data: { label: string; value: number }[];
  height?: number;
}) {
  return (
    <div style={{ height }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 4, right: 12, bottom: 0, left: 4 }}>
          <CartesianGrid horizontal={false} stroke="var(--border)" />
          <XAxis type="number" {...axis} />
          <YAxis type="category" dataKey="label" {...axis} width={92} />
          <Tooltip contentStyle={tooltipStyle()} cursor={{ fill: "var(--surface-2)" }} />
          <Bar dataKey="value" fill="var(--primary)" radius={[0, 6, 6, 0]} barSize={14} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}