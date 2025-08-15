-- =====================================================
-- EduManage School Management System - MySQL Schema for Hostinger
-- =====================================================
-- Complete MySQL-compatible database schema
-- Upload this to your Hostinger MySQL database

-- =====================
-- ROLES TABLE
-- =====================
CREATE TABLE IF NOT EXISTS roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

-- =====================
-- USERS TABLE
-- =====================
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    role_id INT,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    profile_image VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
);

-- =====================
-- SECTIONS & SUBJECTS
-- =====================
CREATE TABLE IF NOT EXISTS sections (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    grade_level VARCHAR(50) NOT NULL,
    adviser_id INT,
    capacity INT DEFAULT 40,
    school_year VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (adviser_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS subjects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    section_id INT,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(500)
);

CREATE TABLE IF NOT EXISTS teacher_subjects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    teacher_id INT,
    subject_id INT,
    section_id INT,
    school_year VARCHAR(20) NOT NULL,
    semester VARCHAR(20) NOT NULL,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
    FOREIGN KEY (section_id) REFERENCES sections(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS schedules (
    id INT AUTO_INCREMENT PRIMARY KEY,
    teacher_id INT,
    subject_id INT,
    section_id INT,
    day_of_week VARCHAR(20) NOT NULL,
    start_time VARCHAR(10) NOT NULL,
    end_time VARCHAR(10) NOT NULL,
    room VARCHAR(50),
    school_year VARCHAR(20) NOT NULL,
    semester VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
    FOREIGN KEY (section_id) REFERENCES sections(id) ON DELETE CASCADE
);

-- =====================
-- ENROLLMENT SYSTEM
-- =====================
CREATE TABLE IF NOT EXISTS enrollment_progress (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT,
    current_status VARCHAR(100) NOT NULL,
    remarks VARCHAR(1000),
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS enrollment_applications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT,
    school_year VARCHAR(20) NOT NULL,
    status VARCHAR(20) DEFAULT 'Draft',
    submitted_at TIMESTAMP NULL,
    decided_at TIMESTAMP NULL,
    decided_by INT,
    remarks VARCHAR(1000),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (decided_by) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS enrollment_documents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    application_id INT,
    document_type VARCHAR(100) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_url VARCHAR(500) NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (application_id) REFERENCES enrollment_applications(id) ON DELETE CASCADE
);

-- =====================
-- LEARNING MODULES
-- =====================
CREATE TABLE IF NOT EXISTS modules (
    id INT AUTO_INCREMENT PRIMARY KEY,
    teacher_id INT,
    section_id INT,
    title VARCHAR(200) NOT NULL,
    description VARCHAR(1000),
    file_url VARCHAR(500) NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (section_id) REFERENCES sections(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS learning_modules (
    id INT AUTO_INCREMENT PRIMARY KEY,
    teacher_id INT,
    section_id INT,
    subject_id INT,
    title VARCHAR(200) NOT NULL,
    description VARCHAR(1000),
    file_url VARCHAR(500) NOT NULL,
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (section_id) REFERENCES sections(id) ON DELETE SET NULL,
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE
);

-- =====================
-- TASKS & ASSIGNMENTS
-- =====================
CREATE TABLE IF NOT EXISTS tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    teacher_id INT,
    section_id INT,
    title VARCHAR(200) NOT NULL,
    description VARCHAR(1000),
    task_type VARCHAR(50) NOT NULL,
    timer_minutes INT,
    due_date TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (section_id) REFERENCES sections(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS task_questions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    task_id INT,
    question VARCHAR(1000) NOT NULL,
    question_type VARCHAR(50) NOT NULL,
    options VARCHAR(2000),
    correct_answer VARCHAR(1000),
    points INT DEFAULT 1,
    FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS task_submissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    task_id INT,
    student_id INT,
    answers VARCHAR(5000),
    file_urls VARCHAR(2000),
    score DECIMAL(5,2),
    feedback VARCHAR(1000),
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    graded_at TIMESTAMP NULL,
    FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
);

-- =====================
-- MEETINGS
-- =====================
CREATE TABLE IF NOT EXISTS meetings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    host_id INT,
    section_id INT,
    title VARCHAR(200) NOT NULL,
    meeting_link VARCHAR(500) NOT NULL,
    scheduled_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (host_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (section_id) REFERENCES sections(id) ON DELETE CASCADE
);

-- =====================
-- CHAT SYSTEM
-- =====================
CREATE TABLE IF NOT EXISTS messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sender_id INT,
    receiver_id INT,
    message VARCHAR(2000) NOT NULL,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_read BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS online_status (
    user_id INT PRIMARY KEY,
    is_online BOOLEAN DEFAULT FALSE,
    last_seen TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- =====================
-- ANNOUNCEMENTS & EVENTS
-- =====================
CREATE TABLE IF NOT EXISTS announcements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    content VARCHAR(2000) NOT NULL,
    posted_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (posted_by) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description VARCHAR(1000),
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NULL,
    created_by INT,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- =====================
-- ACCOUNTING SYSTEM
-- =====================
CREATE TABLE IF NOT EXISTS fees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT,
    fee_type VARCHAR(100) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    due_date TIMESTAMP NULL,
    status VARCHAR(20) DEFAULT 'Unpaid',
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fee_id INT,
    student_id INT,
    amount_paid DECIMAL(10,2) NOT NULL,
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    payment_method VARCHAR(50),
    payment_status VARCHAR(20) DEFAULT 'pending',
    reference_number VARCHAR(100),
    receipt_url VARCHAR(500),
    notes VARCHAR(1000),
    recorded_by INT,
    verified_by INT,
    verified_at TIMESTAMP NULL,
    FOREIGN KEY (fee_id) REFERENCES fees(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (recorded_by) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (verified_by) REFERENCES users(id) ON DELETE SET NULL
);

-- =====================
-- GUIDANCE SYSTEM
-- =====================
CREATE TABLE IF NOT EXISTS guidance_reports (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT,
    counselor_id INT,
    report VARCHAR(2000) NOT NULL,
    report_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (counselor_id) REFERENCES users(id) ON DELETE SET NULL
);

-- =====================
-- GRADES SYSTEM
-- =====================
CREATE TABLE IF NOT EXISTS grades (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT,
    subject_id INT,
    teacher_id INT,
    grade DECIMAL(5,2) NOT NULL,
    quarter INT NOT NULL,
    school_year VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
    FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE CASCADE
);

-- =====================
-- NEWS SYSTEM
-- =====================
CREATE TABLE IF NOT EXISTS news (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    summary VARCHAR(500),
    content TEXT,
    posted_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (posted_by) REFERENCES users(id) ON DELETE SET NULL
);

-- =====================
-- NOTIFICATIONS
-- =====================
CREATE TABLE IF NOT EXISTS notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    recipient_id INT,
    sender_id INT,
    title VARCHAR(200) NOT NULL,
    message VARCHAR(1000) NOT NULL,
    type VARCHAR(20) DEFAULT 'info',
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (recipient_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE SET NULL
);

-- =====================================================
-- SEED DATA - INITIAL ROLES
-- =====================================================
INSERT INTO roles (name) VALUES 
('admin'),
('parent'),
('student'),
('teacher'),
('registrar'),
('guidance'),
('accounting')
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- =====================================================
-- SAMPLE ADMIN USER (Change credentials!)
-- =====================================================
INSERT INTO users (
    role_id, 
    first_name, 
    last_name, 
    email, 
    password_hash, 
    is_active, 
    status
) VALUES (
    1,
    'Admin',
    'User',
    'admin@school.edu',
    '$2b$10$rLzKH6PGkZ7A4xVqKx5hqeQhBTlXKKv5QY.nLU5p5WnE8Q7SqHJUy',
    TRUE,
    'active'
) ON DUPLICATE KEY UPDATE email = VALUES(email);

-- =====================================================
-- SAMPLE DATA
-- =====================================================
INSERT INTO sections (name, grade_level, school_year) VALUES 
('Grade 1-A', 'Grade 1', '2024-2025'),
('Grade 2-A', 'Grade 2', '2024-2025'),
('Grade 3-A', 'Grade 3', '2024-2025')
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO subjects (name, description) VALUES 
('Mathematics', 'Basic mathematics and arithmetic'),
('English', 'Language arts and literature'),
('Science', 'Basic science concepts'),
('Filipino', 'Filipino language and literature'),
('Social Studies', 'History and social sciences')
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role_id ON users(role_id);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_grades_student_id ON grades(student_id);
CREATE INDEX idx_grades_subject_id ON grades(subject_id);
CREATE INDEX idx_teacher_subjects_teacher_id ON teacher_subjects(teacher_id);
CREATE INDEX idx_teacher_subjects_section_id ON teacher_subjects(section_id);
CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_messages_receiver_id ON messages(receiver_id);
CREATE INDEX idx_messages_sent_at ON messages(sent_at);
CREATE INDEX idx_fees_student_id ON fees(student_id);
CREATE INDEX idx_payments_student_id ON payments(student_id);
CREATE INDEX idx_payments_fee_id ON payments(fee_id);

-- =====================================================
-- COMPLETION MESSAGE
-- =====================================================
-- Schema creation completed successfully!
-- Your MySQL database is now ready for the EduManage system!