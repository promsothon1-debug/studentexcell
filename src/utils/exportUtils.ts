import * as XLSX from 'xlsx';
import { Student } from '../types';

/**
 * 1. Export as Native Excel (.xlsx) file with styled worksheets and statistics
 */
export function exportToExcel(students: Student[]) {
  // Compute subject averages
  const totalStudents = students.length || 1;
  const avgKhmer = (students.reduce((a, b) => a + b.scores.khmer, 0) / totalStudents).toFixed(1);
  const avgMath = (students.reduce((a, b) => a + b.scores.math, 0) / totalStudents).toFixed(1);
  const avgPhysics = (students.reduce((a, b) => a + b.scores.physics, 0) / totalStudents).toFixed(1);
  const avgChemistry = (students.reduce((a, b) => a + b.scores.chemistry, 0) / totalStudents).toFixed(1);
  const avgBiology = (students.reduce((a, b) => a + b.scores.biology, 0) / totalStudents).toFixed(1);
  const avgEnglish = (students.reduce((a, b) => a + b.scores.english, 0) / totalStudents).toFixed(1);
  const avgTotal = (students.reduce((a, b) => a + b.totalScore, 0) / totalStudents).toFixed(1);
  const avgOverall = (students.reduce((a, b) => a + b.average, 0) / totalStudents).toFixed(1);

  // Student scores worksheet data
  const mainData = students.map((s, index) => ({
    'ល.រ (No.)': index + 1,
    'អត្តលេខ (ID)': s.studentId,
    'ឈ្មោះសិស្ស (Name)': s.name,
    'ភេទ (Gender)': s.gender,
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
  }));

  // Summary row
  mainData.push({
    'ល.រ (No.)': '∑',
    'អត្តលេខ (ID)': '-',
    'ឈ្មោះសិស្ស (Name)': 'មធ្យមភាគថ្នាក់ (Class Average)',
    'ភេទ (Gender)': '-',
    'ភាសាខ្មែរ (Khmer)': Number(avgKhmer),
    'គណិតវិទ្យា (Math)': Number(avgMath),
    'រូបវិទ្យា (Physics)': Number(avgPhysics),
    'គីមីវិទ្យា (Chemistry)': Number(avgChemistry),
    'ជីវវិទ្យា (Biology)': Number(avgBiology),
    'អង់គ្លេស (English)': Number(avgEnglish),
    'ពិន្ទុសរុប (Total)': Number(avgTotal),
    'មធ្យមភាគ (Average)': Number(avgOverall),
    'និទ្ទេស (Grade)': '-',
    'ចំណាត់ថ្នាក់ (Rank)': '-',
  } as any);

  // Class Summary Sheet data
  const passCount = students.filter(s => s.average >= 50).length;
  const failCount = students.length - passCount;
  const passRate = ((passCount / totalStudents) * 100).toFixed(1) + '%';
  const topStudent = [...students].sort((a, b) => a.rank - b.rank)[0];

  const summaryData = [
    { 'សូចនាករ (Metric)': 'ចំនួនសិស្សសរុប (Total Students)', 'តម្លៃ (Value)': totalStudents },
    { 'សូចនាករ (Metric)': 'ចំនួនសិស្សជាប់ (Passed Students)', 'តម្លៃ (Value)': passCount },
    { 'សូចនាករ (Metric)': 'ចំនួនសិស្សធ្លាក់ (Failed Students)', 'តម្លៃ (Value)': failCount },
    { 'សូចនាករ (Metric)': 'អត្រាជាប់ (Pass Rate)', 'តម្លៃ (Value)': passRate },
    { 'សូចនាករ (Metric)': 'មធ្យមភាគរួមថ្នាក់ (Class Average Score)', 'តម្លៃ (Value)': avgOverall },
    { 'សូចនាករ (Metric)': 'សិស្សពូកែលេខ ១ (Top Scorer)', 'តម្លៃ (Value)': topStudent ? `${topStudent.name} (${topStudent.average} ពិន្ទុ)` : '-' },
    { 'សូចនាករ (Metric)': 'មធ្យមភាគភាសាខ្មែរ', 'តម្លៃ (Value)': avgKhmer },
    { 'សូចនាករ (Metric)': 'មធ្យមភាគគណិតវិទ្យា', 'តម្លៃ (Value)': avgMath },
    { 'សូចនាករ (Metric)': 'មធ្យមភាគរូបវិទ្យា', 'តម្លៃ (Value)': avgPhysics },
    { 'សូចនាករ (Metric)': 'មធ្យមភាគគីមីវិទ្យា', 'តម្លៃ (Value)': avgChemistry },
    { 'សូចនាករ (Metric)': 'មធ្យមភាគជីវវិទ្យា', 'តម្លៃ (Value)': avgBiology },
    { 'សូចនាករ (Metric)': 'មធ្យមភាគអង់គ្លេស', 'តម្លៃ (Value)': avgEnglish },
  ];

  const workbook = XLSX.utils.book_new();

  // Create worksheets
  const sheet1 = XLSX.utils.json_to_sheet(mainData);
  const sheet2 = XLSX.utils.json_to_sheet(summaryData);

  // Set column widths
  sheet1['!cols'] = [
    { wch: 8 },  // No.
    { wch: 14 }, // ID
    { wch: 24 }, // Name
    { wch: 10 }, // Gender
    { wch: 14 }, // Khmer
    { wch: 14 }, // Math
    { wch: 14 }, // Physics
    { wch: 14 }, // Chemistry
    { wch: 14 }, // Biology
    { wch: 14 }, // English
    { wch: 14 }, // Total
    { wch: 14 }, // Average
    { wch: 12 }, // Grade
    { wch: 14 }, // Rank
  ];

  sheet2['!cols'] = [
    { wch: 35 },
    { wch: 30 },
  ];

  XLSX.utils.book_append_sheet(workbook, sheet1, 'បញ្ជីពិន្ទុសិស្ស');
  XLSX.utils.book_append_sheet(workbook, sheet2, 'ស្ថិតិថ្នាក់');

  // Trigger file download
  XLSX.writeFile(workbook, 'ប្រព័ន្ធគ្រប់គ្រងពិន្ទុសិស្ស_Student_Scores.xlsx');
}

/**
 * 2. Export as MS Word (.doc) Document
 */
export function exportToWord(students: Student[]) {
  const totalStudents = students.length || 1;
  const passCount = students.filter(s => s.average >= 50).length;
  const failCount = students.length - passCount;
  const passRate = ((passCount / totalStudents) * 100).toFixed(1);
  const classAvg = (students.reduce((a, b) => a + b.average, 0) / totalStudents).toFixed(1);

  const avgKhmer = (students.reduce((a, b) => a + b.scores.khmer, 0) / totalStudents).toFixed(1);
  const avgMath = (students.reduce((a, b) => a + b.scores.math, 0) / totalStudents).toFixed(1);
  const avgPhysics = (students.reduce((a, b) => a + b.scores.physics, 0) / totalStudents).toFixed(1);
  const avgChemistry = (students.reduce((a, b) => a + b.scores.chemistry, 0) / totalStudents).toFixed(1);
  const avgBiology = (students.reduce((a, b) => a + b.scores.biology, 0) / totalStudents).toFixed(1);
  const avgEnglish = (students.reduce((a, b) => a + b.scores.english, 0) / totalStudents).toFixed(1);

  const tableRowsHtml = students.map((s, index) => `
    <tr style="background-color: ${index % 2 === 0 ? '#ffffff' : '#f8fafc'};">
      <td style="border: 1px solid #cbd5e1; padding: 6px; text-align: center;">${index + 1}</td>
      <td style="border: 1px solid #cbd5e1; padding: 6px; text-align: center; font-weight: bold; color: #2563eb;">${s.studentId}</td>
      <td style="border: 1px solid #cbd5e1; padding: 6px; font-weight: bold;">${s.name}</td>
      <td style="border: 1px solid #cbd5e1; padding: 6px; text-align: center;">${s.gender}</td>
      <td style="border: 1px solid #cbd5e1; padding: 6px; text-align: center;">${s.scores.khmer}</td>
      <td style="border: 1px solid #cbd5e1; padding: 6px; text-align: center;">${s.scores.math}</td>
      <td style="border: 1px solid #cbd5e1; padding: 6px; text-align: center;">${s.scores.physics}</td>
      <td style="border: 1px solid #cbd5e1; padding: 6px; text-align: center;">${s.scores.chemistry}</td>
      <td style="border: 1px solid #cbd5e1; padding: 6px; text-align: center;">${s.scores.biology}</td>
      <td style="border: 1px solid #cbd5e1; padding: 6px; text-align: center;">${s.scores.english}</td>
      <td style="border: 1px solid #cbd5e1; padding: 6px; text-align: center; font-weight: bold;">${s.totalScore}</td>
      <td style="border: 1px solid #cbd5e1; padding: 6px; text-align: center; font-weight: bold; color: #1e3a8a;">${s.average}</td>
      <td style="border: 1px solid #cbd5e1; padding: 6px; text-align: center; font-weight: bold; color: ${s.grade === 'F' ? '#e11d48' : '#16a34a'};">${s.grade}</td>
      <td style="border: 1px solid #cbd5e1; padding: 6px; text-align: center; font-weight: bold;">${s.rank}</td>
    </tr>
  `).join('');

  const wordHtml = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset='utf-8'>
      <title>របាយការណ៍ពិន្ទុសិស្ស - MS Word</title>
      <style>
        body {
          font-family: 'Khmer OS Battambang', 'Segoe UI', Arial, sans-serif;
          margin: 20px;
          color: #1e293b;
        }
        h1 {
          color: #1e3a8a;
          text-align: center;
          font-size: 22px;
          margin-bottom: 5px;
        }
        .subtitle {
          text-align: center;
          font-size: 13px;
          color: #64748b;
          margin-bottom: 25px;
        }
        .summary-box {
          border: 1px solid #2563eb;
          background-color: #eff6ff;
          padding: 12px;
          border-radius: 6px;
          margin-bottom: 20px;
        }
        .summary-title {
          font-weight: bold;
          color: #1e40af;
          margin-bottom: 8px;
          font-size: 14px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          font-size: 11px;
        }
        th {
          background-color: #2563eb;
          color: #ffffff;
          border: 1px solid #1d4ed8;
          padding: 8px 4px;
          text-align: center;
        }
        .summary-row {
          background-color: #dbeafe;
          font-weight: bold;
        }
        .footer-sign {
          margin-top: 40px;
          display: flex;
          justify-content: space-between;
        }
      </style>
    </head>
    <body>
      <h1>ព្រះរាជាណាចក្រកម្ពុជា</h1>
      <h2 style="text-align: center; font-size: 16px; margin-top: 0; color: #334155;">ជាតិ សាសនា ព្រះមហាក្សត្រ</h2>
      <hr style="width: 200px; margin: 10px auto 20px auto; border: 1px solid #94a3b8;" />

      <h1>របាយការណ៍ពិន្ទុសិស្សសរុប (Student Scores Report)</h1>
      <div class="subtitle">ប្រព័ន្ធគ្រប់គ្រងពិន្ទុសិស្សលក្ខណៈ Excel • កាលបរិច្ឆេទ៖ ២០២៦-០៧-២២</div>

      <div class="summary-box">
        <div class="summary-title">📊 សេចក្តីសង្ខេបលទ្ធផលរួមថ្នាក់ (Executive Summary)</div>
        <p style="margin: 3px 0;">• ចំនួនសិស្សសរុប៖ <strong>${totalStudents} នាក់</strong> | សិស្សជាប់៖ <strong style="color:#16a34a;">${passCount} នាក់</strong> | សិស្សធ្លាក់៖ <strong style="color:#dc2626;">${failCount} នាក់</strong></p>
        <p style="margin: 3px 0;">• អត្រាជាប់សរុប៖ <strong>${passRate}%</strong> | មធ្យមភាគពិន្ទុរួមថ្នាក់៖ <strong>${classAvg} ពិន្ទុ</strong></p>
      </div>

      <h3 style="color: #1e293b; font-size: 14px;">១. បញ្ជីរាយនាម និងពិន្ទុសិស្សលម្អិត</h3>
      <table>
        <thead>
          <tr>
            <th>ល.រ</th>
            <th>អត្តលេខ</th>
            <th>ឈ្មោះសិស្ស</th>
            <th>ភេទ</th>
            <th>ខ្មែរ</th>
            <th>គណិត</th>
            <th>រូប</th>
            <th>គីមី</th>
            <th>ជីវ</th>
            <th>អង់គ្លេស</th>
            <th>សរុប</th>
            <th>មធ្យមភាគ</th>
            <th>និទ្ទេស</th>
            <th>ចំណាត់ថ្នាក់</th>
          </tr>
        </thead>
        <tbody>
          ${tableRowsHtml}
          <tr class="summary-row">
            <td style="border: 1px solid #cbd5e1; padding: 6px; text-align: center;">∑</td>
            <td style="border: 1px solid #cbd5e1; padding: 6px; text-align: center;">-</td>
            <td style="border: 1px solid #cbd5e1; padding: 6px;">មធ្យមភាគថ្នាក់ (Class Avg)</td>
            <td style="border: 1px solid #cbd5e1; padding: 6px; text-align: center;">-</td>
            <td style="border: 1px solid #cbd5e1; padding: 6px; text-align: center;">${avgKhmer}</td>
            <td style="border: 1px solid #cbd5e1; padding: 6px; text-align: center;">${avgMath}</td>
            <td style="border: 1px solid #cbd5e1; padding: 6px; text-align: center;">${avgPhysics}</td>
            <td style="border: 1px solid #cbd5e1; padding: 6px; text-align: center;">${avgChemistry}</td>
            <td style="border: 1px solid #cbd5e1; padding: 6px; text-align: center;">${avgBiology}</td>
            <td style="border: 1px solid #cbd5e1; padding: 6px; text-align: center;">${avgEnglish}</td>
            <td style="border: 1px solid #cbd5e1; padding: 6px; text-align: center;">-</td>
            <td style="border: 1px solid #cbd5e1; padding: 6px; text-align: center;">${classAvg}</td>
            <td style="border: 1px solid #cbd5e1; padding: 6px; text-align: center;">-</td>
            <td style="border: 1px solid #cbd5e1; padding: 6px; text-align: center;">-</td>
          </tr>
        </tbody>
      </table>

      <br/><br/>
      <table style="border: none; width: 100%;">
        <tr style="background: none;">
          <td style="border: none; text-align: center; width: 50%;">
            <p>បានឃើញ និងឯកភាព</p>
            <p><strong>នាយក / នាយិកាសាលា</strong></p>
          </td>
          <td style="border: none; text-align: center; width: 50%;">
            <p>ថ្ងៃទី ២២ ខែកក្កដា ឆ្នាំ២០២៦</p>
            <p><strong>គ្រូប្រចាំថ្នាក់</strong></p>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  const blob = new Blob(['\ufeff', wordHtml], {
    type: 'application/msword;charset=utf-8'
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'របាយការណ៍ពិន្ទុសិស្ស_MS_Word.doc';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

/**
 * 3. Google Sheets Integration & CSV Export
 */
export function exportToGoogleSheets(students: Student[]): { csvString: string } {
  const headers = [
    'ល.រ (No.)',
    'អត្តលេខ (Student ID)',
    'ឈ្មោះសិស្ស (Student Name)',
    'ភេទ (Gender)',
    'ភាសាខ្មែរ (Khmer)',
    'គណិតវិទ្យា (Math)',
    'រូបវិទ្យា (Physics)',
    'គីមីវិទ្យា (Chemistry)',
    'ជីវវិទ្យា (Biology)',
    'អង់គ្លេស (English)',
    'ពិន្ទុសរុប (Total Score)',
    'មធ្យមភាគ (Average)',
    'និទ្ទេស (Grade)',
    'ចំណាត់ថ្នាក់ (Rank)'
  ];

  const rows = students.map((s, index) => [
    index + 1,
    `"${s.studentId}"`,
    `"${s.name}"`,
    `"${s.gender}"`,
    s.scores.khmer,
    s.scores.math,
    s.scores.physics,
    s.scores.chemistry,
    s.scores.biology,
    s.scores.english,
    s.totalScore,
    s.average,
    `"${s.grade}"`,
    s.rank
  ]);

  const csvString = '\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');

  // Trigger Google Sheets compatible CSV download
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', 'Student_Scores_Google_Sheets.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  return { csvString };
}
