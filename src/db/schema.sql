-- ====================================================================
-- ប្រព័ន្ធគ្រប់គ្រងពិន្ទុសិស្ស (Student Score Management Database Schema)
-- Database Engine: PostgreSQL / MySQL Compatible
-- Generated Date: 2026-07-22
-- ====================================================================

-- 1. បង្កើតតារាងព័ត៌មានសិស្ស (Students Table)
CREATE TABLE IF NOT EXISTS students (
    id VARCHAR(36) PRIMARY KEY,
    student_id VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    gender VARCHAR(10) NOT NULL CHECK (gender IN ('ប្រុស', 'ស្រី', 'Male', 'Female')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. បង្កើតតារាងពិន្ទុតាមមុខវិជ្ជា (Subject Scores Table)
CREATE TABLE IF NOT EXISTS scores (
    id VARCHAR(36) PRIMARY KEY,
    student_table_id VARCHAR(36) NOT NULL UNIQUE REFERENCES students(id) ON DELETE CASCADE,
    khmer NUMERIC(5, 2) NOT NULL DEFAULT 0.00 CHECK (khmer >= 0 AND khmer <= 100),
    math NUMERIC(5, 2) NOT NULL DEFAULT 0.00 CHECK (math >= 0 AND math <= 100),
    physics NUMERIC(5, 2) NOT NULL DEFAULT 0.00 CHECK (physics >= 0 AND physics <= 100),
    chemistry NUMERIC(5, 2) NOT NULL DEFAULT 0.00 CHECK (chemistry >= 0 AND chemistry <= 100),
    biology NUMERIC(5, 2) NOT NULL DEFAULT 0.00 CHECK (biology >= 0 AND biology <= 100),
    english NUMERIC(5, 2) NOT NULL DEFAULT 0.00 CHECK (english >= 0 AND english <= 100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. បង្កើត Index សម្រាប់បង្កើនល្បឿនស្វែងរក (Indexes)
CREATE INDEX IF NOT EXISTS idx_students_student_id ON students(student_id);
CREATE INDEX IF NOT EXISTS idx_students_name ON students(name);

-- 4. VIEW សម្រាប់គណនាពិន្ទុសរុប, មធ្យមភាគ, និទ្ទេស និងចំណាត់ថ្នាក់ (Calculated View)
CREATE OR REPLACE VIEW v_student_scores AS
WITH calculated_scores AS (
    SELECT 
        s.id AS id,
        s.student_id,
        s.name,
        s.gender,
        sc.khmer,
        sc.math,
        sc.physics,
        sc.chemistry,
        sc.biology,
        sc.english,
        (sc.khmer + sc.math + sc.physics + sc.chemistry + sc.biology + sc.english) AS total_score,
        ROUND((sc.khmer + sc.math + sc.physics + sc.chemistry + sc.biology + sc.english) / 6.0, 2) AS average
    FROM students s
    JOIN scores sc ON s.id = sc.student_table_id
)
SELECT 
    id,
    student_id,
    name,
    gender,
    khmer,
    math,
    physics,
    chemistry,
    biology,
    english,
    total_score,
    average,
    CASE 
        WHEN average >= 90 THEN 'A'
        WHEN average >= 80 THEN 'B'
        WHEN average >= 70 THEN 'C'
        WHEN average >= 60 THEN 'D'
        WHEN average >= 50 THEN 'E'
        ELSE 'F'
    END AS grade,
    RANK() OVER (ORDER BY total_score DESC) AS rank
FROM calculated_scores;

-- ====================================================================
-- 5. ទិន្នន័យគំរូដំបូង (Sample Data Insertion)
-- ====================================================================

-- Insert Students
INSERT INTO students (id, student_id, name, gender) VALUES
('1', 'ST-001', 'សុខ ជា', 'ប្រុស'),
('2', 'ST-002', 'ចាន់ ធីតា', 'ស្រី'),
('3', 'ST-003', 'សេង ហុង', 'ប្រុស'),
('4', 'ST-004', 'លី ស្រីនី', 'ស្រី'),
('5', 'ST-005', 'អ៊ុក វណ្ណដា', 'ប្រុស'),
('6', 'ST-006', 'ម៉ៅ ចន្ថា', 'ស្រី'),
('7', 'ST-007', 'ភិន មុន្នី', 'ប្រុស'),
('8', 'ST-008', 'ទូច សុជាតា', 'ស្រី'),
('9', 'ST-009', 'កែវ សិរីវុឌ្ឍ', 'ប្រុស'),
('10', 'ST-010', 'ជា សុភ័ក្ត្រ', 'ស្រី')
ON CONFLICT (id) DO NOTHING;

-- Insert Scores
INSERT INTO scores (id, student_table_id, khmer, math, physics, chemistry, biology, english) VALUES
('sc-1', '1', 85, 95, 88, 78, 82, 90),
('sc-2', '2', 92, 88, 85, 90, 94, 95),
('sc-3', '3', 65, 70, 68, 60, 72, 58),
('sc-4', '4', 78, 82, 75, 80, 76, 84),
('sc-5', '5', 90, 92, 94, 89, 91, 88),
('sc-6', '6', 58, 48, 52, 50, 55, 60),
('sc-7', '7', 72, 65, 70, 74, 68, 71),
('sc-8', '8', 88, 90, 86, 85, 89, 92),
('sc-9', '9', 80, 75, 78, 82, 80, 78),
('sc-10', '10', 45, 50, 48, 42, 52, 48)
ON CONFLICT (id) DO NOTHING;
