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
  studentId: string; // អត្តលេខ (e.g., ST-001)
  name: string; // ឈ្មោះសិស្ស
  gender: 'ប្រុស' | 'ស្រី' | string; // ភេទ
  scores: SubjectScores; // ពិន្ទុតាមមុខវិជ្ជា
  totalScore: number; // ពិន្ទុសរុប
  average: number; // មធ្យមភាគ
  grade: string; // និទ្ទេស (A, B, C, D, E, F)
  rank: number; // ចំណាត់ថ្នាក់
  dob?: string; // ថ្ងៃខែឆ្នាំកំណើត
  pob?: string; // ទីកន្លែងកំណើត
  parentName?: string; // ឈ្មោះអាណាព្យាបាល
  parentPhone?: string; // លេខទូរស័ព្ទ
  preTestScore?: number; // ពិន្ទុតេស្តដើមឆ្នាំ
  postTestScore?: number; // ពិន្ទុតេស្តចុងឆ្នាំ
}

export interface TeacherProfile {
  teacherName: string;
  gender: string;
  schoolName: string;
  telegram: string;
  phoneNumber: string;
  academicYear: string;
  gradeClass: string;
  province: string;
  district: string;
  commune: string;
  village: string;
}

export interface SchoolSummaryRow {
  grade: string;
  section?: string;
  startYearTotal: number;
  startYearFemale: number;
  endYearTotal?: number;
  endYearFemale?: number;
  gradeA: { total: number; female: number; percent: number };
  gradeB: { total: number; female: number; percent: number };
  gradeC: { total: number; female: number; percent: number };
  gradeD: { total: number; female: number; percent: number };
  gradeE: { total: number; female: number; percent: number };
  gradeF: { total: number; female: number; percent: number };
  passPercent: string;
  isTotalRow?: boolean;
}

export interface BookRecord {
  id: string;
  studentId: string;
  studentName: string;
  gender: string;
  bookTitle: string;
  borrowDate: string;
  returnDate?: string;
  status: 'កំពុងខ្ចី' | 'បានសងរួច';
  librarianNote?: string;
}

export interface CleaningDuty {
  dayOfWeek: string; // ច័ន្ទ, អង្គារ, ពុធ, ព្រហស្បតិ៍, សុក្រ, សៅរ៍
  teamLeader: string;
  members: string[];
  tasks: string[];
}

export interface AttendanceRecord {
  studentId: string;
  studentName: string;
  gender: string;
  presentDays: number;
  excusedDays: number;
  unexcusedDays: number;
}

export interface FitnessTestRecord {
  studentId: string;
  studentName: string;
  gender: string;
  heightCm: number;
  weightKg: number;
  running50mSec: number;
  longJumpCm: number;
  shuttleRunSec: number;
  resultGrade: 'ល្អប្រសើរ' | 'ល្អ' | 'មធ្យម' | 'ខ្សោយ';
}

export type SortField = 'studentId' | 'name' | 'gender' | 'totalScore' | 'average' | 'rank' | 'no';
export type SortOrder = 'asc' | 'desc';
