export interface SubjectScores {
  khmer: number;
  math: number;
  physics: number;
  chemistry: number;
  biology: number;
  english: number;
}

export interface Student {
  id: string; // Unique uuid/timestamp
  studentId: string; // អត្តលេខ (e.g., ST001)
  name: string; // ឈ្មោះសិស្ស
  gender: 'ប្រុស' | 'ស្រី' | string; // ភេទ
  scores: SubjectScores; // ពិន្ទុតាមមុខវិជ្ជា
  totalScore: number; // ពិន្ទុសរុប
  average: number; // មធ្យមភាគ
  grade: string; // និទ្ទេស (A, B, C, D, E, F)
  rank: number; // ចំណាត់ថ្នាក់
}

export type SortField = 'studentId' | 'name' | 'gender' | 'totalScore' | 'average' | 'rank' | 'no';
export type SortOrder = 'asc' | 'desc';
