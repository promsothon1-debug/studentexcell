import React, { useState, useRef, useEffect } from 'react';
import { 
  SortAsc, 
  SortDesc, 
  Search, 
  UserPlus, 
  Download, 
  Upload,
  RotateCcw, 
  AlertCircle,
  FileSpreadsheet,
  FileText,
  ExternalLink,
  ChevronDown,
  Check,
  Copy
} from 'lucide-react';
import { SortOrder, Student } from '../types';
import { exportToExcel, exportToWord, exportToGoogleSheets } from '../utils/exportUtils';

interface ExcelToolbarProps {
  students: Student[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSearch: (id: string) => void;
  onSortAlphabetically: () => void;
  sortOrder: SortOrder | null;
  onAddStudent: () => void;
  onImportClick: () => void;
  onResetData: () => void;
  invalidSearchError: string | null;
}

export default function ExcelToolbar({
  students,
  searchQuery,
  setSearchQuery,
  onSearch,
  onSortAlphabetically,
  sortOrder,
  onAddStudent,
  onImportClick,
  onResetData,
  invalidSearchError
}: ExcelToolbarProps) {
  const [localSearch, setLocalSearch] = useState('');
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showSheetsModal, setShowSheetsModal] = useState(false);
  const [copiedSuccess, setCopiedSuccess] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(localSearch.trim());
  };

  // Close export dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowExportMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleExcelExport = () => {
    exportToExcel(students);
    setShowExportMenu(false);
  };

  const handleWordExport = () => {
    exportToWord(students);
    setShowExportMenu(false);
  };

  const handleSheetsExport = () => {
    exportToGoogleSheets(students);
    setShowExportMenu(false);
    setShowSheetsModal(true);
  };

  const handleCopyTSVForSheets = () => {
    const headers = ['ល.រ', 'អត្តលេខ', 'ឈ្មោះសិស្ស', 'ភេទ', 'ខ្មែរ', 'គណិត', 'រូប', 'គីមី', 'ជីវ', 'អង់គ្លេស', 'ពិន្ទុសរុប', 'មធ្យមភាគ', 'និទ្ទេស', 'ចំណាត់ថ្នាក់'];
    const rows = students.map((s, i) => [
      i + 1,
      s.studentId,
      s.name,
      s.gender,
      s.scores.khmer,
      s.scores.math,
      s.scores.physics,
      s.scores.chemistry,
      s.scores.biology,
      s.scores.english,
      s.totalScore,
      s.average,
      s.grade,
      s.rank
    ]);
    const tsvData = [headers.join('\t'), ...rows.map(r => r.join('\t'))].join('\n');
    
    navigator.clipboard.writeText(tsvData);
    setCopiedSuccess(true);
    setTimeout(() => setCopiedSuccess(false), 3000);
  };

  return (
    <div className="bg-slate-50 border-b border-slate-200 py-3 px-6 flex flex-col xl:flex-row items-center justify-between gap-4 shadow-xs" id="excel-toolbar">
      {/* Search by Student ID */}
      <div className="w-full xl:w-auto flex flex-col md:flex-row items-stretch md:items-center gap-2">
        <form onSubmit={handleSearchSubmit} className="flex items-stretch gap-1 flex-1 md:flex-initial">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="ស្វែងរកតាមអត្តលេខ (e.g. ST-001)"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-xs font-mono text-slate-800"
              id="input-search-id"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-semibold px-4 py-2 rounded-lg flex items-center gap-1.5 transition cursor-pointer shrink-0 shadow-sm"
            id="btn-search-submit"
          >
            <Search className="w-4 h-4" />
            <span>ស្វែងរកពិន្ទុ (Search)</span>
          </button>
        </form>
        
        {invalidSearchError && (
          <div className="flex items-center gap-1 text-xs text-rose-600 bg-rose-50 border border-rose-200 px-3 py-1.5 rounded-lg animate-bounce" id="search-error">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{invalidSearchError}</span>
          </div>
        )}
      </div>

      {/* Main Excel Operations */}
      <div className="w-full xl:w-auto flex flex-wrap items-center justify-end gap-2.5">
        {/* Sort Alphabetically Button */}
        <button
          onClick={onSortAlphabetically}
          className={`flex items-center gap-1.5 text-sm font-semibold px-3.5 py-2 rounded-lg border transition cursor-pointer shadow-xs ${
            sortOrder 
              ? 'bg-blue-50 border-blue-600 text-blue-700' 
              : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
          }`}
          id="btn-sort-alphabetical"
          title="តម្រៀបឈ្មោះសិស្សតាមអក្ខរក្រម"
        >
          {sortOrder === 'desc' ? <SortDesc className="w-4 h-4 text-blue-600" /> : <SortAsc className="w-4 h-4 text-blue-600" />}
          <span>តម្រៀបឈ្មោះ ({sortOrder === 'asc' ? 'A-Z' : sortOrder === 'desc' ? 'Z-A' : 'Sort'})</span>
        </button>

        {/* Add Student Button */}
        <button
          onClick={onAddStudent}
          className="bg-white border border-slate-300 hover:bg-slate-50 active:bg-slate-100 text-slate-700 text-sm font-semibold px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition cursor-pointer shadow-xs"
          id="btn-add-student"
        >
          <UserPlus className="w-4 h-4 text-blue-600" />
          <span>បន្ថែមសិស្ស</span>
        </button>

        {/* Import Students from Sheet/Excel Button */}
        <button
          onClick={onImportClick}
          className="bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 active:bg-emerald-200 text-emerald-800 text-sm font-semibold px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition cursor-pointer shadow-xs"
          id="btn-import-students"
          title="នាំចូលសិស្សពី Excel ឬ Google Sheets"
        >
          <Upload className="w-4 h-4 text-emerald-600" />
          <span>នាំចូលសិស្ស (Import)</span>
        </button>

        {/* Unified Export Menu (Excel, MS Word, Google Sheets) */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowExportMenu(!showExportMenu)}
            className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-bold px-4 py-2 rounded-lg flex items-center gap-2 transition cursor-pointer shadow-sm"
            id="btn-export-dropdown"
          >
            <Download className="w-4 h-4" />
            <span>នាំចេញឯកសារ (Export)</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${showExportMenu ? 'rotate-180' : ''}`} />
          </button>

          {showExportMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-xl shadow-xl z-50 py-1.5 animate-in fade-in slide-in-from-top-2 duration-150" id="export-options-menu">
              <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                ជ្រើសរើសទម្រង់នាំចេញ (Choose Format)
              </div>
              
              {/* Export as Excel (.xlsx) */}
              <button
                onClick={handleExcelExport}
                className="w-full text-left px-3.5 py-2.5 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 text-xs font-semibold flex items-center gap-2.5 transition cursor-pointer group"
                id="btn-export-excel"
              >
                <div className="p-1.5 bg-emerald-100 text-emerald-700 rounded-md group-hover:bg-emerald-600 group-hover:text-white transition">
                  <FileSpreadsheet className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold">នាំចេញជា Excel (.xlsx)</div>
                  <div className="text-[10px] text-slate-400 font-normal">Microsoft Excel Workbook</div>
                </div>
              </button>

              {/* Export as MS Word (.doc) */}
              <button
                onClick={handleWordExport}
                className="w-full text-left px-3.5 py-2.5 hover:bg-blue-50 text-slate-700 hover:text-blue-800 text-xs font-semibold flex items-center gap-2.5 transition cursor-pointer group border-t border-slate-100"
                id="btn-export-word"
              >
                <div className="p-1.5 bg-blue-100 text-blue-700 rounded-md group-hover:bg-blue-600 group-hover:text-white transition">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold">នាំចេញជា MS Word (.doc)</div>
                  <div className="text-[10px] text-slate-400 font-normal">Microsoft Word Document Report</div>
                </div>
              </button>

              {/* Connect / Export to Google Sheets */}
              <button
                onClick={handleSheetsExport}
                className="w-full text-left px-3.5 py-2.5 hover:bg-teal-50 text-slate-700 hover:text-teal-800 text-xs font-semibold flex items-center gap-2.5 transition cursor-pointer group border-t border-slate-100"
                id="btn-export-sheets"
              >
                <div className="p-1.5 bg-teal-100 text-teal-700 rounded-md group-hover:bg-teal-600 group-hover:text-white transition">
                  <ExternalLink className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold">ភ្ជាប់ទៅ Google Sheets</div>
                  <div className="text-[10px] text-slate-400 font-normal">Open / Import in Google Sheets</div>
                </div>
              </button>
            </div>
          )}
        </div>

        {/* Reset Mock Data */}
        <button
          onClick={onResetData}
          className="bg-white border border-slate-300 hover:bg-rose-50 hover:border-rose-300 hover:text-rose-700 text-slate-500 text-sm font-medium p-2 rounded-lg flex items-center justify-center transition cursor-pointer shadow-xs"
          id="btn-reset-data"
          title="កំណត់ឡើងវិញទិន្នន័យគំរូ"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Google Sheets Modal / Guidance Dialog */}
      {showSheetsModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden" id="google-sheets-dialog">
            <div className="bg-teal-700 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-teal-800 rounded-lg">
                  <ExternalLink className="w-5 h-5 text-teal-200" />
                </div>
                <div>
                  <h3 className="font-bold text-base">ភ្ជាប់ទៅ Google Sheets</h3>
                  <p className="text-xs text-teal-100">Export & Import into Google Sheets</p>
                </div>
              </div>
              <button 
                onClick={() => setShowSheetsModal(false)}
                className="text-teal-200 hover:text-white text-sm font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-teal-50 border border-teal-200 rounded-xl p-4 text-xs text-teal-900">
                <p className="font-bold mb-1">✅ បានទាញយក CSV File រួចរាល់!</p>
                <p>លោកអ្នកអាចចម្លងទិន្នន័យ ឬបើក Google Sheets ដោយផ្ទាល់ខាងក្រោមនេះ៖</p>
              </div>

              <div className="space-y-3 pt-1">
                {/* Step 1: Copy to Clipboard */}
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div>
                    <div className="text-xs font-bold text-slate-800">១. ចម្លងទិន្នន័យ (Copy Data)</div>
                    <div className="text-[11px] text-slate-500">ចម្លងទិន្នន័យដើម្បី Paste ដោយផ្ទាល់ចូល Sheet</div>
                  </div>
                  <button
                    onClick={handleCopyTSVForSheets}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                      copiedSuccess 
                        ? 'bg-emerald-600 text-white' 
                        : 'bg-white border border-slate-300 hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    {copiedSuccess ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5 text-teal-600" />}
                    <span>{copiedSuccess ? 'បានចម្លង!' : 'ចម្លងទិន្នន័យ'}</span>
                  </button>
                </div>

                {/* Step 2: Open Google Sheets */}
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div>
                    <div className="text-xs font-bold text-slate-800">២. បើក Google Sheets ថ្មី</div>
                    <div className="text-[11px] text-slate-500">បង្កើត Sheet ថ្មីភ្លាមៗនៅលើ Browser</div>
                  </div>
                  <a
                    href="https://sheets.new"
                    target="_blank"
                    rel="noreferrer"
                    className="px-3.5 py-1.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition cursor-pointer shadow-xs"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>sheets.new</span>
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setShowSheetsModal(false)}
                className="bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold px-5 py-2 rounded-lg transition cursor-pointer"
              >
                រួចរាល់ (Done)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

