import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Card } from '../design-system/components/Card';

const pieData = [
  { name: 'Completed', value: 65, color: 'hsl(var(--chart-1))' },
  { name: 'In Progress', value: 25, color: 'hsl(var(--chart-2))' },
  { name: 'Pending', value: 10, color: 'hsl(var(--chart-3))' },
];

const barData = [
  { name: 'Jan', completed: 12, pending: 3 },
  { name: 'Feb', completed: 19, pending: 5 },
  { name: 'Mar', completed: 15, pending: 2 },
  { name: 'Apr', completed: 22, pending: 7 },
  { name: 'May', completed: 18, pending: 4 },
  { name: 'Jun', completed: 25, pending: 6 },
];

export function SampleChart() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="p-6">
        <h3 className="mb-4 text-lg font-semibold text-text">Assessment Status</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--surface))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </Card>

      <Card className="p-6">
        <h3 className="mb-4 text-lg font-semibold text-text">Monthly Progress</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={barData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="name"
              stroke="hsl(var(--text-secondary))"
              fontSize={12}
            />
            <YAxis
              stroke="hsl(var(--text-secondary))"
              fontSize={12}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--surface))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
            />
            <Legend />
            <Bar
              dataKey="completed"
              fill="hsl(var(--chart-1))"
              name="Completed"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="pending"
              fill="hsl(var(--chart-2))"
              name="Pending"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}