-- ===============================
-- School Management System - Hostinger MySQL Database Schema
-- ===============================

-- ===============================
-- 1. Roles Table
-- ===============================
CREATE TABLE roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(50) UNIQUE NOT NULL
);

-- Insert default roles
INSERT INTO roles (role_name) VALUES 
('admin'),
('principal'),
('academic_coordinator'),
('registrar'),
('accounting'),
('guidance'),
('teacher'),
('student'),
('parent');

-- ===============================
-- 2. Users Table
-- ===============================
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL,
    role_id INT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES roles(id)
);

-- ===============================
-- 3. Sections Table
-- ===============================
CREATE TABLE sections (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    grade_level INT NOT NULL,
    adviser_id INT
);

-- ===============================
-- 4. Subjects Table
-- ===============================
CREATE TABLE subjects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    section_id INT,
    FOREIGN KEY (section_id) REFERENCES sections(id)
);

-- ===============================
-- 5. Enrollments Table
-- ===============================
CREATE TABLE enrollments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    section_id INT,
    status VARCHAR(20) DEFAULT 'pending',
    documents TEXT,
    payment_status VARCHAR(20) DEFAULT 'unpaid',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===============================
-- 6. Grades Table
-- ===============================
CREATE TABLE grades (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    subject_id INT,
    quarter INT NOT NULL,
    grade DECIMAL(5,2),
    teacher_id INT,
    FOREIGN KEY (subject_id) REFERENCES subjects(id)
);

-- ===============================
-- 7. Teacher Tasks Table
-- ===============================
CREATE TABLE teacher_tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    teacher_id INT NOT NULL,
    section_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    task_type VARCHAR(50) NOT NULL,
    timer_minutes INT,
    due_date TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (teacher_id) REFERENCES users(id),
    FOREIGN KEY (section_id) REFERENCES sections(id)
);

-- ===============================
-- 8. Task Submissions Table
-- ===============================
CREATE TABLE task_submissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    task_id INT NOT NULL,
    student_id INT NOT NULL,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    file_url TEXT,
    score DECIMAL(5,2),
    feedback TEXT,
    FOREIGN KEY (task_id) REFERENCES teacher_tasks(id),
    FOREIGN KEY (student_id) REFERENCES users(id)
);

-- ===============================
-- 9. Teacher Meetings Table
-- ===============================
CREATE TABLE teacher_meetings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    teacher_id INT NOT NULL,
    section_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    meeting_url TEXT NOT NULL,
    scheduled_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (teacher_id) REFERENCES users(id),
    FOREIGN KEY (section_id) REFERENCES sections(id)
);

-- ===============================
-- 10. Teacher Assignments Table
-- ===============================
CREATE TABLE teacher_assignments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    teacher_id INT,
    subject_id INT,
    section_id INT,
    school_year VARCHAR(20) DEFAULT '2024-2025',
    FOREIGN KEY (teacher_id) REFERENCES users(id),
    FOREIGN KEY (subject_id) REFERENCES subjects(id),
    FOREIGN KEY (section_id) REFERENCES sections(id)
);

-- ===============================
-- 11. Announcements Table
-- ===============================
CREATE TABLE announcements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    author_id INT,
    target_audience VARCHAR(100) DEFAULT 'all',
    priority VARCHAR(20) DEFAULT 'normal',
    date_posted TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    FOREIGN KEY (author_id) REFERENCES users(id)
);

-- ===============================
-- 12. Organization Chart Table
-- ===============================
CREATE TABLE org_chart (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    position VARCHAR(255) NOT NULL,
    photo_url TEXT,
    reports_to INT
);

-- ===============================
-- 13. School Settings Table
-- ===============================
CREATE TABLE school_settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    primary_color VARCHAR(7) DEFAULT '#3b82f6',
    school_name VARCHAR(255) DEFAULT 'School Management System',
    school_year VARCHAR(20) DEFAULT '2024-2025',
    start_date DATE,
    end_date DATE,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ===============================
-- 14. Tuition Fees Table
-- ===============================
CREATE TABLE tuition_fees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    grade_level INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    due_date DATE,
    school_year VARCHAR(20) DEFAULT '2024-2025',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===============================
-- 15. Chat Conversations Table
-- ===============================
CREATE TABLE chat_conversations (
    id VARCHAR(255) PRIMARY KEY,
    conversation_type VARCHAR(50) NOT NULL,
    participants JSON NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ===============================
-- 16. Chat Messages Table
-- ===============================
CREATE TABLE chat_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    conversation_id VARCHAR(255),
    sender_id INT,
    content TEXT NOT NULL,
    message_type VARCHAR(50) DEFAULT 'text',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (conversation_id) REFERENCES chat_conversations(id),
    FOREIGN KEY (sender_id) REFERENCES users(id)
);

-- ===============================
-- Insert Sample Data
-- ===============================

-- Sample Admin User (Change this password!)
INSERT INTO users (name, email, password_hash, role, role_id, is_active) VALUES 
('System Administrator', 'admin@yourschool.com', '$2a$10$YourHashedPasswordHere', 'admin', 1, true);

-- Sample School Settings
INSERT INTO school_settings (primary_color, school_name, school_year) VALUES 
('#3b82f6', 'Your School Name', '2024-2025');

-- Sample Organization Chart Entry
INSERT INTO org_chart (name, position, photo_url) VALUES 
('Principal Name', 'Principal', '');

-- Sample Sections
INSERT INTO sections (name, grade_level, adviser_id) VALUES 
('Grade 7-A', 7, NULL),
('Grade 8-A', 8, NULL),
('Grade 9-A', 9, NULL),
('Grade 10-A', 10, NULL);

-- Sample Subjects
INSERT INTO subjects (name, description, section_id) VALUES 
('Mathematics', 'Basic Mathematics', 1),
('English', 'English Language Arts', 1),
('Science', 'General Science', 1),
('Social Studies', 'History and Geography', 1);

-- Sample Tuition Fees
INSERT INTO tuition_fees (grade_level, amount, school_year) VALUES 
(7, 5000.00, '2024-2025'),
(8, 5500.00, '2024-2025'),
(9, 6000.00, '2024-2025'),
(10, 6500.00, '2024-2025');

-- ===============================
-- Create Indexes for Performance
-- ===============================
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_grades_student_id ON grades(student_id);
CREATE INDEX idx_grades_subject_id ON grades(subject_id);
CREATE INDEX idx_enrollments_student_id ON enrollments(student_id);
CREATE INDEX idx_teacher_tasks_teacher_id ON teacher_tasks(teacher_id);
CREATE INDEX idx_task_submissions_task_id ON task_submissions(task_id);
CREATE INDEX idx_chat_messages_conversation_id ON chat_messages(conversation_id);