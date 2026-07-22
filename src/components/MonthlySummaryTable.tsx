import React, { useState } from 'react';
import { Student } from '../types';
import { FileSpreadsheet, Printer, RefreshCw, Layers } from 'lucide-react';

interface MonthlySummaryTableProps {
  students: Student[];
}

// Sample static data from user's image reference
const SAMPLE_IMAGE_DATA = {
  overall: {
    total: { A: 39, B: 51, C: 94, D: 114, E: 191, F: 427 },
    female: { A: 21, B: 28, C: 56, D: 63, E: 98, F: 176 },
  },
  khmer: {
    total: { A: 9, B: 32, C: 37, D: 66, E: 87, F: 227 },
    female: { A: 4, B: 19, C: 26, D: 34, E: 45, F: 93 },
  },
  math: {
    total: { A: 30, B: 19, C: 57, D: 48, E: 104, F: 200 },
    female: { A: 17, B: 9, C: 30, D: 29, E: 53, F: 83 },
  }
};

export default function MonthlySummaryTable({ students }: MonthlySummaryTableProps) {
  const [clusterName, setClusterName] = useState('កម្រងសាលាអូរស្រឡៅ');
  const [schoolName, setSchoolName] = useState('សាលាបឋមសិក្សាវត្ថុចែង');
  const [reportMonth, setReportMonth] = useState('លទ្ធផលសរុបរួមប្រចាំខែមករា ឆ្នាំ២០២៦');
  const [useLiveCalculations, setUseLiveCalculations] = useState(true);

  // Helper to get letter grade for a score
  const getGradeForScore = (score: number): 'A' | 'B' | 'C' | 'D' | 'E' | 'F' => {
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    if (score >= 50) return 'E';
    return 'F';
  };

  // Calculate live statistics from students prop
  const calculateLiveStats = () => {
    const isFemale = (s: Student) => s.gender === 'ស្រី' || s.gender === 'Female';

    const stats = {
      overall: {
        total: { A: 0, B: 0, C: 0, D: 0, E: 0, F: 0 },
        female: { A: 0, B: 0, C: 0, D: 0, E: 0, F: 0 }
      },
      khmer: {
        total: { A: 0, B: 0, C: 0, D: 0, E: 0, F: 0 },
        female: { A: 0, B: 0, C: 0, D: 0, E: 0, F: 0 }
      },
      math: {
        total: { A: 0, B: 0, C: 0, D: 0, E: 0, F: 0 },
        female: { A: 0, B: 0, C: 0, D: 0, E: 0, F: 0 }
      }
    };

    students.forEach((s) => {
      const female = isFemale(s);

      // Overall average grade
      const overallGrade = s.grade as 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
      if (stats.overall.total[overallGrade] !== undefined) {
        stats.overall.total[overallGrade]++;
        if (female) stats.overall.female[overallGrade]++;
      }

      // Khmer grade
      const khmerGrade = getGradeForScore(s.scores.khmer);
      stats.khmer.total[khmerGrade]++;
      if (female) stats.khmer.female[khmerGrade]++;

      // Math grade
      const mathGrade = getGradeForScore(s.scores.math);
      stats.math.total[mathGrade]++;
      if (female) stats.math.female[mathGrade]++;
    });

    return stats;
  };

  const data = useLiveCalculations ? calculateLiveStats() : SAMPLE_IMAGE_DATA;

  // Compute ABC vs DEF groupings
  const khmerTotalABC = data.khmer.total.A + data.khmer.total.B + data.khmer.total.C;
  const khmerTotalDEF = data.khmer.total.D + data.khmer.total.E + data.khmer.total.F;
  const khmerFemaleABC = data.khmer.female.A + data.khmer.female.B + data.khmer.female.C;
  const khmerFemaleDEF = data.khmer.female.D + data.khmer.female.E + data.khmer.female.F;

  const mathTotalABC = data.math.total.A + data.math.total.B + data.math.total.C;
  const mathTotalDEF = data.math.total.D + data.math.total.E + data.math.total.F;
  const mathFemaleABC = data.math.female.A + data.math.female.B + data.math.female.C;
  const mathFemaleDEF = data.math.female.D + data.math.female.E + data.math.female.F;

  // Vertical totals for KH
  const khTotalSum = Object.values(data.khmer.total).reduce((a, b) => a + b, 0);
  const khFemaleSum = Object.values(data.khmer.female).reduce((a, b) => a + b, 0);

  // Vertical totals for MATH
  const mathTotalSum = Object.values(data.math.total).reduce((a, b) => a + b, 0);
  const mathFemaleSum = Object.values(data.math.female).reduce((a, b) => a + b, 0);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6" id="monthly-summary-container">
      {/* Control Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4 no-print">
        <div className="flex items-center gap-3">
          <div className="bg-blue-50 text-blue-600 p-2.5 rounded-lg">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-800">របាយការណ៍សរុបរួមប្រចាំខែ (Monthly Overall Summary)</h2>
            <p className="text-xs text-slate-500">ផ្អែកលើទម្រង់តារាងសាលាបឋមសិក្សា</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Data Toggle Button */}
          <button
            onClick={() => setUseLiveCalculations(!useLiveCalculations)}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-2 border transition cursor-pointer ${
              useLiveCalculations
                ? 'bg-blue-50 border-blue-300 text-blue-700'
                : 'bg-amber-50 border-amber-300 text-amber-800'
            }`}
            title="ប្តូររវាងទិន្នន័យជាក់ស្តែង និងទិន្នន័យគំរូដើម"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>
              {useLiveCalculations ? 'ទិន្នន័យផ្ទាល់ (Live Student Data)' : 'ទិន្នន័យគំរូរូបថត (Image Sample)'}
            </span>
          </button>

          {/* Print Report */}
          <button
            onClick={handlePrint}
            className="bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-1.5 transition cursor-pointer shadow-xs"
          >
            <Printer className="w-4 h-4" />
            <span>បោះពុម្ព (Print)</span>
          </button>
        </div>
      </div>

      {/* Main Excel-like Sheet Card */}
      <div className="bg-white p-6 md:p-8 rounded-xl border border-slate-200 shadow-sm font-sans text-slate-800 space-y-6 printable-area">
        {/* Header Editable Text */}
        <div className="text-center space-y-2">
          <input
            type="text"
            value={reportMonth}
            onChange={(e) => setReportMonth(e.target.value)}
            className="text-xl md:text-2xl font-bold text-slate-900 text-center w-full focus:outline-none focus:bg-slate-50 rounded py-1 px-2 font-moul"
          />
        </div>

        {/* School Cluster sub-headers */}
        <div className="flex flex-col gap-1 text-sm text-slate-700 max-w-sm">
          <input
            type="text"
            value={clusterName}
            onChange={(e) => setClusterName(e.target.value)}
            className="font-medium focus:outline-none focus:bg-slate-50 rounded py-0.5 px-1"
          />
          <input
            type="text"
            value={schoolName}
            onChange={(e) => setSchoolName(e.target.value)}
            className="font-medium focus:outline-none focus:bg-slate-50 rounded py-0.5 px-1"
          />
        </div>

        {/* Layout Grid: Matrix Left, Vertical Right */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start pt-4">
          
          {/* LEFT TABLE: Grade Distribution Matrix */}
          <div className="xl:col-span-8 overflow-x-auto">
            <table className="w-full border-collapse border border-slate-400 text-xs font-mono">
              <thead>
                {/* Overall Section Header */}
                <tr className="bg-slate-100 text-slate-800 text-center font-bold">
                  <th className="border border-slate-400 p-2 w-16" rowSpan={2}>
                    
                  </th>
                  <th className="border border-slate-400 p-2 w-20">
                    និទ្ទេស
                  </th>
                  <th className="border border-slate-400 p-2 w-12">A</th>
                  <th className="border border-slate-400 p-2 w-12">B</th>
                  <th className="border border-slate-400 p-2 w-12">C</th>
                  <th className="border border-slate-400 p-2 w-12">D</th>
                  <th className="border border-slate-400 p-2 w-12">E</th>
                  <th className="border border-slate-400 p-2 w-12">F</th>
                </tr>
              </thead>
              <tbody>
                {/* 1. រួម (Overall) */}
                <tr>
                  <td className="border border-slate-400 p-2 text-center font-bold font-sans bg-slate-50" rowSpan={2}>
                    រួម
                  </td>
                  <td className="border border-slate-400 p-2 text-center font-bold bg-slate-50">
                    សរុប
                  </td>
                  <td className="border border-slate-400 p-2 text-center">{data.overall.total.A}</td>
                  <td className="border border-slate-400 p-2 text-center">{data.overall.total.B}</td>
                  <td className="border border-slate-400 p-2 text-center">{data.overall.total.C}</td>
                  <td className="border border-slate-400 p-2 text-center">{data.overall.total.D}</td>
                  <td className="border border-slate-400 p-2 text-center">{data.overall.total.E}</td>
                  <td className="border border-slate-400 p-2 text-center">{data.overall.total.F}</td>
                </tr>
                <tr>
                  <td className="border border-slate-400 p-2 text-center font-bold bg-slate-50">
                    ស្រី
                  </td>
                  <td className="border border-slate-400 p-2 text-center">{data.overall.female.A}</td>
                  <td className="border border-slate-400 p-2 text-center">{data.overall.female.B}</td>
                  <td className="border border-slate-400 p-2 text-center">{data.overall.female.C}</td>
                  <td className="border border-slate-400 p-2 text-center">{data.overall.female.D}</td>
                  <td className="border border-slate-400 p-2 text-center">{data.overall.female.E}</td>
                  <td className="border border-slate-400 p-2 text-center">{data.overall.female.F}</td>
                </tr>

                {/* Separator row */}
                <tr className="bg-amber-100/60 text-amber-900 h-6">
                  <td colSpan={8} className="border border-slate-400 p-1"></td>
                </tr>

                {/* 2. ខ្មែរ (Khmer) */}
                <tr>
                  <td className="border border-slate-400 p-2 text-center font-bold font-sans bg-slate-50" rowSpan={2}>
                    ខ្មែរ
                  </td>
                  <td className="border border-slate-400 p-2 text-center font-bold bg-slate-50">
                    សរុប
                  </td>
                  <td className="border border-slate-400 p-2 text-center">{data.khmer.total.A}</td>
                  <td className="border border-slate-400 p-2 text-center">{data.khmer.total.B}</td>
                  <td className="border border-slate-400 p-2 text-center">{data.khmer.total.C}</td>
                  <td className="border border-slate-400 p-2 text-center">{data.khmer.total.D}</td>
                  <td className="border border-slate-400 p-2 text-center">{data.khmer.total.E}</td>
                  <td className="border border-slate-400 p-2 text-center">{data.khmer.total.F}</td>
                </tr>
                <tr>
                  <td className="border border-slate-400 p-2 text-center font-bold bg-slate-50">
                    ស្រី
                  </td>
                  <td className="border border-slate-400 p-2 text-center">{data.khmer.female.A}</td>
                  <td className="border border-slate-400 p-2 text-center">{data.khmer.female.B}</td>
                  <td className="border border-slate-400 p-2 text-center">{data.khmer.female.C}</td>
                  <td className="border border-slate-400 p-2 text-center">{data.khmer.female.D}</td>
                  <td className="border border-slate-400 p-2 text-center">{data.khmer.female.E}</td>
                  <td className="border border-slate-400 p-2 text-center">{data.khmer.female.F}</td>
                </tr>

                {/* 3. គណិត (Math) */}
                <tr>
                  <td className="border border-slate-400 p-2 text-center font-bold font-sans bg-slate-50" rowSpan={2}>
                    គណិត
                  </td>
                  <td className="border border-slate-400 p-2 text-center font-bold bg-slate-50">
                    សរុប
                  </td>
                  <td className="border border-slate-400 p-2 text-center">{data.math.total.A}</td>
                  <td className="border border-slate-400 p-2 text-center">{data.math.total.B}</td>
                  <td className="border border-slate-400 p-2 text-center">{data.math.total.C}</td>
                  <td className="border border-slate-400 p-2 text-center">{data.math.total.D}</td>
                  <td className="border border-slate-400 p-2 text-center">{data.math.total.E}</td>
                  <td className="border border-slate-400 p-2 text-center">{data.math.total.F}</td>
                </tr>
                <tr>
                  <td className="border border-slate-400 p-2 text-center font-bold bg-slate-50">
                    ស្រី
                  </td>
                  <td className="border border-slate-400 p-2 text-center">{data.math.female.A}</td>
                  <td className="border border-slate-400 p-2 text-center">{data.math.female.B}</td>
                  <td className="border border-slate-400 p-2 text-center">{data.math.female.C}</td>
                  <td className="border border-slate-400 p-2 text-center">{data.math.female.D}</td>
                  <td className="border border-slate-400 p-2 text-center">{data.math.female.E}</td>
                  <td className="border border-slate-400 p-2 text-center">{data.math.female.F}</td>
                </tr>

                {/* ABC vs DEF Grouping Separator Header */}
                <tr className="bg-amber-100/70 text-amber-950 font-bold text-center">
                  <td className="border border-slate-400 p-1.5" colSpan={2}></td>
                  <td className="border border-slate-400 p-1.5 font-bold" colSpan={3}>ABC</td>
                  <td className="border border-slate-400 p-1.5 font-bold" colSpan={3}>DEF</td>
                </tr>

                {/* Khmer Grouped */}
                <tr>
                  <td className="border border-slate-400 p-2 text-center font-bold font-sans bg-slate-50" rowSpan={2}>
                    ខ្មែរ
                  </td>
                  <td className="border border-slate-400 p-2 text-center font-bold bg-slate-50">
                    សរុប
                  </td>
                  <td className="border border-slate-400 p-2 text-center font-bold" colSpan={3}>{khmerTotalABC}</td>
                  <td className="border border-slate-400 p-2 text-center font-bold" colSpan={3}>{khmerTotalDEF}</td>
                </tr>
                <tr>
                  <td className="border border-slate-400 p-2 text-center font-bold bg-slate-50">
                    ស្រី
                  </td>
                  <td className="border border-slate-400 p-2 text-center font-bold" colSpan={3}>{khmerFemaleABC}</td>
                  <td className="border border-slate-400 p-2 text-center font-bold" colSpan={3}>{khmerFemaleDEF}</td>
                </tr>

                {/* Math Grouped */}
                <tr>
                  <td className="border border-slate-400 p-2 text-center font-bold font-sans bg-slate-50" rowSpan={2}>
                    គណិត
                  </td>
                  <td className="border border-slate-400 p-2 text-center font-bold bg-slate-50">
                    សរុប
                  </td>
                  <td className="border border-slate-400 p-2 text-center font-bold" colSpan={3}>{mathTotalABC}</td>
                  <td className="border border-slate-400 p-2 text-center font-bold" colSpan={3}>{mathTotalDEF}</td>
                </tr>
                <tr>
                  <td className="border border-slate-400 p-2 text-center font-bold bg-slate-50">
                    ស្រី
                  </td>
                  <td className="border border-slate-400 p-2 text-center font-bold" colSpan={3}>{mathFemaleABC}</td>
                  <td className="border border-slate-400 p-2 text-center font-bold" colSpan={3}>{mathFemaleDEF}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* RIGHT TABLE: Vertical Breakdown for KH & MATH */}
          <div className="xl:col-span-4 overflow-x-auto">
            <table className="w-full border-collapse border border-slate-400 text-xs font-mono">
              <thead>
                <tr className="bg-slate-100 text-slate-800 text-center font-bold">
                  <th className="border border-slate-400 p-2"></th>
                  <th className="border border-slate-400 p-2">និទ្ទេស</th>
                  <th className="border border-slate-400 p-2">សរុប</th>
                  <th className="border border-slate-400 p-2">ស្រី</th>
                </tr>
              </thead>
              <tbody>
                {/* KH Section */}
                {(['A', 'B', 'C', 'D', 'E', 'F'] as const).map((g, idx) => (
                  <tr key={`kh-${g}`} className={g === 'F' ? 'bg-amber-50/50' : ''}>
                    {idx === 0 && (
                      <td className="border border-slate-400 p-2 text-center font-bold font-sans bg-slate-50" rowSpan={7}>
                        KH
                      </td>
                    )}
                    <td className="border border-slate-400 p-1.5 text-center font-bold">{g}</td>
                    <td className="border border-slate-400 p-1.5 text-center">{data.khmer.total[g]}</td>
                    <td className="border border-slate-400 p-1.5 text-center">{data.khmer.female[g]}</td>
                  </tr>
                ))}
                <tr className="bg-slate-100 font-bold">
                  <td className="border border-slate-400 p-1.5 text-center" colSpan={2}>សរុបរួម</td>
                  <td className="border border-slate-400 p-1.5 text-center">{khTotalSum}</td>
                  <td className="border border-slate-400 p-1.5 text-center">{khFemaleSum}</td>
                </tr>

                {/* MATH Section */}
                {(['A', 'B', 'C', 'D', 'E', 'F'] as const).map((g, idx) => (
                  <tr key={`math-${g}`} className={g === 'F' ? 'bg-amber-50/50' : ''}>
                    {idx === 0 && (
                      <td className="border border-slate-400 p-2 text-center font-bold font-sans bg-slate-50" rowSpan={7}>
                        MATH
                      </td>
                    )}
                    <td className="border border-slate-400 p-1.5 text-center font-bold">{g}</td>
                    <td className="border border-slate-400 p-1.5 text-center">{data.math.total[g]}</td>
                    <td className="border border-slate-400 p-1.5 text-center">{data.math.female[g]}</td>
                  </tr>
                ))}
                <tr className="bg-slate-100 font-bold">
                  <td className="border border-slate-400 p-1.5 text-center" colSpan={2}>សរុបរួម</td>
                  <td className="border border-slate-400 p-1.5 text-center">{mathTotalSum}</td>
                  <td className="border border-slate-400 p-1.5 text-center">{mathFemaleSum}</td>
                </tr>
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </div>
  );
}
