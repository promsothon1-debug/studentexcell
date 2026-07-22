import React from 'react';
import { Student } from '../types';
import { Trash2, AlertTriangle, X } from 'lucide-react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  studentsToDelete: Student[];
  onClose: () => void;
  onConfirmDelete: (ids: string[]) => void;
}

export default function DeleteConfirmModal({
  isOpen,
  studentsToDelete,
  onClose,
  onConfirmDelete,
}: DeleteConfirmModalProps) {
  if (!isOpen || studentsToDelete.length === 0) return null;

  const handleConfirm = () => {
    const ids = studentsToDelete.map((s) => s.id);
    onConfirmDelete(ids);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col" id="delete-confirm-dialog">
        {/* Header */}
        <div className="bg-rose-600 text-white p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-rose-700 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-rose-100" />
            </div>
            <div>
              <h2 className="font-bold text-base">បញ្ជាក់ការលុបទិន្នន័យសិស្ស</h2>
              <p className="text-xs text-rose-100">Confirm Student Deletion</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/10 rounded-lg text-rose-200 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4">
          <p className="text-xs text-slate-600 leading-relaxed">
            តើលោកគ្រូ/អ្នកគ្រូពិតជាចង់លុបទិន្នន័យសិស្ស <span className="font-bold text-slate-800">({studentsToDelete.length} នាក់)</span> ខាងក្រោមនេះចេញពីបញ្ជីពិន្ទុប្រាកដមែនទេ?
          </p>

          {/* List of students to delete */}
          <div className="border border-rose-200 bg-rose-50/50 rounded-xl overflow-hidden max-h-48 overflow-y-auto divide-y divide-rose-100">
            {studentsToDelete.map((s) => (
              <div key={s.id} className="p-3 flex items-center justify-between text-xs font-sans">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono font-bold text-blue-600 bg-white px-2 py-0.5 rounded border border-slate-200">
                    {s.studentId}
                  </span>
                  <span className="font-bold text-slate-800">{s.name}</span>
                  <span className="text-slate-500">({s.gender})</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 font-mono text-[11px]">
                    មធ្យមភាគ: <strong className="text-slate-700">{s.average}</strong>
                  </span>
                  <span className="font-mono font-bold text-rose-600 bg-rose-100 px-1.5 py-0.5 rounded">
                    {s.grade}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg text-xs text-amber-800 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>
              ការលុបនេះនឹងលុបទិន្នន័យសិស្ស និងពិន្ទុដែលពាក់ព័ន្ធទាំងអស់ចេញពីតារាងភ្លាមៗ។
            </span>
          </div>
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
            onClick={handleConfirm}
            className="bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white text-xs font-bold px-5 py-2.5 rounded-lg flex items-center gap-2 transition cursor-pointer shadow-md"
            id="btn-confirm-delete-action"
          >
            <Trash2 className="w-4 h-4" />
            <span>លុបចេញ ({studentsToDelete.length})</span>
          </button>
        </div>
      </div>
    </div>
  );
}
