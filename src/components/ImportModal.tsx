import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { Student, SubjectScores } from '../types';
import { computeStudentCalculations, computeRankings } from '../data';
import { FileSpreadsheet, Upload, Clipboard, CheckCircle, AlertCircle, X, Download } from 'lucide-react';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (newStudents: Student[], replace: boolean) => void;
}

export default function ImportModal({ isOpen, onClose, onImport }: ImportModalProps) {
  const [activeTab, setActiveTab] = useState<'file' | 'paste'>('file');
  const [file, setFile] = useState<File | null>(null);
  const [pasteText, setPasteText] = useState('');
  const [parsedPreview, setParsedPreview] = useState<Omit<Student, 'rank'>[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [importMode, setImportMode] = useState<'append' | 'replace'>('append');

  if (!isOpen) return null;

  // Helper to normalize column names for matching
  const normalizeKey = (key: string): string => {
    return key.toString().trim().toLowerCase().replace(/[\s_()\-.]/g, '');
  };

  // Helper to extract student objects from raw array of rows
  const parseRowsToStudents = (rows: any[]): Omit<Student, 'rank'>[] => {
    if (!rows || rows.length === 0) return [];

    let headerRowIndex = 0;
    // Find header row if first row isn't header
    for (let i = 0; i < Math.min(5, rows.length); i++) {
      const rowStr = JSON.stringify(rows[i] || '').toLowerCase();
      if (
        rowStr.includes('ឈ្មោះ') || 
        rowStr.includes('name') || 
        rowStr.includes('អត្តលេខ') || 
        rowStr.includes('id') ||
        rowStr.includes('ខ្មែរ') ||
        rowStr.includes('math')
      ) {
        headerRowIndex = i;
        break;
      }
    }

    const headers: string[] = (rows[headerRowIndex] || []).map((h: any) => normalizeKey(String(h || '')));

    // Column Index Mapping
    let idIdx = headers.findIndex(h => h.includes('អត្តលេខ') || h.includes('id') || h.includes('studentid'));
    let nameIdx = headers.findIndex(h => h.includes('ឈ្មោះ') || h.includes('name') || h.includes('studentname'));
    let genderIdx = headers.findIndex(h => h.includes('ភេទ') || h.includes('gender') || h.includes('sex'));
    let khmerIdx = headers.findIndex(h => h.includes('ខ្មែរ') || h.includes('khmer'));
    let mathIdx = headers.findIndex(h => h.includes('គណិត') || h.includes('math'));
    let physicsIdx = headers.findIndex(h => h.includes('រូប') || h.includes('physic'));
    let chemistryIdx = headers.findIndex(h => h.includes('គីមី') || h.includes('chemis'));
    let biologyIdx = headers.findIndex(h => h.includes('ជីវ') || h.includes('biol'));
    let englishIdx = headers.findIndex(h => h.includes('អង់គ្លេស') || h.includes('english') || h.includes('eng'));

    // Fallbacks if headers weren't named nicely
    if (idIdx === -1) idIdx = 1;
    if (nameIdx === -1) nameIdx = 2;
    if (genderIdx === -1) genderIdx = 3;
    if (khmerIdx === -1) khmerIdx = 4;
    if (mathIdx === -1) mathIdx = 5;
    if (physicsIdx === -1) physicsIdx = 6;
    if (chemistryIdx === -1) chemistryIdx = 7;
    if (biologyIdx === -1) biologyIdx = 8;
    if (englishIdx === -1) englishIdx = 9;

    const results: Omit<Student, 'rank'>[] = [];

    for (let i = headerRowIndex + 1; i < rows.length; i++) {
      const row = rows[i];
      if (!row || !Array.isArray(row) || row.length === 0) continue;

      const rawId = row[idIdx] !== undefined ? String(row[idIdx]).trim() : '';
      const rawName = row[nameIdx] !== undefined ? String(row[nameIdx]).trim() : '';

      // Skip empty or summary rows
      if (!rawName || rawName.includes('មធ្យមភាគ') || rawName.includes('សរុប') || rawName.toLowerCase().includes('average')) {
        continue;
      }

      const parseScore = (val: any) => {
        const num = parseFloat(val);
        return isNaN(num) ? 0 : Math.min(100, Math.max(0, num));
      };

      const gender = (row[genderIdx] && String(row[genderIdx]).trim().toLowerCase().includes('ស្រី')) || 
                     (row[genderIdx] && String(row[genderIdx]).trim().toLowerCase().startsWith('f')) 
                     ? 'ស្រី' : 'ប្រុស';

      const scores: SubjectScores = {
        khmer: parseScore(row[khmerIdx]),
        math: parseScore(row[mathIdx]),
        physics: parseScore(row[physicsIdx]),
        chemistry: parseScore(row[chemistryIdx]),
        biology: parseScore(row[biologyIdx]),
        english: parseScore(row[englishIdx]),
      };

      const calculations = computeStudentCalculations(scores);

      results.push({
        id: `import-${Date.now()}-${i}`,
        studentId: rawId || `ST-${String(results.length + 1).padStart(3, '0')}`,
        name: rawName,
        gender,
        scores,
        ...calculations
      });
    }

    return results;
  };

  // Process File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (!uploadedFile) return;

    setFile(uploadedFile);
    setErrorMsg(null);

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const workbook = XLSX.read(bstr, { type: 'binary' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const rows: any[] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        const parsed = parseRowsToStudents(rows);
        if (parsed.length === 0) {
          setErrorMsg('រកមិនឃើញទិន្នន័យសិស្សត្រឹមត្រូវក្នុងឯកសារនេះឡើយ! សូមពិនិត្យមើលទម្រង់តារាងឡើងវិញ។');
          setParsedPreview([]);
        } else {
          setParsedPreview(parsed);
        }
      } catch (err) {
        console.error(err);
        setErrorMsg('មានបញ្ហាក្នុងការអានឯកសារ Excel/CSV! សូមប្រាកដថាឯកសារមានទម្រង់ត្រឹមត្រូវ។');
        setParsedPreview([]);
      }
    };
    reader.readAsBinaryString(uploadedFile);
  };

  // Process Pasted Text
  const handlePasteChange = (text: string) => {
    setPasteText(text);
    setErrorMsg(null);

    if (!text.trim()) {
      setParsedPreview([]);
      return;
    }

    const lines = text.trim().split(/\r?\n/);
    const rows = lines.map(line => line.split(/\t|,/));

    const parsed = parseRowsToStudents(rows);
    if (parsed.length === 0) {
      setErrorMsg('មិនអាចបំបែកទិន្នន័យដែលបាន Paste បានឡើយ! សូមពិនិត្យមើល Column ឈ្មោះ និងពិន្ទុ។');
      setParsedPreview([]);
    } else {
      setParsedPreview(parsed);
    }
  };

  // Handle Confirm Import
  const handleConfirmImport = () => {
    if (parsedPreview.length === 0) return;

    // Compute ranks for imported list
    const finalStudents = computeRankings(parsedPreview);
    onImport(finalStudents, importMode === 'replace');
    onClose();
  };

  // Download Template File
  const handleDownloadTemplate = () => {
    const templateData = [
      {
        'អត្តលេខ (Student ID)': 'ST-011',
        'ឈ្មោះសិស្ស (Student Name)': 'សូ វណ្ណនី',
        'ភេទ (Gender)': 'ស្រី',
        'ភាសាខ្មែរ (Khmer)': 85,
        'គណិតវិទ្យា (Math)': 90,
        'រូបវិទ្យា (Physics)': 80,
        'គីមីវិទ្យា (Chemistry)': 88,
        'ជីវវិទ្យា (Biology)': 86,
        'អង់គ្លេស (English)': 92,
      },
      {
        'អត្តលេខ (Student ID)': 'ST-012',
        'ឈ្មោះសិស្ស (Student Name)': 'ម៉េង ហួរ',
        'ភេទ (Gender)': 'ប្រុស',
        'ភាសាខ្មែរ (Khmer)': 78,
        'គណិតវិទ្យា (Math)': 82,
        'រូបវិទ្យា (Physics)': 75,
        'គីមីវិទ្យា (Chemistry)': 70,
        'ជីវវិទ្យា (Biology)': 74,
        'អង់គ្លេស (English)': 80,
      }
    ];

    const ws = XLSX.utils.json_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'គំរូនាំចូល');
    XLSX.writeFile(wb, 'គំរូនាំចូលសិស្ស_Import_Template.xlsx');
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]" id="import-students-dialog">
        {/* Header */}
        <div className="bg-blue-600 text-white p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-700 rounded-lg">
              <FileSpreadsheet className="w-6 h-6 text-blue-200" />
            </div>
            <div>
              <h2 className="font-bold text-base">នាំចូលសិស្សពី Excel / Google Sheets</h2>
              <p className="text-xs text-blue-100">Import Students from Excel or Google Sheets</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-white/10 rounded-lg text-blue-200 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1">
          {/* Method Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
            <button
              onClick={() => setActiveTab('file')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeTab === 'file'
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Upload className="w-4 h-4" />
              <span>ជ្រើសរើសឯកសារ (.xlsx, .xls, .csv)</span>
            </button>
            <button
              onClick={() => setActiveTab('paste')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeTab === 'paste'
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Clipboard className="w-4 h-4" />
              <span>Paste ពី Sheet / Excel (Copy Data)</span>
            </button>
            
            <button
              onClick={handleDownloadTemplate}
              className="ml-auto text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 hover:underline cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>ទាញយកទម្រង់គំរូ (.xlsx)</span>
            </button>
          </div>

          {/* TAB 1: File Upload */}
          {activeTab === 'file' && (
            <div className="space-y-3">
              <label className="border-2 border-dashed border-slate-300 hover:border-blue-500 bg-slate-50 hover:bg-blue-50/50 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition">
                <Upload className="w-8 h-8 text-blue-500 mb-2" />
                <span className="text-sm font-bold text-slate-700">ចុចទីនេះដើម្បីជ្រើសរើសឯកសារ Excel ឬ CSV</span>
                <span className="text-xs text-slate-400 mt-1">គាំទ្រឯកសារ .xlsx, .xls, .csv</span>
                <input 
                  type="file" 
                  accept=".xlsx, .xls, .csv" 
                  onChange={handleFileUpload} 
                  className="hidden" 
                />
              </label>

              {file && (
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 p-3 rounded-lg border border-emerald-200">
                  <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>បានជ្រើសរើស៖ {file.name}</span>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Copy Paste Text */}
          {activeTab === 'paste' && (
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">
                Paste ទិន្នន័យដែលបានចម្លងចេញពី Excel ឬ Google Sheet ទីនេះ៖
              </label>
              <textarea
                value={pasteText}
                onChange={(e) => handlePasteChange(e.target.value)}
                placeholder="ឧទាហរណ៍៖&#10;ST-001	សុខ ជា	ប្រុស	85	95	88	78	82	90&#10;ST-002	ចាន់ ធីតា	ស្រី	92	88	85	90	94	95"
                rows={5}
                className="w-full p-3 border border-slate-300 rounded-xl font-mono text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50"
              />
            </div>
          )}

          {/* Error Message */}
          {errorMsg && (
            <div className="flex items-center gap-2 text-xs text-rose-700 bg-rose-50 border border-rose-200 p-3 rounded-lg">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Parsed Preview Table */}
          {parsedPreview.length > 0 && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">
                  ✅ រកឃើញសិស្សចំនួន <span className="text-blue-600 font-mono text-sm">{parsedPreview.length}</span> នាក់
                </span>

                {/* Import Mode Selection */}
                <div className="flex items-center gap-3 text-xs">
                  <label className="flex items-center gap-1.5 cursor-pointer font-medium text-slate-700">
                    <input 
                      type="radio" 
                      name="importMode" 
                      value="append" 
                      checked={importMode === 'append'} 
                      onChange={() => setImportMode('append')}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span>បន្ថែមបន្ត (Append)</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer font-medium text-slate-700">
                    <input 
                      type="radio" 
                      name="importMode" 
                      value="replace" 
                      checked={importMode === 'replace'} 
                      onChange={() => setImportMode('replace')}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span>ជំនួសទិន្នន័យចាស់ (Replace)</span>
                  </label>
                </div>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden max-h-56 overflow-y-auto shadow-xs">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 sticky top-0">
                    <tr>
                      <th className="p-2 text-center">អត្តលេខ</th>
                      <th className="p-2">ឈ្មោះសិស្ស</th>
                      <th className="p-2 text-center">ភេទ</th>
                      <th className="p-2 text-center">ខ្មែរ</th>
                      <th className="p-2 text-center">គណិត</th>
                      <th className="p-2 text-center">រូប</th>
                      <th className="p-2 text-center">គីមី</th>
                      <th className="p-2 text-center">ជីវ</th>
                      <th className="p-2 text-center">អង់គ្លេស</th>
                      <th className="p-2 text-center">សរុប</th>
                      <th className="p-2 text-center">មធ្យមភាគ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono">
                    {parsedPreview.map((s, idx) => (
                      <tr key={idx} className="hover:bg-blue-50/50">
                        <td className="p-2 text-center font-bold text-blue-600">{s.studentId}</td>
                        <td className="p-2 font-sans font-medium text-slate-800">{s.name}</td>
                        <td className="p-2 text-center font-sans">{s.gender}</td>
                        <td className="p-2 text-center">{s.scores.khmer}</td>
                        <td className="p-2 text-center">{s.scores.math}</td>
                        <td className="p-2 text-center">{s.scores.physics}</td>
                        <td className="p-2 text-center">{s.scores.chemistry}</td>
                        <td className="p-2 text-center">{s.scores.biology}</td>
                        <td className="p-2 text-center">{s.scores.english}</td>
                        <td className="p-2 text-center font-bold">{s.totalScore}</td>
                        <td className="p-2 text-center font-bold text-blue-700">{s.average}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 transition cursor-pointer"
          >
            បោះបង់ (Cancel)
          </button>

          <button
            onClick={handleConfirmImport}
            disabled={parsedPreview.length === 0}
            className={`px-6 py-2.5 rounded-lg text-xs font-bold text-white transition flex items-center gap-2 cursor-pointer shadow-md ${
              parsedPreview.length > 0
                ? 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
                : 'bg-slate-300 cursor-not-allowed'
            }`}
          >
            <CheckCircle className="w-4 h-4" />
            <span>បញ្ជាក់ការនាំចូលសិស្ស ({parsedPreview.length})</span>
          </button>
        </div>
      </div>
    </div>
  );
}
