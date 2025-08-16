-- =====================================================
-- EduManage - FIXED MySQL Database Schema for Hostinger
-- =====================================================
-- This schema matches your application's exact requirements
-- Upload this complete file to your Hostinger database

-- Drop existing tables to fix structure issues
DROP TABLE IF EXISTS task_submissions;
DROP TABLE IF EXISTS teacher_tasks;
DROP TABLE IF EXISTS teacher_meetings;
DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS grades;
DROP TABLE IF EXISTS enrollments;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS roles;
DROP TABLE IF EXISTS sections;
DROP TABLE IF EXISTS subjects;

-- =====================
-- ROLES TABLE (Fixed)
-- =====================
CREATE TABLE roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL UNIQUE
);

-- =====================
-- USERS TABLE (Complete with all needed columns)
-- =====================
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    role_id INT,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    name VARCHAR(100), -- Computed name field
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50), -- Role name field
    profile_image VARCHAR(500),
    section_id INT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE SET NULL
);

-- =====================
-- SECTIONS TABLE
-- =====================
CREATE TABLE sections (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    grade_level INT NOT NULL,
    adviser_id INT,
    FOREIGN KEY (adviser_id) REFERENCES users(id) ON DELETE SET NULL
);

-- =====================
-- SUBJECTS TABLE
-- =====================
CREATE TABLE subjects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    section_id INT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    FOREIGN KEY (section_id) REFERENCES sections(id) ON DELETE SET NULL
);

-- =====================
-- ENROLLMENTS TABLE
-- =====================
CREATE TABLE enrollments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    section_id INT,
    status VARCHAR(20) DEFAULT 'pending',
    documents TEXT,
    payment_status VARCHAR(20) DEFAULT 'unpaid',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (section_id) REFERENCES sections(id) ON DELETE SET NULL
);

-- =====================
-- GRADES TABLE
-- =====================
CREATE TABLE grades (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    subject_id INT NOT NULL,
    quarter INT NOT NULL,
    grade DECIMAL(5,2),
    teacher_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
    FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE SET NULL
);

-- =====================
-- ANNOUNCEMENTS TABLE
-- =====================
CREATE TABLE announcements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    author_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL
);

-- =====================
-- NEWS TABLE
-- =====================
CREATE TABLE news (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    author_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL
);

-- =====================
-- EVENTS TABLE
-- =====================
CREATE TABLE events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    event_date DATE NOT NULL,
    location VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================
-- INSERT INITIAL DATA
-- =====================

-- Insert roles
INSERT INTO roles (id, role_name) VALUES 
(1, 'admin'),
(2, 'teacher'), 
(3, 'student'),
(4, 'parent'),
(5, 'guidance'),
(6, 'registrar'),
(7, 'accounting');

-- Insert admin user with ALL required fields
INSERT INTO users (
    id, role_id, first_name, last_name, name, email, password_hash, 
    role, is_active, created_at
) VALUES (
    1, 1, 'Admin', 'User', 'Admin User', 'admin@school.edu',
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj3lq5eaUWxq',
    'admin', TRUE, NOW()
);

-- Insert sample teacher
INSERT INTO users (
    id, role_id, first_name, last_name, name, email, password_hash, 
    role, is_active, created_at
) VALUES (
    2, 2, 'Teacher', 'User', 'Teacher User', 'teacher@school.edu',
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj3lq5eaUWxq',
    'teacher', TRUE, NOW()
);

-- Insert sample student
INSERT INTO users (
    id, role_id, first_name, last_name, name, email, password_hash, 
    role, is_active, created_at
) VALUES (
    3, 3, 'Student', 'User', 'Student User', 'student@school.edu',
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj3lq5eaUWxq',
    'student', TRUE, NOW()
);

-- Insert sample section
INSERT INTO sections (id, name, grade_level, adviser_id) VALUES 
(1, 'Grade 7-A', 7, 2);

-- Insert sample subjects
INSERT INTO subjects (id, section_id, name, description) VALUES 
(1, 1, 'Mathematics', 'Basic Mathematics for Grade 7'),
(2, 1, 'Science', 'General Science for Grade 7'),
(3, 1, 'English', 'English Language and Literature');

-- Insert sample announcements
INSERT INTO announcements (title, content, author_id) VALUES 
('Welcome to EduManage!', 'School management system is now live.', 1),
('New Academic Year', 'Enrollment for new academic year has started.', 1);

-- Insert sample news
INSERT INTO news (title, content, author_id) VALUES 
('School Reopening', 'School will reopen on Monday for face-to-face classes.', 1),
('Sports Festival', 'Annual sports festival scheduled for next month.', 1);

-- Insert sample events
INSERT INTO events (title, description, event_date, location) VALUES 
('Parent-Teacher Meeting', 'Quarterly meeting with parents', '2025-09-15', 'School Auditorium'),
('Science Fair', 'Annual science exhibition', '2025-10-01', 'School Gymnasium');

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================
-- Verify the admin account was created
SELECT id, first_name, last_name, name, email, role, is_active FROM users WHERE email = 'admin@school.edu';

-- Show all roles
SELECT * FROM roles;

-- Show all users
SELECT id, name, email, role FROM users;

-- =====================================================
-- LOGIN CREDENTIALS AFTER SETUP:
-- Email: admin@school.edu  
-- Password: admin123456
-- =====================================================