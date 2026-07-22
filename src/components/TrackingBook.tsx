import React, { useState } from 'react';
import { Student } from '../types';
import { BookOpen, Printer, User, ChevronLeft, ChevronRight, Edit3 } from 'lucide-react';

interface TrackingBookProps {
  students: Student[];
  initialStudentId?: string | null;
}

interface SubjectItem {
  id: string;
  name: string;
  score: number; // 0 to 10 scale
  comment: string;
}

export default function TrackingBook({ students, initialStudentId }: TrackingBookProps) {
  // Currently selected student index
  const [selectedIndex, setSelectedIndex] = useState<number>(() => {
    if (initialStudentId) {
      const idx = students.findIndex((s) => s.id === initialStudentId);
      if (idx !== -1) return idx;
    }
    return 0;
  });

  // Customizable report metadata
  const [monthName, setMonthName] = useState('ខែកុម្ភៈ');
  const [className, setClassName] = useState('ថ្នាក់ទី១(ក)');
  const [schoolLocation, setSchoolLocation] = useState('វត្តចែង');
  const [teacherName, setTeacherName] = useState('ព្រុំ សុធន');
  const [lunarDateText, setLunarDateText] = useState('ថ្ងៃ ពុធ ៥កើត ខែមាឃ ឆ្នាំ ម្សាញ់ សប្តស័ក ព.ស.២៥៦៩');
  const [reportDateText, setReportDateText] = useState('ថ្ងៃទី ២៤ ខែ កុម្ភៈ ឆ្នាំ ២០២៦');
  const [discipline, setDiscipline] = useState('ល្អ');
  const [excusedAbsence, setExcusedAbsence] = useState('0');
  const [unexcusedAbsence, setUnexcusedAbsence] = useState('1');

  const currentStudent = students[selectedIndex] || students[0];

  // Map 100-point scale scores to 10-point scale for primary tracking sheet
  const scaleTo10 = (score100: number) => {
    return Math.min(10, Math.max(0, parseFloat((score100 / 10).toFixed(1))));
  };

  // Base list of subjects as shown in user's image sample
  const baseSubjects: { name: string; score: number; comment: string }[] = currentStudent
    ? [
        { name: 'រៀនអាន', score: scaleTo10(currentStudent.scores.khmer * 0.95), comment: '' },
        { name: 'តែងសេចក្តី', score: scaleTo10(currentStudent.scores.khmer * 0.9), comment: '' },
        { name: 'សរសេរតាមអាន', score: scaleTo10(currentStudent.scores.khmer * 1.05), comment: '' },
        { name: 'សមត្ថភាពនិយាយ', score: scaleTo10(currentStudent.scores.khmer * 1.0), comment: '' },
        { name: 'ចំនួន', score: scaleTo10(currentStudent.scores.math * 1.02), comment: '' },
        { name: 'រង្វាស់រង្វាល់', score: scaleTo10(currentStudent.scores.math * 0.98), comment: '' },
        { name: 'ធរណីមាត្រ', score: scaleTo10(currentStudent.scores.math * 0.95), comment: '' },
        { name: 'ពិជគណិត', score: scaleTo10(currentStudent.scores.math * 0.9), comment: '' },
        { name: 'ស្ថិតិ', score: scaleTo10(currentStudent.scores.math * 0.92), comment: '' },
        { name: 'វិទ្យាសាស្ត្រ', score: scaleTo10(currentStudent.scores.physics), comment: '' },
        { name: 'សីលធម៌', score: scaleTo10(currentStudent.scores.biology * 1.05), comment: '' },
        { name: 'ភូមិវិទ្យា', score: scaleTo10(currentStudent.scores.chemistry * 1.02), comment: '' },
        { name: 'ប្រវត្តិវិទ្យា', score: scaleTo10(currentStudent.scores.chemistry * 0.98), comment: '' },
        { name: 'សិល្បៈ', score: scaleTo10(currentStudent.scores.biology * 0.95), comment: '' },
        { name: 'អប់រំកាយ-កីឡា', score: scaleTo10(currentStudent.scores.biology * 1.08), comment: '' },
        { name: 'សុខភាព-អនាម័យ', score: scaleTo10(currentStudent.scores.biology * 1.02), comment: '' },
        { name: 'ភាសាបរទេស', score: scaleTo10(currentStudent.scores.english), comment: '' },
        { name: 'បំណិនជីវិត', score: scaleTo10(currentStudent.scores.khmer * 0.96), comment: '' },
      ]
    : [];

  // State for overrides if teacher edits score/comments per student
  const [subjectData, setSubjectData] = useState<Record<string, { score: number; comment: string }>>({});

  const handleScoreChange = (subName: string, val: number) => {
    setSubjectData((prev) => ({
      ...prev,
      [subName]: {
        score: val,
        comment: prev[subName]?.comment || '',
      },
    }));
  };

  const handleCommentChange = (subName: string, val: string) => {
    setSubjectData((prev) => ({
      ...prev,
      [subName]: {
        score: prev[subName]?.score ?? (baseSubjects.find((b) => b.name === subName)?.score || 0),
        comment: val,
      },
    }));
  };

  const getSubjectState = (subName: string, defaultScore: number) => {
    if (subjectData[subName]) {
      return subjectData[subName];
    }
    return { score: defaultScore, comment: '' };
  };

  const handlePrint = () => {
    window.print();
  };

  if (!currentStudent) {
    return (
      <div className="p-12 text-center text-slate-500 font-sans">
        មិនមានទិន្នន័យសិស្សសម្រាប់បង្ហាញសៀវភៅតាមដានឡើយ។
      </div>
    );
  }

  // Calculate 10-point scale student average
  const studentAverage10 = (currentStudent.average / 10).toFixed(2);
  const totalAbsences = (parseInt(excusedAbsence) || 0) + (parseInt(unexcusedAbsence) || 0);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6" id="tracking-book-container">
      {/* Control Navigation Header */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4 no-print">
        <div className="flex items-center gap-3">
          <div className="bg-blue-50 text-blue-600 p-2.5 rounded-lg">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-800">សៀវភៅតាមដាន និងលទ្ធផលសិក្សាប្រចាំខែ</h2>
            <p className="text-xs text-slate-500">Student Progress Tracking Booklet</p>
          </div>
        </div>

        {/* Student Selector & Navigation */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button
              onClick={() => setSelectedIndex((prev) => Math.max(0, prev - 1))}
              disabled={selectedIndex === 0}
              className="p-1.5 rounded-md hover:bg-white text-slate-700 disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
              title="សិស្សមុន"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            
            <select
              value={selectedIndex}
              onChange={(e) => setSelectedIndex(Number(e.target.value))}
              className="bg-transparent text-xs font-bold text-slate-800 px-2 py-1 focus:outline-none cursor-pointer"
            >
              {students.map((s, idx) => (
                <option key={s.id} value={idx}>
                  {idx + 1}. {s.name} ({s.studentId})
                </option>
              ))}
            </select>

            <button
              onClick={() => setSelectedIndex((prev) => Math.min(students.length - 1, prev + 1))}
              disabled={selectedIndex === students.length - 1}
              className="p-1.5 rounded-md hover:bg-white text-slate-700 disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
              title="សិស្សបន្ទាប់"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={handlePrint}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-1.5 transition cursor-pointer shadow-xs"
          >
            <Printer className="w-4 h-4" />
            <span>បោះពុម្ពសៀវភៅ (Print)</span>
          </button>
        </div>
      </div>

      {/* Printable Sheet reproducing the user image exact format */}
      <div className="bg-white p-6 sm:p-10 rounded-xl border border-slate-300 shadow-sm font-sans text-blue-900 printable-area leading-tight">
        
        {/* Title & Student Header */}
        <div className="flex items-start justify-between border-b-2 border-transparent pb-2 mb-2">
          {/* Main Title */}
          <div className="text-center flex-1">
            <h1 className="text-xl sm:text-2xl font-bold text-blue-700 flex items-center justify-center gap-2">
              <span>លទ្ធផលសិក្សាប្រចាំ</span>
              <input
                type="text"
                value={monthName}
                onChange={(e) => setMonthName(e.target.value)}
                className="text-red-600 font-bold w-28 text-center bg-transparent focus:outline-none border-b border-dashed border-red-300 py-0"
              />
            </h1>
          </div>

          {/* Top Right Student Name and Class */}
          <div className="text-right text-xs sm:text-sm font-bold text-blue-800 space-y-1">
            <div className="flex items-center justify-end gap-1">
              <span className="text-blue-900 font-bold">{currentStudent.name}</span>
            </div>
            <div className="flex items-center justify-end gap-1">
              <input
                type="text"
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                className="text-blue-700 font-bold text-right w-24 bg-transparent focus:outline-none border-b border-dashed border-blue-300 py-0"
              />
            </div>
          </div>
        </div>

        {/* Main Subject Rating Table */}
        <table className="w-full border-2 border-black text-xs border-collapse">
          <thead>
            {/* Main Header Row */}
            <tr className="border-b-2 border-black">
              <th className="border-r border-black p-2 text-center w-32 bg-amber-50/30 text-blue-900 font-bold" rowSpan={2}>
                មុខវិជ្ជា
              </th>
              <th className="border-r border-black p-1 text-center bg-amber-50/30 text-blue-900 font-bold" colSpan={4}>
                លទ្ធផលនៃការវាយតម្លៃលទ្ធផលសិក្សា៖
              </th>
              <th className="p-2 text-center w-48 bg-amber-50/30 text-blue-900 font-bold" rowSpan={2}>
                ចំណុចដែលត្រូវពង្រឹងបន្ថែម
              </th>
            </tr>

            {/* Sub Header Ratings Row */}
            <tr className="border-b-2 border-black text-[11px]">
              <th className="border-r border-black p-1 text-center w-14 bg-amber-50/30 text-blue-900">
                <div>ល្អ</div>
                <div className="text-[10px] text-slate-600 font-mono font-normal">8 - 10</div>
              </th>
              <th className="border-r border-black p-1 text-center w-16 bg-amber-50/30 text-blue-900">
                <div>ល្អបង្គួរ</div>
                <div className="text-[10px] text-slate-600 font-mono font-normal">6.5 - 7.99</div>
              </th>
              <th className="border-r border-black p-1 text-center w-16 bg-amber-50/30 text-blue-900">
                <div>មធ្យម</div>
                <div className="text-[10px] text-slate-600 font-mono font-normal">5 - 6.49</div>
              </th>
              <th className="border-r border-black p-1 text-center w-16 bg-amber-50/30 text-blue-900">
                <div>ខ្សោយ</div>
                <div className="text-[10px] text-slate-600 font-mono font-normal">0 - 4.99</div>
              </th>
            </tr>
          </thead>

          <tbody>
            {baseSubjects.map((sub, idx) => {
              const state = getSubjectState(sub.name, sub.score);
              const score = state.score;

              const isGood = score >= 8.0;
              const isVeryGood = score >= 6.5 && score < 8.0;
              const isMedium = score >= 5.0 && score < 6.5;
              const isWeak = score < 5.0;

              return (
                <tr key={idx} className="border-b border-black text-blue-900 hover:bg-slate-50/50">
                  {/* Subject Name */}
                  <td className="border-r border-black p-1.5 font-bold pl-2">
                    {sub.name}
                  </td>

                  {/* Rating Columns with Checkmarks ✓ */}
                  <td className="border-r border-black p-1 text-center font-bold text-sm text-blue-800">
                    {isGood ? '✓' : ''}
                  </td>
                  <td className="border-r border-black p-1 text-center font-bold text-sm text-blue-800">
                    {isVeryGood ? '✓' : ''}
                  </td>
                  <td className="border-r border-black p-1 text-center font-bold text-sm text-blue-800">
                    {isMedium ? '✓' : ''}
                  </td>
                  <td className="border-r border-black p-1 text-center font-bold text-sm text-blue-800">
                    {isWeak ? '✓' : ''}
                  </td>

                  {/* Points to strengthen / comments */}
                  <td className="p-1">
                    <input
                      type="text"
                      value={state.comment}
                      onChange={(e) => handleCommentChange(sub.name, e.target.value)}
                      placeholder=""
                      className="w-full bg-transparent text-xs text-blue-900 focus:outline-none px-1"
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Stats Summary Line Below Table */}
        <div className="pt-4 space-y-2 text-xs sm:text-sm">
          {/* Line 1: Average, Rank, Grade */}
          <div className="flex items-center justify-start gap-6 font-bold">
            <div className="flex items-center gap-2">
              <span className="text-blue-900">មធ្យមភាគ</span>
              <span className="text-red-600 font-mono text-base">{studentAverage10}</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-blue-900">ចំណាត់ថ្នាក់</span>
              <span className="text-red-600 font-mono text-base">{currentStudent.rank}</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-blue-900">និទ្ទេស</span>
              <span className="text-red-600 font-bold text-base">{currentStudent.grade}</span>
            </div>
          </div>

          {/* Line 2: Attendance statistics */}
          <div className="flex flex-wrap items-center justify-start gap-x-6 gap-y-1 text-blue-900 font-bold">
            <div className="flex items-center gap-1.5">
              <span>អវត្តមានមានច្បាប់</span>
              <input
                type="text"
                value={excusedAbsence}
                onChange={(e) => setExcusedAbsence(e.target.value)}
                className="w-8 text-center text-red-600 font-mono focus:outline-none border-b border-dotted border-slate-400"
              />
            </div>

            <div className="flex items-center gap-1.5">
              <span>អត់ច្បាប់</span>
              <input
                type="text"
                value={unexcusedAbsence}
                onChange={(e) => setUnexcusedAbsence(e.target.value)}
                className="w-8 text-center text-red-600 font-mono focus:outline-none border-b border-dotted border-slate-400"
              />
            </div>

            <div className="flex items-center gap-1.5">
              <span>សរុប</span>
              <span className="text-red-600 font-mono">{totalAbsences}</span>
            </div>
          </div>

          {/* Line 3: Discipline */}
          <div className="flex items-center gap-2 text-blue-900 font-bold">
            <span>វិន័យនិងសីលធម៌</span>
            <input
              type="text"
              value={discipline}
              onChange={(e) => setDiscipline(e.target.value)}
              className="text-blue-700 font-bold focus:outline-none border-b border-dotted border-slate-400 w-20"
            />
          </div>
        </div>

        {/* Date and Signatures Block */}
        <div className="mt-6 pt-2 space-y-4 text-xs sm:text-sm text-blue-900 font-bold">
          {/* Lunar Date & Report Location */}
          <div className="text-right space-y-1">
            <input
              type="text"
              value={lunarDateText}
              onChange={(e) => setLunarDateText(e.target.value)}
              className="text-right text-blue-900 font-medium w-full max-w-sm bg-transparent focus:outline-none text-xs"
            />
            <div className="flex items-center justify-end gap-1">
              <span>ធ្វើនៅ</span>
              <input
                type="text"
                value={schoolLocation}
                onChange={(e) => setSchoolLocation(e.target.value)}
                className="text-blue-900 font-bold w-20 text-center focus:outline-none border-b border-dotted border-slate-400"
              />
              <span>{reportDateText}</span>
            </div>
            <div className="pr-12 pt-1 font-bold">
              <span>គ្រូបន្ទុកថ្នាក់</span>
            </div>
          </div>

          {/* Bottom Principal & Parents Feedback */}
          <div className="grid grid-cols-2 gap-6 pt-4">
            {/* Left: Principal approval */}
            <div className="space-y-1 text-center sm:text-left">
              <div>បានឃើញ និងឯកភាព</div>
              <div className="text-blue-800 font-bold">នាយកសាលា</div>
            </div>

            {/* Right: Parent comments and teacher signature */}
            <div className="space-y-2 text-right">
              <div className="text-blue-900">មតិរបស់អាណាព្យាបាល</div>
              <div className="space-y-1.5">
                <div className="border-b border-dotted border-slate-400 h-4"></div>
                <div className="border-b border-dotted border-slate-400 h-4"></div>
                <div className="border-b border-dotted border-slate-400 h-4"></div>
                <div className="border-b border-dotted border-slate-400 h-4"></div>
              </div>

              <div className="pt-8 pr-4">
                <input
                  type="text"
                  value={teacherName}
                  onChange={(e) => setTeacherName(e.target.value)}
                  className="text-right text-blue-900 font-bold w-36 focus:outline-none border-b border-dotted border-slate-400"
                />
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
