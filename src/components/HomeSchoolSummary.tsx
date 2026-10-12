import React, { useState } from 'react';
import { SCHOOL_SUMMARY_DATA } from '../data';
import { SchoolSummaryRow } from '../types';
import { Award, Users, Download, Printer, School, TrendingUp, CheckCircle2 } from 'lucide-react';

export default function HomeSchoolSummary() {
  const [data, setData] = useState<SchoolSummaryRow[]>(SCHOOL_SUMMARY_DATA);

  // Total summary row
  const grandTotal = data.find(d => d.grade.includes('ថ្នាក់ទី១-៦')) || data[data.length - 1];

  const handleExportCSV = () => {
    const headers = [
      'ថ្នាក់ (Grade)',
      'បន្ទប់/ផ្នែក (Section)',
      'សិស្សដើមឆ្នាំ-សរុប',
      'សិស្សដើមឆ្នាំ-ស្រី',
      'និទ្ទេសA-សរុប',
      'និទ្ទេសA-ស្រី',
      'និទ្ទេសA-%',
      'និទ្ទេសB-សរុប',
      'និទ្ទេសB-ស្រី',
      'និទ្ទេសB-%',
      'និទ្ទេសC-សរុប',
      'និទ្ទេសC-ស្រី',
      'និទ្ទេសC-%',
      'និទ្ទេសD-សរុប',
      'និទ្ទេសD-ស្រី',
      'និទ្ទេសD-%',
      'និទ្ទេសE-សរុប',
      'និទ្ទេសE-ស្រី',
      'និទ្ទេសE-%',
      'និទ្ទេសF-សរុប',
      'និទ្ទេសF-ស្រី',
      'និទ្ទេសF-%',
      'ភាគរយជាប់'
    ];

    const rows = data.map(r => [
      `"${r.grade}"`,
      `"${r.section || ''}"`,
      r.startYearTotal,
      r.startYearFemale,
      r.gradeA.total,
      r.gradeA.female,
      `"${r.gradeA.percent}%"`,
      r.gradeB.total,
      r.gradeB.female,
      `"${r.gradeB.percent}%"`,
      r.gradeC.total,
      r.gradeC.female,
      `"${r.gradeC.percent}%"`,
      r.gradeD.total,
      r.gradeD.female,
      `"${r.gradeD.percent}%"`,
      r.gradeE.total,
      r.gradeE.female,
      `"${r.gradeE.percent}%"`,
      r.gradeF.total,
      r.gradeF.female,
      `"${r.gradeF.percent}%"`,
      `"${r.passPercent}"`
    ]);

    const csv = '\uFEFF' + [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Wat_Cheng_Primary_School_Summary.csv';
    link.click();
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Top Banner with Official Title */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/20 flex items-center justify-center shrink-0 shadow-inner">
              <School className="w-8 h-8 text-amber-300" />
            </div>
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-blue-500/30 text-blue-100 text-xs font-semibold mb-1 border border-white/10">
                <span>ទំព័រដើម • Home Excel Sheet</span>
              </div>
              <h2 className="text-xl md:text-2xl font-black tracking-tight">
                តារាងស្ថិតិសិស្ស និងនិទ្ទេសរួមទូទាំងសាលា
              </h2>
              <p className="text-xs md:text-sm text-blue-100/90 font-medium mt-0.5">
                សាលាបឋមសិក្សាវត្តចែង • រៀបចំដោយ៖ លោកគ្រូ ព្រំ សុធន (Telegram: 098 629 231)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 self-stretch md:self-auto justify-end">
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-2 px-4 py-2 bg-white/15 hover:bg-white/25 active:bg-white/30 text-white text-xs font-bold rounded-xl border border-white/20 transition cursor-pointer shadow-xs"
            >
              <Download className="w-4 h-4" />
              <span>ទាញយក Excel (CSV)</span>
            </button>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-900 text-xs font-bold rounded-xl transition cursor-pointer shadow-md"
            >
              <Printer className="w-4 h-4" />
              <span>បោះពុម្ព (Print)</span>
            </button>
          </div>
        </div>

        {/* Quick Highlights Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/15">
          <div className="bg-white/10 rounded-xl p-3 border border-white/10">
            <span className="text-[11px] text-blue-200 block font-medium">សិស្សសរុបទូទាំងសាលា</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black">{grandTotal.startYearTotal}</span>
              <span className="text-xs text-blue-200">នាក់ (ស្រី {grandTotal.startYearFemale})</span>
            </div>
          </div>
          <div className="bg-white/10 rounded-xl p-3 border border-white/10">
            <span className="text-[11px] text-blue-200 block font-medium">និទ្ទេសល្អប្រសើរ (A & B)</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-amber-300">{grandTotal.gradeA.total + grandTotal.gradeB.total}</span>
              <span className="text-xs text-blue-200">នាក់ ({((grandTotal.gradeA.total + grandTotal.gradeB.total) / grandTotal.startYearTotal * 100).toFixed(1)}%)</span>
            </div>
          </div>
          <div className="bg-white/10 rounded-xl p-3 border border-white/10">
            <span className="text-[11px] text-blue-200 block font-medium">និទ្ទេសមធ្យម (C & D)</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-emerald-300">{grandTotal.gradeC.total + grandTotal.gradeD.total}</span>
              <span className="text-xs text-blue-200">នាក់</span>
            </div>
          </div>
          <div className="bg-white/10 rounded-xl p-3 border border-white/10">
            <span className="text-[11px] text-blue-200 block font-medium">អត្រាជាប់ទូទៅ (Pass Rate)</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-emerald-300">{grandTotal.passPercent}</span>
              <span className="text-xs text-blue-200 font-semibold">ថ្នាក់ទី១ ដល់ ទី៦</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Excel Data Table */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
        <div className="p-4 bg-slate-50/80 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />
            <h3 className="font-bold text-slate-800 text-sm">
              ទិន្នន័យជាក់ស្ដែងតាមកម្រិតថ្នាក់ (ថ្នាក់ទី១ ដល់ ថ្នាក់ទី៦)
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-mono">
            ប្រភព៖ ឯកសារ Excel គ្រប់គ្រងពិន្ទុសិស្ស ប.វត្តចែង
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse select-none" id="school-summary-table">
            <thead>
              {/* Primary Header */}
              <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-300 text-center">
                <th rowSpan={2} className="p-2.5 border-r border-slate-300 min-w-[120px] text-left">
                  កម្រិតថ្នាក់
                </th>
                <th colSpan={2} className="p-2 border-r border-slate-300 bg-blue-50/60 text-blue-900">
                  សិស្សដើមឆ្នាំ
                </th>
                <th colSpan={3} className="p-2 border-r border-slate-300 bg-amber-50/60 text-amber-900">
                  និទ្ទេស A
                </th>
                <th colSpan={3} className="p-2 border-r border-slate-300 bg-blue-50/60 text-blue-900">
                  និទ្ទេស B
                </th>
                <th colSpan={3} className="p-2 border-r border-slate-300 bg-emerald-50/60 text-emerald-900">
                  និទ្ទេស C
                </th>
                <th colSpan={3} className="p-2 border-r border-slate-300 bg-indigo-50/60 text-indigo-900">
                  និទ្ទេស D
                </th>
                <th colSpan={3} className="p-2 border-r border-slate-300 bg-purple-50/60 text-purple-900">
                  និទ្ទេស E
                </th>
                <th colSpan={3} className="p-2 border-r border-slate-300 bg-rose-50/60 text-rose-900">
                  និទ្ទេស F
                </th>
                <th rowSpan={2} className="p-2.5 bg-slate-100 min-w-[70px]">
                  ភាគរយ
                </th>
              </tr>

              {/* Sub-header row */}
              <tr className="bg-slate-50 text-[11px] text-slate-600 font-semibold border-b border-slate-300 text-center">
                <th className="py-1.5 px-2 border-r border-slate-200">សរុប</th>
                <th className="py-1.5 px-2 border-r border-slate-300 text-pink-600">ស្រី</th>

                <th className="py-1.5 px-1 border-r border-slate-200">សរុប</th>
                <th className="py-1.5 px-1 border-r border-slate-200 text-pink-600">ស្រី</th>
                <th className="py-1.5 px-1.5 border-r border-slate-300 font-mono">%</th>

                <th className="py-1.5 px-1 border-r border-slate-200">សរុប</th>
                <th className="py-1.5 px-1 border-r border-slate-200 text-pink-600">ស្រី</th>
                <th className="py-1.5 px-1.5 border-r border-slate-300 font-mono">%</th>

                <th className="py-1.5 px-1 border-r border-slate-200">សរុប</th>
                <th className="py-1.5 px-1 border-r border-slate-200 text-pink-600">ស្រី</th>
                <th className="py-1.5 px-1.5 border-r border-slate-300 font-mono">%</th>

                <th className="py-1.5 px-1 border-r border-slate-200">សរុប</th>
                <th className="py-1.5 px-1 border-r border-slate-200 text-pink-600">ស្រី</th>
                <th className="py-1.5 px-1.5 border-r border-slate-300 font-mono">%</th>

                <th className="py-1.5 px-1 border-r border-slate-200">សរុប</th>
                <th className="py-1.5 px-1 border-r border-slate-200 text-pink-600">ស្រី</th>
                <th className="py-1.5 px-1.5 border-r border-slate-300 font-mono">%</th>

                <th className="py-1.5 px-1 border-r border-slate-200">សរុប</th>
                <th className="py-1.5 px-1 border-r border-slate-200 text-pink-600">ស្រី</th>
                <th className="py-1.5 px-1.5 border-r border-slate-300 font-mono">%</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, idx) => {
                const isGrandTotal = row.grade.includes('ថ្នាក់ទី១-៦');
                const isClassTotal = row.isTotalRow && !isGrandTotal;

                return (
                  <tr
                    key={idx}
                    className={`border-b border-slate-200 transition text-center ${
                      isGrandTotal
                        ? 'bg-blue-100/90 font-extrabold text-blue-950 text-xs border-t-2 border-blue-400'
                        : isClassTotal
                        ? 'bg-slate-100 font-bold text-slate-900 border-t border-slate-300'
                        : 'hover:bg-blue-50/30'
                    }`}
                  >
                    <td className={`p-2.5 text-left border-r border-slate-200 font-medium ${isClassTotal || isGrandTotal ? 'font-bold' : 'pl-6 text-slate-700'}`}>
                      {row.grade} {row.section && !isClassTotal && !isGrandTotal && <span className="text-[11px] text-slate-400 font-normal">({row.section})</span>}
                    </td>

                    {/* Start of Year */}
                    <td className="p-2 border-r border-slate-200 font-mono font-semibold">{row.startYearTotal}</td>
                    <td className="p-2 border-r border-slate-300 font-mono text-pink-600">{row.startYearFemale}</td>

                    {/* Grade A */}
                    <td className="p-1 border-r border-slate-200 font-mono">{row.gradeA.total || '-'}</td>
                    <td className="p-1 border-r border-slate-200 font-mono text-pink-600">{row.gradeA.female || '-'}</td>
                    <td className="p-1 border-r border-slate-300 font-mono text-[10px] text-slate-500">{row.gradeA.percent ? `${row.gradeA.percent.toFixed(2)}%` : '-'}</td>

                    {/* Grade B */}
                    <td className="p-1 border-r border-slate-200 font-mono">{row.gradeB.total || '-'}</td>
                    <td className="p-1 border-r border-slate-200 font-mono text-pink-600">{row.gradeB.female || '-'}</td>
                    <td className="p-1 border-r border-slate-300 font-mono text-[10px] text-slate-500">{row.gradeB.percent ? `${row.gradeB.percent.toFixed(2)}%` : '-'}</td>

                    {/* Grade C */}
                    <td className="p-1 border-r border-slate-200 font-mono">{row.gradeC.total || '-'}</td>
                    <td className="p-1 border-r border-slate-200 font-mono text-pink-600">{row.gradeC.female || '-'}</td>
                    <td className="p-1 border-r border-slate-300 font-mono text-[10px] text-slate-500">{row.gradeC.percent ? `${row.gradeC.percent.toFixed(2)}%` : '-'}</td>

                    {/* Grade D */}
                    <td className="p-1 border-r border-slate-200 font-mono">{row.gradeD.total || '-'}</td>
                    <td className="p-1 border-r border-slate-200 font-mono text-pink-600">{row.gradeD.female || '-'}</td>
                    <td className="p-1 border-r border-slate-300 font-mono text-[10px] text-slate-500">{row.gradeD.percent ? `${row.gradeD.percent.toFixed(2)}%` : '-'}</td>

                    {/* Grade E */}
                    <td className="p-1 border-r border-slate-200 font-mono">{row.gradeE.total || '-'}</td>
                    <td className="p-1 border-r border-slate-200 font-mono text-pink-600">{row.gradeE.female || '-'}</td>
                    <td className="p-1 border-r border-slate-300 font-mono text-[10px] text-slate-500">{row.gradeE.percent ? `${row.gradeE.percent.toFixed(2)}%` : '-'}</td>

                    {/* Grade F */}
                    <td className="p-1 border-r border-slate-200 font-mono">{row.gradeF.total || '-'}</td>
                    <td className="p-1 border-r border-slate-200 font-mono text-pink-600">{row.gradeF.female || '-'}</td>
                    <td className="p-1 border-r border-slate-300 font-mono text-[10px] text-rose-500">{row.gradeF.percent ? `${row.gradeF.percent.toFixed(2)}%` : '-'}</td>

                    {/* Pass % */}
                    <td className="p-2 font-mono font-bold text-slate-800">
                      <span className={`px-2 py-0.5 rounded-full text-[11px] ${
                        row.passPercent === '100%' ? 'bg-emerald-100 text-emerald-800 font-extrabold' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {row.passPercent}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Grade distribution summary chart card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-5 h-5 text-amber-500" />
            <h4 className="font-bold text-slate-800 text-sm">សមាមាត្រនិទ្ទេសទូទាំងសាលា (Grade Proportions)</h4>
          </div>
          <div className="space-y-3">
            {[
              { grade: 'និទ្ទេស A (ឆ្នើម)', count: grandTotal.gradeA.total, percent: grandTotal.gradeA.percent, color: 'bg-amber-500' },
              { grade: 'និទ្ទេស B (ល្អណាស់)', count: grandTotal.gradeB.total, percent: grandTotal.gradeB.percent, color: 'bg-blue-600' },
              { grade: 'និទ្ទេស C (ល្អ)', count: grandTotal.gradeC.total, percent: grandTotal.gradeC.percent, color: 'bg-emerald-500' },
              { grade: 'និទ្ទេស D (ល្អបង្គួរ)', count: grandTotal.gradeD.total, percent: grandTotal.gradeD.percent, color: 'bg-indigo-500' },
              { grade: 'និទ្ទេស E (មធ្យម)', count: grandTotal.gradeE.total, percent: grandTotal.gradeE.percent, color: 'bg-purple-500' },
              { grade: 'និទ្ទេស F (ធ្លាក់)', count: grandTotal.gradeF.total, percent: grandTotal.gradeF.percent, color: 'bg-rose-500' },
            ].map(item => (
              <div key={item.grade}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium text-slate-700">{item.grade}</span>
                  <span className="font-mono text-slate-500 font-bold">{item.count} នាក់ ({item.percent}%)</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full ${item.color} rounded-full transition-all duration-500`} style={{ width: `${Math.max(2, item.percent * 3)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <h4 className="font-bold text-slate-800 text-sm">សេចក្តីសន្និដ្ឋាន និងព័ត៌មានរដ្ឋបាលសាលា</h4>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              ផ្អែកតាមទិន្នន័យផ្លូវការនៃតារាងស្ថិតិសិស្សចុងឆ្នាំ សាលាបឋមសិក្សាវត្តចែង មានសិស្សសរុបចំនួន <strong>៤៥៨ នាក់</strong> (ស្រី ២២១ នាក់)។ អត្រាជាប់ទូទៅទូទាំងសាលាទទួលបាន <strong>៨៣%</strong> ដោយសិស្សទទួលបាននិទ្ទេស A ចំនួន ៣ នាក់ និទ្ទេស B ចំនួន ៣៣ នាក់ និងនិទ្ទេស C ចំនួន ៦៧ នាក់។
            </p>
          </div>

          <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-xl text-xs space-y-1">
            <div className="flex items-center justify-between text-blue-900 font-bold">
              <span>រៀបចំចងក្រងប្រព័ន្ធដោយ៖</span>
              <span>លោកគ្រូ ព្រំ សុធន</span>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span>សាលាបឋមសិក្សា៖</span>
              <span className="font-medium">វត្តចែង</span>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span>ទំនាក់ទំនង Telegram៖</span>
              <a href="https://t.me/+85598629231" target="_blank" rel="noreferrer" className="text-blue-600 font-bold hover:underline">
                098 629 231
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
