-- =====================================================
-- EduManage School Management System - Supabase Schema
-- =====================================================
-- Complete database schema for the EduManage system
-- Copy and paste this script into Supabase SQL Editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================
-- ROLES TABLE
-- =====================
CREATE TABLE IF NOT EXISTS roles (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE
);

-- =====================
-- USERS TABLE
-- =====================
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    role_id INTEGER REFERENCES roles(id) ON DELETE CASCADE,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    profile_image TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    status TEXT DEFAULT 'active', -- active, inactive, suspended
    created_at TIMESTAMP DEFAULT NOW(),
    last_login TIMESTAMP
);

-- =====================
-- SECTIONS & SUBJECTS
-- =====================
CREATE TABLE IF NOT EXISTS sections (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    grade_level TEXT NOT NULL,
    adviser_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    capacity INTEGER DEFAULT 40,
    school_year TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS subjects (
    id SERIAL PRIMARY KEY,
    section_id INTEGER,
    name TEXT NOT NULL,
    description TEXT
);

-- Teacher-Subject Assignments
CREATE TABLE IF NOT EXISTS teacher_subjects (
    id SERIAL PRIMARY KEY,
    teacher_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    subject_id INTEGER REFERENCES subjects(id) ON DELETE CASCADE,
    section_id INTEGER REFERENCES sections(id) ON DELETE CASCADE,
    school_year TEXT NOT NULL,
    semester TEXT NOT NULL,
    assigned_at TIMESTAMP DEFAULT NOW()
);

-- Teacher Schedules
CREATE TABLE IF NOT EXISTS schedules (
    id SERIAL PRIMARY KEY,
    teacher_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    subject_id INTEGER REFERENCES subjects(id) ON DELETE CASCADE,
    section_id INTEGER REFERENCES sections(id) ON DELETE CASCADE,
    day_of_week TEXT NOT NULL, -- Monday, Tuesday, etc.
    start_time TEXT NOT NULL, -- HH:MM format
    end_time TEXT NOT NULL, -- HH:MM format
    room TEXT,
    school_year TEXT NOT NULL,
    semester TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- =====================
-- ENROLLMENT SYSTEM
-- =====================
CREATE TABLE IF NOT EXISTS enrollment_progress (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    current_status TEXT NOT NULL,
    remarks TEXT,
    last_updated TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enrollment_applications (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    school_year TEXT NOT NULL,
    status TEXT DEFAULT 'Draft',
    submitted_at TIMESTAMP,
    decided_at TIMESTAMP,
    decided_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    remarks TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enrollment_documents (
    id SERIAL PRIMARY KEY,
    application_id INTEGER REFERENCES enrollment_applications(id) ON DELETE CASCADE,
    document_type TEXT NOT NULL,
    file_name TEXT NOT NULL,
    file_url TEXT NOT NULL,
    uploaded_at TIMESTAMP DEFAULT NOW()
);

-- =====================
-- LEARNING MODULES
-- =====================
CREATE TABLE IF NOT EXISTS modules (
    id SERIAL PRIMARY KEY,
    teacher_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    section_id INTEGER REFERENCES sections(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    file_url TEXT NOT NULL,
    uploaded_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS learning_modules (
    id SERIAL PRIMARY KEY,
    teacher_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    section_id INTEGER REFERENCES sections(id) ON DELETE SET NULL,
    subject_id INTEGER REFERENCES subjects(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    file_url TEXT NOT NULL,
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- =====================
-- TASKS & ASSIGNMENTS
-- =====================
CREATE TABLE IF NOT EXISTS tasks (
    id SERIAL PRIMARY KEY,
    teacher_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    section_id INTEGER REFERENCES sections(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    task_type TEXT NOT NULL,
    timer_minutes INTEGER,
    due_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS task_questions (
    id SERIAL PRIMARY KEY,
    task_id INTEGER REFERENCES tasks(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    question_type TEXT NOT NULL,
    options TEXT,
    correct_answer TEXT,
    points INTEGER DEFAULT 1
);

CREATE TABLE IF NOT EXISTS task_submissions (
    id SERIAL PRIMARY KEY,
    task_id INTEGER REFERENCES tasks(id) ON DELETE CASCADE,
    student_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    answers TEXT,
    file_urls TEXT,
    score NUMERIC(5,2),
    feedback TEXT,
    submitted_at TIMESTAMP DEFAULT NOW(),
    graded_at TIMESTAMP
);

-- =====================
-- MEETINGS
-- =====================
CREATE TABLE IF NOT EXISTS meetings (
    id SERIAL PRIMARY KEY,
    host_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    section_id INTEGER REFERENCES sections(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    meeting_link TEXT NOT NULL,
    scheduled_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- =====================
-- CHAT SYSTEM
-- =====================
CREATE TABLE IF NOT EXISTS messages (
    id SERIAL PRIMARY KEY,
    sender_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    receiver_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    sent_at TIMESTAMP DEFAULT NOW(),
    is_read BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS online_status (
    user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    is_online BOOLEAN DEFAULT FALSE,
    last_seen TIMESTAMP
);

-- =====================
-- ANNOUNCEMENTS & EVENTS
-- =====================
CREATE TABLE IF NOT EXISTS announcements (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    posted_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS events (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP,
    created_by INTEGER REFERENCES users(id) ON DELETE SET NULL
);

-- =====================
-- ACCOUNTING SYSTEM
-- =====================
CREATE TABLE IF NOT EXISTS fees (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    fee_type TEXT NOT NULL,
    amount NUMERIC(10,2) NOT NULL,
    due_date TIMESTAMP,
    status TEXT DEFAULT 'Unpaid'
);

CREATE TABLE IF NOT EXISTS payments (
    id SERIAL PRIMARY KEY,
    fee_id INTEGER REFERENCES fees(id) ON DELETE CASCADE,
    student_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    amount_paid NUMERIC(10,2) NOT NULL,
    payment_date TIMESTAMP DEFAULT NOW(),
    payment_method TEXT, -- 'cash', 'online', 'promissory_note'
    payment_status TEXT DEFAULT 'pending', -- 'pending', 'verified', 'rejected'
    reference_number TEXT,
    receipt_url TEXT,
    notes TEXT,
    recorded_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    verified_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    verified_at TIMESTAMP
);

-- =====================
-- GUIDANCE SYSTEM
-- =====================
CREATE TABLE IF NOT EXISTS guidance_reports (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    counselor_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    report TEXT NOT NULL,
    report_date TIMESTAMP DEFAULT NOW()
);

-- =====================
-- GRADES SYSTEM
-- =====================
CREATE TABLE IF NOT EXISTS grades (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    subject_id INTEGER REFERENCES subjects(id) ON DELETE CASCADE,
    teacher_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    grade NUMERIC(5,2) NOT NULL,
    quarter INTEGER NOT NULL,
    school_year TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- =====================
-- NEWS SYSTEM
-- =====================
CREATE TABLE IF NOT EXISTS news (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    summary TEXT,
    content TEXT,
    posted_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- =====================
-- NOTIFICATIONS
-- =====================
CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    recipient_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    sender_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT DEFAULT 'info',
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- SEED DATA - INITIAL ROLES
-- =====================================================

-- Insert default roles
INSERT INTO roles (name) VALUES 
('admin'),
('parent'),
('student'),
('teacher'),
('registrar'),
('guidance'),
('accounting')
ON CONFLICT (name) DO NOTHING;

-- =====================================================
-- SAMPLE ADMIN USER (Optional - Change credentials!)
-- =====================================================

-- Insert sample admin user (password: admin123 - CHANGE THIS!)
-- Password hash for 'admin123' using bcrypt
INSERT INTO users (
    role_id, 
    first_name, 
    last_name, 
    email, 
    password_hash, 
    is_active, 
    status
) VALUES (
    1, -- admin role
    'Admin',
    'User',
    'admin@school.edu',
    '$2b$10$rLzKH6PGkZ7A4xVqKx5hqeQhBTlXKKv5QY.nLU5p5WnE8Q7SqHJUy', -- bcrypt hash for 'admin123'
    TRUE,
    'active'
) ON CONFLICT (email) DO NOTHING;

-- =====================================================
-- SAMPLE SECTIONS AND SUBJECTS (Optional)
-- =====================================================

-- Insert sample sections
INSERT INTO sections (name, grade_level, school_year) VALUES 
('Grade 1-A', 'Grade 1', '2024-2025'),
('Grade 2-A', 'Grade 2', '2024-2025'),
('Grade 3-A', 'Grade 3', '2024-2025')
ON CONFLICT DO NOTHING;

-- Insert sample subjects
INSERT INTO subjects (name, description) VALUES 
('Mathematics', 'Basic mathematics and arithmetic'),
('English', 'Language arts and literature'),
('Science', 'Basic science concepts'),
('Filipino', 'Filipino language and literature'),
('Social Studies', 'History and social sciences')
ON CONFLICT DO NOTHING;

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- User-related indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role_id ON users(role_id);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);

-- Academic-related indexes
CREATE INDEX IF NOT EXISTS idx_grades_student_id ON grades(student_id);
CREATE INDEX IF NOT EXISTS idx_grades_subject_id ON grades(subject_id);
CREATE INDEX IF NOT EXISTS idx_teacher_subjects_teacher_id ON teacher_subjects(teacher_id);
CREATE INDEX IF NOT EXISTS idx_teacher_subjects_section_id ON teacher_subjects(section_id);

-- Chat-related indexes
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver_id ON messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_messages_sent_at ON messages(sent_at);

-- Financial-related indexes
CREATE INDEX IF NOT EXISTS idx_fees_student_id ON fees(student_id);
CREATE INDEX IF NOT EXISTS idx_payments_student_id ON payments(student_id);
CREATE INDEX IF NOT EXISTS idx_payments_fee_id ON payments(fee_id);

-- =====================================================
-- COMPLETION MESSAGE
-- =====================================================

-- Schema creation completed successfully!
-- 
-- Next steps:
-- 1. Update your DATABASE_URL environment variable to point to this Supabase database
-- 2. Change the default admin password immediately!
-- 3. Test the connection from your application
-- 
-- Default admin credentials (CHANGE IMMEDIATELY):
-- Email: admin@school.edu
-- Password: admin123