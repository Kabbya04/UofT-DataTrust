"use client";

import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend } from "recharts";

const data = [
  { name: 'Health', uploads: 40, downloads: 24, views: 24 },
  { name: 'Fitness', uploads: 30, downloads: 13, views: 45 },
  { name: 'AI', uploads: 20, downloads: 98, views: 23 },
  { name: 'Finance', uploads: 27, downloads: 39, views: 20 },
  { name: 'Games', uploads: 18, downloads: 48, views: 60 },
  { name: 'Tech', uploads: 23, downloads: 38, views: 25 },
  { name: 'Movies', uploads: 34, downloads: 43, views: 12 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-2 bg-background/80 border border-border rounded-md shadow-lg">
          <p className="font-bold text-foreground">{label}</p>
          <p style={{ color: payload[0].color }}>{`Uploads: ${payload[0].value}`}</p>
          <p style={{ color: payload[1].color }}>{`Downloads: ${payload[1].value}`}</p>
          <p style={{ color: payload[2].color }}>{`Views: ${payload[2].value}`}</p>
        </div>
      );
    }
    return null;
};

export function HeatmapPlaceholder() {
  return (
    <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} layout="vertical" barCategoryGap="20%">
            <XAxis type="number" hide />
            <YAxis 
                dataKey="name" 
                type="category" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--muted))' }} />
            <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }}/>
            <Bar dataKey="uploads" stackId="a" fill="#8884d8" name="Uploads" />
            <Bar dataKey="downloads" stackId="a" fill="#82ca9d" name="Downloads" />
            <Bar dataKey="views" stackId="a" fill="#ffc658" name="Views" />
        </BarChart>
    </ResponsiveContainer>
  );
}