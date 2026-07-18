import React, { useEffect, useRef } from 'react';
import { Chart } from '@/services/chartService';

const StatCard: React.FC<{ title: string; value: string; trend?: string; icon: React.ReactNode; color: string }> = ({ title, value, trend, icon, color }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 transition-all hover:shadow-lg hover:-translate-y-1">
    <div className="flex justify-between items-start">
      <div className="flex flex-col">
        <h3 className="text-slate-500 text-sm font-medium uppercase tracking-wider">{title}</h3>
        <p className="text-3xl font-bold text-slate-800 mt-2">{value}</p>
      </div>
      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${color}`}>
        {icon}
      </div>
    </div>
    {trend && <p className={`text-sm mt-3 font-medium ${trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>{trend}</p>}
  </div>
);

const newsItems = [
  {
    id: 1,
    category: 'Export Policy',
    color: 'blue',
    title: 'Government Updates Timber Legality Verification System (SVLK)',
    snippet: 'The Ministry of Trade has revised the Timber Legality Verification System (SVLK) regulations to boost export competitiveness...',
    date: '1 day ago',
  },
  {
    id: 2,
    category: 'Industry Event',
    color: 'amber',
    title: 'IFEX 2024: International Furniture Expo Gears Up',
    snippet: 'The Indonesia International Furniture Expo (IFEX) is set to return, providing a key platform for industry players...',
    date: '3 days ago',
  },
  {
    id: 3,
    category: 'Import Regulation',
    color: 'red',
    title: 'Adjustments to Import Duties on Furniture Components',
    snippet: 'The government has announced adjustments to import duties for several components to encourage the use of local materials.',
    date: '1 week ago',
  },
];

const NewsItem: React.FC<{ item: typeof newsItems[0] }> = ({ item }) => {
  const categoryColorClasses = {
    blue: 'bg-sky-100 text-sky-800',
    amber: 'bg-amber-100 text-amber-800',
    red: 'bg-red-100 text-red-800',
  };

  return (
    <div className="border-b border-slate-100 py-4 last:border-b-0">
      <div className="flex justify-between items-center mb-2">
        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${categoryColorClasses[item.color as keyof typeof categoryColorClasses]}`}>{item.category}</span>
        <span className="text-xs text-slate-400">{item.date}</span>
      </div>
      <h4 className="font-semibold text-slate-800 mb-1 hover:text-amber-600 transition-colors cursor-pointer">{item.title}</h4>
      <p className="text-sm text-slate-500 line-clamp-2">{item.snippet}</p>
    </div>
  );
};


const DashboardPage: React.FC = () => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (chartRef.current) {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }

      const ctx = chartRef.current.getContext('2d');
      if (!ctx) return;

      const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const dataPoints = [12, 19, 15, 25, 22, 30, 28, 35, 32, 40, 38, 45];

      const gradient = ctx.createLinearGradient(0, 0, 0, 400);
      gradient.addColorStop(0, 'rgba(56, 189, 248, 0.4)'); // sky-400
      gradient.addColorStop(1, 'rgba(56, 189, 248, 0)');

      chartInstanceRef.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: 'Design Efficiency',
            data: dataPoints,
            borderColor: '#0284c7', // sky-600
            backgroundColor: gradient,
            borderWidth: 3,
            tension: 0.4,
            fill: true,
            pointBackgroundColor: '#fff',
            pointBorderColor: '#0284c7',
            pointRadius: 5,
            pointHoverRadius: 7,
            pointHoverBorderWidth: 2
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: '#1e293b', // slate-800
                padding: 12,
                cornerRadius: 8,
                titleFont: { weight: 'bold' },
                bodyFont: { size: 14 },
                boxPadding: 4,
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: { color: '#f1f5f9' }, // slate-100
              border: { display: false }
            },
            x: {
              grid: { display: false },
              border: { display: false }
            }
          }
        }
      });
    }

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, []);

  return (
    <div className="space-y-10">
      <div>
          <h2 className="text-3xl font-bold text-slate-900">Dashboard</h2>
          <p className="text-slate-500 mt-1">An overview of your production, costs, and industry news.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Designs" value="124" trend="+12%" icon={<svg className="w-5 h-5 text-sky-800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>} color="bg-sky-100" />
        <StatCard title="Saved Projects" value="45" trend="+5%" icon={<svg className="w-5 h-5 text-amber-800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>} color="bg-amber-100" />
        <StatCard title="Avg. Prod. Cost" value="$285" trend="-2%" icon={<svg className="w-5 h-5 text-green-800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} color="bg-green-100" />
        <StatCard title="Top Style" value="Japandi" icon={<svg className="w-5 h-5 text-indigo-800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.539 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.539-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>} color="bg-indigo-100" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-800">Production Volume Trend</h3>
              <select className="text-sm border-slate-300 rounded-md text-slate-500 focus:ring-amber-500 focus:border-amber-500">
                  <option>Last 12 Months</option>
                  <option>Last 6 Months</option>
              </select>
          </div>
          <div className="relative h-80 w-full">
            <canvas ref={chartRef}></canvas>
          </div>
        </div>

        <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
            <h3 className="text-lg font-bold text-slate-800 mb-2 flex-shrink-0">Industry News & Regulations</h3>
            <div className="flex-grow overflow-y-auto -mr-2 pr-2">
                {newsItems.map((item) => (
                    <NewsItem key={item.id} item={item} />
                ))}
            </div>
            <button className="mt-4 text-sm font-semibold text-amber-600 hover:text-amber-700 transition-colors w-full text-left">
                View All News &rarr;
            </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
