import React, { useState } from 'react';
import { Student } from '../types';
import { Award, Printer, Upload, User, Sparkles } from 'lucide-react';

interface HonorRollProps {
  students: Student[];
}

export default function HonorRoll({ students }: HonorRollProps) {
  // Configurable metadata
  const [districtOffice, setDistrictOffice] = useState('ការិយាល័យអប់រំ យុវជន និងកីឡា នៃរដ្ឋបាលស្រុកសំពៅលូន');
  const [schoolName, setSchoolName] = useState('សាលា បឋមសិក្សាកំពង់ចង');
  const [communeName, setCommuneName] = useState('ឃុំ អូរស្រឡៅ');
  const [termText, setTermText] = useState('ប្រចាំ ឆមាសទី១');
  
  // Date & Signatures
  const [lunarDateText, setLunarDateText] = useState('ថ្ងៃ ចន្ទ ៥កើត ខែ ចេត្រ ឆ្នាំ ម្សាញ់ សប្តស័ក ព.ស.២៥៦៩');
  const [reportDateText, setReportDateText] = useState('ធ្វើនៅវត្តចែង, ថ្ងៃទី ២៣ ខែ មីនា ឆ្នាំ ២០២៦');
  const [teacherName, setTeacherName] = useState('ព្រុំ សុធន');

  // Custom photo overrides per student ID (Data URL or image URL)
  const [customPhotos, setCustomPhotos] = useState<Record<string, string>>({});

  // Top 5 ranked students
  const topStudents = [...students].sort((a, b) => a.rank - b.rank).slice(0, 5);

  // Default avatars if student has no photo
  const getDefaultPhoto = (gender: string, index: number) => {
    const isFemale = gender === 'ស្រី' || gender === 'Female';
    const malePhotos = [
      'https://images.unsplash.com/photo-1544717305-2782549b5136?w=300&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    ];
    const femalePhotos = [
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    ];
    const list = isFemale ? femalePhotos : malePhotos;
    return list[index % list.length];
  };

  const handlePhotoUpload = (studentId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setCustomPhotos((prev) => ({
            ...prev,
            [studentId]: e.target!.result as string,
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Rank position mapping for top 5
  // Rank 1: Top center
  // Rank 2: Mid left
  // Rank 3: Mid right
  // Rank 4: Bottom left
  // Rank 5: Bottom right
  const rankLabels: Record<number, { text: string; bg: string }> = {
    1: { text: 'លេខ១', bg: 'text-red-600' },
    2: { text: 'លេខ២', bg: 'text-red-600' },
    3: { text: 'លេខ៣', bg: 'text-red-600' },
    4: { text: 'លេខ៤', bg: 'text-red-600' },
    5: { text: 'លេខ៥', bg: 'text-red-600' },
  };

  const getStudentByRank = (rankNum: number) => {
    return topStudents.find((s) => s.rank === rankNum) || topStudents[rankNum - 1];
  };

  const renderStudentCard = (rankNum: number, positionClass: string) => {
    const student = getStudentByRank(rankNum);
    if (!student) return null;

    const photoUrl = customPhotos[student.id] || getDefaultPhoto(student.gender, rankNum);

    return (
      <div className={`flex flex-col items-center group relative ${positionClass}`}>
        {/* Rank Badge */}
        <div className="font-bold text-red-600 text-base md:text-lg mb-1 drop-shadow-xs font-sans">
          {rankLabels[rankNum]?.text || `លេខ ${rankNum}`}
        </div>

        {/* Photo Container with Golden Wreath Styling */}
        <div className="relative w-28 h-36 md:w-32 md:h-40 rounded-lg p-1 border-2 border-amber-400 bg-gradient-to-b from-amber-100 to-amber-200 shadow-md flex items-center justify-center overflow-hidden">
          {/* Student Photo */}
          <img
            src={photoUrl}
            alt={student.name}
            className="w-full h-full object-cover rounded border border-amber-300"
          />

          {/* Golden Laurel Wreath Overlay Effect */}
          <div className="absolute inset-0 pointer-events-none border-4 border-amber-400/40 rounded-lg" />

          {/* Upload Photo Hover Button */}
          <label 
            className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center text-white text-[10px] font-bold cursor-pointer no-print p-1 text-center"
            title="ប្តូររូបថតសិស្ស"
          >
            <Upload className="w-5 h-5 mb-1 text-amber-300" />
            <span>ប្តូររូបថត</span>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handlePhotoUpload(student.id, e)}
              className="hidden"
            />
          </label>
        </div>

        {/* Gold & Blue Name Plaque */}
        <div className="mt-2 relative w-48 md:w-56 py-2 px-3 bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 rounded-xl border-2 border-amber-400 shadow-lg text-center flex items-center justify-center">
          {/* Gold Decorative Corner Highlights */}
          <div className="absolute left-1 top-1 w-2 h-2 border-t-2 border-l-2 border-amber-300" />
          <div className="absolute right-1 top-1 w-2 h-2 border-t-2 border-r-2 border-amber-300" />
          <div className="absolute left-1 bottom-1 w-2 h-2 border-b-2 border-l-2 border-amber-300" />
          <div className="absolute right-1 bottom-1 w-2 h-2 border-b-2 border-r-2 border-amber-300" />

          {/* Student Name */}
          <span className="font-bold text-amber-300 text-sm md:text-base font-moul tracking-wide drop-shadow-sm">
            {student.name}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6" id="honor-roll-container">
      {/* Control Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4 no-print">
        <div className="flex items-center gap-3">
          <div className="bg-amber-50 text-amber-600 p-2.5 rounded-lg">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-800">តារាងកិត្តិយសសិស្សពូកែ (Honor Roll Board)</h2>
            <p className="text-xs text-slate-500">បង្ហាញសិស្សទទួលបានចំណាត់ថ្នាក់កំពូលប្រចាំថ្នាក់</p>
          </div>
        </div>

        <button
          onClick={handlePrint}
          className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-1.5 transition cursor-pointer shadow-xs"
        >
          <Printer className="w-4 h-4" />
          <span>បោះពុម្ពតារាងកិត្តិយស (Print)</span>
        </button>
      </div>

      {/* Main Honor Roll Sheet */}
      <div className="bg-white p-6 md:p-10 rounded-2xl border-4 border-amber-500/80 shadow-xl font-sans text-slate-900 relative overflow-hidden printable-area">
        {/* Khmer Traditional Corner Ornaments (CSS Framed) */}
        <div className="absolute top-2 left-2 w-12 h-12 border-t-4 border-l-4 border-amber-600 rounded-tl-xl pointer-events-none" />
        <div className="absolute top-2 right-2 w-12 h-12 border-t-4 border-r-4 border-amber-600 rounded-tr-xl pointer-events-none" />
        <div className="absolute bottom-2 left-2 w-12 h-12 border-b-4 border-l-4 border-amber-600 rounded-bl-xl pointer-events-none" />
        <div className="absolute bottom-2 right-2 w-12 h-12 border-b-4 border-r-4 border-amber-600 rounded-br-xl pointer-events-none" />

        {/* Outer Frame Padding */}
        <div className="border-2 border-dashed border-amber-300/80 p-4 sm:p-6 rounded-xl space-y-6">
          
          {/* Header Bar */}
          <div className="flex items-start justify-between">
            {/* Left Header */}
            <div className="text-xs font-bold text-blue-900 space-y-1 max-w-xs">
              <input
                type="text"
                value={districtOffice}
                onChange={(e) => setDistrictOffice(e.target.value)}
                className="w-full bg-transparent focus:outline-none"
              />
              <div className="flex items-center gap-1">
                <span>សាលា៖</span>
                <input
                  type="text"
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  className="w-full bg-transparent focus:outline-none border-b border-dotted border-blue-300"
                />
              </div>
              <div className="flex items-center gap-1">
                <span>ឃុំ៖</span>
                <input
                  type="text"
                  value={communeName}
                  onChange={(e) => setCommuneName(e.target.value)}
                  className="w-full bg-transparent focus:outline-none border-b border-dotted border-blue-300"
                />
              </div>
            </div>

            {/* Right Header */}
            <div className="text-right text-xs font-bold text-blue-900 space-y-1">
              <div>ព្រះរាជាណាចក្រកម្ពុជា</div>
              <div>ជាតិ សាសនា ព្រះមហាក្សត្រ</div>
              <div className="pt-2 text-red-600">
                <input
                  type="text"
                  value={termText}
                  onChange={(e) => setTermText(e.target.value)}
                  className="text-right bg-transparent focus:outline-none font-bold text-red-600"
                />
              </div>
            </div>
          </div>

          {/* Banner Title */}
          <div className="flex justify-center py-2">
            <div className="border-2 border-amber-600 bg-amber-50 px-10 py-2 rounded-2xl shadow-sm text-center">
              <h1 className="text-2xl sm:text-3xl font-bold text-red-600 font-moul tracking-wider drop-shadow-xs">
                តារាងកិត្តិយស
              </h1>
            </div>
          </div>

          {/* Student Podium Grid */}
          <div className="py-6 space-y-8">
            {/* Row 1: Rank 1 (Top Center) */}
            <div className="flex justify-center">
              {renderStudentCard(1, '')}
            </div>

            {/* Row 2: Rank 2 & Rank 3 */}
            <div className="grid grid-cols-2 gap-4 md:gap-8 justify-items-center">
              {renderStudentCard(2, '')}
              {renderStudentCard(3, '')}
            </div>

            {/* Row 3: Rank 4 & Rank 5 */}
            <div className="grid grid-cols-2 gap-4 md:gap-8 justify-items-center">
              {renderStudentCard(4, '')}
              {renderStudentCard(5, '')}
            </div>
          </div>

          {/* Footer Date & Signatures */}
          <div className="pt-6 space-y-2 text-xs font-bold text-blue-900">
            <div className="text-right space-y-1">
              <input
                type="text"
                value={lunarDateText}
                onChange={(e) => setLunarDateText(e.target.value)}
                className="text-right text-blue-900 font-medium w-full max-w-md bg-transparent focus:outline-none text-xs"
              />
              <input
                type="text"
                value={reportDateText}
                onChange={(e) => setReportDateText(e.target.value)}
                className="text-right text-blue-900 font-bold w-full max-w-md bg-transparent focus:outline-none text-xs"
              />
              <div className="pr-12 pt-1 font-bold">
                <span>គ្រូបន្ទុកថ្នាក់</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 pt-2">
              <div className="space-y-1">
                <div>បានឃើញ និងឯកភាព</div>
                <div className="text-blue-900 font-bold">នាយកសាលា</div>
              </div>

              <div className="text-right pr-4 pt-10">
                <input
                  type="text"
                  value={teacherName}
                  onChange={(e) => setTeacherName(e.target.value)}
                  className="text-right text-blue-900 font-bold w-36 focus:outline-none border-b border-dotted border-slate-400"
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
