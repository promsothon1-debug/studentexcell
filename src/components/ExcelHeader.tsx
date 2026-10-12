import React from 'react';
import { Info, Calendar, HelpCircle } from 'lucide-react';

interface ExcelHeaderProps {
  activeFileName?: string;
  hasUnsavedChanges?: boolean;
  onOpenStorageTab?: () => void;
}

export default function ExcelHeader({
  activeFileName = 'គំរូឯកសារផ្ទុកទិន្នន័យសិស្ស_វត្តចែង_ថ្នាក់ទី៦.xlsx',
  hasUnsavedChanges = false,
  onOpenStorageTab
}: ExcelHeaderProps) {
  const [showHelp, setShowHelp] = React.useState(false);

  return (
    <header className="bg-white border-b border-slate-200 py-4 px-6 shadow-xs" id="excel-header">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="bg-blue-600 p-2.5 rounded-lg shadow-sm flex items-center justify-center">
            <div className="grid grid-cols-2 gap-0.5">
              <div className="w-2 h-2 bg-white opacity-40 rounded-xs"></div>
              <div className="w-2 h-2 bg-white rounded-xs"></div>
              <div className="w-2 h-2 bg-white rounded-xs"></div>
              <div className="w-2 h-2 bg-white opacity-40 rounded-xs"></div>
            </div>
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-extrabold tracking-tight text-slate-900">
              ប្រព័ន្ធគ្រប់គ្រងពិន្ទុសិស្សលក្ខណៈ Excel
            </h1>
            <p className="text-xs text-slate-500 font-mono mt-0.5">
              Student Score Spreadsheet Manager • File-Based Storage Edition
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-sm flex-wrap justify-end">
          {/* Active File Storage Badge */}
          {onOpenStorageTab && (
            <button
              onClick={onOpenStorageTab}
              className={`flex items-center gap-2 py-1.5 px-3 rounded-lg border text-xs font-mono transition cursor-pointer shadow-xs ${
                hasUnsavedChanges
                  ? 'bg-amber-50 border-amber-300 text-amber-800 hover:bg-amber-100'
                  : 'bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100'
              }`}
              title="ចុចដើម្បីបើកមជ្ឈមណ្ឌលផ្ទុកទិន្នន័យ (Open Data Storage Hub)"
              id="header-storage-file-badge"
            >
              <span className={`w-2 h-2 rounded-full ${hasUnsavedChanges ? 'bg-amber-500 animate-ping' : 'bg-emerald-500'}`}></span>
              <span className="font-bold">📁 File: {activeFileName}</span>
              <span className="text-[10px] font-sans px-1.5 py-0.2 rounded bg-white/70">
                {hasUnsavedChanges ? 'មិនទាន់ Save' : 'បានរក្សាទុក'}
              </span>
            </button>
          )}

          <div className="hidden lg:flex items-center gap-2 bg-slate-100 py-1.5 px-3.5 rounded-full font-mono text-xs text-slate-600 border border-slate-200">
            <Calendar className="w-3.5 h-3.5 text-blue-600" />
            <span className="font-semibold text-slate-700">២០២៦-០៧-២០</span>
          </div>
          
          <button
            onClick={() => setShowHelp(!showHelp)}
            className="flex items-center gap-1.5 bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-700 transition py-1.5 px-3.5 rounded-lg border border-slate-300 font-bold cursor-pointer shadow-xs text-xs"
            id="btn-help-toggle"
          >
            <HelpCircle className="w-4 h-4 text-blue-600" />
            <span>ជំនួយ (Help)</span>
          </button>
        </div>
      </div>

      {showHelp && (
        <div className="max-w-7xl mx-auto mt-4 p-4 bg-white text-slate-800 rounded-xl shadow-md border border-slate-200 flex flex-col md:flex-row gap-4 items-start animate-in fade-in slide-in-from-top-2 duration-200" id="help-panel">
          <div className="bg-blue-50 p-3 rounded-lg text-blue-600 self-start">
            <Info className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-slate-900 text-base mb-1.5">របៀបប្រើប្រាស់កម្មវិធី (How to use the program)</h3>
            <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-5">
              <li><strong className="text-slate-800">កែប្រែទិន្នន័យ (Inline Editing):</strong> ចុចពីរដង (Double-Click) ឬចុចលើក្រឡា (Cell) រួចវាយបញ្ចូលដើម្បីកែសម្រួល អត្តលេខ, ឈ្មោះ, ភេទ ឬពិន្ទុភ្លាមៗ។</li>
              <li><strong className="text-slate-800">ស្វែងរកពិន្ទុសិស្ស (Search by ID):</strong> វាយបញ្ចូលអត្តលេខសិស្សក្នុងប្រអប់ស្វែងរក រួចចុច "ស្វែងរក" ដើម្បីមើលព្រឹត្តិបត្រពិន្ទុចុងក្រោយរបស់សិស្សនោះ។</li>
              <li><strong className="text-slate-800">តម្រៀបឈ្មោះ (Sort Alphabetically):</strong> ចុចប៊ូតុង "តម្រៀបឈ្មោះ ក-អ" ដើម្បីរៀបចំឈ្មោះសិស្សតាមលំដាប់អក្ខរក្រមខ្មែរ។</li>
              <li><strong className="text-slate-800">ការគណនាស្វ័យប្រវត្ត (Excel Formulas):</strong> ពិន្ទុសរុប, មធ្យមភាគ, និទ្ទេស, និងចំណាត់ថ្នាក់ នឹងត្រូវគណនាឡើងវិញដោយស្វ័យប្រវត្តនៅពេលដែលពិន្ទុមុខវិជ្ជាត្រូវបានកែប្រែ។</li>
            </ul>
          </div>
          <button 
            onClick={() => setShowHelp(false)}
            className="text-xs font-bold text-blue-600 hover:underline cursor-pointer px-2 py-1 self-end"
          >
            បិទ (Close)
          </button>
        </div>
      )}
    </header>
  );
}
