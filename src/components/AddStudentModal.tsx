import React, { useState, useEffect } from 'react';
import { X, UserPlus, AlertCircle } from 'lucide-react';
import { Student, SubjectScores } from '../types';

interface AddStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddStudent: (studentData: {
    studentId: string;
    name: string;
    gender: string;
    scores: SubjectScores;
  }) => void;
  nextSuggestedId: string;
}

export default function AddStudentModal({
  isOpen,
  onClose,
  onAddStudent,
  nextSuggestedId
}: AddStudentModalProps) {
  const [studentId, setStudentId] = useState('');
  const [name, setName] = useState('');
  const [gender, setGender] = useState('ស្រី'); // Default to Female
  const [scores, setScores] = useState<SubjectScores>({
    khmer: 0,
    math: 0,
    physics: 0,
    chemistry: 0,
    biology: 0,
    english: 0
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setStudentId(nextSuggestedId);
      setName('');
      setGender('ស្រី');
      setScores({ khmer: 0, math: 0, physics: 0, chemistry: 0, biology: 0, english: 0 });
      setError(null);
    }
  }, [isOpen, nextSuggestedId]);

  if (!isOpen) return null;

  const handleScoreChange = (subject: keyof SubjectScores, value: string) => {
    const num = Number(value);
    if (value === '' || (num >= 0 && num <= 100)) {
      setScores(prev => ({
        ...prev,
        [subject]: num
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!studentId.trim()) {
      setError('សូមបំពេញអត្តលេខសិស្ស! (Student ID is required)');
      return;
    }

    if (!name.trim()) {
      setError('សូមបំពេញឈ្មោះសិស្ស! (Student Name is required)');
      return;
    }

    onAddStudent({
      studentId: studentId.trim(),
      name: name.trim(),
      gender,
      scores
    });
    
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200" id="add-student-overlay">
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col animate-in zoom-in-95 duration-200"
        id="add-student-modal"
      >
        {/* Header */}
        <div className="bg-blue-600 text-white py-4 px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-blue-200" />
            <h2 className="font-bold text-base">បន្ថែមព័ត៌មានសិស្សថ្មី (Add New Student)</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-white/10 active:bg-white/20 rounded-lg text-blue-100 hover:text-white transition cursor-pointer"
            id="btn-close-add-student"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1">
          {/* Form Body */}
          <div className="p-6 overflow-y-auto space-y-4 max-h-[70vh]">
            
            {error && (
              <div className="flex items-center gap-2 p-3 text-xs text-rose-700 bg-rose-50 border border-rose-100 rounded-lg" id="add-student-error">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                <span>{error}</span>
              </div>
            )}

            {/* General Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">អត្តលេខសិស្ស (Student ID) *</label>
                <input
                  type="text"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                  placeholder="e.g. ST-011"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">ភេទ (Gender) *</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                >
                  <option value="ស្រី">ស្រី (Female)</option>
                  <option value="ប្រុស">ប្រុស (Male)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">ឈ្មោះសិស្ស (Student Name) *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="ឈ្មោះជាភាសាខ្មែរ ឬឡាតាំង"
                required
              />
            </div>

            {/* Subject Scores Inputs */}
            <div className="border-t border-slate-100 pt-4">
              <h4 className="font-bold text-xs text-slate-500 uppercase tracking-wider mb-3">ពិន្ទុតាមមុខវិជ្ជា (Subject Scores) • ០ ដល់ ១០០</h4>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { key: 'khmer', label: 'ភាសាខ្មែរ' },
                  { key: 'math', label: 'គណិតវិទ្យា' },
                  { key: 'physics', label: 'រូបវិទ្យា' },
                  { key: 'chemistry', label: 'គីមីវិទ្យា' },
                  { key: 'biology', label: 'ជីវវិទ្យា' },
                  { key: 'english', label: 'អង់គ្លេស' }
                ].map((subject) => (
                  <div key={subject.key}>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">{subject.label}</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={scores[subject.key as keyof SubjectScores]}
                      onChange={(e) => handleScoreChange(subject.key as keyof SubjectScores, e.target.value)}
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center font-mono"
                      required
                    />
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Footer Actions */}
          <div className="bg-slate-50 py-3.5 px-6 border-t border-slate-200 flex justify-end items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition cursor-pointer"
            >
              បោះបង់ (Cancel)
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-bold px-5 py-2.5 rounded-lg transition shadow-xs hover:shadow-md cursor-pointer flex items-center gap-1"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>បន្ថែមសិស្ស (Add Student)</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
