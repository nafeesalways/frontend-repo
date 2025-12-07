// src/app/(dashboard)/analytics/page.tsx
'use client';

import { useGetProductsQuery } from '@/redux/api/baseApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function AnalyticsPage() {
  const { data: products = [] } = useGetProductsQuery();

  // calculate product based on category
  const categoryData = products.reduce((acc: any[], product) => {
    const existing = acc.find(item => item.name === product.category);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: product.category, value: 1 });
    }
    return acc;
  }, []);

  // ২. stock level based on product
  const stockData = products.slice(0, 10).map(p => ({
    name: p.name,
    stock: p.stock
  }));

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Analytics Dashboard</h2>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        
        {/* Chart 1: Products by Category (Pie Chart) */}
        <Card>
          <CardHeader>
            <CardTitle>Products by Category</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Chart 2: Stock Levels (Bar Chart) */}
        <Card>
          <CardHeader>
            <CardTitle>Stock Levels (Top 10)</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stockData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="stock" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
