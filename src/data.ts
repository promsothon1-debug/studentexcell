import { Student, SubjectScores, SchoolSummaryRow, TeacherProfile, BookRecord, CleaningDuty, AttendanceRecord, FitnessTestRecord } from './types';

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
  const sorted = [...students].sort((a, b) => b.totalScore - a.totalScore);
  
  return sorted.map((student) => {
    const higherCount = sorted.filter(s => s.totalScore > student.totalScore).length;
    return {
      ...student,
      rank: higherCount + 1
    } as Student;
  });
}

// Default Teacher Profile from Excel Header & Metadata
export const DEFAULT_TEACHER_PROFILE: TeacherProfile = {
  teacherName: 'ព្រំ សុធន',
  gender: 'ប្រុស',
  schoolName: 'សាលាបឋមសិក្សាវត្តចែង',
  telegram: '098 629 231',
  phoneNumber: '098 629 231',
  academicYear: '២០២៥ - ២០២៦',
  gradeClass: 'ថ្នាក់ទី៦',
  province: 'បាត់ដំបង',
  district: 'សង្កែ',
  commune: 'អូតាពូង',
  village: 'វត្តចែង'
};

// Exact School Summary Data directly imported from user's Excel file:
export const SCHOOL_SUMMARY_DATA: SchoolSummaryRow[] = [
  {
    grade: 'ថ្នាក់ទី១',
    section: 'បន្ទប់ ១',
    startYearTotal: 37,
    startYearFemale: 17,
    gradeA: { total: 0, female: 0, percent: 0 },
    gradeB: { total: 0, female: 0, percent: 0 },
    gradeC: { total: 0, female: 0, percent: 0 },
    gradeD: { total: 0, female: 0, percent: 0 },
    gradeE: { total: 0, female: 0, percent: 0 },
    gradeF: { total: 0, female: 0, percent: 0 },
    passPercent: '0%'
  },
  {
    grade: 'ថ្នាក់ទី១',
    section: 'បន្ទប់ ២',
    startYearTotal: 30,
    startYearFemale: 10,
    gradeA: { total: 0, female: 0, percent: 0 },
    gradeB: { total: 0, female: 0, percent: 0 },
    gradeC: { total: 0, female: 0, percent: 0 },
    gradeD: { total: 0, female: 0, percent: 0 },
    gradeE: { total: 0, female: 0, percent: 0 },
    gradeF: { total: 0, female: 0, percent: 0 },
    passPercent: '0%'
  },
  {
    grade: 'ថ្នាក់ទី១ (សរុប)',
    section: 'សរុបថ្នាក់ទី១',
    startYearTotal: 67,
    startYearFemale: 27,
    gradeA: { total: 0, female: 0, percent: 0 },
    gradeB: { total: 0, female: 0, percent: 0 },
    gradeC: { total: 0, female: 0, percent: 0 },
    gradeD: { total: 0, female: 0, percent: 0 },
    gradeE: { total: 0, female: 0, percent: 0 },
    gradeF: { total: 0, female: 0, percent: 0 },
    passPercent: '0%',
    isTotalRow: true
  },
  {
    grade: 'ថ្នាក់ទី២',
    section: 'បន្ទប់ ១',
    startYearTotal: 34,
    startYearFemale: 14,
    gradeA: { total: 0, female: 0, percent: 0 },
    gradeB: { total: 1, female: 1, percent: 2.94 },
    gradeC: { total: 6, female: 1, percent: 17.65 },
    gradeD: { total: 15, female: 4, percent: 44.12 },
    gradeE: { total: 10, female: 6, percent: 29.41 },
    gradeF: { total: 2, female: 2, percent: 5.88 },
    passPercent: '100%'
  },
  {
    grade: 'ថ្នាក់ទី២',
    section: 'បន្ទប់ ២',
    startYearTotal: 41,
    startYearFemale: 26,
    gradeA: { total: 0, female: 0, percent: 0 },
    gradeB: { total: 2, female: 2, percent: 4.88 },
    gradeC: { total: 4, female: 2, percent: 9.76 },
    gradeD: { total: 10, female: 8, percent: 24.39 },
    gradeE: { total: 15, female: 11, percent: 36.59 },
    gradeF: { total: 10, female: 3, percent: 24.39 },
    passPercent: '100%'
  },
  {
    grade: 'ថ្នាក់ទី២ (សរុប)',
    section: 'សរុបថ្នាក់ទី២',
    startYearTotal: 75,
    startYearFemale: 40,
    gradeA: { total: 0, female: 0, percent: 0 },
    gradeB: { total: 3, female: 3, percent: 4.00 },
    gradeC: { total: 10, female: 3, percent: 13.33 },
    gradeD: { total: 25, female: 12, percent: 33.33 },
    gradeE: { total: 25, female: 17, percent: 33.33 },
    gradeF: { total: 12, female: 5, percent: 16.00 },
    passPercent: '100%',
    isTotalRow: true
  },
  {
    grade: 'ថ្នាក់ទី៣',
    section: 'បន្ទប់ ១',
    startYearTotal: 31,
    startYearFemale: 13,
    gradeA: { total: 0, female: 0, percent: 0 },
    gradeB: { total: 2, female: 2, percent: 6.45 },
    gradeC: { total: 4, female: 4, percent: 12.90 },
    gradeD: { total: 6, female: 2, percent: 19.35 },
    gradeE: { total: 14, female: 3, percent: 45.16 },
    gradeF: { total: 5, female: 2, percent: 16.13 },
    passPercent: '100%'
  },
  {
    grade: 'ថ្នាក់ទី៣',
    section: 'បន្ទប់ ២',
    startYearTotal: 30,
    startYearFemale: 14,
    gradeA: { total: 0, female: 0, percent: 0 },
    gradeB: { total: 3, female: 3, percent: 10.00 },
    gradeC: { total: 8, female: 4, percent: 26.67 },
    gradeD: { total: 9, female: 3, percent: 30.00 },
    gradeE: { total: 4, female: 2, percent: 13.33 },
    gradeF: { total: 6, female: 1, percent: 20.00 },
    passPercent: '100%'
  },
  {
    grade: 'ថ្នាក់ទី៣',
    section: 'បន្ទប់ ៣',
    startYearTotal: 21,
    startYearFemale: 11,
    gradeA: { total: 0, female: 0, percent: 0 },
    gradeB: { total: 0, female: 0, percent: 0 },
    gradeC: { total: 1, female: 1, percent: 4.76 },
    gradeD: { total: 3, female: 2, percent: 14.29 },
    gradeE: { total: 5, female: 4, percent: 23.81 },
    gradeF: { total: 2, female: 2, percent: 9.52 },
    passPercent: '52%'
  },
  {
    grade: 'ថ្នាក់ទី៣ (សរុប)',
    section: 'សរុបថ្នាក់ទី៣',
    startYearTotal: 82,
    startYearFemale: 38,
    gradeA: { total: 0, female: 0, percent: 0 },
    gradeB: { total: 5, female: 5, percent: 6.10 },
    gradeC: { total: 13, female: 9, percent: 15.85 },
    gradeD: { total: 18, female: 7, percent: 21.95 },
    gradeE: { total: 23, female: 9, percent: 28.05 },
    gradeF: { total: 13, female: 3, percent: 15.85 },
    passPercent: '88%',
    isTotalRow: true
  },
  {
    grade: 'ថ្នាក់ទី៤',
    section: 'បន្ទប់ ១',
    startYearTotal: 45,
    startYearFemale: 19,
    gradeA: { total: 0, female: 0, percent: 0 },
    gradeB: { total: 2, female: 1, percent: 4.44 },
    gradeC: { total: 4, female: 3, percent: 8.89 },
    gradeD: { total: 8, female: 4, percent: 17.78 },
    gradeE: { total: 18, female: 6, percent: 40.00 },
    gradeF: { total: 13, female: 5, percent: 28.89 },
    passPercent: '100%'
  },
  {
    grade: 'ថ្នាក់ទី៤',
    section: 'បន្ទប់ ២',
    startYearTotal: 44,
    startYearFemale: 22,
    gradeA: { total: 0, female: 0, percent: 0 },
    gradeB: { total: 5, female: 4, percent: 11.36 },
    gradeC: { total: 8, female: 6, percent: 18.18 },
    gradeD: { total: 14, female: 7, percent: 31.82 },
    gradeE: { total: 11, female: 3, percent: 25.00 },
    gradeF: { total: 6, female: 2, percent: 13.64 },
    passPercent: '100%'
  },
  {
    grade: 'ថ្នាក់ទី៤ (សរុប)',
    section: 'សរុបថ្នាក់ទី៤',
    startYearTotal: 89,
    startYearFemale: 41,
    gradeA: { total: 0, female: 0, percent: 0 },
    gradeB: { total: 7, female: 5, percent: 7.87 },
    gradeC: { total: 12, female: 9, percent: 13.48 },
    gradeD: { total: 22, female: 11, percent: 24.72 },
    gradeE: { total: 29, female: 9, percent: 32.58 },
    gradeF: { total: 19, female: 7, percent: 21.35 },
    passPercent: '100%',
    isTotalRow: true
  },
  {
    grade: 'ថ្នាក់ទី៥',
    section: 'បន្ទប់ ១',
    startYearTotal: 38,
    startYearFemale: 22,
    gradeA: { total: 0, female: 0, percent: 0 },
    gradeB: { total: 1, female: 1, percent: 2.63 },
    gradeC: { total: 5, female: 4, percent: 13.16 },
    gradeD: { total: 8, female: 6, percent: 21.05 },
    gradeE: { total: 12, female: 6, percent: 31.58 },
    gradeF: { total: 12, female: 5, percent: 31.58 },
    passPercent: '100%'
  },
  {
    grade: 'ថ្នាក់ទី៥',
    section: 'បន្ទប់ ២',
    startYearTotal: 40,
    startYearFemale: 25,
    gradeA: { total: 0, female: 0, percent: 0 },
    gradeB: { total: 6, female: 4, percent: 15.00 },
    gradeC: { total: 10, female: 10, percent: 25.00 },
    gradeD: { total: 14, female: 9, percent: 35.00 },
    gradeE: { total: 3, female: 0, percent: 7.50 },
    gradeF: { total: 7, female: 2, percent: 17.50 },
    passPercent: '100%'
  },
  {
    grade: 'ថ្នាក់ទី៥ (សរុប)',
    section: 'សរុបថ្នាក់ទី៥',
    startYearTotal: 78,
    startYearFemale: 47,
    gradeA: { total: 0, female: 0, percent: 0 },
    gradeB: { total: 7, female: 5, percent: 8.97 },
    gradeC: { total: 15, female: 14, percent: 19.23 },
    gradeD: { total: 22, female: 15, percent: 28.21 },
    gradeE: { total: 15, female: 6, percent: 19.23 },
    gradeF: { total: 19, female: 7, percent: 24.36 },
    passPercent: '100%',
    isTotalRow: true
  },
  {
    grade: 'ថ្នាក់ទី៦',
    section: 'បន្ទប់ ១',
    startYearTotal: 33,
    startYearFemale: 16,
    gradeA: { total: 1, female: 1, percent: 3.03 },
    gradeB: { total: 4, female: 3, percent: 12.12 },
    gradeC: { total: 9, female: 6, percent: 27.27 },
    gradeD: { total: 12, female: 5, percent: 36.36 },
    gradeE: { total: 3, female: 1, percent: 9.09 },
    gradeF: { total: 4, female: 0, percent: 12.12 },
    passPercent: '100%'
  },
  {
    grade: 'ថ្នាក់ទី៦',
    section: 'បន្ទប់ ២',
    startYearTotal: 34,
    startYearFemale: 12,
    gradeA: { total: 2, female: 1, percent: 5.88 },
    gradeB: { total: 7, female: 2, percent: 20.59 },
    gradeC: { total: 8, female: 5, percent: 23.53 },
    gradeD: { total: 9, female: 3, percent: 26.47 },
    gradeE: { total: 5, female: 1, percent: 14.71 },
    gradeF: { total: 3, female: 0, percent: 8.82 },
    passPercent: '100%'
  },
  {
    grade: 'ថ្នាក់ទី៦ (សរុប)',
    section: 'សរុបថ្នាក់ទី៦',
    startYearTotal: 67,
    startYearFemale: 28,
    gradeA: { total: 3, female: 2, percent: 4.48 },
    gradeB: { total: 11, female: 5, percent: 16.42 },
    gradeC: { total: 17, female: 11, percent: 25.37 },
    gradeD: { total: 21, female: 8, percent: 31.34 },
    gradeE: { total: 8, female: 2, percent: 11.94 },
    gradeF: { total: 7, female: 0, percent: 10.45 },
    passPercent: '100%',
    isTotalRow: true
  },
  {
    grade: 'ថ្នាក់ទី១-៦ (សរុបទូទាំងសាលា)',
    section: 'សរុបទូទាំងសាលា',
    startYearTotal: 458,
    startYearFemale: 221,
    gradeA: { total: 3, female: 2, percent: 0.66 },
    gradeB: { total: 33, female: 23, percent: 7.21 },
    gradeC: { total: 67, female: 46, percent: 14.63 },
    gradeD: { total: 108, female: 53, percent: 23.58 },
    gradeE: { total: 100, female: 43, percent: 21.83 },
    gradeF: { total: 70, female: 22, percent: 15.28 },
    passPercent: '83%',
    isTotalRow: true
  }
];

// Initial Students with Cambodian demographics
export const INITIAL_STUDENTS_RAW = [
  {
    id: '1',
    studentId: 'ST-001',
    name: 'សុខ ជា',
    gender: 'ប្រុស',
    gradeLevel: 'ថ្នាក់ទី៦',
    dob: '២០០៩-០៣-១២',
    pob: 'បាត់ដំបង',
    parentName: 'សុខ ម៉េង',
    parentPhone: '097 555 1234',
    preTestScore: 65,
    postTestScore: 88,
    scores: { khmer: 85, math: 95, physics: 88, chemistry: 78, biology: 82, english: 90 }
  },
  {
    id: '2',
    studentId: 'ST-002',
    name: 'ចាន់ ធីតា',
    gender: 'ស្រី',
    gradeLevel: 'ថ្នាក់ទី៦',
    dob: '២០០៩-០៥-២១',
    pob: 'បាត់ដំបង',
    parentName: 'ចាន់ សុផល',
    parentPhone: '098 777 6543',
    preTestScore: 78,
    postTestScore: 92,
    scores: { khmer: 92, math: 88, physics: 85, chemistry: 90, biology: 94, english: 95 }
  },
  {
    id: '3',
    studentId: 'ST-003',
    name: 'សេង ហុង',
    gender: 'ប្រុស',
    gradeLevel: 'ថ្នាក់ទី៦',
    dob: '២០០៩-០១-១៥',
    pob: 'បាត់ដំបង',
    parentName: 'សេង វណ្ណា',
    parentPhone: '012 345 6789',
    preTestScore: 50,
    postTestScore: 68,
    scores: { khmer: 65, math: 70, physics: 68, chemistry: 60, biology: 72, english: 58 }
  },
  {
    id: '4',
    studentId: 'ST-004',
    name: 'លី ស្រីនី',
    gender: 'ស្រី',
    gradeLevel: 'ថ្នាក់ទី៦',
    dob: '២០០៩-០៨-១៩',
    pob: 'បាត់ដំបង',
    parentName: 'លី រតនា',
    parentPhone: '010 888 9999',
    preTestScore: 62,
    postTestScore: 81,
    scores: { khmer: 78, math: 82, physics: 75, chemistry: 80, biology: 76, english: 84 }
  },
  {
    id: '5',
    studentId: 'ST-005',
    name: 'អ៊ុក វណ្ណដា',
    gender: 'ប្រុស',
    gradeLevel: 'ថ្នាក់ទី៦',
    dob: '២០០៩-០៤-០៥',
    pob: 'បាត់ដំបង',
    parentName: 'អ៊ុក សំអាត',
    parentPhone: '088 222 3344',
    preTestScore: 80,
    postTestScore: 93,
    scores: { khmer: 90, math: 92, physics: 94, chemistry: 89, biology: 91, english: 88 }
  },
  {
    id: '6',
    studentId: 'ST-006',
    name: 'ម៉ៅ ចន្ថា',
    gender: 'ស្រី',
    gradeLevel: 'ថ្នាក់ទី៦',
    dob: '២០០៩-១០-៣០',
    pob: 'បាត់ដំបង',
    parentName: 'ម៉ៅ បូរី',
    parentPhone: '015 667 8899',
    preTestScore: 40,
    postTestScore: 55,
    scores: { khmer: 58, math: 48, physics: 52, chemistry: 50, biology: 55, english: 60 }
  },
  {
    id: '7',
    studentId: 'ST-007',
    name: 'ភិន មុន្នី',
    gender: 'ប្រុស',
    gradeLevel: 'ថ្នាក់ទី៦',
    dob: '២០០៩-១២-១១',
    pob: 'បាត់ដំបង',
    parentName: 'ភិន សារ៉េត',
    parentPhone: '096 112 3344',
    preTestScore: 55,
    postTestScore: 72,
    scores: { khmer: 72, math: 65, physics: 70, chemistry: 74, biology: 68, english: 71 }
  },
  {
    id: '8',
    studentId: 'ST-008',
    name: 'ទូច សុជាតា',
    gender: 'ស្រី',
    gradeLevel: 'ថ្នាក់ទី៦',
    dob: '២០០៩-០៧-១៤',
    pob: 'បាត់ដំបង',
    parentName: 'ទូច វិចិត្រ',
    parentPhone: '070 334 5566',
    preTestScore: 75,
    postTestScore: 90,
    scores: { khmer: 88, math: 90, physics: 86, chemistry: 85, biology: 89, english: 92 }
  },
  {
    id: '9',
    studentId: 'ST-009',
    name: 'កែវ សិរីវុឌ្ឍ',
    gender: 'ប្រុស',
    gradeLevel: 'ថ្នាក់ទី៦',
    dob: '២០០៩-០២-២៧',
    pob: 'បាត់ដំបង',
    parentName: 'កែវ សម្បត្តិ',
    parentPhone: '092 889 9001',
    preTestScore: 68,
    postTestScore: 80,
    scores: { khmer: 80, math: 75, physics: 78, chemistry: 82, biology: 80, english: 78 }
  },
  {
    id: '10',
    studentId: 'ST-010',
    name: 'ជា សុភ័ក្ត្រ',
    gender: 'ស្រី',
    gradeLevel: 'ថ្នាក់ទី៦',
    dob: '២០០៩-១១-០៨',
    pob: 'បាត់ដំបង',
    parentName: 'ជា ចិន្តា',
    parentPhone: '097 990 1122',
    preTestScore: 38,
    postTestScore: 49,
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

// Initial Book Borrowing/Returning List
export const INITIAL_BOOK_RECORDS: BookRecord[] = [
  {
    id: 'b1',
    studentId: 'ST-001',
    studentName: 'សុខ ជា',
    gender: 'ប្រុស',
    bookTitle: 'គណិតវិទ្យា ថ្នាក់ទី៦ (ក្រសួង)',
    borrowDate: '២០២៦-០១-១០',
    returnDate: '២០២៦-០១-២៤',
    status: 'បានសងរួច',
    librarianNote: 'សៀវភៅស្អាតល្អ'
  },
  {
    id: 'b2',
    studentId: 'ST-002',
    studentName: 'ចាន់ ធីតា',
    gender: 'ស្រី',
    bookTitle: 'រឿងព្រេងខ្មែរ ភាគ ៥',
    borrowDate: '២០២៦-០២-០៥',
    returnDate: '',
    status: 'កំពុងខ្ចី',
    librarianNote: 'ខ្ចីសម្រាប់អានស្រាវជ្រាវ'
  },
  {
    id: 'b3',
    studentId: 'ST-004',
    studentName: 'លី ស្រីនី',
    gender: 'ស្រី',
    bookTitle: 'ភាសាខ្មែរ អក្សរសិល្ប៍ ថ្នាក់ទី៦',
    borrowDate: '២០២៦-០២-១២',
    returnDate: '',
    status: 'កំពុងខ្ចី',
    librarianNote: ''
  },
  {
    id: 'b4',
    studentId: 'ST-005',
    studentName: 'អ៊ុក វណ្ណដា',
    gender: 'ប្រុស',
    bookTitle: 'វិទ្យាសាស្ត្រ និងការស្រាវជ្រាវកុមារ',
    borrowDate: '២០២៦-០១-១៨',
    returnDate: '២០២៦-០២-០១',
    status: 'បានសងរួច',
    librarianNote: 'សងទាន់ពេលវេលា'
  },
  {
    id: 'b5',
    studentId: 'ST-008',
    studentName: 'ទូច សុជាតា',
    gender: 'ស្រី',
    bookTitle: 'វេយ្យាករណ៍ភាសាខ្មែរ',
    borrowDate: '២០២៦-០២-១៦',
    returnDate: '',
    status: 'កំពុងខ្ចី',
    librarianNote: ''
  }
];

// Classroom Cleaning Duty Schedule (វេនសម្អាត)
export const INITIAL_CLEANING_DUTIES: CleaningDuty[] = [
  {
    dayOfWeek: 'ថ្ងៃច័ន្ទ',
    teamLeader: 'សុខ ជា',
    members: ['សុខ ជា', 'ចាន់ ធីតា'],
    tasks: ['បោស និងជូតឥដ្ឋ', 'ជូតក្តារខៀន', 'រៀបចំតុគ្រូ']
  },
  {
    dayOfWeek: 'ថ្ងៃអង្គារ',
    teamLeader: 'សេង ហុង',
    members: ['សេង ហុង', 'លី ស្រីនី'],
    tasks: ['បោសសំអាតថ្នាក់', 'បោសសម្អាតទីធ្លាមុខថ្នាក់', 'ចាក់ធុងសំរាម']
  },
  {
    dayOfWeek: 'ថ្ងៃពុធ',
    teamLeader: 'អ៊ុក វណ្ណដា',
    members: ['អ៊ុក វណ្ណដា', 'ម៉ៅ ចន្ថា'],
    tasks: ['បោសសំអាតក្នុងថ្នាក់', 'ជូតបង្អួច', 'លាងជូតជ័រលុបក្តារខៀន']
  },
  {
    dayOfWeek: 'ថ្ងៃព្រហស្បតិ៍',
    teamLeader: 'ភិន មុន្នី',
    members: ['ភិន មុន្នី', 'ទូច សុជាតា'],
    tasks: ['បោស និងជូតឥដ្ឋ', 'ស្រោចផ្កាមុខថ្នាក់', 'រៀបចំតុសិស្សឱ្យត្រង់ជួរ']
  },
  {
    dayOfWeek: 'ថ្ងៃសុក្រ',
    teamLeader: 'កែវ សិរីវុឌ្ឍ',
    members: ['កែវ សិរីវុឌ្ឍ', 'ជា សុភ័ក្ត្រ'],
    tasks: ['បោសសំអាតទូទៅ', 'បិទបង្អួចទ្វារ', 'ប្រមូលសំរាមទៅទីលាន']
  },
  {
    dayOfWeek: 'ថ្ងៃសៅរ៍',
    teamLeader: 'គ្រប់ក្រុមទាំងអស់',
    members: ['សិស្សទាំងអស់ក្នុងថ្នាក់'],
    tasks: ['ពលកម្មអនាម័យទូទាំងសាលា', 'ដាំ និងកាត់ស្មៅ', 'រៀបចំសម្ភារសិក្សា']
  }
];

// Physical Fitness Records (តេស្តកាយសម្បទា)
export const INITIAL_FITNESS_RECORDS: FitnessTestRecord[] = [
  {
    studentId: 'ST-001',
    studentName: 'សុខ ជា',
    gender: 'ប្រុស',
    heightCm: 148,
    weightKg: 41,
    running50mSec: 8.2,
    longJumpCm: 185,
    shuttleRunSec: 11.4,
    resultGrade: 'ល្អប្រសើរ'
  },
  {
    studentId: 'ST-002',
    studentName: 'ចាន់ ធីតា',
    gender: 'ស្រី',
    heightCm: 145,
    weightKg: 38,
    running50mSec: 8.9,
    longJumpCm: 162,
    shuttleRunSec: 12.1,
    resultGrade: 'ល្អ'
  },
  {
    studentId: 'ST-003',
    studentName: 'សេង ហុង',
    gender: 'ប្រុស',
    heightCm: 152,
    weightKg: 46,
    running50mSec: 9.1,
    longJumpCm: 170,
    shuttleRunSec: 12.5,
    resultGrade: 'មធ្យម'
  },
  {
    studentId: 'ST-004',
    studentName: 'លី ស្រីនី',
    gender: 'ស្រី',
    heightCm: 142,
    weightKg: 36,
    running50mSec: 9.0,
    longJumpCm: 158,
    shuttleRunSec: 12.3,
    resultGrade: 'ល្អ'
  },
  {
    studentId: 'ST-005',
    studentName: 'អ៊ុក វណ្ណដា',
    gender: 'ប្រុស',
    heightCm: 150,
    weightKg: 43,
    running50mSec: 7.9,
    longJumpCm: 195,
    shuttleRunSec: 10.9,
    resultGrade: 'ល្អប្រសើរ'
  }
];

// All available school grade levels (ថ្នាក់ទី១ ដល់ ថ្នាក់ទី៦)
export const GRADE_LEVELS = [
  'ថ្នាក់ទី១',
  'ថ្នាក់ទី២',
  'ថ្នាក់ទី៣',
  'ថ្នាក់ទី៤',
  'ថ្នាក់ទី៥',
  'ថ្នាក់ទី៦'
] as const;
