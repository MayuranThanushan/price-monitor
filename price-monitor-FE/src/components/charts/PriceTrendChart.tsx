import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export interface PricePoint { date: string; price: number }

interface PriceTrendChartProps {
	data: PricePoint[];
	height?: number;
}

const PriceTrendChart: React.FC<PriceTrendChartProps> = ({ data, height = 220 }) => {
	return (
		<div style={{ width: '100%', height }}>
			<ResponsiveContainer width='100%' height='100%'>
				<LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
					<CartesianGrid strokeDasharray='3 3' stroke='#e5e7eb' />
					<XAxis dataKey='date' tick={{ fontSize: 12 }} stroke='#6b7280' />
					<YAxis width={45} tick={{ fontSize: 12 }} stroke='#6b7280' />
					<Tooltip cursor={{ stroke: '#16a34a', strokeWidth: 1 }} contentStyle={{ fontSize: 12 }} />
					<Line type='monotone' dataKey='price' stroke='#16a34a' strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
				</LineChart>
			</ResponsiveContainer>
		</div>
	);
};

export default PriceTrendChart;
