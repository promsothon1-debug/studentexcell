import { Student, SubjectScores } from './types';

// Helper to calculate Grade based on average
export function calculateGrade(average: number): string {
  if (average >= 90) return 'A';
  if (average >= 80) return 'B';
  if (average >= 70) return 'C';
  if (average >= 60) return 'D';
  if (average >= 50) return 'E';
  return 'F';
}

// Full calculation helper for a single student's calculated fields
export function computeStudentCalculations(
  scores: SubjectScores
): { totalScore: number; average: number; grade: string } {
  const totalScore = 
    scores.khmer + 
    scores.math + 
    scores.physics + 
    scores.chemistry + 
    scores.biology + 
    scores.english;
  
  const average = Number((totalScore / 6).toFixed(2));
  const grade = calculateGrade(average);

  return { totalScore, average, grade };
}

// Helper to compute rankings for all students based on totalScore
export function computeRankings(students: Omit<Student, 'rank'>[]): Student[] {
  // Sort by total score descending
  const sorted = [...students].sort((a, b) => b.totalScore - a.totalScore);
  
  return sorted.map((student, index) => {
    // Find how many students have a strictly higher score
    const higherCount = sorted.filter(s => s.totalScore > student.totalScore).length;
    return {
      ...student,
      rank: higherCount + 1
    } as Student;
  });
}

// Initial Mock Students
export const INITIAL_STUDENTS_RAW = [
  {
    id: '1',
    studentId: 'ST-001',
    name: 'សុខ ជា',
    gender: 'ប្រុស',
    scores: { khmer: 85, math: 95, physics: 88, chemistry: 78, biology: 82, english: 90 }
  },
  {
    id: '2',
    studentId: 'ST-002',
    name: 'ចាន់ ធីតា',
    gender: 'ស្រី',
    scores: { khmer: 92, math: 88, physics: 85, chemistry: 90, biology: 94, english: 95 }
  },
  {
    id: '3',
    studentId: 'ST-003',
    name: 'សេង ហុង',
    gender: 'ប្រុស',
    scores: { khmer: 65, math: 70, physics: 68, chemistry: 60, biology: 72, english: 58 }
  },
  {
    id: '4',
    studentId: 'ST-004',
    name: 'លី ស្រីនី',
    gender: 'ស្រី',
    scores: { khmer: 78, math: 82, physics: 75, chemistry: 80, biology: 76, english: 84 }
  },
  {
    id: '5',
    studentId: 'ST-005',
    name: 'អ៊ុក វណ្ណដា',
    gender: 'ប្រុស',
    scores: { khmer: 90, math: 92, physics: 94, chemistry: 89, biology: 91, english: 88 }
  },
  {
    id: '6',
    studentId: 'ST-006',
    name: 'ម៉ៅ ចន្ថា',
    gender: 'ស្រី',
    scores: { khmer: 58, math: 48, physics: 52, chemistry: 50, biology: 55, english: 60 }
  },
  {
    id: '7',
    studentId: 'ST-007',
    name: 'ភិន មុន្នី',
    gender: 'ប្រុស',
    scores: { khmer: 72, math: 65, physics: 70, chemistry: 74, biology: 68, english: 71 }
  },
  {
    id: '8',
    studentId: 'ST-008',
    name: 'ទូច សុជាតា',
    gender: 'ស្រី',
    scores: { khmer: 88, math: 90, physics: 86, chemistry: 85, biology: 89, english: 92 }
  },
  {
    id: '9',
    studentId: 'ST-009',
    name: 'កែវ សិរីវុឌ្ឍ',
    gender: 'ប្រុស',
    scores: { khmer: 80, math: 75, physics: 78, chemistry: 82, biology: 80, english: 78 }
  },
  {
    id: '10',
    studentId: 'ST-010',
    name: 'ជា សុភ័ក្ត្រ',
    gender: 'ស្រី',
    scores: { khmer: 45, math: 50, physics: 48, chemistry: 42, biology: 52, english: 48 }
  }
];

export function getInitialStudents(): Student[] {
  const calculated = INITIAL_STUDENTS_RAW.map(s => {
    const calcs = computeStudentCalculations(s.scores);
    return {
      ...s,
      ...calcs
    };
  });
  return computeRankings(calculated);
}
