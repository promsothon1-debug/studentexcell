import React, { useEffect, useState } from 'react';
import { Student } from '../types';

interface ExcelFormulaBarProps {
  focusedCell: { rowIndex: number; colField: string } | null;
  students: Student[];
  onFormulaValueChange: (value: string) => void;
}

export default function ExcelFormulaBar({
  focusedCell,
  students,
  onFormulaValueChange
}: ExcelFormulaBarProps) {
  const [displayValue, setDisplayValue] = useState('');
  const [address, setAddress] = useState('');
  const [isFormula, setIsFormula] = useState(false);

  useEffect(() => {
    if (!focusedCell) {
      setAddress('');
      setDisplayValue('សូមជ្រើសរើសក្រឡាណាមួយដើម្បីកែសម្រួល... (Select a cell...)');
      setIsFormula(false);
      return;
    }

    const { rowIndex, colField } = focusedCell;
    const student = students[rowIndex];
    if (!student) return;

    // Excel starts rows at 1. Since we have headers, let's count:
    // Header is row 1. Column labels is row 2. First student is row 3.
    const excelRow = rowIndex + 3;

    // Map fields to Excel Columns
    const colMap: Record<string, { col: string; title: string }> = {
      no: { col: 'A', title: 'លេខរៀង' },
      studentId: { col: 'B', title: 'អត្តលេខ' },
      name: { col: 'C', title: 'ឈ្មោះសិស្ស' },
      gender: { col: 'D', title: 'ភេទ' },
      khmer: { col: 'E', title: 'ភាសាខ្មែរ' },
      math: { col: 'F', title: 'គណិតវិទ្យា' },
      physics: { col: 'G', title: 'រូបវិទ្យា' },
      chemistry: { col: 'H', title: 'គីមីវិទ្យា' },
      biology: { col: 'I', title: 'ជីវវិទ្យា' },
      english: { col: 'J', title: 'អង់គ្លេស' },
      totalScore: { col: 'K', title: 'សរុប' },
      average: { col: 'L', title: 'មធ្យមភាគ' },
      grade: { col: 'M', title: 'និទ្ទេស' },
      rank: { col: 'N', title: 'ចំណាត់ថ្នាក់' }
    };

    const colInfo = colMap[colField] || { col: '?', title: 'ចម្លែក' };
    setAddress(`${colInfo.col}${excelRow}`);

    // Get current cell value
    let value = '';
    let formula = '';

    if (colField === 'no') {
      value = String(rowIndex + 1);
    } else if (colField === 'studentId') {
      value = student.studentId;
    } else if (colField === 'name') {
      value = student.name;
    } else if (colField === 'gender') {
      value = student.gender;
    } else if (['khmer', 'math', 'physics', 'chemistry', 'biology', 'english'].includes(colField)) {
      value = String(student.scores[colField as keyof typeof student.scores] ?? 0);
    } else if (colField === 'totalScore') {
      value = String(student.totalScore);
      formula = `=SUM(E${excelRow}:J${excelRow})`;
    } else if (colField === 'average') {
      value = String(student.average);
      formula = `=AVERAGE(E${excelRow}:J${excelRow})`;
    } else if (colField === 'grade') {
      value = student.grade;
      formula = `=IF(L${excelRow}>=90,"A",IF(L${excelRow}>=80,"B",IF(L${excelRow}>=70,"C",IF(L${excelRow}>=60,"D",IF(L${excelRow}>=50,"E","F")))))`;
    } else if (colField === 'rank') {
      value = String(student.rank);
      formula = `=RANK(K${excelRow}, $K$3:$K$${students.length + 2})`;
    }

    if (formula) {
      setDisplayValue(formula);
      setIsFormula(true);
    } else {
      setDisplayValue(value);
      setIsFormula(false);
    }
  }, [focusedCell, students]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isFormula || !focusedCell) return; // Prevent editing calculated formulas directly via formula bar (makes it realistic!)
    setDisplayValue(e.target.value);
    onFormulaValueChange(e.target.value);
  };

  return (
    <div className="bg-white border-b border-slate-200 py-1.5 px-4 flex items-stretch gap-1 font-mono text-xs select-none" id="excel-formula-bar">
      {/* Active Cell Address */}
      <div 
        className="flex items-center justify-center bg-blue-50 border border-blue-200 rounded px-3 py-1.5 min-w-[60px] font-extrabold text-blue-700 text-center select-none"
        title="អាសយដ្ឋានក្រឡាសកម្ម (Active Cell Address)"
      >
        {address || 'A1'}
      </div>

      <div className="h-full border-r border-slate-300 mx-1"></div>

      {/* Formula Indicator 'fx' */}
      <div className="flex items-center text-slate-400 italic px-2 font-serif text-sm font-bold select-none">
        fx
      </div>

      {/* Input / Formula Display */}
      <input
        type="text"
        value={displayValue}
        onChange={handleChange}
        disabled={!focusedCell || isFormula}
        className={`flex-1 border border-slate-200 rounded px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-slate-50/30 ${
          isFormula ? 'text-slate-500 font-medium select-all cursor-not-allowed bg-slate-50' : 'text-slate-800'
        }`}
        id="input-formula-bar"
      />
    </div>
  );
}
