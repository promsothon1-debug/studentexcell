import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Student } from '../types';
import { BarChart3, PieChart as PieIcon } from 'lucide-react';

interface StudentChartsProps {
  students: Student[];
}

const COLORS = {
  'A': '#2563eb', // Blue-600
  'B': '#0d9488', // Teal
  'C': '#4f46e5', // Indigo
  'D': '#f59e0b', // Amber
  'E': '#f97316', // Orange
  'F': '#e11d48'  // Rose
};

export default function StudentCharts({ students }: StudentChartsProps) {
  if (students.length === 0) {
    return null;
  }

  // Calculate subject averages
  const count = students.length;
  const sums = students.reduce(
    (acc, s) => {
      acc.khmer += s.scores.khmer;
      acc.math += s.scores.math;
      acc.physics += s.scores.physics;
      acc.chemistry += s.scores.chemistry;
      acc.biology += s.scores.biology;
      acc.english += s.scores.english;
      return acc;
    },
    { khmer: 0, math: 0, physics: 0, chemistry: 0, biology: 0, english: 0 }
  );

  const subjectAveragesData = [
    { name: 'ភាសាខ្មែរ', 'ពិន្ទុមធ្យម': Number((sums.khmer / count).toFixed(1)), fill: '#2563eb' },
    { name: 'គណិតវិទ្យា', 'ពិន្ទុមធ្យម': Number((sums.math / count).toFixed(1)), fill: '#3b82f6' },
    { name: 'រូបវិទ្យា', 'ពិន្ទុមធ្យម': Number((sums.physics / count).toFixed(1)), fill: '#6366f1' },
    { name: 'គីមីវិទ្យា', 'ពិន្ទុមធ្យម': Number((sums.chemistry / count).toFixed(1)), fill: '#a855f7' },
    { name: 'ជីវវិទ្យា', 'ពិន្ទុមធ្យម': Number((sums.biology / count).toFixed(1)), fill: '#ec4899' },
    { name: 'អង់គ្លេស', 'ពិន្ទុមធ្យម': Number((sums.english / count).toFixed(1)), fill: '#f59e0b' }
  ];

  // Calculate Grade Distribution
  const gradeCounts = students.reduce((acc, s) => {
    acc[s.grade] = (acc[s.grade] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const gradeDistributionData = ['A', 'B', 'C', 'D', 'E', 'F'].map(g => ({
    name: `និទ្ទេស ${g}`,
    value: gradeCounts[g] || 0,
    color: COLORS[g as keyof typeof COLORS]
  })).filter(item => item.value > 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-6 pb-8" id="dashboard-charts-container">
      {/* Subject Averages Bar Chart */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col">
        <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
          <BarChart3 className="w-5 h-5 text-blue-600" />
          <h3 className="font-bold text-sm text-slate-800">ពិន្ទុមធ្យមតាមមុខវិជ្ជា (Subject Average Scores)</h3>
        </div>
        <div className="h-64 w-full text-xs">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={subjectAveragesData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fill: '#64748b' }} axisLine={{ stroke: '#cbd5e1' }} />
              <YAxis domain={[0, 100]} tick={{ fill: '#64748b' }} axisLine={{ stroke: '#cbd5e1' }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                cursor={{ fill: '#f8fafc' }}
              />
              <Bar dataKey="ពិន្ទុមធ្យម" radius={[4, 4, 0, 0]}>
                {subjectAveragesData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Grade Distribution Pie Chart */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col">
        <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
          <PieIcon className="w-5 h-5 text-blue-600" />
          <h3 className="font-bold text-sm text-slate-800">ការបែងចែកនិទ្ទេសរួម (Grade Distribution)</h3>
        </div>
        {gradeDistributionData.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-xs text-slate-400">
            គ្មានទិន្នន័យនិទ្ទេស
          </div>
        ) : (
          <div className="h-64 w-full flex flex-col sm:flex-row items-center justify-center text-xs">
            <div className="h-full w-full sm:w-2/3">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={gradeDistributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {gradeDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            {/* Custom Legend */}
            <div className="w-full sm:w-1/3 flex flex-wrap sm:flex-col justify-center gap-3 sm:pl-4 mt-2 sm:mt-0 border-t sm:border-t-0 sm:border-l border-slate-100 pt-3 sm:pt-0">
              {gradeDistributionData.map((entry, index) => (
                <div key={index} className="flex items-center gap-2 min-w-[80px]">
                  <div className="w-3.5 h-3.5 rounded" style={{ backgroundColor: entry.color }}></div>
                  <div className="font-medium text-slate-700">
                    {entry.name}: <span className="font-mono font-bold text-slate-900">{entry.value} នាក់</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
