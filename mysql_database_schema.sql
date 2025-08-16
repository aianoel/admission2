-- EduManage School Management System - MySQL Database Schema
-- Import this file into your MySQL database on Hostinger

-- Set character set and collation for proper Unicode support
SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

-- Users table
CREATE TABLE `users` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `role_id` int,
  `first_name` text NOT NULL,
  `last_name` text NOT NULL,
  `email` text NOT NULL,
  `password_hash` text NOT NULL,
  `profile_image` text,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `last_login` timestamp,
  `section_id` int,
  `name` varchar(100),
  `role` varchar(50),
  `is_active` boolean DEFAULT TRUE
);

-- Sections table
CREATE TABLE `sections` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `name` varchar(100) NOT NULL,
  `grade_level` int NOT NULL,
  `adviser_id` int
);

-- Enrollments table
CREATE TABLE `enrollments` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `student_id` int NOT NULL,
  `section_id` int,
  `status` varchar(20) DEFAULT 'pending',
  `documents` text,
  `payment_status` varchar(20) DEFAULT 'unpaid',
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP
);

-- Grades table
CREATE TABLE `grades` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `student_id` int NOT NULL,
  `subject_id` int NOT NULL,
  `quarter` int NOT NULL,
  `grade` decimal(5,2),
  `teacher_id` int,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP
);

-- Teacher Tasks (Enhanced Assignments)
CREATE TABLE `teacher_tasks` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `teacher_id` int NOT NULL,
  `section_id` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text,
  `task_type` varchar(50) NOT NULL,
  `timer_minutes` int,
  `due_date` timestamp,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP
);

-- Task Submissions
CREATE TABLE `task_submissions` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `task_id` int NOT NULL,
  `student_id` int NOT NULL,
  `submitted_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `file_url` text,
  `score` decimal(5,2),
  `feedback` text
);

-- Teacher Meetings
CREATE TABLE `teacher_meetings` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `teacher_id` int NOT NULL,
  `section_id` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `meeting_url` text NOT NULL,
  `scheduled_at` timestamp NOT NULL,
  `duration_minutes` int NOT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP
);

-- Notifications
CREATE TABLE `notifications` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `recipient_id` int NOT NULL,
  `message` text NOT NULL,
  `link` text,
  `is_read` boolean DEFAULT FALSE,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP
);

-- Guidance Office Tables
CREATE TABLE `guidance_behavior_records` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `student_id` int NOT NULL,
  `reported_by` int NOT NULL,
  `incident_type` varchar(100) NOT NULL,
  `description` text NOT NULL,
  `action_taken` text,
  `status` varchar(50) DEFAULT 'Pending' NOT NULL,
  `date_reported` timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE `guidance_counseling_sessions` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `student_id` int NOT NULL,
  `counselor_id` int NOT NULL,
  `session_date` varchar(50) NOT NULL,
  `session_notes` text,
  `follow_up_date` varchar(50),
  `confidentiality_level` varchar(50) DEFAULT 'Internal' NOT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE `guidance_wellness_programs` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `program_name` varchar(255) NOT NULL,
  `description` text,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `created_by` int NOT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE `guidance_program_participants` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `program_id` int NOT NULL,
  `student_id` int NOT NULL,
  `joined_at` timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Registrar office features
CREATE TABLE `registrar_enrollment_requests` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `student_id` int NOT NULL,
  `school_year` varchar(9) NOT NULL,
  `grade_level` varchar(50) NOT NULL,
  `section_id` int,
  `status` varchar(20) DEFAULT 'Pending' NOT NULL,
  `date_requested` timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
  `date_processed` timestamp
);

CREATE TABLE `registrar_subjects` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `subject_code` varchar(20) NOT NULL,
  `subject_name` varchar(255) NOT NULL,
  `description` text,
  `grade_level` varchar(50),
  `semester` varchar(20),
  `prerequisite_id` int
);

CREATE TABLE `academic_records` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `student_id` int NOT NULL,
  `subject_id` int NOT NULL,
  `school_year` varchar(9) NOT NULL,
  `quarter1` decimal(5,2),
  `quarter2` decimal(5,2),
  `quarter3` decimal(5,2),
  `quarter4` decimal(5,2),
  `final_grade` decimal(5,2),
  `remarks` varchar(20),
  `recorded_at` timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE `graduation_candidates` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `student_id` int NOT NULL,
  `school_year` varchar(9) NOT NULL,
  `status` varchar(20) DEFAULT 'Pending' NOT NULL,
  `date_cleared` timestamp
);

CREATE TABLE `transcript_requests` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `student_id` int NOT NULL,
  `request_date` timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
  `status` varchar(20) DEFAULT 'Pending' NOT NULL,
  `release_date` timestamp
);

-- Accounting module features
CREATE TABLE `fee_structures` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `grade_level` varchar(50) NOT NULL,
  `tuition_fee` decimal(12,2) NOT NULL,
  `misc_fee` decimal(12,2) DEFAULT 0 NOT NULL,
  `other_fee` decimal(12,2) DEFAULT 0 NOT NULL,
  `effective_school_year` varchar(9) NOT NULL
);

CREATE TABLE `invoices` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `student_id` int NOT NULL,
  `school_year` varchar(9) NOT NULL,
  `due_date` date NOT NULL,
  `total_amount` decimal(12,2) NOT NULL,
  `status` varchar(20) DEFAULT 'Unpaid' NOT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE `invoice_items` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `invoice_id` int NOT NULL,
  `description` varchar(255) NOT NULL,
  `amount` decimal(12,2) NOT NULL
);

CREATE TABLE `payments` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `invoice_id` int NOT NULL,
  `payment_date` timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
  `amount_paid` decimal(12,2) NOT NULL,
  `payment_method` varchar(50),
  `receipt_number` varchar(100)
);

CREATE TABLE `scholarships` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `student_id` int NOT NULL,
  `scholarship_name` varchar(255) NOT NULL,
  `discount_percentage` decimal(5,2) NOT NULL,
  `effective_school_year` varchar(9) NOT NULL
);

CREATE TABLE `school_expenses` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `expense_date` date NOT NULL,
  `category` varchar(100) NOT NULL,
  `description` text,
  `amount` decimal(12,2) NOT NULL,
  `recorded_by` int NOT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Real-time chat system features
CREATE TABLE `conversations` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `conversation_type` varchar(20) DEFAULT 'private' NOT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE `conversation_members` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `conversation_id` int NOT NULL,
  `user_id` int NOT NULL,
  `joined_at` timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE `messages` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `conversation_id` int NOT NULL,
  `sender_id` int NOT NULL,
  `message_text` text,
  `attachment_url` text,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
  `is_read` boolean DEFAULT FALSE NOT NULL
);

CREATE TABLE `user_status` (
  `user_id` int PRIMARY KEY,
  `is_online` boolean DEFAULT FALSE NOT NULL,
  `last_seen` timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Legacy assignments table (keeping for compatibility)
CREATE TABLE `assignments` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `section_id` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text,
  `type` varchar(20) NOT NULL,
  `due_date` date,
  `file_url` varchar(255),
  `created_by` int NOT NULL
);

-- Chat messages table
CREATE TABLE `chat_messages` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `sender_id` int NOT NULL,
  `receiver_id` int,
  `message` text NOT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP
);

-- Meetings table
CREATE TABLE `meetings` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `section_id` int NOT NULL,
  `title` varchar(255),
  `meeting_link` varchar(255),
  `date` timestamp,
  `created_by` int NOT NULL
);

-- Hero images table
CREATE TABLE `hero_images` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `image_url` varchar(255) NOT NULL,
  `uploaded_by` int
);

-- Announcements table
CREATE TABLE `announcements` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `date_posted` timestamp DEFAULT CURRENT_TIMESTAMP,
  `posted_by` int
);

-- News table
CREATE TABLE `news` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `title` varchar(255) NOT NULL,
  `summary` text,
  `image_url` varchar(255),
  `date_posted` timestamp DEFAULT CURRENT_TIMESTAMP,
  `posted_by` int
);

-- Teacher Folders for Learning Materials
CREATE TABLE `teacher_folders` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `teacher_id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Folder Documents
CREATE TABLE `folder_documents` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `folder_id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `file_url` text NOT NULL,
  `file_type` varchar(50),
  `file_size` int,
  `uploaded_at` timestamp DEFAULT CURRENT_TIMESTAMP
);

-- Folder Section Access
CREATE TABLE `folder_section_access` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `folder_id` int NOT NULL,
  `section_id` int NOT NULL,
  `granted_at` timestamp DEFAULT CURRENT_TIMESTAMP
);

-- Events table
CREATE TABLE `events` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `title` varchar(255) NOT NULL,
  `description` text,
  `date` date,
  `location` varchar(255),
  `posted_by` int
);

-- Roles table for flexible role management
CREATE TABLE `roles` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `role_name` varchar(50) NOT NULL
);

-- Subjects table
CREATE TABLE `subjects` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `name` varchar(100) NOT NULL,
  `grade_level` int NOT NULL
);

-- Teacher assignments table - Enhanced for Academic Coordinator
CREATE TABLE `teacher_assignments` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `teacher_id` int,
  `section_id` int,
  `subject_id` int,
  `is_advisory` boolean DEFAULT FALSE,
  `school_year` varchar(9) DEFAULT '2024-2025',
  `assigned_by` int,
  `assigned_at` timestamp DEFAULT CURRENT_TIMESTAMP
);

-- Organizational chart table
CREATE TABLE `org_chart` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `name` varchar(100) NOT NULL,
  `position` varchar(100) NOT NULL,
  `photo_url` varchar(255),
  `reports_to` int
);

-- School settings table
CREATE TABLE `school_settings` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `school_year` varchar(20) NOT NULL,
  `start_date` date,
  `end_date` date
);

-- Tuition fees table
CREATE TABLE `tuition_fees` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `grade_level` int NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `due_date` date
);

-- Academic Management Tables
CREATE TABLE `academic_subjects` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `subject_code` varchar(20) NOT NULL,
  `subject_name` varchar(255) NOT NULL,
  `description` text,
  `grade_level` varchar(50) NOT NULL,
  `semester` varchar(20) NOT NULL,
  `units` int NOT NULL,
  `prerequisite_subject_id` int,
  `is_active` boolean DEFAULT TRUE,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE `teacher_registrations` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `user_id` int NOT NULL,
  `employee_id` varchar(50) NOT NULL,
  `specialization` varchar(255),
  `qualifications` text,
  `experience` text,
  `is_advisory` boolean DEFAULT FALSE,
  `status` varchar(20) DEFAULT 'Active' NOT NULL,
  `date_hired` date,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE `subject_assignments` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `teacher_registration_id` int NOT NULL,
  `subject_id` int NOT NULL,
  `section_id` int NOT NULL,
  `school_year` varchar(9) NOT NULL,
  `semester` varchar(20) NOT NULL,
  `status` varchar(20) DEFAULT 'Active' NOT NULL,
  `assigned_at` timestamp DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE `advisory_assignments` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `teacher_registration_id` int NOT NULL,
  `section_id` int NOT NULL,
  `school_year` varchar(9) NOT NULL,
  `status` varchar(20) DEFAULT 'Active' NOT NULL,
  `assigned_at` timestamp DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE `class_schedules` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `subject_assignment_id` int NOT NULL,
  `day_of_week` varchar(20) NOT NULL,
  `start_time` varchar(10) NOT NULL,
  `end_time` varchar(10) NOT NULL,
  `room` varchar(50),
  `status` varchar(20) DEFAULT 'Active' NOT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE `teacher_evaluations` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `teacher_registration_id` int NOT NULL,
  `evaluator_id` int NOT NULL,
  `evaluation_period` varchar(50) NOT NULL,
  `overall_rating` decimal(3,2),
  `strengths` text,
  `areas_for_improvement` text,
  `comments` text,
  `status` varchar(20) DEFAULT 'Draft' NOT NULL,
  `evaluated_at` timestamp DEFAULT CURRENT_TIMESTAMP
);

-- Insert initial roles
INSERT INTO `roles` (`id`, `role_name`) VALUES
(1, 'admin'),
(2, 'principal'),
(3, 'academic_coordinator'),
(4, 'teacher'),
(5, 'student'),
(6, 'parent'),
(7, 'registrar'),
(8, 'guidance'),
(9, 'accounting');

-- Insert a default admin user (password: admin123)
INSERT INTO `users` (`id`, `role_id`, `first_name`, `last_name`, `email`, `password_hash`, `name`, `role`, `is_active`) VALUES
(1, 1, 'Admin', 'User', 'admin@school.edu', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj3lq5eaUWxq', 'Admin User', 'admin', TRUE);

-- Add some initial sections
INSERT INTO `sections` (`id`, `name`, `grade_level`, `adviser_id`) VALUES
(1, 'Grade 1-A', 1, NULL),
(2, 'Grade 1-B', 1, NULL),
(3, 'Grade 2-A', 2, NULL),
(4, 'Grade 2-B', 2, NULL),
(5, 'Grade 3-A', 3, NULL),
(6, 'Grade 3-B', 3, NULL);

-- Add some initial subjects
INSERT INTO `subjects` (`id`, `name`, `grade_level`) VALUES
(1, 'Mathematics', 1),
(2, 'English', 1),
(3, 'Science', 1),
(4, 'Filipino', 1),
(5, 'Mathematics', 2),
(6, 'English', 2),
(7, 'Science', 2),
(8, 'Filipino', 2),
(9, 'Mathematics', 3),
(10, 'English', 3),
(11, 'Science', 3),
(12, 'Filipino', 3);

-- EduManage MySQL Schema Import Complete
-- Total Tables: 45+ tables for comprehensive school management
-- Features: User Management, Academic Records, Chat System, Accounting, Guidance Office, Registrar, and more