import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { formatINRCompact } from "@/lib/format";

const COLORS = ["#2563EB", "#D4AF37"];

export function BreakdownDonut({
  a,
  b,
  labels,
  testid,
}: {
  a: number;
  b: number;
  labels: [string, string];
  testid: string;
}) {
  const data = [
    { name: labels[0], value: Math.max(0, Math.round(a)) },
    { name: labels[1], value: Math.max(0, Math.round(b)) },
  ];
  return (
    <div className="h-44 w-full" data-testid={testid}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="value" innerRadius={48} outerRadius={72} strokeWidth={0} isAnimationActive>
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number, name: string) => [formatINRCompact(value), name]}
            contentStyle={{ background: "#0F172A", border: "1px solid #1E293B", borderRadius: 8, fontSize: 12 }}
            itemStyle={{ color: "#F8FAFC" }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ResultRow({ label, value, highlight = false, testid }: { label: string; value: string; highlight?: boolean; testid: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-border/60 py-2.5 last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span data-testid={testid} className={`font-mono font-bold ${highlight ? "text-xl text-gold sm:text-2xl" : "text-base text-foreground"}`}>
        {value}
      </span>
    </div>
  );
}
