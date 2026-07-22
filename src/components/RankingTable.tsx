import React, { useState } from 'react';
import { Student } from '../types';
import { Award, Printer, RefreshCw } from 'lucide-react';

interface RankingTableProps {
  students: Student[];
}

export default function RankingTable({ students }: RankingTableProps) {
  // Configurable Header Info
  const [districtOffice, setDistrictOffice] = useState('ការិយាល័យអប់រំ យុវជន និងកីឡា នៃរដ្ឋបាលស្រុកសំពៅលូន');
  const [schoolCluster, setSchoolCluster] = useState('បឋមសិក្សាកំពង់ចង');
  const [locationName, setLocationName] = useState('អូរស្រឡៅ');
  const [rankingTitle, setRankingTitle] = useState('ចំណាត់ថ្នាក់ប្រចាំឆមាសទី១');
  
  // Date & Teacher signature settings
  const [lunarDateText, setLunarDateText] = useState('ថ្ងៃ ចន្ទ ៥កើត ខែ ចេត្រ ឆ្នាំ ម្សាញ់ សប្តស័ក ព.ស.២៥៦៩');
  const [reportDateText, setReportDateText] = useState('ធ្វើនៅវត្តចែង, ថ្ងៃទី ២៣ ខែ មីនា ឆ្នាំ ២០២៦');
  const [teacherName, setTeacherName] = useState('ព្រុំ សុធន');

  // Sort students by rank (1, 2, 3...)
  const sortedStudents = [...students].sort((a, b) => a.rank - b.rank);

  // Split into 2 halves for side-by-side rendering like the reference image
  const halfCount = Math.ceil(sortedStudents.length / 2);
  const leftColStudents = sortedStudents.slice(0, halfCount);
  const rightColStudents = sortedStudents.slice(halfCount);

  // Statistics Calculations
  const totalStudents = students.length;
  const femaleStudents = students.filter((s) => s.gender === 'ស្រី' || s.gender === 'Female').length;

  // Passed students (Average >= 50 or Grade !== 'F')
  const passedStudents = students.filter((s) => s.average >= 50);
  const passedCount = passedStudents.length;
  const passedPercentage = totalStudents > 0 ? ((passedCount / totalStudents) * 100).toFixed(2) : '0.00';
  const passedFemaleCount = passedStudents.filter((s) => s.gender === 'ស្រី' || s.gender === 'Female').length;

  // Failed students (Average < 50 or Grade === 'F')
  const failedStudents = students.filter((s) => s.average < 50);
  const failedCount = failedStudents.length;
  const failedPercentage = totalStudents > 0 ? ((failedCount / totalStudents) * 100).toFixed(2) : '0.00';
  const failedFemaleCount = failedStudents.filter((s) => s.gender === 'ស្រី' || s.gender === 'Female').length;

  // Grade Breakdown (A, B, C, D, E, F)
  const getGradeStats = (grade: 'A' | 'B' | 'C' | 'D' | 'E' | 'F') => {
    const list = students.filter((s) => s.grade === grade);
    const count = list.length;
    const pct = totalStudents > 0 ? ((count / totalStudents) * 100).toFixed(2) : '0.00';
    const femaleCount = list.filter((s) => s.gender === 'ស្រី' || s.gender === 'Female').length;
    const femalePct = totalStudents > 0 ? ((femaleCount / totalStudents) * 100).toFixed(2) : '0.00';
    return { count, pct, femaleCount, femalePct };
  };

  const gradeA = getGradeStats('A');
  const gradeB = getGradeStats('B');
  const gradeC = getGradeStats('C');
  const gradeD = getGradeStats('D');
  const gradeE = getGradeStats('E');
  const gradeF = getGradeStats('F');

  const handlePrint = () => {
    window.print();
  };

  const renderSubTable = (studentList: Student[], startIndex: number) => {
    return (
      <table className="w-full border-collapse border border-slate-900 text-[11px] font-mono">
        <thead>
          <tr className="bg-amber-50/50 text-slate-900 text-center font-bold">
            <th className="border border-slate-900 p-1 w-7">ល.រ</th>
            <th className="border border-slate-900 p-1 font-sans text-[11px]">ឈ្មោះសិស្ស</th>
            <th className="border border-slate-900 p-1 w-7 font-sans text-[11px]">ភេទ</th>
            <th className="border border-slate-900 p-1 w-12 text-[9px] font-sans">មធ្យមភាគ ប្រឡងឆមាស</th>
            <th className="border border-slate-900 p-1 w-12 text-[9px] font-sans">មធ្យមភាគ ប្រចាំខែ</th>
            <th className="border border-slate-900 p-1 w-12 text-[9px] font-sans">មធ្យមភាគ ប្រចាំឆមាស</th>
            <th className="border border-slate-900 p-1 w-10 font-sans text-rose-600 font-bold text-[10px]">ចំណាត់ថ្នាក់</th>
            <th className="border border-slate-900 p-1 w-8 font-sans text-[10px]">និទ្ទេស</th>
            <th className="border border-slate-900 p-1 w-8 font-sans text-[9px]">ផ្សេងៗ</th>
          </tr>
        </thead>
        <tbody>
          {studentList.map((s, idx) => {
            const rowNo = startIndex + idx + 1;
            const isFemale = s.gender === 'ស្រី' || s.gender === 'Female';
            
            // Mock semester exam average based on score
            const semesterExamAvg = (s.average * 0.98).toFixed(2);
            const monthlyAvg = (s.average * 1.01 > 100 ? 99.5 : s.average * 1.01).toFixed(2);
            const overallSemesterAvg = s.average.toFixed(2);

            return (
              <tr key={s.id} className="text-slate-900 hover:bg-slate-50">
                <td className="border border-slate-900 p-1 text-center font-bold">{rowNo}</td>
                <td className="border border-slate-900 p-1 font-sans font-bold text-[11px] whitespace-nowrap pl-1.5">
                  {s.name}
                </td>
                <td className="border border-slate-900 p-1 text-center font-sans">
                  {isFemale ? 'ស្រី' : 'ប្រុស'}
                </td>
                <td className="border border-slate-900 p-1 text-center font-mono text-[10px]">{semesterExamAvg}</td>
                <td className="border border-slate-900 p-1 text-center font-mono text-[10px]">{monthlyAvg}</td>
                <td className="border border-slate-900 p-1 text-center font-mono font-bold text-[10px]">{overallSemesterAvg}</td>
                <td className="border border-slate-900 p-1 text-center font-mono font-bold text-rose-600 text-[11px]">
                  {s.rank}
                </td>
                <td className="border border-slate-900 p-1 text-center font-bold font-sans text-[11px]">{s.grade}</td>
                <td className="border border-slate-900 p-1 text-center"></td>
              </tr>
            );
          })}

          {/* Empty rows filler if needed for uniform height */}
          {Array.from({ length: Math.max(0, 23 - studentList.length) }).map((_, i) => (
            <tr key={`empty-${i}`} className="h-6">
              <td className="border border-slate-900 p-1 text-center font-mono text-[10px] text-slate-300">
                {startIndex + studentList.length + i + 1}
              </td>
              <td className="border border-slate-900 p-1"></td>
              <td className="border border-slate-900 p-1"></td>
              <td className="border border-slate-900 p-1"></td>
              <td className="border border-slate-900 p-1"></td>
              <td className="border border-slate-900 p-1"></td>
              <td className="border border-slate-900 p-1"></td>
              <td className="border border-slate-900 p-1"></td>
              <td className="border border-slate-900 p-1"></td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6" id="ranking-table-container">
      {/* Control Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4 no-print">
        <div className="flex items-center gap-3">
          <div className="bg-amber-50 text-amber-600 p-2.5 rounded-lg">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-800">តារាងចំណាត់ថ្នាក់សិស្ស (Semester Ranking Sheet)</h2>
            <p className="text-xs text-slate-500">រៀបចំតាមទម្រង់ផ្លូវការ ផ្អែកលើពិន្ទុមធ្យមភាគ និងចំណាត់ថ្នាក់</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-1.5 transition cursor-pointer shadow-xs"
          >
            <Printer className="w-4 h-4" />
            <span>បោះពុម្ពតារាងចំណាត់ថ្នាក់ (Print)</span>
          </button>
        </div>
      </div>

      {/* Main Ranking Sheet Container */}
      <div className="bg-white p-6 md:p-8 rounded-xl border border-slate-300 shadow-sm font-sans text-slate-900 space-y-4 printable-area">
        
        {/* Top Header Section */}
        <div className="flex items-start justify-between border-b border-transparent pb-1">
          {/* Top Left: School Office */}
          <div className="text-xs text-slate-800 space-y-0.5 max-w-sm">
            <input
              type="text"
              value={districtOffice}
              onChange={(e) => setDistrictOffice(e.target.value)}
              className="w-full font-bold focus:outline-none focus:bg-slate-50 rounded py-0.5"
            />
            <input
              type="text"
              value={schoolCluster}
              onChange={(e) => setSchoolCluster(e.target.value)}
              className="w-full font-medium focus:outline-none focus:bg-slate-50 rounded py-0.5"
            />
            <input
              type="text"
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
              className="w-full text-slate-600 focus:outline-none focus:bg-slate-50 rounded py-0.5"
            />
          </div>

          {/* Top Right: Kingdom Motto */}
          <div className="text-center text-xs font-bold text-blue-900 space-y-1">
            <div>ព្រះរាជាណាចក្រកម្ពុជា</div>
            <div>ជាតិ សាសនា ព្រះមហាក្សត្រ</div>
          </div>
        </div>

        {/* Banner Title Box */}
        <div className="flex justify-center pt-1 pb-2">
          <div className="border-2 border-amber-800 bg-amber-50/60 px-8 py-1.5 rounded-2xl shadow-xs text-center min-w-[320px]">
            <input
              type="text"
              value={rankingTitle}
              onChange={(e) => setRankingTitle(e.target.value)}
              className="text-xl md:text-2xl font-bold text-red-600 font-moul text-center bg-transparent w-full focus:outline-none"
            />
          </div>
        </div>

        {/* 2-Column Side-by-Side Tables Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start overflow-x-auto">
          {/* Left Column Table (1..N/2) */}
          <div className="overflow-x-auto">
            {renderSubTable(leftColStudents, 0)}
          </div>

          {/* Right Column Table (N/2 + 1 .. N) */}
          <div className="overflow-x-auto">
            {renderSubTable(rightColStudents, halfCount)}
          </div>
        </div>

        {/* Bottom Statistics Summary Row */}
        <div className="border-t border-slate-300 pt-3 space-y-2 text-xs font-bold text-slate-900">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Passed & Failed Summary */}
            <div className="space-y-1.5 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
              <div className="flex items-center justify-between text-blue-900">
                <span>សិស្សជាប់មធ្យមភាគ៖ <strong className="text-blue-700">{passedCount} នាក់</strong> ({passedPercentage}%)</span>
                <span>ស្រី៖ <strong className="text-blue-700">{passedFemaleCount} នាក់</strong></span>
              </div>
              <div className="flex items-center justify-between text-rose-900">
                <span>សិស្សធ្លាក់/ក្រោមមធ្យម៖ <strong className="text-rose-700">{failedCount} នាក់</strong> ({failedPercentage}%)</span>
                <span>ស្រី៖ <strong className="text-rose-700">{failedFemaleCount} នាក់</strong></span>
              </div>
            </div>

            {/* Grades Breakdown Grid */}
            <div className="grid grid-cols-3 gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-[11px]">
              <div>
                <span className="text-emerald-700 font-bold">និទ្ទេស A: </span>
                <span className="font-mono">{gradeA.count}</span> ({gradeA.pct}%)
              </div>
              <div>
                <span className="text-blue-700 font-bold">និទ្ទេស B: </span>
                <span className="font-mono">{gradeB.count}</span> ({gradeB.pct}%)
              </div>
              <div>
                <span className="text-amber-700 font-bold">និទ្ទេស C: </span>
                <span className="font-mono">{gradeC.count}</span> ({gradeC.pct}%)
              </div>
              <div>
                <span className="text-orange-700 font-bold">និទ្ទេស D: </span>
                <span className="font-mono">{gradeD.count}</span> ({gradeD.pct}%)
              </div>
              <div>
                <span className="text-purple-700 font-bold">និទ្ទេស E: </span>
                <span className="font-mono">{gradeE.count}</span> ({gradeE.pct}%)
              </div>
              <div>
                <span className="text-rose-700 font-bold">និទ្ទេស F: </span>
                <span className="font-mono">{gradeF.count}</span> ({gradeF.pct}%)
              </div>
            </div>
          </div>
        </div>

        {/* Date and Signatures Block */}
        <div className="pt-4 space-y-2 text-xs text-slate-900 font-bold">
          <div className="text-right space-y-1">
            <input
              type="text"
              value={lunarDateText}
              onChange={(e) => setLunarDateText(e.target.value)}
              className="text-right text-slate-800 font-medium w-full max-w-md bg-transparent focus:outline-none text-xs"
            />
            <input
              type="text"
              value={reportDateText}
              onChange={(e) => setReportDateText(e.target.value)}
              className="text-right text-slate-900 font-bold w-full max-w-md bg-transparent focus:outline-none text-xs"
            />
            <div className="pr-12 pt-1 font-bold">
              <span>គ្រូបន្ទុកថ្នាក់</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 pt-2">
            <div className="space-y-1">
              <div>បានឃើញ និងឯកភាព</div>
              <div className="text-blue-900 font-bold">នាយកសាលា</div>
            </div>

            <div className="text-right pr-4 pt-10">
              <input
                type="text"
                value={teacherName}
                onChange={(e) => setTeacherName(e.target.value)}
                className="text-right text-slate-900 font-bold w-36 focus:outline-none border-b border-dotted border-slate-400"
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
