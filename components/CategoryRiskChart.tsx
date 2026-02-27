'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface CategoryRiskChartProps {
  scores: {
    confidentiality: number;
    liability: number;
    compliance: number;
    financial: number;
    operational: number;
  };
}

export function CategoryRiskChart({ scores }: CategoryRiskChartProps) {
  const data = [
    {
      name: 'Confidentiality',
      'Risk Score': scores.confidentiality || 0,
    },
    {
      name: 'Liability',
      'Risk Score': scores.liability || 0,
    },
    {
      name: 'Compliance',
      'Risk Score': scores.compliance || 0,
    },
    {
      name: 'Financial',
      'Risk Score': scores.financial || 0,
    },
    {
      name: 'Operational',
      'Risk Score': scores.operational || 0,
    },
  ];

  return (
    <Card className="bg-card/50 backdrop-blur">
      <CardHeader>
        <CardTitle className="text-base">Risk by Category</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgb(38, 38, 38)" />
              <XAxis
                dataKey="name"
                stroke="rgb(163, 163, 163)"
                style={{ fontSize: '12px' }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis
                stroke="rgb(163, 163, 163)"
                style={{ fontSize: '12px' }}
                domain={[0, 100]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgb(26, 26, 26)',
                  border: '1px solid rgb(38, 38, 38)',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: 'rgb(245, 245, 245)' }}
                formatter={(value) => [`${Math.round(Number(value) || 0)}/100`, 'Risk Score']}
                cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
              />
              <Bar
                dataKey="Risk Score"
                radius={[8, 8, 0, 0]}
                fill="#3b82f6"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
