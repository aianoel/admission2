-- =====================================================
-- Create Admin Account for Hostinger MySQL Database
-- =====================================================
-- Run this SQL script in your Hostinger MySQL database
-- to create the admin account for login

-- First, make sure the roles exist
INSERT IGNORE INTO roles (id, name) VALUES 
(1, 'admin'),
(2, 'teacher'), 
(3, 'student'),
(4, 'parent'),
(5, 'guidance'),
(6, 'registrar'),
(7, 'accounting');

-- Create the admin user account
-- Email: admin@school.edu
-- Password: admin123456
-- This matches the demo credentials shown on your login page
INSERT IGNORE INTO users (
    id,
    role_id, 
    first_name, 
    last_name, 
    email, 
    password_hash, 
    name,
    role,
    is_active, 
    status,
    created_at
) VALUES (
    1,
    1,
    'Admin',
    'User', 
    'admin@school.edu',
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj3lq5eaUWxq',
    'Admin User',
    'admin',
    TRUE,
    'active',
    NOW()
);

-- Verify the admin account was created
SELECT id, name, email, role, is_active FROM users WHERE email = 'admin@school.edu';

-- Show all roles
SELECT * FROM roles;

-- =====================================================
-- After running this script, you should be able to login with:
-- Email: admin@school.edu  
-- Password: admin123456
-- =====================================================