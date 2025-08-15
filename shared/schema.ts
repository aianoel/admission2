import { pgTable, serial, varchar, text, integer, decimal, date, timestamp, boolean } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

// Users table
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  roleId: integer('role_id').references(() => roles.id),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  email: text('email').unique().notNull(),
  passwordHash: text('password_hash').notNull(),
  profileImage: text('profile_image'),
  createdAt: timestamp('created_at').defaultNow(),
  lastLogin: timestamp('last_login'),
  sectionId: integer('section_id'),
  name: varchar('name', { length: 100 }),
  role: varchar('role', { length: 50 }),
  isActive: boolean('is_active').default(true),
});

// Sections table
export const sections = pgTable('sections', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  gradeLevel: integer('grade_level').notNull(),
  adviserId: integer('adviser_id'),
});

// Enrollments table
export const enrollments = pgTable('enrollments', {
  id: serial('id').primaryKey(),
  studentId: integer('student_id').notNull(),
  sectionId: integer('section_id'),
  status: varchar('status', { length: 20 }).default('pending'),
  documents: text('documents'),
  paymentStatus: varchar('payment_status', { length: 20 }).default('unpaid'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Grades table - Fixed with proper subject reference
export const grades = pgTable('grades', {
  id: serial('id').primaryKey(),
  studentId: integer('student_id').notNull(),
  subjectId: integer('subject_id').notNull().references(() => subjects.id),
  quarter: integer('quarter').notNull(),
  grade: decimal('grade', { precision: 5, scale: 2 }),
  teacherId: integer('teacher_id').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
});

// Teacher Tasks (Enhanced Assignments)
export const teacherTasks = pgTable('teacher_tasks', {
  id: serial('id').primaryKey(),
  teacherId: integer('teacher_id').notNull().references(() => users.id),
  sectionId: integer('section_id').notNull().references(() => sections.id),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  taskType: varchar('task_type', { length: 50 }).notNull(), // Assignment, Quiz, Test
  timerMinutes: integer('timer_minutes'), // NULL if no timer
  dueDate: timestamp('due_date'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Task Submissions
export const taskSubmissions = pgTable('task_submissions', {
  id: serial('id').primaryKey(),
  taskId: integer('task_id').notNull().references(() => teacherTasks.id),
  studentId: integer('student_id').notNull().references(() => users.id),
  submittedAt: timestamp('submitted_at').defaultNow(),
  fileUrl: text('file_url'),
  score: decimal('score', { precision: 5, scale: 2 }),
  feedback: text('feedback'),
});

// Teacher Meetings
export const teacherMeetings = pgTable('teacher_meetings', {
  id: serial('id').primaryKey(),
  teacherId: integer('teacher_id').notNull().references(() => users.id),
  sectionId: integer('section_id').notNull().references(() => sections.id),
  title: varchar('title', { length: 255 }).notNull(),
  meetingUrl: text('meeting_url').notNull(),
  scheduledAt: timestamp('scheduled_at').notNull(),
  durationMinutes: integer('duration_minutes').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Notifications
export const notifications = pgTable('notifications', {
  id: serial('id').primaryKey(),
  recipientId: integer('recipient_id').notNull().references(() => users.id),
  message: text('message').notNull(),
  link: text('link'),
  isRead: boolean('is_read').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

// Guidance Office Tables
export const guidanceBehaviorRecords = pgTable('guidance_behavior_records', {
  id: serial('id').primaryKey(),
  studentId: integer('student_id').notNull().references(() => users.id),
  reportedBy: integer('reported_by').notNull().references(() => users.id),
  incidentType: varchar('incident_type', { length: 100 }).notNull(),
  description: text('description').notNull(),
  actionTaken: text('action_taken'),
  status: varchar('status', { length: 50 }).default('Pending').notNull(),
  dateReported: timestamp('date_reported').defaultNow().notNull(),
});

export const guidanceCounselingSessions = pgTable('guidance_counseling_sessions', {
  id: serial('id').primaryKey(),
  studentId: integer('student_id').notNull().references(() => users.id),
  counselorId: integer('counselor_id').notNull().references(() => users.id),
  sessionDate: varchar('session_date', { length: 50 }).notNull(),
  sessionNotes: text('session_notes'),
  followUpDate: varchar('follow_up_date', { length: 50 }),
  confidentialityLevel: varchar('confidentiality_level', { length: 50 }).default('Internal').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const guidanceWellnessPrograms = pgTable('guidance_wellness_programs', {
  id: serial('id').primaryKey(),
  programName: varchar('program_name', { length: 255 }).notNull(),
  description: text('description'),
  startDate: date('start_date').notNull(),
  endDate: date('end_date').notNull(),
  createdBy: integer('created_by').notNull().references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const guidanceProgramParticipants = pgTable('guidance_program_participants', {
  id: serial('id').primaryKey(),
  programId: integer('program_id').notNull().references(() => guidanceWellnessPrograms.id),
  studentId: integer('student_id').notNull().references(() => users.id),
  joinedAt: timestamp('joined_at').defaultNow().notNull(),
});

// Registrar office features
export const registrarEnrollmentRequests = pgTable('registrar_enrollment_requests', {
  id: serial('id').primaryKey(),
  studentId: integer('student_id').notNull().references(() => users.id),
  schoolYear: varchar('school_year', { length: 9 }).notNull(),
  gradeLevel: varchar('grade_level', { length: 50 }).notNull(),
  sectionId: integer('section_id').references(() => sections.id),
  status: varchar('status', { length: 20 }).default('Pending').notNull(),
  dateRequested: timestamp('date_requested').defaultNow().notNull(),
  dateProcessed: timestamp('date_processed'),
});

export const registrarSubjects = pgTable('registrar_subjects', {
  id: serial('id').primaryKey(),
  subjectCode: varchar('subject_code', { length: 20 }).unique().notNull(),
  subjectName: varchar('subject_name', { length: 255 }).notNull(),
  description: text('description'),
  gradeLevel: varchar('grade_level', { length: 50 }),
  semester: varchar('semester', { length: 20 }),
  prerequisiteId: integer('prerequisite_id'),
});

export const academicRecords = pgTable('academic_records', {
  id: serial('id').primaryKey(),
  studentId: integer('student_id').notNull().references(() => users.id),
  subjectId: integer('subject_id').notNull().references(() => registrarSubjects.id),
  schoolYear: varchar('school_year', { length: 9 }).notNull(),
  quarter1: decimal('quarter1', { precision: 5, scale: 2 }),
  quarter2: decimal('quarter2', { precision: 5, scale: 2 }),
  quarter3: decimal('quarter3', { precision: 5, scale: 2 }),
  quarter4: decimal('quarter4', { precision: 5, scale: 2 }),
  finalGrade: decimal('final_grade', { precision: 5, scale: 2 }),
  remarks: varchar('remarks', { length: 20 }),
  recordedAt: timestamp('recorded_at').defaultNow().notNull(),
});

export const graduationCandidates = pgTable('graduation_candidates', {
  id: serial('id').primaryKey(),
  studentId: integer('student_id').notNull().references(() => users.id),
  schoolYear: varchar('school_year', { length: 9 }).notNull(),
  status: varchar('status', { length: 20 }).default('Pending').notNull(),
  dateCleared: timestamp('date_cleared'),
});

export const transcriptRequests = pgTable('transcript_requests', {
  id: serial('id').primaryKey(),
  studentId: integer('student_id').notNull().references(() => users.id),
  requestDate: timestamp('request_date').defaultNow().notNull(),
  status: varchar('status', { length: 20 }).default('Pending').notNull(),
  releaseDate: timestamp('release_date'),
});

// Accounting module features
export const feeStructures = pgTable('fee_structures', {
  id: serial('id').primaryKey(),
  gradeLevel: varchar('grade_level', { length: 50 }).notNull(),
  tuitionFee: decimal('tuition_fee', { precision: 12, scale: 2 }).notNull(),
  miscFee: decimal('misc_fee', { precision: 12, scale: 2 }).default('0').notNull(),
  otherFee: decimal('other_fee', { precision: 12, scale: 2 }).default('0').notNull(),
  effectiveSchoolYear: varchar('effective_school_year', { length: 9 }).notNull(),
});

export const invoices = pgTable('invoices', {
  id: serial('id').primaryKey(),
  studentId: integer('student_id').notNull().references(() => users.id),
  schoolYear: varchar('school_year', { length: 9 }).notNull(),
  dueDate: date('due_date').notNull(),
  totalAmount: decimal('total_amount', { precision: 12, scale: 2 }).notNull(),
  status: varchar('status', { length: 20 }).default('Unpaid').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const invoiceItems = pgTable('invoice_items', {
  id: serial('id').primaryKey(),
  invoiceId: integer('invoice_id').notNull().references(() => invoices.id),
  description: varchar('description', { length: 255 }).notNull(),
  amount: decimal('amount', { precision: 12, scale: 2 }).notNull(),
});

export const payments = pgTable('payments', {
  id: serial('id').primaryKey(),
  invoiceId: integer('invoice_id').notNull().references(() => invoices.id),
  paymentDate: timestamp('payment_date').defaultNow().notNull(),
  amountPaid: decimal('amount_paid', { precision: 12, scale: 2 }).notNull(),
  paymentMethod: varchar('payment_method', { length: 50 }),
  receiptNumber: varchar('receipt_number', { length: 100 }),
});

export const scholarships = pgTable('scholarships', {
  id: serial('id').primaryKey(),
  studentId: integer('student_id').notNull().references(() => users.id),
  scholarshipName: varchar('scholarship_name', { length: 255 }).notNull(),
  discountPercentage: decimal('discount_percentage', { precision: 5, scale: 2 }).notNull(),
  effectiveSchoolYear: varchar('effective_school_year', { length: 9 }).notNull(),
});

export const schoolExpenses = pgTable('school_expenses', {
  id: serial('id').primaryKey(),
  expenseDate: date('expense_date').notNull(),
  category: varchar('category', { length: 100 }).notNull(),
  description: text('description'),
  amount: decimal('amount', { precision: 12, scale: 2 }).notNull(),
  recordedBy: integer('recorded_by').notNull().references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Real-time chat system features
export const conversations = pgTable('conversations', {
  id: serial('id').primaryKey(),
  conversationType: varchar('conversation_type', { length: 20 }).default('private').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const conversationMembers = pgTable('conversation_members', {
  id: serial('id').primaryKey(),
  conversationId: integer('conversation_id').notNull().references(() => conversations.id),
  userId: integer('user_id').notNull().references(() => users.id),
  joinedAt: timestamp('joined_at').defaultNow().notNull(),
});

export const messages = pgTable('messages', {
  id: serial('id').primaryKey(),
  conversationId: integer('conversation_id').notNull().references(() => conversations.id),
  senderId: integer('sender_id').notNull().references(() => users.id),
  messageText: text('message_text'),
  attachmentUrl: text('attachment_url'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  isRead: boolean('is_read').default(false).notNull(),
});

export const userStatus = pgTable('user_status', {
  userId: integer('user_id').primaryKey().references(() => users.id),
  isOnline: boolean('is_online').default(false).notNull(),
  lastSeen: timestamp('last_seen').defaultNow().notNull(),
});

// Legacy assignments table (keeping for compatibility)
export const assignments = pgTable('assignments', {
  id: serial('id').primaryKey(),
  sectionId: integer('section_id').notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  type: varchar('type', { length: 20 }).notNull(),
  dueDate: date('due_date'),
  fileUrl: varchar('file_url', { length: 255 }),
  createdBy: integer('created_by').notNull(),
});

// Chat messages table
export const chatMessages = pgTable('chat_messages', {
  id: serial('id').primaryKey(),
  senderId: integer('sender_id').notNull(),
  receiverId: integer('receiver_id'),
  message: text('message').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Meetings table
export const meetings = pgTable('meetings', {
  id: serial('id').primaryKey(),
  sectionId: integer('section_id').notNull(),
  title: varchar('title', { length: 255 }),
  meetingLink: varchar('meeting_link', { length: 255 }),
  date: timestamp('date'),
  createdBy: integer('created_by').notNull(),
});

// Hero images table
export const heroImages = pgTable('hero_images', {
  id: serial('id').primaryKey(),
  imageUrl: varchar('image_url', { length: 255 }).notNull(),
  uploadedBy: integer('uploaded_by'),
});

// Announcements table
export const announcements = pgTable('announcements', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  content: text('content').notNull(),
  datePosted: date('date_posted').defaultNow(),
  postedBy: integer('posted_by'),
});

// News table
export const news = pgTable('news', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  summary: text('summary'),
  imageUrl: varchar('image_url', { length: 255 }),
  datePosted: date('date_posted').defaultNow(),
  postedBy: integer('posted_by'),
});

// Teacher Folders for Learning Materials
export const teacherFolders = pgTable('teacher_folders', {
  id: serial('id').primaryKey(),
  teacherId: integer('teacher_id').notNull().references(() => users.id),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Folder Documents
export const folderDocuments = pgTable('folder_documents', {
  id: serial('id').primaryKey(),
  folderId: integer('folder_id').notNull().references(() => teacherFolders.id),
  name: varchar('name', { length: 255 }).notNull(),
  fileUrl: text('file_url').notNull(),
  fileType: varchar('file_type', { length: 50 }),
  fileSize: integer('file_size'),
  uploadedAt: timestamp('uploaded_at').defaultNow(),
});

// Folder Section Access - tracks which sections can access which folders
export const folderSectionAccess = pgTable('folder_section_access', {
  id: serial('id').primaryKey(),
  folderId: integer('folder_id').notNull().references(() => teacherFolders.id),
  sectionId: integer('section_id').notNull().references(() => sections.id),
  grantedAt: timestamp('granted_at').defaultNow(),
});

// Insert and Select types for Teacher Folder System
export const insertTeacherFolderSchema = createInsertSchema(teacherFolders);
export const selectTeacherFolderSchema = createSelectSchema(teacherFolders);
export type InsertTeacherFolder = z.infer<typeof insertTeacherFolderSchema>;
export type TeacherFolder = z.infer<typeof selectTeacherFolderSchema>;

export const insertFolderDocumentSchema = createInsertSchema(folderDocuments);
export const selectFolderDocumentSchema = createSelectSchema(folderDocuments);
export type InsertFolderDocument = z.infer<typeof insertFolderDocumentSchema>;
export type FolderDocument = z.infer<typeof selectFolderDocumentSchema>;

export const insertFolderSectionAccessSchema = createInsertSchema(folderSectionAccess);
export const selectFolderSectionAccessSchema = createSelectSchema(folderSectionAccess);
export type InsertFolderSectionAccess = z.infer<typeof insertFolderSectionAccessSchema>;
export type FolderSectionAccess = z.infer<typeof selectFolderSectionAccessSchema>;

// Events table
export const events = pgTable('events', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  date: date('date'),
  location: varchar('location', { length: 255 }),
  postedBy: integer('posted_by'),
});

// Roles table for flexible role management
export const roles = pgTable('roles', {
  id: serial('id').primaryKey(),
  roleName: varchar('role_name', { length: 50 }).unique().notNull(),
});

// Subjects table
export const subjects = pgTable('subjects', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  gradeLevel: integer('grade_level').notNull(),
});

// Teacher assignments table - Enhanced for Academic Coordinator
export const teacherAssignments = pgTable('teacher_assignments', {
  id: serial('id').primaryKey(),
  teacherId: integer('teacher_id').references(() => users.id),
  sectionId: integer('section_id').references(() => sections.id),
  subjectId: integer('subject_id').references(() => subjects.id),
  isAdvisory: boolean('is_advisory').default(false),
  schoolYear: varchar('school_year', { length: 9 }).default('2024-2025'),
  assignedBy: integer('assigned_by').references(() => users.id), // Academic Coordinator
  assignedAt: timestamp('assigned_at').defaultNow(),
});

// Organizational chart table
export const orgChart = pgTable('org_chart', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  position: varchar('position', { length: 100 }).notNull(),
  photoUrl: varchar('photo_url', { length: 255 }),
  reportsTo: integer('reports_to'),
});

// School settings table
export const schoolSettings = pgTable('school_settings', {
  id: serial('id').primaryKey(),
  schoolYear: varchar('school_year', { length: 20 }).notNull(),
  startDate: date('start_date'),
  endDate: date('end_date'),
});

// Tuition fees table
export const tuitionFees = pgTable('tuition_fees', {
  id: serial('id').primaryKey(),
  gradeLevel: integer('grade_level').notNull(),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  dueDate: date('due_date'),
});

// Academic Management Tables
export const academicSubjects = pgTable('academic_subjects', {
  id: serial('id').primaryKey(),
  subjectCode: varchar('subject_code', { length: 20 }).unique().notNull(),
  subjectName: varchar('subject_name', { length: 255 }).notNull(),
  description: text('description'),
  gradeLevel: varchar('grade_level', { length: 50 }).notNull(),
  semester: varchar('semester', { length: 20 }).notNull(),
  units: integer('units').notNull(),
  prerequisiteSubjectId: integer('prerequisite_subject_id'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
});

export const teacherRegistrations = pgTable('teacher_registrations', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  employeeId: varchar('employee_id', { length: 50 }).unique().notNull(),
  specialization: varchar('specialization', { length: 255 }),
  qualifications: text('qualifications'),
  experience: text('experience'),
  isAdvisory: boolean('is_advisory').default(false),
  status: varchar('status', { length: 20 }).default('Active').notNull(),
  dateHired: date('date_hired'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const subjectAssignments = pgTable('subject_assignments', {
  id: serial('id').primaryKey(),
  teacherRegistrationId: integer('teacher_registration_id').notNull().references(() => teacherRegistrations.id),
  subjectId: integer('subject_id').notNull().references(() => academicSubjects.id),
  sectionId: integer('section_id').notNull().references(() => sections.id),
  schoolYear: varchar('school_year', { length: 9 }).notNull(),
  semester: varchar('semester', { length: 20 }).notNull(),
  status: varchar('status', { length: 20 }).default('Active').notNull(),
  assignedAt: timestamp('assigned_at').defaultNow(),
});

export const advisoryAssignments = pgTable('advisory_assignments', {
  id: serial('id').primaryKey(),
  teacherRegistrationId: integer('teacher_registration_id').notNull().references(() => teacherRegistrations.id),
  sectionId: integer('section_id').notNull().references(() => sections.id),
  schoolYear: varchar('school_year', { length: 9 }).notNull(),
  status: varchar('status', { length: 20 }).default('Active').notNull(),
  assignedAt: timestamp('assigned_at').defaultNow(),
});

export const classSchedules = pgTable('class_schedules', {
  id: serial('id').primaryKey(),
  subjectAssignmentId: integer('subject_assignment_id').notNull().references(() => subjectAssignments.id),
  dayOfWeek: varchar('day_of_week', { length: 20 }).notNull(),
  startTime: varchar('start_time', { length: 10 }).notNull(),
  endTime: varchar('end_time', { length: 10 }).notNull(),
  room: varchar('room', { length: 50 }),
  status: varchar('status', { length: 20 }).default('Active').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const teacherEvaluations = pgTable('teacher_evaluations', {
  id: serial('id').primaryKey(),
  teacherRegistrationId: integer('teacher_registration_id').notNull().references(() => teacherRegistrations.id),
  evaluatorId: integer('evaluator_id').notNull().references(() => users.id),
  evaluationPeriod: varchar('evaluation_period', { length: 50 }).notNull(),
  overallRating: decimal('overall_rating', { precision: 3, scale: 2 }),
  strengths: text('strengths'),
  areasForImprovement: text('areas_for_improvement'),
  comments: text('comments'),
  status: varchar('status', { length: 20 }).default('Draft').notNull(),
  evaluatedAt: timestamp('evaluated_at').defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ one, many }) => ({
  role: one(roles, {
    fields: [users.roleId],
    references: [roles.id],
  }),
  sections: many(sections),
  enrollments: many(enrollments),
  grades: many(grades),
  assignments: many(assignments),
  sentMessages: many(chatMessages, { relationName: 'sender' }),
  receivedMessages: many(chatMessages, { relationName: 'receiver' }),
  meetings: many(meetings),
  heroImages: many(heroImages),
  announcements: many(announcements),
  news: many(news),
  events: many(events),
  teacherAssignments: many(teacherAssignments),
  teacherRegistrations: many(teacherRegistrations),
  teacherEvaluations: many(teacherEvaluations),
  teacherFolders: many(teacherFolders),
}));

export const rolesRelations = relations(roles, ({ many }) => ({
  users: many(users),
}));

export const subjectsRelations = relations(subjects, ({ many }) => ({
  teacherAssignments: many(teacherAssignments),
}));

export const teacherAssignmentsRelations = relations(teacherAssignments, ({ one }) => ({
  teacher: one(users, {
    fields: [teacherAssignments.teacherId],
    references: [users.id],
  }),
  section: one(sections, {
    fields: [teacherAssignments.sectionId],
    references: [sections.id],
  }),
  subject: one(subjects, {
    fields: [teacherAssignments.subjectId],
    references: [subjects.id],
  }),
}));

export const orgChartRelations = relations(orgChart, ({ one, many }) => ({
  manager: one(orgChart, {
    fields: [orgChart.reportsTo],
    references: [orgChart.id],
    relationName: 'manager',
  }),
  subordinates: many(orgChart, { relationName: 'manager' }),
}));

export const sectionsRelations = relations(sections, ({ one, many }) => ({
  adviser: one(users, {
    fields: [sections.adviserId],
    references: [users.id],
  }),
  enrollments: many(enrollments),
  assignments: many(assignments),
  meetings: many(meetings),
  teacherAssignments: many(teacherAssignments),
  folderSectionAccess: many(folderSectionAccess),
}));

export const enrollmentsRelations = relations(enrollments, ({ one }) => ({
  student: one(users, {
    fields: [enrollments.studentId],
    references: [users.id],
  }),
  section: one(sections, {
    fields: [enrollments.sectionId],
    references: [sections.id],
  }),
}));

export const gradesRelations = relations(grades, ({ one }) => ({
  student: one(users, {
    fields: [grades.studentId],
    references: [users.id],
  }),
  teacher: one(users, {
    fields: [grades.teacherId],
    references: [users.id],
  }),
}));

export const assignmentsRelations = relations(assignments, ({ one }) => ({
  section: one(sections, {
    fields: [assignments.sectionId],
    references: [sections.id],
  }),
  creator: one(users, {
    fields: [assignments.createdBy],
    references: [users.id],
  }),
}));

export const chatMessagesRelations = relations(chatMessages, ({ one }) => ({
  sender: one(users, {
    fields: [chatMessages.senderId],
    references: [users.id],
    relationName: 'sender',
  }),
  receiver: one(users, {
    fields: [chatMessages.receiverId],
    references: [users.id],
    relationName: 'receiver',
  }),
}));

export const meetingsRelations = relations(meetings, ({ one }) => ({
  section: one(sections, {
    fields: [meetings.sectionId],
    references: [sections.id],
  }),
  creator: one(users, {
    fields: [meetings.createdBy],
    references: [users.id],
  }),
}));

// Academic Management Relations
export const academicSubjectsRelations = relations(academicSubjects, ({ one, many }) => ({
  prerequisiteSubject: one(academicSubjects, {
    fields: [academicSubjects.prerequisiteSubjectId],
    references: [academicSubjects.id],
    relationName: 'prerequisite',
  }),
  dependentSubjects: many(academicSubjects, { relationName: 'prerequisite' }),
  subjectAssignments: many(subjectAssignments),
}));

export const teacherRegistrationsRelations = relations(teacherRegistrations, ({ one, many }) => ({
  user: one(users, {
    fields: [teacherRegistrations.userId],
    references: [users.id],
  }),
  subjectAssignments: many(subjectAssignments),
  advisoryAssignments: many(advisoryAssignments),
  teacherEvaluations: many(teacherEvaluations),
}));

export const subjectAssignmentsRelations = relations(subjectAssignments, ({ one, many }) => ({
  teacherRegistration: one(teacherRegistrations, {
    fields: [subjectAssignments.teacherRegistrationId],
    references: [teacherRegistrations.id],
  }),
  subject: one(academicSubjects, {
    fields: [subjectAssignments.subjectId],
    references: [academicSubjects.id],
  }),
  section: one(sections, {
    fields: [subjectAssignments.sectionId],
    references: [sections.id],
  }),
  classSchedules: many(classSchedules),
}));

export const advisoryAssignmentsRelations = relations(advisoryAssignments, ({ one }) => ({
  teacherRegistration: one(teacherRegistrations, {
    fields: [advisoryAssignments.teacherRegistrationId],
    references: [teacherRegistrations.id],
  }),
  section: one(sections, {
    fields: [advisoryAssignments.sectionId],
    references: [sections.id],
  }),
}));

export const classSchedulesRelations = relations(classSchedules, ({ one }) => ({
  subjectAssignment: one(subjectAssignments, {
    fields: [classSchedules.subjectAssignmentId],
    references: [subjectAssignments.id],
  }),
}));

export const teacherEvaluationsRelations = relations(teacherEvaluations, ({ one }) => ({
  teacherRegistration: one(teacherRegistrations, {
    fields: [teacherEvaluations.teacherRegistrationId],
    references: [teacherRegistrations.id],
  }),
  evaluator: one(users, {
    fields: [teacherEvaluations.evaluatorId],
    references: [users.id],
  }),
}));

// Schema types
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export const selectUserSchema = createSelectSchema(users);
export const insertSectionSchema = createInsertSchema(sections).omit({ id: true });
export const selectSectionSchema = createSelectSchema(sections);
export const insertEnrollmentSchema = createInsertSchema(enrollments).omit({ id: true, createdAt: true });
export const selectEnrollmentSchema = createSelectSchema(enrollments);
export const insertGradeSchema = createInsertSchema(grades).omit({ id: true });
export const selectGradeSchema = createSelectSchema(grades);
export const insertAssignmentSchema = createInsertSchema(assignments).omit({ id: true });
export const selectAssignmentSchema = createSelectSchema(assignments);
export const insertChatMessageSchema = createInsertSchema(chatMessages).omit({ id: true, createdAt: true });
export const selectChatMessageSchema = createSelectSchema(chatMessages);
export const insertMeetingSchema = createInsertSchema(meetings).omit({ id: true });
export const selectMeetingSchema = createSelectSchema(meetings);
export const insertAnnouncementSchema = createInsertSchema(announcements).omit({ id: true, datePosted: true });
export const selectAnnouncementSchema = createSelectSchema(announcements);
export const insertNewsSchema = createInsertSchema(news).omit({ id: true, datePosted: true });
export const selectNewsSchema = createSelectSchema(news);
export const insertEventSchema = createInsertSchema(events).omit({ id: true });
export const selectEventSchema = createSelectSchema(events);

// New schema types for admin functionality
export const insertRoleSchema = createInsertSchema(roles).omit({ id: true });
export const selectRoleSchema = createSelectSchema(roles);
export const insertSubjectSchema = createInsertSchema(subjects).omit({ id: true });
export const selectSubjectSchema = createSelectSchema(subjects);
export const insertTeacherAssignmentSchema = createInsertSchema(teacherAssignments).omit({ id: true });
export const selectTeacherAssignmentSchema = createSelectSchema(teacherAssignments);
export const insertOrgChartSchema = createInsertSchema(orgChart).omit({ id: true });
export const selectOrgChartSchema = createSelectSchema(orgChart);
export const insertSchoolSettingsSchema = createInsertSchema(schoolSettings).omit({ id: true });
export const selectSchoolSettingsSchema = createSelectSchema(schoolSettings);
export const insertTuitionFeeSchema = createInsertSchema(tuitionFees).omit({ id: true });
export const selectTuitionFeeSchema = createSelectSchema(tuitionFees);

// Enhanced teacher feature schemas
export const insertTeacherTaskSchema = createInsertSchema(teacherTasks).omit({ id: true, createdAt: true });
export const selectTeacherTaskSchema = createSelectSchema(teacherTasks);
export const insertTaskSubmissionSchema = createInsertSchema(taskSubmissions).omit({ id: true, submittedAt: true });
export const selectTaskSubmissionSchema = createSelectSchema(taskSubmissions);
export const insertTeacherMeetingSchema = createInsertSchema(teacherMeetings).omit({ id: true, createdAt: true });
export const selectTeacherMeetingSchema = createSelectSchema(teacherMeetings);
export const insertNotificationSchema = createInsertSchema(notifications).omit({ id: true, createdAt: true });
export const selectNotificationSchema = createSelectSchema(notifications);

// Guidance office schemas
export const insertGuidanceBehaviorRecordSchema = createInsertSchema(guidanceBehaviorRecords).omit({ id: true, dateReported: true });
export const selectGuidanceBehaviorRecordSchema = createSelectSchema(guidanceBehaviorRecords);
export const insertGuidanceCounselingSessionSchema = createInsertSchema(guidanceCounselingSessions).omit({ id: true, createdAt: true });
export const selectGuidanceCounselingSessionSchema = createSelectSchema(guidanceCounselingSessions);
export const insertGuidanceWellnessProgramSchema = createInsertSchema(guidanceWellnessPrograms).omit({ id: true, createdAt: true });
export const selectGuidanceWellnessProgramSchema = createSelectSchema(guidanceWellnessPrograms);
export const insertGuidanceProgramParticipantSchema = createInsertSchema(guidanceProgramParticipants).omit({ id: true, joinedAt: true });
export const selectGuidanceProgramParticipantSchema = createSelectSchema(guidanceProgramParticipants);

// Registrar office schemas
export const insertRegistrarEnrollmentRequestSchema = createInsertSchema(registrarEnrollmentRequests).omit({ id: true, dateRequested: true, dateProcessed: true });
export const selectRegistrarEnrollmentRequestSchema = createSelectSchema(registrarEnrollmentRequests);
export const insertRegistrarSubjectSchema = createInsertSchema(registrarSubjects).omit({ id: true });
export const selectRegistrarSubjectSchema = createSelectSchema(registrarSubjects);
export const insertAcademicRecordSchema = createInsertSchema(academicRecords).omit({ id: true, recordedAt: true });
export const selectAcademicRecordSchema = createSelectSchema(academicRecords);
export const insertGraduationCandidateSchema = createInsertSchema(graduationCandidates).omit({ id: true, dateCleared: true });
export const selectGraduationCandidateSchema = createSelectSchema(graduationCandidates);
export const insertTranscriptRequestSchema = createInsertSchema(transcriptRequests).omit({ id: true, requestDate: true, releaseDate: true });
export const selectTranscriptRequestSchema = createSelectSchema(transcriptRequests);

// Accounting module schemas
export const insertFeeStructureSchema = createInsertSchema(feeStructures).omit({ id: true });
export const selectFeeStructureSchema = createSelectSchema(feeStructures);
export const insertInvoiceSchema = createInsertSchema(invoices).omit({ id: true, createdAt: true });
export const selectInvoiceSchema = createSelectSchema(invoices);
export const insertInvoiceItemSchema = createInsertSchema(invoiceItems).omit({ id: true });
export const selectInvoiceItemSchema = createSelectSchema(invoiceItems);
export const insertPaymentSchema = createInsertSchema(payments).omit({ id: true, paymentDate: true });
export const selectPaymentSchema = createSelectSchema(payments);
export const insertScholarshipSchema = createInsertSchema(scholarships).omit({ id: true });
export const selectScholarshipSchema = createSelectSchema(scholarships);
export const insertSchoolExpenseSchema = createInsertSchema(schoolExpenses).omit({ id: true, createdAt: true });
export const selectSchoolExpenseSchema = createSelectSchema(schoolExpenses);

// Academic Management schemas
export const insertAcademicSubjectSchema = createInsertSchema(academicSubjects).omit({ id: true, createdAt: true });
export const selectAcademicSubjectSchema = createSelectSchema(academicSubjects);
export const insertTeacherRegistrationSchema = createInsertSchema(teacherRegistrations).omit({ id: true, createdAt: true });
export const selectTeacherRegistrationSchema = createSelectSchema(teacherRegistrations);
export const insertSubjectAssignmentSchema = createInsertSchema(subjectAssignments).omit({ id: true, assignedAt: true });
export const selectSubjectAssignmentSchema = createSelectSchema(subjectAssignments);
export const insertAdvisoryAssignmentSchema = createInsertSchema(advisoryAssignments).omit({ id: true, assignedAt: true });
export const selectAdvisoryAssignmentSchema = createSelectSchema(advisoryAssignments);
export const insertClassScheduleSchema = createInsertSchema(classSchedules).omit({ id: true, createdAt: true });
export const selectClassScheduleSchema = createSelectSchema(classSchedules);
export const insertTeacherEvaluationSchema = createInsertSchema(teacherEvaluations).omit({ id: true, evaluatedAt: true });
export const selectTeacherEvaluationSchema = createSelectSchema(teacherEvaluations);

// Real-time chat system schemas
export const insertConversationSchema = createInsertSchema(conversations).omit({ id: true, createdAt: true });
export const selectConversationSchema = createSelectSchema(conversations);
export const insertConversationMemberSchema = createInsertSchema(conversationMembers).omit({ id: true, joinedAt: true });
export const selectConversationMemberSchema = createSelectSchema(conversationMembers);
export const insertMessageSchema = createInsertSchema(messages).omit({ id: true, createdAt: true });
export const selectMessageSchema = createSelectSchema(messages);
export const insertUserStatusSchema = createInsertSchema(userStatus);
export const selectUserStatusSchema = createSelectSchema(userStatus);

// Teacher Folder System Relations
export const teacherFoldersRelations = relations(teacherFolders, ({ one, many }) => ({
  teacher: one(users, {
    fields: [teacherFolders.teacherId],
    references: [users.id],
  }),
  documents: many(folderDocuments),
  sectionAccess: many(folderSectionAccess),
}));

export const folderDocumentsRelations = relations(folderDocuments, ({ one }) => ({
  folder: one(teacherFolders, {
    fields: [folderDocuments.folderId],
    references: [teacherFolders.id],
  }),
}));

export const folderSectionAccessRelations = relations(folderSectionAccess, ({ one }) => ({
  folder: one(teacherFolders, {
    fields: [folderSectionAccess.folderId],
    references: [teacherFolders.id],
  }),
  section: one(sections, {
    fields: [folderSectionAccess.sectionId],
    references: [sections.id],
  }),
}));

// Inferred types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Section = typeof sections.$inferSelect;
export type InsertSection = z.infer<typeof insertSectionSchema>;
export type Enrollment = typeof enrollments.$inferSelect;
export type InsertEnrollment = z.infer<typeof insertEnrollmentSchema>;
export type Grade = typeof grades.$inferSelect;
export type InsertGrade = z.infer<typeof insertGradeSchema>;
export type Assignment = typeof assignments.$inferSelect;
export type InsertAssignment = z.infer<typeof insertAssignmentSchema>;
export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
export type Meeting = typeof meetings.$inferSelect;
export type InsertMeeting = z.infer<typeof insertMeetingSchema>;
export type Announcement = typeof announcements.$inferSelect;
export type InsertAnnouncement = z.infer<typeof insertAnnouncementSchema>;
export type News = typeof news.$inferSelect;
export type InsertNews = z.infer<typeof insertNewsSchema>;
export type Event = typeof events.$inferSelect;
export type InsertEvent = z.infer<typeof insertEventSchema>;

// New inferred types for admin functionality
export type Role = typeof roles.$inferSelect;
export type InsertRole = z.infer<typeof insertRoleSchema>;
export type Subject = typeof subjects.$inferSelect;
export type InsertSubject = z.infer<typeof insertSubjectSchema>;
export type TeacherAssignment = typeof teacherAssignments.$inferSelect;
export type InsertTeacherAssignment = z.infer<typeof insertTeacherAssignmentSchema>;
export type OrgChart = typeof orgChart.$inferSelect;
export type InsertOrgChart = z.infer<typeof insertOrgChartSchema>;
export type SchoolSettings = typeof schoolSettings.$inferSelect;
export type InsertSchoolSettings = z.infer<typeof insertSchoolSettingsSchema>;
export type TuitionFee = typeof tuitionFees.$inferSelect;
export type InsertTuitionFee = z.infer<typeof insertTuitionFeeSchema>;

// Enhanced teacher feature types
export type TeacherTask = typeof teacherTasks.$inferSelect;
export type InsertTeacherTask = z.infer<typeof insertTeacherTaskSchema>;
export type TaskSubmission = typeof taskSubmissions.$inferSelect;
export type InsertTaskSubmission = z.infer<typeof insertTaskSubmissionSchema>;
export type TeacherMeeting = typeof teacherMeetings.$inferSelect;
export type InsertTeacherMeeting = z.infer<typeof insertTeacherMeetingSchema>;
export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;

// Guidance office types
export type GuidanceBehaviorRecord = typeof guidanceBehaviorRecords.$inferSelect;
export type InsertGuidanceBehaviorRecord = z.infer<typeof insertGuidanceBehaviorRecordSchema>;
export type GuidanceCounselingSession = typeof guidanceCounselingSessions.$inferSelect;
export type InsertGuidanceCounselingSession = z.infer<typeof insertGuidanceCounselingSessionSchema>;
export type GuidanceWellnessProgram = typeof guidanceWellnessPrograms.$inferSelect;
export type InsertGuidanceWellnessProgram = z.infer<typeof insertGuidanceWellnessProgramSchema>;
export type GuidanceProgramParticipant = typeof guidanceProgramParticipants.$inferSelect;
export type InsertGuidanceProgramParticipant = z.infer<typeof insertGuidanceProgramParticipantSchema>;

// Registrar office types
export type RegistrarEnrollmentRequest = typeof registrarEnrollmentRequests.$inferSelect;
export type InsertRegistrarEnrollmentRequest = z.infer<typeof insertRegistrarEnrollmentRequestSchema>;
export type RegistrarSubject = typeof registrarSubjects.$inferSelect;
export type InsertRegistrarSubject = z.infer<typeof insertRegistrarSubjectSchema>;
export type AcademicRecord = typeof academicRecords.$inferSelect;
export type InsertAcademicRecord = z.infer<typeof insertAcademicRecordSchema>;
export type GraduationCandidate = typeof graduationCandidates.$inferSelect;
export type InsertGraduationCandidate = z.infer<typeof insertGraduationCandidateSchema>;
export type TranscriptRequest = typeof transcriptRequests.$inferSelect;
export type InsertTranscriptRequest = z.infer<typeof insertTranscriptRequestSchema>;

// Accounting module types
export type FeeStructure = typeof feeStructures.$inferSelect;
export type InsertFeeStructure = z.infer<typeof insertFeeStructureSchema>;
export type Invoice = typeof invoices.$inferSelect;
export type InsertInvoice = z.infer<typeof insertInvoiceSchema>;
export type InvoiceItem = typeof invoiceItems.$inferSelect;
export type InsertInvoiceItem = z.infer<typeof insertInvoiceItemSchema>;
export type Payment = typeof payments.$inferSelect;
export type InsertPayment = z.infer<typeof insertPaymentSchema>;
export type Scholarship = typeof scholarships.$inferSelect;
export type InsertScholarship = z.infer<typeof insertScholarshipSchema>;
export type SchoolExpense = typeof schoolExpenses.$inferSelect;
export type InsertSchoolExpense = z.infer<typeof insertSchoolExpenseSchema>;

// Real-time chat system types
export type Conversation = typeof conversations.$inferSelect;
export type InsertConversation = z.infer<typeof insertConversationSchema>;
export type ConversationMember = typeof conversationMembers.$inferSelect;
export type InsertConversationMember = z.infer<typeof insertConversationMemberSchema>;
export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type UserStatus = typeof userStatus.$inferSelect;
export type InsertUserStatus = z.infer<typeof insertUserStatusSchema>;

// User roles enum for validation
export const UserRoles = ['admin', 'teacher', 'student', 'parent', 'guidance', 'registrar', 'accounting'] as const;
export type UserRole = typeof UserRoles[number];