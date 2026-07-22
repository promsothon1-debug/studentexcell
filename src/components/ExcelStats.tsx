import React from 'react';
import { Users, GraduationCap, Award, CheckCircle, TrendingUp } from 'lucide-react';
import { Student } from '../types';

interface ExcelStatsProps {
  students: Student[];
}

export default function ExcelStats({ students }: ExcelStatsProps) {
  const total = students.length;
  
  const femaleCount = students.filter(s => s.gender === 'ស្រី').length;
  const maleCount = total - femaleCount;
  
  const classAverage = total > 0 
    ? Number((students.reduce((acc, s) => acc + s.average, 0) / total).toFixed(2))
    : 0;
    
  const passingCount = students.filter(s => s.average >= 50).length;
  const passRate = total > 0 
    ? Number(((passingCount / total) * 100).toFixed(1))
    : 0;

  // Find top student
  const topStudent = total > 0
    ? [...students].sort((a, b) => b.totalScore - a.totalScore)[0]
    : null;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 px-6 py-4" id="excel-stats-dashboard">
      {/* Total Students */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-4 hover:border-blue-300 transition-colors duration-200">
        <div className="bg-blue-50 p-3 rounded-lg text-blue-600">
          <Users className="w-6 h-6" />
        </div>
        <div>
          <p className="text-xs text-slate-500 font-medium">សិស្សសរុប (Total)</p>
          <p className="text-2xl font-bold font-mono text-slate-800">{total} នាក់</p>
          <p className="text-[10px] text-slate-400 font-sans mt-0.5">
            ស្រី: {femaleCount} • ប្រុស: {maleCount}
          </p>
        </div>
      </div>

      {/* Class Average */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-4 hover:border-blue-300 transition-colors duration-200">
        <div className="bg-blue-50 p-3 rounded-lg text-blue-600">
          <GraduationCap className="w-6 h-6" />
        </div>
        <div>
          <p className="text-xs text-slate-500 font-medium">មធ្យមភាគថ្នាក់ (Avg)</p>
          <p className="text-2xl font-bold font-mono text-slate-800">{classAverage}</p>
          <p className="text-[10px] text-slate-400 font-sans mt-0.5">
            ពិន្ទុសរុបមធ្យម: {(classAverage * 6).toFixed(0)}/600
          </p>
        </div>
      </div>

      {/* Pass Rate */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-4 hover:border-blue-300 transition-colors duration-200">
        <div className="bg-emerald-50 p-3 rounded-lg text-emerald-600">
          <CheckCircle className="w-6 h-6" />
        </div>
        <div>
          <p className="text-xs text-slate-500 font-medium">អត្រាជាប់ (Pass Rate)</p>
          <p className={`text-2xl font-bold font-mono ${passRate >= 70 ? 'text-emerald-600' : 'text-rose-500'}`}>
            {passRate}%
          </p>
          <p className="text-[10px] text-slate-400 font-sans mt-0.5">
            ជាប់: {passingCount} នាក់ (មធ្យមភាគ ≥ 50)
          </p>
        </div>
      </div>

      {/* Top Scorer */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-4 hover:border-blue-300 transition-colors duration-200 col-span-2 lg:col-span-2">
        <div className="bg-amber-50 p-3 rounded-lg text-amber-500">
          <Award className="w-6 h-6" />
        </div>
        <div className="overflow-hidden">
          <p className="text-xs text-slate-500 font-medium">សិស្សពូកែជាងគេ (Top Student)</p>
          {topStudent ? (
            <>
              <p className="text-lg font-bold text-slate-800 truncate" title={topStudent.name}>
                {topStudent.name} ({topStudent.gender})
              </p>
              <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                អត្តលេខ: {topStudent.studentId} • ពិន្ទុ: {topStudent.totalScore} ({topStudent.grade})
              </p>
            </>
          ) : (
            <p className="text-sm font-semibold text-slate-400">គ្មានទិន្នន័យ</p>
          )}
        </div>
      </div>
    </div>
  );
}
