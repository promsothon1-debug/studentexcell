import React, { useState, useEffect, useRef } from 'react';
import { Trash2, AlertCircle, Sparkles, CheckSquare, Square, X } from 'lucide-react';
import { Student, SortField, SortOrder } from '../types';
import DeleteConfirmModal from './DeleteConfirmModal';

interface ExcelTableProps {
  students: Student[];
  focusedCell: { rowIndex: number; colField: string } | null;
  setFocusedCell: (cell: { rowIndex: number; colField: string } | null) => void;
  onUpdateStudentCell: (rowIndex: number, colField: string, value: string) => void;
  onDeleteStudent: (id: string) => void;
  onDeleteStudents?: (ids: string[]) => void;
  searchedStudentId: string | null;
  setSearchedStudentId: (id: string | null) => void;
}

const COLUMNS = [
  { field: 'no', label: 'ល.រ', letter: 'A', width: 'w-14 min-w-[56px]', readOnly: true },
  { field: 'studentId', label: 'អត្តលេខ', letter: 'B', width: 'w-28 min-w-[112px]', readOnly: false },
  { field: 'name', label: 'ឈ្មោះសិស្ស', letter: 'C', width: 'w-44 min-w-[176px]', readOnly: false },
  { field: 'gender', label: 'ភេទ', letter: 'D', width: 'w-24 min-w-[96px]', readOnly: false },
  { field: 'khmer', label: 'ភាសាខ្មែរ', letter: 'E', width: 'w-24 min-w-[96px]', readOnly: false, isScore: true },
  { field: 'math', label: 'គណិតវិទ្យា', letter: 'F', width: 'w-24 min-w-[96px]', readOnly: false, isScore: true },
  { field: 'physics', label: 'រូបវិទ្យា', letter: 'G', width: 'w-24 min-w-[96px]', readOnly: false, isScore: true },
  { field: 'chemistry', label: 'គីមីវិទ្យា', letter: 'H', width: 'w-24 min-w-[96px]', readOnly: false, isScore: true },
  { field: 'biology', label: 'ជីវវិទ្យា', letter: 'I', width: 'w-24 min-w-[96px]', readOnly: false, isScore: true },
  { field: 'english', label: 'អង់គ្លេស', letter: 'J', width: 'w-24 min-w-[96px]', readOnly: false, isScore: true },
  { field: 'totalScore', label: 'សរុប', letter: 'K', width: 'w-28 min-w-[112px]', readOnly: true, isComputed: true },
  { field: 'average', label: 'មធ្យមភាគ', letter: 'L', width: 'w-28 min-w-[112px]', readOnly: true, isComputed: true },
  { field: 'grade', label: 'និទ្ទេស', letter: 'M', width: 'w-24 min-w-[96px]', readOnly: true, isComputed: true },
  { field: 'rank', label: 'ចំណាត់ថ្នាក់', letter: 'N', width: 'w-28 min-w-[112px]', readOnly: true, isComputed: true },
];

export default function ExcelTable({
  students,
  focusedCell,
  setFocusedCell,
  onUpdateStudentCell,
  onDeleteStudent,
  onDeleteStudents,
  searchedStudentId,
  setSearchedStudentId
}: ExcelTableProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [studentsToDeleteModal, setStudentsToDeleteModal] = useState<Student[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const tableContainerRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<Record<string, HTMLTableRowElement | null>>({});

  // Selection handlers
  const handleToggleSelectAll = () => {
    if (selectedIds.length === students.length && students.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(students.map((s) => s.id));
    }
  };

  const handleToggleSelectRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleOpenDeleteSingle = (student: Student) => {
    setStudentsToDeleteModal([student]);
    setIsDeleteModalOpen(true);
  };

  const handleOpenDeleteSelected = () => {
    const selectedStudents = students.filter((s) => selectedIds.includes(s.id));
    if (selectedStudents.length === 0) return;
    setStudentsToDeleteModal(selectedStudents);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = (ids: string[]) => {
    if (onDeleteStudents) {
      onDeleteStudents(ids);
    } else {
      ids.forEach((id) => onDeleteStudent(id));
    }
    setSelectedIds((prev) => prev.filter((id) => !ids.includes(id)));
  };

  // Calculations for summary row
  const getSubjectAverage = (field: string) => {
    if (students.length === 0) return '0.0';
    const sum = students.reduce((acc, s) => {
      return acc + (Number(s.scores[field as keyof typeof s.scores]) || 0);
    }, 0);
    return (sum / students.length).toFixed(1);
  };

  const getClassTotalScoreAverage = () => {
    if (students.length === 0) return '0.0';
    const sum = students.reduce((acc, s) => acc + (s.totalScore || 0), 0);
    return (sum / students.length).toFixed(1);
  };

  const getClassOverallAverage = () => {
    if (students.length === 0) return '0.0';
    const sum = students.reduce((acc, s) => acc + (s.average || 0), 0);
    return (sum / students.length).toFixed(1);
  };

  // Auto-scroll and highlight searched row
  useEffect(() => {
    if (searchedStudentId) {
      const row = rowRefs.current[searchedStudentId];
      if (row) {
        row.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // Flash the cell focus on Name
        const sIndex = students.findIndex(s => s.id === searchedStudentId);
        if (sIndex !== -1) {
          setFocusedCell({ rowIndex: sIndex, colField: 'studentId' });
        }
      }
      
      // Auto fade out the search alert after 5s
      const timer = setTimeout(() => {
        setSearchedStudentId(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [searchedStudentId, students, setFocusedCell, setSearchedStudentId]);

  // Handle cell click
  const handleCellClick = (rowIndex: number, colField: string) => {
    if (focusedCell?.rowIndex === rowIndex && focusedCell?.colField === colField) {
      // Second click on already focused cell enters editing mode (Excel style)
      const column = COLUMNS.find(c => c.field === colField);
      if (column && !column.readOnly) {
        startEditing(rowIndex, colField);
      }
    } else {
      setFocusedCell({ rowIndex, colField });
      setIsEditing(false);
    }
  };

  // Start cell editing
  const startEditing = (rowIndex: number, colField: string) => {
    const student = students[rowIndex];
    if (!student) return;

    let value = '';
    if (['khmer', 'math', 'physics', 'chemistry', 'biology', 'english'].includes(colField)) {
      value = String(student.scores[colField as keyof typeof student.scores] ?? 0);
    } else {
      value = String(student[colField as keyof Student] ?? '');
    }

    setEditValue(value);
    setIsEditing(true);
  };

  // Save changes
  const saveEditing = () => {
    if (!focusedCell) return;
    const { rowIndex, colField } = focusedCell;
    onUpdateStudentCell(rowIndex, colField, editValue);
    setIsEditing(false);
  };

  // Keyboard navigation inside the Excel spreadsheet
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!focusedCell) return;
      const { rowIndex, colField } = focusedCell;
      const fields = COLUMNS.map(c => c.field);
      const colIndex = fields.indexOf(colField);

      if (isEditing) {
        // Keyboard inside editing mode
        if (e.key === 'Enter') {
          e.preventDefault();
          saveEditing();
          // Move down to next student row (very Excel-like!)
          if (rowIndex < students.length - 1) {
            setFocusedCell({ rowIndex: rowIndex + 1, colField });
          }
        } else if (e.key === 'Escape') {
          e.preventDefault();
          setIsEditing(false);
        }
        return;
      }

      // Keyboard navigation outside editing mode
      let targetRow = rowIndex;
      let targetColIndex = colIndex;
      let handled = false;

      switch (e.key) {
        case 'ArrowUp':
          targetRow = Math.max(0, rowIndex - 1);
          handled = true;
          break;
        case 'ArrowDown':
          targetRow = Math.min(students.length - 1, rowIndex + 1);
          handled = true;
          break;
        case 'ArrowLeft':
          targetColIndex = Math.max(0, colIndex - 1);
          handled = true;
          break;
        case 'ArrowRight':
          targetColIndex = Math.min(COLUMNS.length - 1, colIndex + 1);
          handled = true;
          break;
        case 'Enter':
          e.preventDefault();
          const colInfo = COLUMNS[colIndex];
          if (colInfo && !colInfo.readOnly) {
            startEditing(rowIndex, colField);
          }
          handled = true;
          break;
        case 'Tab':
          e.preventDefault();
          if (e.shiftKey) {
            targetColIndex = Math.max(0, colIndex - 1);
          } else {
            targetColIndex = Math.min(COLUMNS.length - 1, colIndex + 1);
          }
          handled = true;
          break;
        case 'Delete':
        case 'Backspace':
          const activeCol = COLUMNS[colIndex];
          if (activeCol && !activeCol.readOnly) {
            onUpdateStudentCell(rowIndex, colField, activeCol.isScore ? '0' : '');
          }
          handled = true;
          break;
        default:
          break;
      }

      if (handled) {
        setFocusedCell({ rowIndex: targetRow, colField: COLUMNS[targetColIndex].field });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [focusedCell, isEditing, editValue, students]);

  return (
    <div className="flex-1 overflow-auto bg-slate-100 p-4 border-b border-slate-200" id="excel-table-section">
      <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden" ref={tableContainerRef}>
        
        {/* Selection Bar for Batch Deletion */}
        {selectedIds.length > 0 ? (
          <div className="bg-rose-50 border-b border-rose-200 py-2.5 px-4 flex items-center justify-between text-xs animate-in fade-in">
            <div className="flex items-center gap-2 text-rose-800 font-bold">
              <CheckSquare className="w-4.5 h-4.5 text-rose-600" />
              <span>បានជ្រើសរើសសិស្សចំនួន <span className="font-mono text-sm underline">{selectedIds.length}</span> នាក់</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleOpenDeleteSelected}
                className="bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-bold px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition cursor-pointer shadow-xs"
                id="btn-delete-selected-students"
              >
                <Trash2 className="w-4 h-4" />
                <span>លុបសិស្សដែលជ្រើសរើស ({selectedIds.length})</span>
              </button>
              <button
                onClick={() => setSelectedIds([])}
                className="bg-white hover:bg-slate-100 text-slate-700 font-semibold px-3 py-1.5 rounded-lg border border-slate-300 transition cursor-pointer"
              >
                បោះបង់ (Cancel)
              </button>
            </div>
          </div>
        ) : (
          /* Quick hint bar */
          <div className="bg-slate-50 border-b border-slate-200 py-1.5 px-4 flex items-center justify-between text-[11px] text-slate-500">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span>ចុចពីរដង (Double-Click) ឬសង្កត់ Enter ដើម្បីកែសម្រួលក្រឡា។ ប្រើប្រអប់គ្រីស (Checkbox) ដើម្បីជ្រើសរើសលុបសិស្សច្រើននាក់។</span>
            </div>
            {searchedStudentId && (
              <span className="text-blue-600 font-bold animate-pulse">
                បានរកឃើញសិស្សអត្តលេខរៀង!
              </span>
            )}
          </div>
        )}

        {/* Scrollable sheet container */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse table-fixed min-w-[1200px]" id="student-spreadsheet">
            <thead>
              {/* Excel Column Letters Header Row */}
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="w-12 bg-slate-150 text-center text-[10px] font-mono text-slate-400 border-r border-slate-200 select-none py-1">
                  &nbsp;
                </th>
                {COLUMNS.map((col, index) => (
                  <th 
                    key={`letter-${index}`} 
                    className={`${col.width} text-center text-[10px] font-mono text-slate-400 font-bold border-r border-slate-200 select-none py-1 bg-slate-100`}
                  >
                    {col.letter}
                  </th>
                ))}
                <th className="w-16 bg-slate-100 text-center text-[10px] font-mono text-slate-400 select-none py-1">
                  O
                </th>
              </tr>

              {/* Data Headers Row */}
              <tr className="bg-blue-600/5 text-slate-700 border-b border-slate-300 font-medium text-xs">
                {/* Select All Checkbox header */}
                <th className="bg-slate-100 border-r border-slate-200 text-center select-none p-2 w-12">
                  <input
                    type="checkbox"
                    checked={students.length > 0 && selectedIds.length === students.length}
                    onChange={handleToggleSelectAll}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer w-4 h-4"
                    title="ជ្រើសរើសសិស្សទាំងអស់ / Deselect All"
                  />
                </th>
                
                {COLUMNS.map((col, index) => (
                  <th 
                    key={`label-${index}`} 
                    className={`${col.width} px-3 py-3 font-semibold text-center select-none border-r border-slate-200 text-slate-800 ${
                      col.isScore ? 'bg-amber-50/40 text-amber-950' : 
                      col.isComputed ? 'bg-blue-50/40 text-blue-950 font-bold' : ''
                    }`}
                  >
                    <div className="truncate text-center">
                      {col.label}
                    </div>
                  </th>
                ))}
                <th className="w-16 py-3 px-2 text-center text-rose-800 select-none bg-rose-50/20 font-bold">
                  លុប
                </th>
              </tr>
            </thead>
            
            <tbody>
              {students.length === 0 ? (
                <tr>
                  <td colSpan={COLUMNS.length + 2} className="py-12 text-center text-slate-400 font-medium text-sm">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <AlertCircle className="w-8 h-8 text-slate-300" />
                      <span>គ្មានទិន្នន័យសិស្សទេ។ សូមចុច "បន្ថែមសិស្ស" ដើម្បីបង្កើតថ្មី។</span>
                    </div>
                  </td>
                </tr>
              ) : (
                students.map((student, rowIndex) => {
                  const isSearched = searchedStudentId === student.id;
                  const isSelected = selectedIds.includes(student.id);
                  
                  return (
                    <tr 
                      key={student.id} 
                      ref={el => { rowRefs.current[student.id] = el; }}
                      className={`group transition-colors border-b border-slate-200 text-xs ${
                        isSelected
                          ? 'bg-rose-50/80 hover:bg-rose-100/80 font-medium'
                          : isSearched 
                          ? 'bg-amber-100/60 ring-2 ring-inset ring-amber-400 animate-pulse duration-1000' 
                          : 'hover:bg-slate-50/50 even:bg-slate-50/30'
                      }`}
                      id={`row-student-${student.id}`}
                    >
                      {/* Left Excel Row Number with Checkbox */}
                      <td className="bg-slate-100 font-mono text-[10px] font-bold text-slate-500 text-center select-none border-r border-slate-200 py-2 px-1">
                        <div className="flex items-center justify-center gap-1">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleToggleSelectRow(student.id)}
                            className="rounded border-slate-300 text-rose-600 focus:ring-rose-500 cursor-pointer w-3.5 h-3.5"
                          />
                          <span className="text-[10px] text-slate-400">{rowIndex + 3}</span>
                        </div>
                      </td>

                      {COLUMNS.map((col) => {
                        const isFocused = focusedCell?.rowIndex === rowIndex && focusedCell?.colField === col.field;
                        const cellId = `cell-${rowIndex}-${col.field}`;

                        // Extract display cell value
                        let cellValue = '';
                        if (col.field === 'no') {
                          cellValue = String(rowIndex + 1);
                        } else if (col.isScore) {
                          cellValue = String(student.scores[col.field as keyof typeof student.scores] ?? 0);
                        } else {
                          cellValue = String(student[col.field as keyof Student] ?? '');
                        }

                        // Determine cell style rules
                        let cellAlignment = 'text-center font-mono';
                        if (col.field === 'name') {
                          cellAlignment = 'text-left font-sans font-medium text-slate-800 pl-3';
                        } else if (col.field === 'studentId') {
                          cellAlignment = 'text-center font-mono font-bold text-blue-600';
                        } else if (col.field === 'gender') {
                          cellAlignment = 'text-center font-sans';
                        } else if (col.field === 'grade') {
                          // Style based on Grade letters
                          const gradeColors: Record<string, string> = {
                            'A': 'text-emerald-600 font-black',
                            'B': 'text-teal-600 font-bold',
                            'C': 'text-indigo-600 font-bold',
                            'D': 'text-amber-600 font-bold',
                            'E': 'text-orange-500 font-medium',
                            'F': 'text-rose-600 font-bold bg-rose-50/50'
                          };
                          cellAlignment = `text-center font-mono font-bold ${gradeColors[student.grade] || 'text-slate-500'}`;
                        } else if (col.field === 'rank') {
                          cellAlignment = 'text-center font-mono font-bold text-blue-600';
                        } else if (col.isScore) {
                          const valNum = Number(cellValue);
                          if (valNum < 50) {
                            cellAlignment = 'text-center font-mono text-rose-500 bg-rose-50/20';
                          } else {
                            cellAlignment = 'text-center font-mono text-slate-700';
                          }
                        }

                        // Render Cell
                        return (
                          <td 
                            key={col.field}
                            id={cellId}
                            onClick={() => handleCellClick(rowIndex, col.field)}
                            onDoubleClick={() => {
                              if (!col.readOnly) {
                                startEditing(rowIndex, col.field);
                              }
                            }}
                            className={`border-r border-slate-200 cursor-cell relative select-none truncate ${col.width} ${cellAlignment} ${
                              isFocused ? 'cell-active' : ''
                            } ${isSearched ? 'bg-amber-100/30' : ''}`}
                          >
                            {isEditing && isFocused ? (
                              col.field === 'gender' ? (
                                <select
                                  value={editValue}
                                  onChange={(e) => setEditValue(e.target.value)}
                                  onBlur={saveEditing}
                                  autoFocus
                                  className="absolute inset-0 w-full h-full px-1 border-none focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-xs select-none"
                                >
                                  <option value="ប្រុស">ប្រុស</option>
                                  <option value="ស្រី">ស្រី</option>
                                </select>
                              ) : (
                                <input
                                  type={col.isScore ? 'number' : 'text'}
                                  value={editValue}
                                  onChange={(e) => {
                                    if (col.isScore) {
                                      // Validate score input is within [0, 100]
                                      const num = Number(e.target.value);
                                      if (e.target.value === '' || (num >= 0 && num <= 100)) {
                                        setEditValue(e.target.value);
                                      }
                                    } else {
                                      setEditValue(e.target.value);
                                    }
                                  }}
                                  onBlur={saveEditing}
                                  autoFocus
                                  className="absolute inset-0 w-full h-full px-2 py-1 border-none focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white font-sans text-xs"
                                />
                              )
                            ) : (
                              col.field === 'gender' ? (
                                <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-medium ${
                                  cellValue === 'ស្រី' 
                                    ? 'bg-pink-100 text-pink-700 border border-pink-200' 
                                    : 'bg-blue-100 text-blue-700 border border-blue-200'
                                }`}>
                                  {cellValue}
                                </span>
                              ) : (
                                <span>{cellValue}</span>
                              )
                            )}
                          </td>
                        );
                      })}

                      {/* Delete Action button */}
                      <td className="w-16 py-1 px-2 text-center">
                        <button
                          onClick={() => handleOpenDeleteSingle(student)}
                          className="p-1.5 hover:bg-rose-100 hover:text-rose-600 active:bg-rose-200 rounded text-slate-400 transition cursor-pointer inline-flex items-center justify-center"
                          title="លុបជួរដេកសិស្ស"
                          id={`btn-delete-student-${student.id}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
            <tfoot className="border-t-2 border-slate-300 bg-slate-50 font-bold text-xs select-none shadow-xs sticky bottom-0 z-10">
              <tr id="excel-table-summary-row" className="bg-slate-100 hover:bg-slate-100/90 text-slate-800 border-b border-slate-300">
                {/* Excel Row Number Column */}
                <td className="bg-slate-200 font-mono text-[10px] font-black text-slate-600 text-center select-none border-r border-slate-300 py-2.5">
                  {students.length > 0 ? students.length + 3 : '∑'}
                </td>

                {COLUMNS.map((col) => {
                  if (col.field === 'no') {
                    return (
                      <td key="sum-no" className="border-r border-slate-300 text-center font-mono text-slate-500 py-2.5">
                        ∑
                      </td>
                    );
                  }
                  if (col.field === 'studentId') {
                    return (
                      <td key="sum-studentId" className="border-r border-slate-300 text-center font-mono text-slate-400 py-2.5">
                        -
                      </td>
                    );
                  }
                  if (col.field === 'name') {
                    return (
                      <td key="sum-name" className="border-r border-slate-300 text-left font-sans font-bold text-slate-900 pl-3 py-2.5">
                        មធ្យមភាគថ្នាក់ (Class Avg)
                      </td>
                    );
                  }
                  if (col.field === 'gender') {
                    return (
                      <td key="sum-gender" className="border-r border-slate-300 text-center font-sans text-slate-400 py-2.5">
                        -
                      </td>
                    );
                  }
                  if (col.isScore) {
                    const avgVal = getSubjectAverage(col.field);
                    const numVal = Number(avgVal);
                    return (
                      <td 
                        key={`sum-${col.field}`} 
                        id={`cell-avg-${col.field}`}
                        className={`border-r border-slate-300 text-center font-mono font-extrabold py-2.5 bg-blue-50/70 ${
                          numVal < 50 ? 'text-rose-600' : 'text-blue-800'
                        }`}
                        title={`ពិន្ទុមធ្យមថ្នាក់សម្រាប់ ${col.label}: ${avgVal}`}
                      >
                        {avgVal}
                      </td>
                    );
                  }
                  if (col.field === 'totalScore') {
                    const classAvgTotal = getClassTotalScoreAverage();
                    return (
                      <td key="sum-totalScore" id="cell-avg-totalScore" className="border-r border-slate-300 text-center font-mono font-extrabold text-blue-900 bg-blue-100/60 py-2.5">
                        {classAvgTotal}
                      </td>
                    );
                  }
                  if (col.field === 'average') {
                    const classOverallAvg = getClassOverallAverage();
                    return (
                      <td key="sum-average" id="cell-avg-overallAverage" className="border-r border-slate-300 text-center font-mono font-extrabold text-blue-900 bg-blue-100/60 py-2.5">
                        {classOverallAvg}
                      </td>
                    );
                  }
                  return (
                    <td key={`sum-${col.field}`} className="border-r border-slate-300 text-center font-mono text-slate-400 py-2.5">
                      -
                    </td>
                  );
                })}

                {/* Actions column spacer */}
                <td className="w-16 py-2.5 text-center text-slate-400 font-mono">
                  -
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        studentsToDelete={studentsToDeleteModal}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirmDelete={handleConfirmDelete}
      />
    </div>
  );
}
