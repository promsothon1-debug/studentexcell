import * as XLSX from 'xlsx';
import { Student, SubjectScores, TeacherProfile, SchoolSummaryRow, BookRecord, CleaningDuty, FitnessTestRecord } from '../types';
import { 
  computeStudentCalculations, 
  computeRankings,
  DEFAULT_TEACHER_PROFILE,
  SCHOOL_SUMMARY_DATA,
  INITIAL_BOOK_RECORDS,
  INITIAL_CLEANING_DUTIES,
  INITIAL_FITNESS_RECORDS,
  getInitialStudents
} from '../data';

export interface StorageSnapshot {
  id: string;
  timestamp: string;
  count: number;
  label: string;
  data: Student[];
}

/**
 * 1. Export complete active data as a Master Excel Database File (.xlsx)
 * Contains all sheets: Student Scores & Demographics, Class Statistics,
 * School Summary, Library Records, Cleaning Duties, Physical Fitness, and Teacher Profile.
 */
export function saveToExcelDatabaseFile(students: Student[], customFileName?: string) {
  const fileName = customFileName || `គំរូឯកសារផ្ទុកទិន្នន័យសិស្ស_${new Date().toISOString().split('T')[0]}.xlsx`;

  // Sheet 1: Student scores & demographics worksheet
  const scoresData = students.map((s, index) => ({
    'ល.រ (No.)': index + 1,
    'អត្តលេខ (ID)': s.studentId,
    'ឈ្មោះសិស្ស (Name)': s.name,
    'ភេទ (Gender)': s.gender,
    'កម្រិតថ្នាក់ (Grade)': s.gradeLevel || 'ថ្នាក់ទី៦',
    'ថ្ងៃខែឆ្នាំកំណើត (DOB)': s.dob || '-',
    'ទីកន្លែងកំណើត (POB)': s.pob || '-',
    'អាណាព្យាបាល (Parent)': s.parentName || '-',
    'លេខទូរស័ព្ទ (Phone)': s.parentPhone || '-',
    'តេស្តដើមឆ្នាំ (Pre-Test)': s.preTestScore ?? '-',
    'តេស្តចុងឆ្នាំ (Post-Test)': s.postTestScore ?? '-',
    'ភាសាខ្មែរ (Khmer)': s.scores.khmer,
    'គណិតវិទ្យា (Math)': s.scores.math,
    'រូបវិទ្យា (Physics)': s.scores.physics,
    'គីមីវិទ្យា (Chemistry)': s.scores.chemistry,
    'ជីវវិទ្យា (Biology)': s.scores.biology,
    'អង់គ្លេស (English)': s.scores.english,
    'ពិន្ទុសរុប (Total)': s.totalScore,
    'មធ្យមភាគ (Average)': s.average,
    'និទ្ទេស (Grade)': s.grade,
    'ចំណាត់ថ្នាក់ (Rank)': s.rank,
    'UUID': s.id
  }));

  // Sheet 2: Class Statistics Worksheet
  const total = students.length || 1;
  const passCount = students.filter(s => s.average >= 50).length;
  const failCount = students.length - passCount;
  const passRate = ((passCount / total) * 100).toFixed(1) + '%';
  const topStudent = [...students].sort((a, b) => a.rank - b.rank)[0];

  const avgKhmer = (students.reduce((a, b) => a + b.scores.khmer, 0) / total).toFixed(1);
  const avgMath = (students.reduce((a, b) => a + b.scores.math, 0) / total).toFixed(1);
  const avgPhysics = (students.reduce((a, b) => a + b.scores.physics, 0) / total).toFixed(1);
  const avgChemistry = (students.reduce((a, b) => a + b.scores.chemistry, 0) / total).toFixed(1);
  const avgBiology = (students.reduce((a, b) => a + b.scores.biology, 0) / total).toFixed(1);
  const avgEnglish = (students.reduce((a, b) => a + b.scores.english, 0) / total).toFixed(1);
  const classAvg = (students.reduce((a, b) => a + b.average, 0) / total).toFixed(1);

  const statsData = [
    { 'សូចនាករ (Metric)': 'ចំនួនសិស្សសរុប (Total Students)', 'តម្លៃ (Value)': total },
    { 'សូចនាករ (Metric)': 'សិស្សជាប់ (Passed)', 'តម្លៃ (Value)': passCount },
    { 'សូចនាករ (Metric)': 'សិស្សធ្លាក់ (Failed)', 'តម្លៃ (Value)': failCount },
    { 'សូចនាករ (Metric)': 'អត្រាជាប់ (Pass Rate)', 'តម្លៃ (Value)': passRate },
    { 'សូចនាករ (Metric)': 'មធ្យមភាគរួមថ្នាក់ (Class Average)', 'តម្លៃ (Value)': classAvg },
    { 'សូចនាករ (Metric)': 'សិស្សពូកែលេខ ១ (Top Scorer)', 'តម្លៃ (Value)': topStudent ? `${topStudent.name} (${topStudent.average} ពិន្ទុ)` : '-' },
    { 'សូចនាករ (Metric)': 'មធ្យមភាគខ្មែរ', 'តម្លៃ (Value)': avgKhmer },
    { 'សូចនាករ (Metric)': 'មធ្យមភាគគណិត', 'តម្លៃ (Value)': avgMath },
    { 'សូចនាករ (Metric)': 'មធ្យមភាគរូបវិទ្យា', 'តម្លៃ (Value)': avgPhysics },
    { 'សូចនាករ (Metric)': 'មធ្យមភាគគីមីវិទ្យា', 'តម្លៃ (Value)': avgChemistry },
    { 'សូចនាករ (Metric)': 'មធ្យមភាគជីវវិទ្យា', 'តម្លៃ (Value)': avgBiology },
    { 'សូចនាករ (Metric)': 'មធ្យមភាគអង់គ្លេស', 'តម្លៃ (Value)': avgEnglish },
  ];

  // Sheet 3: School Summary Data
  const schoolSummaryRows = SCHOOL_SUMMARY_DATA.map((r, i) => ({
    'ល.រ': i + 1,
    'កម្រិតថ្នាក់ (Grade)': r.grade,
    'បន្ទប់/ផ្នែក (Section)': r.section || '-',
    'ដើមឆ្នាំ សរុប': r.startYearTotal,
    'ដើមឆ្នាំ ស្រី': r.startYearFemale,
    'និទ្ទេស A សរុប': r.gradeA.total,
    'និទ្ទេស A ស្រី': r.gradeA.female,
    'និទ្ទេស B សរុប': r.gradeB.total,
    'និទ្ទេស B ស្រី': r.gradeB.female,
    'និទ្ទេស C សរុប': r.gradeC.total,
    'និទ្ទេស C ស្រី': r.gradeC.female,
    'និទ្ទេស D សរុប': r.gradeD.total,
    'និទ្ទេស D ស្រី': r.gradeD.female,
    'និទ្ទេស E សរុប': r.gradeE.total,
    'និទ្ទេស E ស្រី': r.gradeE.female,
    'និទ្ទេស F សរុប': r.gradeF.total,
    'និទ្ទេស F ស្រី': r.gradeF.female,
    'អត្រាជាប់ (%)': r.passPercent
  }));

  // Sheet 4: Library Borrowing Records
  const libraryRows = INITIAL_BOOK_RECORDS.map((b, i) => ({
    'ល.រ': i + 1,
    'អត្តលេខ': b.studentId,
    'ឈ្មោះសិស្ស': b.studentName,
    'ភេទ': b.gender,
    'ចំណងជើងសៀវភៅ': b.bookTitle,
    'កាលបរិច្ឆេទខ្ចី': b.borrowDate,
    'កាលបរិច្ឆេទសង': b.returnDate || 'មិនទាន់សង',
    'ស្ថានភាព': b.status,
    'កំណត់សម្គាល់បណ្ណារក្ស': b.librarianNote || '-'
  }));

  // Sheet 5: Cleaning Duties Schedule
  const dutyRows = INITIAL_CLEANING_DUTIES.map((d, i) => ({
    'ល.រ': i + 1,
    'ថ្ងៃនៃសប្តាហ៍': d.dayOfWeek,
    'ប្រធានក្រុម': d.teamLeader,
    'សមាជិក': d.members.join(', '),
    'ភារកិច្ចសម្អាត': d.tasks.join(', ')
  }));

  // Sheet 6: Physical Fitness Records
  const fitnessRows = INITIAL_FITNESS_RECORDS.map((f, i) => ({
    'ល.រ': i + 1,
    'អត្តលេខ': f.studentId,
    'ឈ្មោះសិស្ស': f.studentName,
    'ភេទ': f.gender,
    'កម្ពស់ (cm)': f.heightCm,
    'ទម្ងន់ (kg)': f.weightKg,
    'រត់ 50m (វិនាទី)': f.running50mSec,
    'លោតចម្ងាយ (cm)': f.longJumpCm,
    'រត់ត្រឡប់ 4x10m (វិនាទី)': f.shuttleRunSec,
    'លទ្ធផលវាយតម្លៃ': f.resultGrade
  }));

  // Sheet 7: Teacher & School Profile
  const profileRows = [
    { 'ព័ត៌មាន': 'ឈ្មោះលោកគ្រូ/អ្នកគ្រូ', 'ខ្លឹមសារ': DEFAULT_TEACHER_PROFILE.teacherName },
    { 'ព័ត៌មាន': 'ភេទ', 'ខ្លឹមសារ': DEFAULT_TEACHER_PROFILE.gender },
    { 'ព័ត៌មាន': 'ឈ្មោះសាលារៀន', 'ខ្លឹមសារ': DEFAULT_TEACHER_PROFILE.schoolName },
    { 'ព័ត៌មាន': 'ថ្នាក់រៀន', 'ខ្លឹមសារ': DEFAULT_TEACHER_PROFILE.gradeClass },
    { 'ព័ត៌មាន': 'ឆ្នាំសិក្សា', 'ខ្លឹមសារ': DEFAULT_TEACHER_PROFILE.academicYear },
    { 'ព័ត៌មាន': 'លេខទូរស័ព្ទ', 'ខ្លឹមសារ': DEFAULT_TEACHER_PROFILE.phoneNumber },
    { 'ព័ត៌មាន': 'តេឡេក្រាម (Telegram)', 'ខ្លឹមសារ': DEFAULT_TEACHER_PROFILE.telegram },
    { 'ព័ត៌មាន': 'ភូមិ', 'ខ្លឹមសារ': DEFAULT_TEACHER_PROFILE.village },
    { 'ព័ត៌មាន': 'ឃុំ/សង្កាត់', 'ខ្លឹមសារ': DEFAULT_TEACHER_PROFILE.commune },
    { 'ព័ត៌មាន': 'ស្រុក/ក្រុង', 'ខ្លឹមសារ': DEFAULT_TEACHER_PROFILE.district },
    { 'ព័ត៌មាន': 'ខេត្ត/រាជធានី', 'ខ្លឹមសារ': DEFAULT_TEACHER_PROFILE.province },
    { 'ព័ត៌មាន': 'កាលបរិច្ឆេទបង្កើតឯកសារ', 'ខ្លឹមសារ': new Date().toISOString() },
    { 'ព័ត៌មាន': 'ប្រព័ន្ធកម្មវិធី', 'ខ្លឹមសារ': 'ប្រព័ន្ធគ្រប់គ្រងពិន្ទុសិស្សលក្ខណៈ Excel' }
  ];

  const wb = XLSX.utils.book_new();

  const wsScores = XLSX.utils.json_to_sheet(scoresData);
  const wsStats = XLSX.utils.json_to_sheet(statsData);
  const wsSchool = XLSX.utils.json_to_sheet(schoolSummaryRows);
  const wsLibrary = XLSX.utils.json_to_sheet(libraryRows);
  const wsDuty = XLSX.utils.json_to_sheet(dutyRows);
  const wsFitness = XLSX.utils.json_to_sheet(fitnessRows);
  const wsProfile = XLSX.utils.json_to_sheet(profileRows);

  wsScores['!cols'] = [
    { wch: 8 },  // No.
    { wch: 14 }, // ID
    { wch: 22 }, // Name
    { wch: 10 }, // Gender
    { wch: 16 }, // DOB
    { wch: 16 }, // POB
    { wch: 20 }, // Parent
    { wch: 16 }, // Phone
    { wch: 12 }, // Pre
    { wch: 12 }, // Post
    { wch: 12 }, // Khmer
    { wch: 12 }, // Math
    { wch: 12 }, // Physics
    { wch: 12 }, // Chemistry
    { wch: 12 }, // Biology
    { wch: 12 }, // English
    { wch: 12 }, // Total
    { wch: 12 }, // Average
    { wch: 10 }, // Grade
    { wch: 12 }, // Rank
    { wch: 20 }, // UUID
  ];

  XLSX.utils.book_append_sheet(wb, wsScores, 'បញ្ជីពិន្ទុសិស្ស');
  XLSX.utils.book_append_sheet(wb, wsStats, 'ស្ថិតិរួមថ្នាក់');
  XLSX.utils.book_append_sheet(wb, wsSchool, 'ស្ថិតិសាលា_ថ្នាក់ទី១-៦');
  XLSX.utils.book_append_sheet(wb, wsLibrary, 'សៀវភៅខ្ចីសៀវភៅ');
  XLSX.utils.book_append_sheet(wb, wsDuty, 'វេនសម្អាត');
  XLSX.utils.book_append_sheet(wb, wsFitness, 'តេស្តកាយសម្បទា');
  XLSX.utils.book_append_sheet(wb, wsProfile, 'ព័ត៌មានគ្រូនិងសាលា');

  XLSX.writeFile(wb, fileName);
  return fileName;
}

/**
 * 2. Export Official Standard Template File with all sample data (.xlsx)
 */
export function exportOfficialTemplateFile(customFileName?: string) {
  const initialStudents = getInitialStudents();
  const fileName = customFileName || `គំរូឯកសារផ្ទុកទិន្នន័យសិស្ស_វត្តចែង_ថ្នាក់ទី៦.xlsx`;
  return saveToExcelDatabaseFile(initialStudents, fileName);
}

/**
 * 3. Save complete data as a JSON Database File (.json)
 */
export function saveToJsonDatabaseFile(students: Student[], customFileName?: string) {
  const fileName = customFileName || `student_scores_backup_${new Date().toISOString().split('T')[0]}.json`;
  const backupObject = {
    app: 'Excel Student Score Manager',
    version: '2.0.0',
    exportDate: new Date().toISOString(),
    school: DEFAULT_TEACHER_PROFILE,
    totalStudents: students.length,
    students: students,
    schoolSummary: SCHOOL_SUMMARY_DATA,
    libraryRecords: INITIAL_BOOK_RECORDS,
    cleaningDuties: INITIAL_CLEANING_DUTIES,
    fitnessRecords: INITIAL_FITNESS_RECORDS
  };

  const jsonStr = JSON.stringify(backupObject, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  return fileName;
}

/**
 * 4. Save as PostgreSQL / MySQL compatible SQL Insert File (.sql)
 * Based on schema.sql
 */
export function saveToSqlDatabaseFile(students: Student[], customFileName?: string) {
  const fileName = customFileName || `student_scores_dump_${new Date().toISOString().split('T')[0]}.sql`;
  
  let sql = `-- ====================================================================\n`;
  sql += `-- Student Score Management Data Dump (SQL Format)\n`;
  sql += `-- School: ${DEFAULT_TEACHER_PROFILE.schoolName} - ${DEFAULT_TEACHER_PROFILE.gradeClass}\n`;
  sql += `-- Teacher: ${DEFAULT_TEACHER_PROFILE.teacherName}\n`;
  sql += `-- Generated Date: ${new Date().toISOString()}\n`;
  sql += `-- Total Students: ${students.length}\n`;
  sql += `-- Compatible with PostgreSQL / MySQL (src/schema.sql)\n`;
  sql += `-- ====================================================================\n\n`;

  sql += `-- 1. Students Insert\n`;
  students.forEach((s, idx) => {
    const safeName = s.name.replace(/'/g, "''");
    const safeGender = s.gender === 'ស្រី' ? 'ស្រី' : 'ប្រុស';
    sql += `INSERT INTO students (id, student_id, name, gender) VALUES ('${s.id || idx + 1}', '${s.studentId}', '${safeName}', '${safeGender}') ON CONFLICT (id) DO UPDATE SET student_id = EXCLUDED.student_id, name = EXCLUDED.name, gender = EXCLUDED.gender;\n`;
  });

  sql += `\n-- 2. Scores Insert\n`;
  students.forEach((s, idx) => {
    const sc = s.scores;
    sql += `INSERT INTO scores (id, student_table_id, khmer, math, physics, chemistry, biology, english) VALUES ('sc-${s.id || idx + 1}', '${s.id || idx + 1}', ${sc.khmer}, ${sc.math}, ${sc.physics}, ${sc.chemistry}, ${sc.biology}, ${sc.english}) ON CONFLICT (id) DO UPDATE SET khmer = EXCLUDED.khmer, math = EXCLUDED.math, physics = EXCLUDED.physics, chemistry = EXCLUDED.chemistry, biology = EXCLUDED.biology, english = EXCLUDED.english;\n`;
  });

  const blob = new Blob([sql], { type: 'text/sql;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  return fileName;
}

/**
 * 5. Parse incoming storage file (.xlsx, .xls, .csv, .json)
 * Restores scores and Cambodian student demographics (DOB, POB, Parent, Phone, Pre/Post test).
 */
export async function parseStorageFile(file: File): Promise<{ students: Student[]; fileName: string; format: string }> {
  const extension = file.name.split('.').pop()?.toLowerCase();

  // If JSON backup file
  if (extension === 'json') {
    const text = await file.text();
    const parsed = JSON.parse(text);
    const rawStudents: any[] = Array.isArray(parsed) ? parsed : (parsed.students || []);

    if (!Array.isArray(rawStudents) || rawStudents.length === 0) {
      throw new Error('ឯកសារ JSON មិនមានទម្រង់បញ្ជីសិស្សត្រឹមត្រូវឡើយ!');
    }

    const students: Student[] = rawStudents.map((s, idx) => {
      const scores: SubjectScores = {
        khmer: Number(s.scores?.khmer ?? s.khmer ?? 0),
        math: Number(s.scores?.math ?? s.math ?? 0),
        physics: Number(s.scores?.physics ?? s.physics ?? 0),
        chemistry: Number(s.scores?.chemistry ?? s.chemistry ?? 0),
        biology: Number(s.scores?.biology ?? s.biology ?? 0),
        english: Number(s.scores?.english ?? s.english ?? 0),
      };
      const calcs = computeStudentCalculations(scores);
      return {
        id: s.id || `json-${Date.now()}-${idx}`,
        studentId: s.studentId || `ST-${String(idx + 1).padStart(3, '0')}`,
        name: s.name || `សិស្ស #${idx + 1}`,
        gender: s.gender || 'ប្រុស',
        dob: s.dob || '',
        pob: s.pob || '',
        parentName: s.parentName || '',
        parentPhone: s.parentPhone || '',
        preTestScore: s.preTestScore,
        postTestScore: s.postTestScore,
        scores,
        ...calcs,
        rank: s.rank || idx + 1
      };
    });

    const reRanked = computeRankings(students);
    return { students: reRanked, fileName: file.name, format: 'JSON File' };
  }

  // If Excel or CSV file
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: 'array' });
  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];
  const rows: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

  if (!rows || rows.length === 0) {
    throw new Error('ឯកសារ Excel នេះគ្មានទិន្នន័យឡើយ!');
  }

  // Normalize helper
  const normalize = (str: any) => String(str || '').trim().toLowerCase().replace(/[\s_()\-.]/g, '');

  let headerIdx = 0;
  for (let i = 0; i < Math.min(6, rows.length); i++) {
    const rowStr = JSON.stringify(rows[i] || '').toLowerCase();
    if (rowStr.includes('ឈ្មោះ') || rowStr.includes('name') || rowStr.includes('អត្តលេខ') || rowStr.includes('id')) {
      headerIdx = i;
      break;
    }
  }

  const headers = (rows[headerIdx] || []).map(normalize);

  let idIdx = headers.findIndex(h => h.includes('អត្តលេខ') || h.includes('id') || h.includes('studentid'));
  let nameIdx = headers.findIndex(h => h.includes('ឈ្មោះ') || h.includes('name') || h.includes('studentname'));
  let genderIdx = headers.findIndex(h => h.includes('ភេទ') || h.includes('gender') || h.includes('sex'));
  let gradeLevelIdx = headers.findIndex(h => h.includes('កម្រិត') || h.includes('ថ្នាក់') || h.includes('grade'));
  let dobIdx = headers.findIndex(h => h.includes('dob') || h.includes('birth') || h.includes('កំណើត') || h.includes('ថ្ងៃខែ'));
  let pobIdx = headers.findIndex(h => h.includes('pob') || h.includes('កន្លែង') || h.includes('ទីកន្លែងកំណើត'));
  let parentIdx = headers.findIndex(h => h.includes('parent') || h.includes('អាណាព្យាបាល') || h.includes('ឪពុក'));
  let phoneIdx = headers.findIndex(h => h.includes('phone') || h.includes('tel') || h.includes('ទូរស័ព្ទ'));
  let preIdx = headers.findIndex(h => h.includes('pre') || h.includes('ដើមឆ្នាំ') || h.includes('មុនរៀន'));
  let postIdx = headers.findIndex(h => h.includes('post') || h.includes('ចុងឆ្នាំ') || h.includes('ក្រោយរៀន'));

  let khmerIdx = headers.findIndex(h => h.includes('ខ្មែរ') || h.includes('khmer'));
  let mathIdx = headers.findIndex(h => h.includes('គណិត') || h.includes('math'));
  let physicsIdx = headers.findIndex(h => h.includes('រូប') || h.includes('physic'));
  let chemistryIdx = headers.findIndex(h => h.includes('គីមី') || h.includes('chemis'));
  let biologyIdx = headers.findIndex(h => h.includes('ជីវ') || h.includes('biol'));
  let englishIdx = headers.findIndex(h => h.includes('អង់គ្លេស') || h.includes('english') || h.includes('eng'));

  // Fallbacks if not matched nicely
  if (idIdx === -1) idIdx = 1;
  if (nameIdx === -1) nameIdx = 2;
  if (genderIdx === -1) genderIdx = 3;

  const parsedStudents: Omit<Student, 'rank'>[] = [];

  for (let i = headerIdx + 1; i < rows.length; i++) {
    const row = rows[i];
    if (!row || !Array.isArray(row) || row.length === 0) continue;

    const rawId = row[idIdx] !== undefined ? String(row[idIdx]).trim() : '';
    const rawName = row[nameIdx] !== undefined ? String(row[nameIdx]).trim() : '';

    if (!rawName || rawName.includes('មធ្យមភាគ') || rawName.includes('សរុប') || rawName.toLowerCase().includes('average')) {
      continue;
    }

    const parseNum = (v: any) => {
      const num = parseFloat(v);
      return isNaN(num) ? 0 : Math.min(100, Math.max(0, num));
    };

    const genderVal = String(row[genderIdx] || '').trim();
    const gender = genderVal.includes('ស្រី') || genderVal.toLowerCase().startsWith('f') ? 'ស្រី' : 'ប្រុស';
    const rawGradeLevel = gradeLevelIdx !== -1 && row[gradeLevelIdx] ? String(row[gradeLevelIdx]).trim() : 'ថ្នាក់ទី៦';

    const scores: SubjectScores = {
      khmer: khmerIdx !== -1 ? parseNum(row[khmerIdx]) : 0,
      math: mathIdx !== -1 ? parseNum(row[mathIdx]) : 0,
      physics: physicsIdx !== -1 ? parseNum(row[physicsIdx]) : 0,
      chemistry: chemistryIdx !== -1 ? parseNum(row[chemistryIdx]) : 0,
      biology: biologyIdx !== -1 ? parseNum(row[biologyIdx]) : 0,
      english: englishIdx !== -1 ? parseNum(row[englishIdx]) : 0,
    };

    const calculations = computeStudentCalculations(scores);

    parsedStudents.push({
      id: `storage-file-${Date.now()}-${i}`,
      studentId: rawId || `ST-${String(parsedStudents.length + 1).padStart(3, '0')}`,
      name: rawName,
      gender,
      gradeLevel: rawGradeLevel || 'ថ្នាក់ទី៦',
      dob: dobIdx !== -1 && row[dobIdx] ? String(row[dobIdx]).trim() : '',
      pob: pobIdx !== -1 && row[pobIdx] ? String(row[pobIdx]).trim() : '',
      parentName: parentIdx !== -1 && row[parentIdx] ? String(row[parentIdx]).trim() : '',
      parentPhone: phoneIdx !== -1 && row[phoneIdx] ? String(row[phoneIdx]).trim() : '',
      preTestScore: preIdx !== -1 && row[preIdx] !== undefined ? Number(row[preIdx]) : undefined,
      postTestScore: postIdx !== -1 && row[postIdx] !== undefined ? Number(row[postIdx]) : undefined,
      scores,
      ...calculations
    });
  }

  if (parsedStudents.length === 0) {
    throw new Error('រកមិនឃើញទិន្នន័យសិស្សក្នុងឯកសារនេះទេ! សូមពិនិត្យមើល Column ឈ្មោះ និងពិន្ទុ។');
  }

  const finalRanked = computeRankings(parsedStudents);
  return { students: finalRanked, fileName: file.name, format: extension?.toUpperCase() || 'Excel' };
}
