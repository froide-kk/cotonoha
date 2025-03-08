import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: string;
  description: string;
}

export default function StatCard({ title, value, description }: StatCardProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
