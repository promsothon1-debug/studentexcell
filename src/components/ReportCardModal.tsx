import React from 'react';
import { X, Award, GraduationCap, CheckCircle2, AlertTriangle, Calendar } from 'lucide-react';
import { Student } from '../types';

interface ReportCardModalProps {
  student: Student | null;
  onClose: () => void;
}

export default function ReportCardModal({ student, onClose }: ReportCardModalProps) {
  if (!student) return null;

  const averagePercentage = student.average; // average is out of 100
  const isPassed = student.average >= 50;

  // Render score comment based on Average/Grade
  const getComment = (grade: string) => {
    switch (grade) {
      case 'A': return { text: 'និទ្ទេសល្អប្រសើរណាស់! សិស្សរៀនពូកែ និងឧស្សាហ៍ព្យាយាមបំផុត។', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
      case 'B': return { text: 'និទ្ទេសល្អណាស់! បន្តការខិតខំប្រឹងប្រែងដើម្បីជោគជ័យបន្ថែមទៀត។', color: 'text-teal-700 bg-teal-50 border-teal-200' };
      case 'C': return { text: 'និទ្ទេសល្អ! ការសិក្សាមានការលូតលាស់ល្អណាស់។', color: 'text-blue-700 bg-blue-50 border-blue-200' };
      case 'D': return { text: 'និទ្ទេសមធ្យម! គួរតែព្យាយាមមើលមេរៀនបន្ថែមទៀត។', color: 'text-amber-700 bg-amber-50 border-amber-200' };
      case 'E': return { text: 'និទ្ទេសខ្សោយ! ត្រូវតែខិតខំរៀនសូត្រទ្វេដងដើម្បីពង្រឹងសមត្ថភាព។', color: 'text-orange-750 bg-orange-50 border-orange-200' };
      default: return { text: 'ធ្លាក់! ត្រូវយកចិត្តទុកដាក់ខ្ពស់លើការរៀនឡើងវិញ និងសួរគ្រូជំនួយ។', color: 'text-rose-700 bg-rose-50 border-rose-200' };
    }
  };

  const comment = getComment(student.grade);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200" id="report-card-overlay">
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200"
        id="report-card-modal"
      >
        {/* Header (Spreadsheet themed green) */}
        <div className="bg-blue-600 text-white py-4 px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-blue-200" />
            <h2 className="font-bold text-lg">ព្រឹត្តិបត្រពិន្ទុបុគ្គល (Student Report Card)</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-white/10 active:bg-white/20 rounded-lg text-blue-100 hover:text-white transition cursor-pointer"
            id="btn-close-report"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Card Body */}
        <div className="p-6 overflow-y-auto space-y-6 max-h-[80vh]">
          {/* Student Profile Block */}
          <div className="flex flex-col md:flex-row items-center gap-6 bg-slate-50 p-4 rounded-xl border border-slate-100">
            {/* Visual average score circular progress */}
            <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
              <svg className="absolute w-full h-full transform -rotate-90">
                <circle 
                  cx="48" 
                  cy="48" 
                  r="42" 
                  stroke="#e2e8f0" 
                  strokeWidth="8" 
                  fill="transparent" 
                />
                <circle 
                  cx="48" 
                  cy="48" 
                  r="42" 
                  stroke={isPassed ? '#2563eb' : '#f43f5e'} 
                  strokeWidth="8" 
                  fill="transparent" 
                  strokeDasharray={2 * Math.PI * 42}
                  strokeDashoffset={2 * Math.PI * 42 * (1 - averagePercentage / 100)}
                  strokeLinecap="round"
                />
              </svg>
              <div className="text-center">
                <span className="text-xl font-black font-mono text-slate-800">{student.average}</span>
                <span className="block text-[9px] text-slate-400 font-sans uppercase">មធ្យមភាគ</span>
              </div>
            </div>

            <div className="flex-1 text-center md:text-left space-y-1">
              <div className="flex flex-col md:flex-row items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900">{student.name}</h3>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  student.gender === 'ស្រី' 
                    ? 'bg-pink-100 text-pink-700 border border-pink-200' 
                    : 'bg-blue-100 text-blue-700 border border-blue-200'
                }`}>
                  ភេទ: {student.gender}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-mono">
                អត្តលេខសិស្ស: <span className="font-bold text-slate-700">{student.studentId}</span>
              </p>
              
              {/* Rank and Grade */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-1 text-xs">
                <div className="flex items-center gap-1 text-amber-600 bg-amber-50 px-2.5 py-1 rounded-md font-medium border border-amber-100">
                  <Award className="w-3.5 h-3.5" />
                  <span>ចំណាត់ថ្នាក់: <strong className="font-mono text-amber-700">លេខ {student.rank}</strong></span>
                </div>
                <div className="flex items-center gap-1 text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md font-medium border border-blue-100">
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>និទ្ទេសរួម: <strong className="font-mono text-blue-700">{student.grade}</strong></span>
                </div>
              </div>
            </div>
          </div>

          {/* Subject Scores Table */}
          <div className="space-y-2">
            <h4 className="font-bold text-sm text-slate-800">ពិន្ទុមុខវិជ្ជាលម្អិត (Subject Breakdown)</h4>
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                    <th className="py-2.5 px-4 text-left">មុខវិជ្ជា (Subject)</th>
                    <th className="py-2.5 px-4 text-center">ពិន្ទុ (Score) / 100</th>
                    <th className="py-2.5 px-4 text-center">លទ្ធផល (Result)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {[
                    { label: 'ភាសាខ្មែរ (Khmer Language)', score: student.scores.khmer },
                    { label: 'គណិតវិទ្យា (Mathematics)', score: student.scores.math },
                    { label: 'រូបវិទ្យា (Physics)', score: student.scores.physics },
                    { label: 'គីមីវិទ្យា (Chemistry)', score: student.scores.chemistry },
                    { label: 'ជីវវិទ្យា (Biology)', score: student.scores.biology },
                    { label: 'អង់គ្លេស (English)', score: student.scores.english },
                  ].map((sub, i) => {
                    const pass = sub.score >= 50;
                    return (
                      <tr key={i} className="hover:bg-slate-50/40">
                        <td className="py-2.5 px-4 text-slate-700">{sub.label}</td>
                        <td className="py-2.5 px-4 text-center font-mono text-slate-900 font-bold">{sub.score}</td>
                        <td className="py-2.5 px-4 text-center">
                          <span className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            pass ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                          }`}>
                            {pass ? 'ជាប់ (Pass)' : 'ធ្លាក់ (Fail)'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                  
                  {/* Totals Summary Rows */}
                  <tr className="bg-slate-50 font-bold">
                    <td className="py-2.5 px-4 text-slate-800 text-right">ពិន្ទុសរុប (Total Score):</td>
                    <td className="py-2.5 px-4 text-center font-mono text-slate-900 text-sm">{student.totalScore} / 600</td>
                    <td className="py-2.5 px-4 text-center">
                      <span className={`text-[10px] uppercase font-black tracking-wider ${isPassed ? 'text-emerald-700' : 'text-rose-700'}`}>
                        {isPassed ? 'ប្រឡងជាប់' : 'ប្រឡងធ្លាក់'}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Teacher Commentary Box */}
          <div className={`p-4 rounded-xl border flex gap-3 ${comment.color}`}>
            <div className="shrink-0 mt-0.5">
              {isPassed ? (
                <CheckCircle2 className="w-5 h-5" />
              ) : (
                <AlertTriangle className="w-5 h-5" />
              )}
            </div>
            <div>
              <h5 className="font-bold text-xs">ការវាយតម្លៃរបស់អ្នកគ្រូ/លោកគ្រូ (Teacher Commentary)</h5>
              <p className="text-xs mt-1 leading-relaxed font-sans">{comment.text}</p>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="bg-slate-50 py-3.5 px-6 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono">
            <Calendar className="w-3.5 h-3.5" />
            <span>កាលបរិច្ឆេទចេញ៖ ២០២៦-០៧-២០</span>
          </div>
          <button
            onClick={onClose}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-bold px-5 py-2.5 rounded-lg transition shadow-xs hover:shadow-md cursor-pointer"
            id="btn-confirm-close-report"
          >
            យល់ព្រម (OK)
          </button>
        </div>
      </div>
    </div>
  );
}
