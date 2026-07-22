import React, { useState, useEffect } from 'react';
import ExcelHeader from './components/ExcelHeader';
import ExcelToolbar from './components/ExcelToolbar';
import ExcelFormulaBar from './components/ExcelFormulaBar';
import ExcelStats from './components/ExcelStats';
import ExcelTable from './components/ExcelTable';
import StudentCharts from './components/StudentCharts';
import MonthlySummaryTable from './components/MonthlySummaryTable';
import ReportCardModal from './components/ReportCardModal';
import AddStudentModal from './components/AddStudentModal';
import ImportModal from './components/ImportModal';
import { Student, SortOrder, SubjectScores } from './types';
import { getInitialStudents, computeStudentCalculations, computeRankings } from './data';
import { motion, AnimatePresence } from 'motion/react';
import { FileSpreadsheet, Eye, BarChart3, RotateCcw, Table } from 'lucide-react';

export default function App() {
  // Load initial students from LocalStorage or the mock data
  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('excel_student_scores_v1');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved student data', e);
      }
    }
    return getInitialStudents();
  });

  // Cell focus state
  const [focusedCell, setFocusedCell] = useState<{ rowIndex: number; colField: string } | null>(null);

  // Search/Report card states
  const [searchQuery, setSearchQuery] = useState('');
  const [searchedStudentId, setSearchedStudentId] = useState<string | null>(null);
  const [searchedStudent, setSearchedStudent] = useState<Student | null>(null);
  const [showReportCard, setShowReportCard] = useState(false);
  const [invalidSearchError, setInvalidSearchError] = useState<string | null>(null);

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);

  // Sorting state
  const [sortOrder, setSortOrder] = useState<SortOrder | null>(null);

  // Active sub-view tab: "sheet", "charts", or "summary"
  const [activeTab, setActiveTab] = useState<'sheet' | 'charts' | 'summary'>('sheet');

  // Save to local storage on student updates
  useEffect(() => {
    localStorage.setItem('excel_student_scores_v1', JSON.stringify(students));
  }, [students]);

  // Handle cell edit save from the table
  const handleUpdateStudentCell = (rowIndex: number, colField: string, value: string) => {
    const updatedRaw = students.map((student, idx) => {
      if (idx !== rowIndex) return student;

      const updatedStudent = { ...student };

      // If updating a score column
      if (['khmer', 'math', 'physics', 'chemistry', 'biology', 'english'].includes(colField)) {
        const scoreVal = value === '' ? 0 : Math.min(100, Math.max(0, Number(value)));
        const scoresCopy = { ...updatedStudent.scores, [colField]: scoreVal };
        const calculations = computeStudentCalculations(scoresCopy);
        
        return {
          ...updatedStudent,
          scores: scoresCopy,
          ...calculations
        };
      }

      // If updating basic details
      if (colField === 'studentId') {
        updatedStudent.studentId = value.trim();
      } else if (colField === 'name') {
        updatedStudent.name = value.trim();
      } else if (colField === 'gender') {
        updatedStudent.gender = value;
      }

      // Recalculate calculations to ensure score stats are valid
      const calculations = computeStudentCalculations(updatedStudent.scores);
      return {
        ...updatedStudent,
        ...calculations
      };
    });

    // Recompute ranks for the entire class after cell update
    const reRanked = computeRankings(updatedRaw);
    setStudents(reRanked);
  };

  // Handle live formula bar updates
  const handleFormulaValueChange = (value: string) => {
    if (!focusedCell) return;
    const { rowIndex, colField } = focusedCell;
    handleUpdateStudentCell(rowIndex, colField, value);
  };

  // Handle search submit by student ID
  const handleSearchById = (searchId: string) => {
    if (!searchId) {
      setInvalidSearchError('សូមបំពេញអត្តលេខមុននឹងស្វែងរក! (Enter ID to search)');
      return;
    }

    const found = students.find(
      s => s.studentId.trim().toUpperCase() === searchId.toUpperCase()
    );

    if (found) {
      setInvalidSearchError(null);
      setSearchedStudentId(found.id);
      setSearchedStudent(found);
      setShowReportCard(true);
    } else {
      setInvalidSearchError(`រកមិនឃើញសិស្សដែលមានអត្តលេខ "${searchId}" ឡើយ!`);
      setTimeout(() => setInvalidSearchError(null), 4000);
    }
  };

  // Sort student names alphabetically using Khmer locale-aware sort
  const handleSortAlphabetically = () => {
    const nextOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    const sorted = [...students].sort((a, b) => {
      const comparison = a.name.localeCompare(b.name, 'km', { sensitivity: 'base' });
      return nextOrder === 'asc' ? comparison : -comparison;
    });

    // Ranks remain linked to total scores, sorting doesn't change rank values, just row orders!
    setStudents(sorted);
    setSortOrder(nextOrder);
  };

  // Add new student
  const handleAddStudent = (data: {
    studentId: string;
    name: string;
    gender: string;
    scores: SubjectScores;
  }) => {
    const calculations = computeStudentCalculations(data.scores);
    const newStudent: Omit<Student, 'rank'> = {
      id: Date.now().toString(),
      studentId: data.studentId,
      name: data.name,
      gender: data.gender,
      scores: data.scores,
      ...calculations
    };

    // Append and compute rankings across all
    const reRanked = computeRankings([...students, newStudent]);
    setStudents(reRanked);
    setActiveTab('sheet');
  };

  // Import students from Excel / Sheet
  const handleImportStudents = (importedList: Student[], replace: boolean) => {
    if (replace) {
      setStudents(computeRankings(importedList));
    } else {
      const merged = [...students, ...importedList];
      setStudents(computeRankings(merged));
    }
    setActiveTab('sheet');
  };

  // Delete student
  const handleDeleteStudent = (id: string) => {
    const filtered = students.filter(s => s.id !== id);
    const reRanked = computeRankings(filtered);
    setStudents(reRanked);

    // Clear focus if focused was deleted
    if (focusedCell !== null) {
      const studentIndex = students.findIndex(s => s.id === id);
      if (focusedCell.rowIndex === studentIndex) {
        setFocusedCell(null);
      }
    }
  };

  // Export spreadsheet data to CSV with UTF-8 BOM so Excel opens Khmer characters correctly
  const handleExportCSV = () => {
    const headers = [
      'ល.រ (No.)',
      'អត្តលេខ (Student ID)',
      'ឈ្មោះសិស្ស (Student Name)',
      'ភេទ (Gender)',
      'ភាសាខ្មែរ (Khmer)',
      'គណិតវិទ្យា (Math)',
      'រូបវិទ្យា (Physics)',
      'គីមីវិទ្យា (Chemistry)',
      'ជីវវិទ្យា (Biology)',
      'អង់គ្លេស (English)',
      'ពិន្ទុសរុប (Total Score)',
      'មធ្យមភាគ (Average)',
      'និទ្ទេស (Grade)',
      'ចំណាត់ថ្នាក់ (Rank)'
    ];

    const rows = students.map((s, index) => [
      index + 1,
      `"${s.studentId}"`,
      `"${s.name}"`,
      `"${s.gender}"`,
      s.scores.khmer,
      s.scores.math,
      s.scores.physics,
      s.scores.chemistry,
      s.scores.biology,
      s.scores.english,
      s.totalScore,
      s.average,
      `"${s.grade}"`,
      s.rank
    ]);

    const csvContent = 
      '\uFEFF' + // UTF-8 Byte Order Mark (BOM) to force Excel to read Khmer text correctly
      [headers.join(','), ...rows.map(e => e.join(','))].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'Student_Scores_Excel_Report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Reset to default mock students
  const handleResetData = () => {
    if (confirm('តើអ្នកចង់កំណត់ទិន្នន័យឡើងវិញទៅជាទិន្នន័យគំរូដើមឬ? (Are you sure you want to reset to initial mock data?)')) {
      const initial = getInitialStudents();
      setStudents(initial);
      setFocusedCell(null);
      setSearchedStudentId(null);
      setSortOrder(null);
      localStorage.removeItem('excel_student_scores_v1');
    }
  };

  // Generate next suggested student ID
  const getNextSuggestedId = () => {
    if (students.length === 0) return 'ST-001';
    
    // Find highest ID number in the ST-XXX sequence
    const ids = students
      .map(s => {
        const match = s.studentId.match(/ST-(\d+)/i);
        return match ? parseInt(match[1], 10) : 0;
      })
      .filter(num => num > 0);

    const maxId = ids.length > 0 ? Math.max(...ids) : students.length;
    const nextNum = maxId + 1;
    return `ST-${String(nextNum).padStart(3, '0')}`;
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800 selection:bg-blue-100 antialiased" id="root-container">
      {/* Excel Header */}
      <ExcelHeader />

      {/* Excel Operations Toolbar */}
      <ExcelToolbar
        students={students}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearch={handleSearchById}
        onSortAlphabetically={handleSortAlphabetically}
        sortOrder={sortOrder}
        onAddStudent={() => setShowAddModal(true)}
        onImportClick={() => setShowImportModal(true)}
        onResetData={handleResetData}
        invalidSearchError={invalidSearchError}
      />

      {/* Formula Bar */}
      <ExcelFormulaBar
        focusedCell={focusedCell}
        students={students}
        onFormulaValueChange={handleFormulaValueChange}
      />

      {/* Main Dashboard Stats cards */}
      <ExcelStats students={students} />

      {/* Tabs Selector for Grid vs Visual Charts vs Monthly Summary */}
      <div className="px-6 pb-2 border-b border-slate-200 bg-slate-50 flex items-center justify-between" id="tab-nav">
        <div className="flex gap-1.5 bg-slate-200/65 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('sheet')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-md transition cursor-pointer ${
              activeTab === 'sheet'
                ? 'bg-white text-blue-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-800'
            }`}
            id="tab-sheet-view"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>តារាងបញ្ជីពិន្ទុ (Spreadsheet)</span>
          </button>
          <button
            onClick={() => setActiveTab('summary')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-md transition cursor-pointer ${
              activeTab === 'summary'
                ? 'bg-white text-blue-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-800'
            }`}
            id="tab-summary-view"
          >
            <Table className="w-4 h-4" />
            <span>តារាងសរុបរួមប្រចាំខែ (Monthly Summary)</span>
          </button>
          <button
            onClick={() => setActiveTab('charts')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-md transition cursor-pointer ${
              activeTab === 'charts'
                ? 'bg-white text-blue-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-800'
            }`}
            id="tab-charts-view"
          >
            <BarChart3 className="w-4 h-4" />
            <span>ក្រាហ្វិកវិភាគ (Analytics Charts)</span>
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-2">
          {focusedCell && activeTab === 'sheet' && (
            <div className="text-xs bg-blue-50 text-blue-700 py-1.5 px-3 rounded-lg border border-blue-200 font-medium">
              ក្រឡាសកម្ម៖ <span className="font-mono font-bold">ជួរ {focusedCell.rowIndex + 3}</span>
            </div>
          )}
        </div>
      </div>

      {/* Dynamic Tab Body */}
      <main className="flex-1 flex flex-col">
        {activeTab === 'sheet' ? (
          <ExcelTable
            students={students}
            focusedCell={focusedCell}
            setFocusedCell={setFocusedCell}
            onUpdateStudentCell={handleUpdateStudentCell}
            onDeleteStudent={handleDeleteStudent}
            searchedStudentId={searchedStudentId}
            setSearchedStudentId={setSearchedStudentId}
          />
        ) : activeTab === 'summary' ? (
          <MonthlySummaryTable students={students} />
        ) : (
          <div className="py-6">
            <StudentCharts students={students} />
          </div>
        )}
      </main>

      {/* Visual Modals Section */}
      <AnimatePresence>
        {/* Report Card Modal */}
        {showReportCard && searchedStudent && (
          <ReportCardModal
            student={searchedStudent}
            onClose={() => {
              setShowReportCard(false);
              setSearchedStudent(null);
            }}
          />
        )}

        {/* Add Student Modal */}
        {showAddModal && (
          <AddStudentModal
            isOpen={showAddModal}
            onClose={() => setShowAddModal(false)}
            onAddStudent={handleAddStudent}
            nextSuggestedId={getNextSuggestedId()}
          />
        )}

        {/* Import Students Modal */}
        {showImportModal && (
          <ImportModal
            isOpen={showImportModal}
            onClose={() => setShowImportModal(false)}
            onImport={handleImportStudents}
          />
        )}
      </AnimatePresence>

      {/* Footer copyright info */}
      <footer className="bg-slate-800 text-slate-400 py-4 px-6 text-center border-t border-slate-700 text-xs font-mono select-none" id="excel-footer">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© ២០២៦ រក្សាសិទ្ធិដោយប្រព័ន្ធគ្រប់គ្រងសិស្ស Excel</p>
          <p className="text-slate-500 text-[10px]">Geometric Balance Theme • Powered by React & Tailwind v4</p>
        </div>
      </footer>
    </div>
  );
}
