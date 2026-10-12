import React, { useState, useRef } from 'react';
import { 
  FileSpreadsheet, 
  Database, 
  Download, 
  Upload, 
  HardDrive, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  FileCode, 
  FileJson, 
  RefreshCw, 
  Trash2, 
  Plus, 
  Check, 
  ArrowDownToLine,
  ShieldCheck,
  FileText,
  Sparkles,
  School,
  BookOpen,
  Award,
  Users
} from 'lucide-react';
import { Student } from '../types';
import { 
  saveToExcelDatabaseFile, 
  exportOfficialTemplateFile,
  saveToJsonDatabaseFile, 
  saveToSqlDatabaseFile, 
  parseStorageFile, 
  StorageSnapshot 
} from '../utils/fileStorageUtils';
import { 
  getInitialStudents, 
  DEFAULT_TEACHER_PROFILE,
  SCHOOL_SUMMARY_DATA
} from '../data';

interface FileStorageManagerProps {
  students: Student[];
  onUpdateStudents: (newStudents: Student[]) => void;
  onResetToSample: () => void;
  activeFileName: string;
  setActiveFileName: (name: string) => void;
  lastSavedTime: string;
  setLastSavedTime: (time: string) => void;
  hasUnsavedChanges: boolean;
  setHasUnsavedChanges: (has: boolean) => void;
}

export default function FileStorageManager({
  students,
  onUpdateStudents,
  onResetToSample,
  activeFileName,
  setActiveFileName,
  lastSavedTime,
  setLastSavedTime,
  hasUnsavedChanges,
  setHasUnsavedChanges
}: FileStorageManagerProps) {
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [customNameInput, setCustomNameInput] = useState(activeFileName);
  const [isEditingName, setIsEditingName] = useState(false);
  const [snapshots, setSnapshots] = useState<StorageSnapshot[]>(() => {
    const saved = localStorage.getItem('excel_storage_snapshots_v1');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [
      {
        id: 'initial',
        timestamp: new Date().toLocaleTimeString('km-KH'),
        count: students.length,
        label: 'ទិន្នន័យដំបូងពេលបើកកម្មវិធី',
        data: students
      }
    ];
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Helper to flash success message
  const triggerSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setErrorMsg(null);
    setTimeout(() => setSuccessMsg(null), 4500);
  };

  // Helper to flash error message
  const triggerError = (msg: string) => {
    setErrorMsg(msg);
    setSuccessMsg(null);
    setTimeout(() => setErrorMsg(null), 5000);
  };

  // Add a local snapshot
  const createSnapshot = (label: string, data: Student[]) => {
    const newSnapshot: StorageSnapshot = {
      id: `snap-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('km-KH'),
      count: data.length,
      label,
      data
    };
    const updated = [newSnapshot, ...snapshots.slice(0, 4)];
    setSnapshots(updated);
    localStorage.setItem('excel_storage_snapshots_v1', JSON.stringify(updated));
  };

  // Set the official template file as the active data storage
  const handleUseTemplateAsStorage = () => {
    const templateStudents = getInitialStudents();
    const templateFileName = 'គំរូឯកសារផ្ទុកទិន្នន័យសិស្ស_វត្តចែង_ថ្នាក់ទី៦.xlsx';
    onUpdateStudents(templateStudents);
    setActiveFileName(templateFileName);
    setCustomNameInput(templateFileName);
    const nowStr = new Date().toLocaleTimeString('km-KH');
    setLastSavedTime(nowStr);
    setHasUnsavedChanges(false);
    createSnapshot(`បានកំណត់យកគំរូ File (${templateFileName}) ជាកន្លែងផ្ទុកទិន្នន័យ`, templateStudents);
    triggerSuccess(`✅ បានកំណត់យកគំរូ File "${templateFileName}" ជាកន្លែងផ្ទុកទិន្នន័យសិស្សសកម្មជោគជ័យ!`);
  };

  // Download official template file directly (.xlsx)
  const handleDownloadTemplateFile = () => {
    try {
      const fileName = exportOfficialTemplateFile();
      triggerSuccess(`✅ បានទាញយកគំរូ File "${fileName}" ជោគជ័យ!`);
    } catch (e: any) {
      triggerError(`ការទាញយកគំរូ File បរាជ័យ៖ ${e?.message || 'កំហុសបច្ចេកទេស'}`);
    }
  };

  // 1. Save to Excel (.xlsx)
  const handleSaveExcel = () => {
    try {
      const fileName = activeFileName.endsWith('.xlsx') ? activeFileName : `${activeFileName}.xlsx`;
      saveToExcelDatabaseFile(students, fileName);
      const nowStr = new Date().toLocaleTimeString('km-KH');
      setLastSavedTime(nowStr);
      setHasUnsavedChanges(false);
      createSnapshot(`បានរក្សាទុកជា File Excel (${fileName})`, students);
      triggerSuccess(`បានរក្សាទុកទិន្នន័យដោយជោគជ័យទៅក្នុងឯកសារ Excel៖ ${fileName}`);
    } catch (e: any) {
      triggerError(`ការរក្សាទុកទិន្នន័យបរាជ័យ៖ ${e?.message || 'កំហុសបច្ចេកទេស'}`);
    }
  };

  // 2. Save to JSON (.json)
  const handleSaveJson = () => {
    try {
      const baseName = activeFileName.replace(/\.[^/.]+$/, "");
      const fileName = `${baseName}_backup.json`;
      saveToJsonDatabaseFile(students, fileName);
      const nowStr = new Date().toLocaleTimeString('km-KH');
      setLastSavedTime(nowStr);
      createSnapshot(`បានទាញយក Backup JSON (${fileName})`, students);
      triggerSuccess(`បានទាញយកឯកសារ Backup JSON ដោយជោគជ័យ៖ ${fileName}`);
    } catch (e: any) {
      triggerError(`ការទាញយក JSON បរាជ័យ៖ ${e?.message || 'កំហុសបច្ចេកទេស'}`);
    }
  };

  // 3. Save to SQL (.sql)
  const handleSaveSql = () => {
    try {
      const baseName = activeFileName.replace(/\.[^/.]+$/, "");
      const fileName = `${baseName}_database_dump.sql`;
      saveToSqlDatabaseFile(students, fileName);
      triggerSuccess(`បានបង្កើត និងទាញយក SQL Script ដោយជោគជ័យ (PostgreSQL/MySQL Compatible)៖ ${fileName}`);
    } catch (e: any) {
      triggerError(`ការបង្កើត SQL បរាជ័យ៖ ${e?.message || 'កំហុសបច្ចេកទេស'}`);
    }
  };

  // 4. Handle File Loading / Upload
  const handleFileChange = async (file: File) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const { students: loadedStudents, fileName, format } = await parseStorageFile(file);
      createSnapshot(`បានប្តូរ File ទៅ៖ ${fileName}`, loadedStudents);
      onUpdateStudents(loadedStudents);
      setActiveFileName(fileName);
      setCustomNameInput(fileName);
      const nowStr = new Date().toLocaleTimeString('km-KH');
      setLastSavedTime(nowStr);
      setHasUnsavedChanges(false);
      triggerSuccess(`បានផ្ទុកទិន្នន័យចំនួន ${loadedStudents.length} នាក់ពីឯកសារ "${fileName}" (${format}) ដោយជោគជ័យ!`);
    } catch (err: any) {
      triggerError(err.message || 'មិនអាចអានឯកសារនេះបានឡើយ!');
    } finally {
      setLoading(false);
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  // Save updated file name
  const handleRenameFile = (e: React.FormEvent) => {
    e.preventDefault();
    if (customNameInput.trim()) {
      setActiveFileName(customNameInput.trim());
      setIsEditingName(false);
      triggerSuccess(`បានប្តូរឈ្មោះឯកសារផ្ទុកទិន្នន័យទៅជា៖ ${customNameInput.trim()}`);
    }
  };

  // Revert to snapshot
  const handleRevertSnapshot = (snap: StorageSnapshot) => {
    if (window.confirm(`តើអ្នកពិតជាចង់ត្រឡប់ទៅកំណែទិន្នន័យ "${snap.label}" (${snap.timestamp}) ដែលមានសិស្ស ${snap.count} នាក់មែនទេ?`)) {
      onUpdateStudents(snap.data);
      setHasUnsavedChanges(true);
      triggerSuccess(`បានត្រឡប់ទៅទិន្នន័យថតទុក "${snap.label}" រួចរាល់!`);
    }
  };

  // Clear all data
  const handleClearData = () => {
    if (window.confirm('⚠️ តើអ្នកពិតជាចង់សម្អាតទិន្នន័យសិស្សទាំងអស់មែនទេ? សកម្មភាពនេះនឹងលុបសិស្សទាំងអស់ចេញពីតារាង!')) {
      createSnapshot('បានសម្អាតទិន្នន័យទាំងអស់', []);
      onUpdateStudents([]);
      setHasUnsavedChanges(true);
      triggerSuccess('បានសម្អាតទិន្នន័យសិស្សទាំងអស់ក្នុងប្រព័ន្ធ!');
    }
  };

  const totalStudents = students.length;
  const passStudents = students.filter(s => s.average >= 50).length;
  const classAvg = totalStudents > 0 
    ? (students.reduce((a, b) => a + b.average, 0) / totalStudents).toFixed(2)
    : '0';

  return (
    <div className="py-6 px-4 sm:px-6 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-200" id="file-storage-manager">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none flex items-center pr-8">
          <Database className="w-80 h-80 text-white" />
        </div>

        <div className="relative z-10 space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-200 border border-blue-400/30 px-3 py-1 rounded-full text-xs font-semibold">
            <HardDrive className="w-3.5 h-3.5" />
            <span>កន្លែងផ្ទុកទិន្នន័យផ្ទាល់ខ្លួន (File-Based Data Storage System)</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            មជ្ឈមណ្ឌលផ្ទុកទិន្នន័យ (Data Storage Hub)
          </h2>
          
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            ប្រើប្រាស់ឯកសារ Excel (.xlsx) ជាមូលដ្ឋានទិន្នន័យចម្បងសម្រាប់រក្សាទុក គ្រប់គ្រង និងធ្វើសមកាលកម្មពិន្ទុសិស្ស។ លោកអ្នកអាចផ្ទុកទិន្នន័យពីឯកសារដែលមានស្រាប់ ឬរក្សាទុកឯកសារថ្មីដោយសុវត្ថិភាព។
          </p>
        </div>
      </div>

      {/* Alert Messages */}
      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 p-4 rounded-xl flex items-center gap-3 shadow-xs animate-in slide-in-from-top-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <p className="text-xs sm:text-sm font-semibold">{successMsg}</p>
        </div>
      )}

      {errorMsg && (
        <div className="bg-rose-50 border border-rose-300 text-rose-800 p-4 rounded-xl flex items-center gap-3 shadow-xs animate-in slide-in-from-top-2">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <p className="text-xs sm:text-sm font-semibold">{errorMsg}</p>
        </div>
      )}

      {/* Active Storage File Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="flex items-start sm:items-center gap-4">
            <div className="p-3.5 bg-emerald-100 text-emerald-700 rounded-xl">
              <FileSpreadsheet className="w-8 h-8" />
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">ឯកសារផ្ទុកទិន្នន័យបច្ចុប្បន្ន</span>
                {hasUnsavedChanges ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-100 border border-amber-300 px-2.5 py-0.5 rounded-full">
                    <Clock className="w-3 h-3 text-amber-600" />
                    មានទិន្នន័យថ្មីមិនទាន់ Save
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 rounded-full">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    បានរក្សាទុក (Synced & Safe)
                  </span>
                )}
              </div>

              {isEditingName ? (
                <form onSubmit={handleRenameFile} className="flex items-center gap-2 mt-1">
                  <input
                    type="text"
                    value={customNameInput}
                    onChange={(e) => setCustomNameInput(e.target.value)}
                    className="border border-blue-400 rounded-lg px-2.5 py-1 text-sm font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="ឈ្មោះឯកសារ (e.g. scores.xlsx)"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="bg-blue-600 text-white text-xs px-3 py-1.5 rounded-lg font-bold hover:bg-blue-700 cursor-pointer"
                  >
                    យល់ព្រម
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCustomNameInput(activeFileName);
                      setIsEditingName(false);
                    }}
                    className="text-xs text-slate-500 hover:text-slate-700 px-2"
                  >
                    បោះបង់
                  </button>
                </form>
              ) : (
                <div className="flex items-center gap-2 mt-0.5">
                  <h3 className="text-lg font-mono font-bold text-slate-800">{activeFileName}</h3>
                  <button
                    onClick={() => setIsEditingName(true)}
                    className="text-xs text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                  >
                    (ប្តូរឈ្មោះ)
                  </button>
                </div>
              )}

              <p className="text-xs text-slate-500 mt-0.5">
                រក្សាទុកចុងក្រោយ៖ <span className="font-mono font-semibold text-slate-700">{lastSavedTime}</span>
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={handleSaveExcel}
              className="bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 transition cursor-pointer shadow-sm"
              id="btn-quick-save-excel"
            >
              <Download className="w-4 h-4" />
              <span>រក្សាទុកទៅ File Excel (.xlsx)</span>
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 transition cursor-pointer shadow-xs"
              id="btn-quick-load-file"
            >
              <Upload className="w-4 h-4 text-blue-600" />
              <span>បើក/ផ្ទុក File ផ្សេង</span>
            </button>
          </div>
        </div>

        {/* Database Metric Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6">
          <div className="bg-slate-50 border border-slate-200/80 p-3.5 rounded-xl">
            <div className="text-[11px] font-bold text-slate-500">ចំនួនសិស្សក្នុង File</div>
            <div className="text-xl font-mono font-black text-slate-800 mt-0.5">{totalStudents} នាក់</div>
          </div>
          <div className="bg-slate-50 border border-slate-200/80 p-3.5 rounded-xl">
            <div className="text-[11px] font-bold text-slate-500">សិស្សជាប់ (Passed)</div>
            <div className="text-xl font-mono font-black text-emerald-600 mt-0.5">{passStudents} នាក់</div>
          </div>
          <div className="bg-slate-50 border border-slate-200/80 p-3.5 rounded-xl">
            <div className="text-[11px] font-bold text-slate-500">មធ្យមភាគពិន្ទុរួម</div>
            <div className="text-xl font-mono font-black text-blue-600 mt-0.5">{classAvg} ពិន្ទុ</div>
          </div>
          <div className="bg-slate-50 border border-slate-200/80 p-3.5 rounded-xl">
            <div className="text-[11px] font-bold text-slate-500">ទម្រង់ផ្ទុកទិន្នន័យ (Format)</div>
            <div className="text-sm font-mono font-bold text-purple-700 mt-1">Excel .XLSX + JSON</div>
          </div>
        </div>
      </div>

      {/* Official Template Storage Card */}
      <div className="bg-gradient-to-br from-indigo-50/90 via-blue-50/80 to-emerald-50/90 border-2 border-indigo-200/90 rounded-2xl p-6 shadow-sm relative overflow-hidden" id="official-template-card">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 bg-indigo-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>គំរូឯកសារស្តង់ដារ (Official Database Template)</span>
            </div>

            <div>
              <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <span>គំរូឯកសារផ្ទុកទិន្នន័យសិស្ស_វត្តចែង_ថ្នាក់ទី៦.xlsx</span>
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                ឯកសារគំរូពេញលេញស្របតាមទម្រង់សាលាបឋមសិក្សាវត្តចែង រួមមានសន្លឹកកិច្ចការទាំង ៧ (បញ្ជីពិន្ទុសិស្ស, ស្ថិតិរួមថ្នាក់, ស្ថិតិសាលាថ្នាក់ទី១-៦, សៀវភៅខ្ចី, វេនសម្អាត, តេស្តកាយសម្បទា, និងព័ត៌មានគ្រូ-សាលា)។
              </p>
            </div>

            {/* School & Class metadata chips */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs font-medium">
              <span className="bg-white/90 border border-slate-200 px-2.5 py-1 rounded-lg text-slate-700 flex items-center gap-1.5 shadow-2xs">
                <School className="w-3.5 h-3.5 text-blue-600" />
                <span>{DEFAULT_TEACHER_PROFILE.schoolName}</span>
              </span>
              <span className="bg-white/90 border border-slate-200 px-2.5 py-1 rounded-lg text-slate-700 flex items-center gap-1.5 shadow-2xs">
                <Users className="w-3.5 h-3.5 text-indigo-600" />
                <span>គ្រូ៖ {DEFAULT_TEACHER_PROFILE.teacherName} ({DEFAULT_TEACHER_PROFILE.gradeClass})</span>
              </span>
              <span className="bg-white/90 border border-slate-200 px-2.5 py-1 rounded-lg text-slate-700 flex items-center gap-1.5 shadow-2xs">
                <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                <span>ឆ្នាំសិក្សា៖ {DEFAULT_TEACHER_PROFILE.academicYear}</span>
              </span>
              <span className="bg-white/90 border border-slate-200 px-2.5 py-1 rounded-lg text-slate-700 flex items-center gap-1.5 shadow-2xs font-mono font-bold text-indigo-700">
                <span>៧ Worksheets</span>
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
            <button
              onClick={handleUseTemplateAsStorage}
              className="bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-xl flex items-center justify-center gap-2 transition cursor-pointer shadow-md hover:shadow-lg"
              id="btn-use-template-as-storage"
            >
              <Check className="w-4 h-4 text-emerald-300" />
              <span>យកគំរូ File នេះជាកន្លែងផ្ទុកទិន្នន័យ</span>
            </button>

            <button
              onClick={handleDownloadTemplateFile}
              className="bg-white hover:bg-slate-50 border border-indigo-300 text-indigo-900 font-bold text-xs sm:text-sm px-5 py-3 rounded-xl flex items-center justify-center gap-2 transition cursor-pointer shadow-xs"
              id="btn-download-template-file"
            >
              <Download className="w-4 h-4 text-indigo-600" />
              <span>ទាញយកគំរូ File (.xlsx)</span>
            </button>
          </div>
        </div>

        {/* Breakdown of 7 worksheets in the template */}
        <div className="mt-5 pt-4 border-t border-indigo-200/60 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 text-[11px]">
          <div className="bg-white/85 p-2 rounded-lg border border-indigo-100 text-center shadow-2xs">
            <div className="font-bold text-indigo-950">១. បញ្ជីពិន្ទុសិស្ស</div>
            <div className="text-[10px] text-slate-500 font-mono">១០ នាក់ + ពិន្ទុ</div>
          </div>
          <div className="bg-white/85 p-2 rounded-lg border border-indigo-100 text-center shadow-2xs">
            <div className="font-bold text-indigo-950">២. ស្ថិតិរួមថ្នាក់</div>
            <div className="text-[10px] text-slate-500 font-mono">មធ្យមភាគ/ជាប់-ធ្លាក់</div>
          </div>
          <div className="bg-white/85 p-2 rounded-lg border border-indigo-100 text-center shadow-2xs">
            <div className="font-bold text-indigo-950">៣. ស្ថិតិសាលារៀន</div>
            <div className="text-[10px] text-slate-500 font-mono">ថ្នាក់ទី១ ដល់ទី៦</div>
          </div>
          <div className="bg-white/85 p-2 rounded-lg border border-indigo-100 text-center shadow-2xs">
            <div className="font-bold text-indigo-950">៤. សៀវភៅខ្ចី</div>
            <div className="text-[10px] text-slate-500 font-mono">កំណត់ត្រាបណ្ណាល័យ</div>
          </div>
          <div className="bg-white/85 p-2 rounded-lg border border-indigo-100 text-center shadow-2xs">
            <div className="font-bold text-indigo-950">៥. វេនសម្អាត</div>
            <div className="text-[10px] text-slate-500 font-mono">ច័ន្ទ ដល់ សៅរ៍</div>
          </div>
          <div className="bg-white/85 p-2 rounded-lg border border-indigo-100 text-center shadow-2xs">
            <div className="font-bold text-indigo-950">៦. កាយសម្បទា</div>
            <div className="text-[10px] text-slate-500 font-mono">តេស្តកាយសម្បទា</div>
          </div>
          <div className="bg-white/85 p-2 rounded-lg border border-indigo-100 text-center shadow-2xs">
            <div className="font-bold text-indigo-950">៧. ព័ត៌មានគ្រូ</div>
            <div className="text-[10px] text-slate-500 font-mono">ប្រវត្តិរូបសាលា</div>
          </div>
        </div>
      </div>

      {/* Main Action Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: Load File as Data Storage */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-100 text-blue-700 rounded-xl">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">១. ជ្រើសរើស File ធ្វើជាកន្លែងផ្ទុកទិន្នន័យ (Open File)</h3>
                <p className="text-xs text-slate-500">Load existing Excel or JSON to become the active database</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              លោកអ្នកអាចយកឯកសារ Excel (.xlsx, .xls, .csv) ឬ JSON ដែលមានស្រាប់មកប្រើប្រាស់ជាកន្លែងផ្ទុកទិន្នន័យ។ ប្រព័ន្ធនឹងអានព័ត៌មានសិស្ស និងពិន្ទុដោយស្វ័យប្រវត្ត។
            </p>

            {/* Drag and Drop Box */}
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={onDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition ${
                dragOver 
                  ? 'border-blue-600 bg-blue-50' 
                  : 'border-slate-300 hover:border-blue-500 bg-slate-50/50 hover:bg-blue-50/30'
              }`}
            >
              <ArrowDownToLine className="w-8 h-8 text-blue-600 mb-2 animate-pulse" />
              <div className="text-xs font-bold text-slate-800">
                ចុចទីនេះ ឬទម្លាក់ File Excel / JSON ដើម្បីផ្ទុកទិន្នន័យ
              </div>
              <div className="text-[11px] text-slate-400 mt-1 font-mono">
                គាំទ្រ .xlsx, .xls, .csv, .json
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx, .xls, .csv, .json"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileChange(e.target.files[0]);
                  }
                }}
                className="hidden"
              />
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>ឯកសារបច្ចុប្បន្ន៖ <strong className="text-slate-800 font-mono">{activeFileName}</strong></span>
            {loading && <span className="text-blue-600 font-bold animate-pulse">កំពុងដំណើរការអាន File...</span>}
          </div>
        </div>

        {/* Card 2: Export & Save Options */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-100 text-emerald-700 rounded-xl">
                <Download className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">២. ជម្រើសរក្សាទុកទិន្នន័យ (Save & Export Formats)</h3>
                <p className="text-xs text-slate-500">Export database into multiple standard formats</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              ទាញយកទិន្នន័យសិស្សពេញលេញដើម្បីរក្សាទុកក្នុងកុំព្យូទ័រ ដ្រាយ ឬប្រើប្រាស់ជាមួយប្រព័ន្ធ Database ផ្សេងទៀត៖
            </p>

            <div className="space-y-2.5">
              {/* Option A: Master Excel */}
              <button
                onClick={handleSaveExcel}
                className="w-full text-left p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/50 hover:bg-emerald-100/60 transition flex items-center justify-between cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-600 text-white rounded-lg">
                    <FileSpreadsheet className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-emerald-900">ទាញយក Master Excel Database (.xlsx)</div>
                    <div className="text-[10px] text-emerald-700">មាន ៣ សន្លឹកកិច្ចការ៖ បញ្ជីពិន្ទុ, ស្ថិតិថ្នាក់ និងព័ត៌មានទិន្នន័យ</div>
                  </div>
                </div>
                <Download className="w-4 h-4 text-emerald-600 group-hover:translate-y-0.5 transition" />
              </button>

              {/* Option B: JSON Backup */}
              <button
                onClick={handleSaveJson}
                className="w-full text-left p-3.5 rounded-xl border border-indigo-200 bg-indigo-50/50 hover:bg-indigo-100/60 transition flex items-center justify-between cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-600 text-white rounded-lg">
                    <FileJson className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-indigo-900">ទាញយក Backup File (.json)</div>
                    <div className="text-[10px] text-indigo-700">ឯកសារកូដ JSON ពេញលេញសម្រាប់រក្សាទុក ឬ Import ឡើងវិញភ្លាមៗ</div>
                  </div>
                </div>
                <Download className="w-4 h-4 text-indigo-600 group-hover:translate-y-0.5 transition" />
              </button>

              {/* Option C: SQL Database Dump */}
              <button
                onClick={handleSaveSql}
                className="w-full text-left p-3.5 rounded-xl border border-purple-200 bg-purple-50/50 hover:bg-purple-100/60 transition flex items-center justify-between cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-600 text-white rounded-lg">
                    <FileCode className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-purple-900">ទាញយក SQL Database Dump (.sql)</div>
                    <div className="text-[10px] text-purple-700">INSERT queries ស្របតាម schema.sql សម្រាប់ PostgreSQL/MySQL</div>
                  </div>
                </div>
                <Download className="w-4 h-4 text-purple-600 group-hover:translate-y-0.5 transition" />
              </button>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
            <span>រក្សាទុកស្វ័យប្រវត្តក្នុង Browser៖ <strong className="text-emerald-600 font-bold">សកម្ម</strong></span>
            <span className="font-mono text-slate-400">Total: {totalStudents} Students</span>
          </div>
        </div>
      </div>

      {/* Local Snapshots & History */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 text-amber-700 rounded-xl">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">ប្រវត្តិនៃការថតទុកទិន្នន័យ (Storage Snapshots & Revert)</h3>
              <p className="text-xs text-slate-500">Restore or roll back to previous saved data states</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                createSnapshot('បានថតទុកទិន្នន័យដោយដៃ (Manual Snapshot)', students);
                triggerSuccess('បានបង្កើត Snapshot ថ្មីជោគជ័យ!');
              }}
              className="text-xs font-bold text-blue-600 hover:bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-lg flex items-center gap-1 transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>ថតទុក Snapshot ឥឡូវ</span>
            </button>
          </div>
        </div>

        <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
          {snapshots.map((snap, idx) => (
            <div key={snap.id} className="p-3.5 flex items-center justify-between hover:bg-slate-50 transition text-xs">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold font-mono text-[10px]">
                  {idx + 1}
                </div>
                <div>
                  <div className="font-bold text-slate-800">{snap.label}</div>
                  <div className="text-[11px] text-slate-400 flex items-center gap-2">
                    <span>ម៉ោង៖ {snap.timestamp}</span>
                    <span>•</span>
                    <span className="font-mono">សិស្ស {snap.count} នាក់</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleRevertSnapshot(snap)}
                  className="bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 font-bold px-3 py-1.5 rounded-lg border border-slate-200 transition cursor-pointer flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3 text-blue-600" />
                  <span>ត្រឡប់ទៅកំណែនេះ</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Database Utility Operations */}
        <div className="mt-6 pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={onResetToSample}
              className="text-xs font-bold text-slate-700 hover:text-blue-700 bg-slate-100 hover:bg-blue-50 border border-slate-200 px-3.5 py-2 rounded-lg transition cursor-pointer flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5 text-blue-600" />
              <span>ផ្ទុកទិន្នន័យគំរូឡើងវិញ (Reset to Sample)</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleClearData}
              className="text-xs font-bold text-rose-600 hover:text-rose-800 hover:bg-rose-50 border border-rose-200 px-3.5 py-2 rounded-lg transition cursor-pointer flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>សម្អាតទិន្នន័យទាំងអស់ (Clear All Data)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
