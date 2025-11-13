'use client';
import dynamic from 'next/dynamic';
import type {ApexOptions} from 'apexcharts';
import {IOrder} from '@/types/order.types';

const Chart = dynamic(() => import('react-apexcharts'), {ssr: false});

const DailySalesChart = ({ordersData}: {ordersData: IOrder[]}) => {
	//get daily sales data from ordersData

	// Generate the last 14 dates dynamically
	const today = new Date();
	const last14Days = Array.from({length: 15}, (_, i) => {
		const date = new Date();
		date.setDate(today.getDate() - (13 - i)); // oldest to newest
		return date.toLocaleDateString('en-US', {month: 'short', day: 'numeric'});
	});

	//get daily sales data from ordersData
	const dailySalesData = Array.from({length: 14}, (_, i) => {
		const date = new Date();
		date.setDate(today.getDate() - (13 - i)); // oldest to newest
		const dateString = date.toISOString().split('T')[0]; // format as 'YYYY-MM-DD'
		return ordersData
			? ordersData.filter((order) => order.created_at.startsWith(dateString)).length
			: 0;
	});

	const options: ApexOptions = {
		chart: {
			type: 'line',
			height: 350,
			fontFamily: 'Jost, sans-serif',
			toolbar: {show: false},
			zoom: {enabled: false},
		},
		stroke: {
			curve: 'smooth',
			width: 3,
		},
		colors: ['#e2211c'],
		xaxis: {
			categories: last14Days,
			title: {
				text: 'Date',
				style: {fontSize: '14px', fontWeight: 600},
			},
			labels: {
				rotate: -45,
				style: {
					fontSize: '12px',
				},
			},
		},
		yaxis: {
			title: {
				text: 'Number of Sales',
				style: {fontSize: '14px', fontWeight: 600},
			},
		},
		tooltip: {
			enabled: true,
			x: {show: true},
			y: {
				formatter: (val: number) => `${val} sales`,
			},
		},
		fill: {
			type: 'gradient',
			gradient: {
				shadeIntensity: 1,
				opacityFrom: 0.6,
				opacityTo: 1,
				stops: [0, 90, 100],
			},
		},
		grid: {
			borderColor: '#eee',
			row: {colors: ['#fafafa', 'transparent'], opacity: 1},
		},
		legend: {show: false},
	};

	const series = [
		{
			name: 'Sales',
			data: dailySalesData,
		},
	];

	return (
		<div className="bg-white rounded-2xl shadow-md pt-6">
			<h2 className="text-xl font-semibold mb-3 mt-4">📊 Last 14 Days Sales Overview</h2>
			<p className="text-sm text-gray-500 mb-6">Sales performance from the past 14 days</p>
			<Chart options={options} series={series} type="line" height={350} />
		</div>
	);
};

export default DailySalesChart;
