import { mysqlTable, int, varchar, text, decimal, date, timestamp, boolean } from 'drizzle-orm/mysql-core';
import { relations } from 'drizzle-orm';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

// Users table
export const users = mysqlTable('users', {
  id: int('id').primaryKey().autoincrement(),
  roleId: int('role_id'),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  email: text('email').notNull(),
  passwordHash: text('password_hash').notNull(),
  profileImage: text('profile_image'),
  createdAt: timestamp('created_at').defaultNow(),
  lastLogin: timestamp('last_login'),
  sectionId: int('section_id'),
  name: varchar('name', { length: 100 }),
  role: varchar('role', { length: 50 }),
  isActive: boolean('is_active').default(true),
});

// Sections table
export const sections = mysqlTable('sections', {
  id: int('id').primaryKey().autoincrement(),
  name: varchar('name', { length: 100 }).notNull(),
  gradeLevel: int('grade_level').notNull(),
  adviserId: int('adviser_id'),
});

// Enrollments table
export const enrollments = mysqlTable('enrollments', {
  id: int('id').primaryKey().autoincrement(),
  studentId: int('student_id').notNull(),
  sectionId: int('section_id'),
  status: varchar('status', { length: 20 }).default('pending'),
  documents: text('documents'),
  paymentStatus: varchar('payment_status', { length: 20 }).default('unpaid'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Grades table
export const grades = mysqlTable('grades', {
  id: int('id').primaryKey().autoincrement(),
  studentId: int('student_id').notNull(),
  subjectId: int('subject_id').notNull(),
  quarter: int('quarter').notNull(),
  grade: decimal('grade', { precision: 5, scale: 2 }),
  teacherId: int('teacher_id'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Teacher Tasks (Enhanced Assignments)
export const teacherTasks = mysqlTable('teacher_tasks', {
  id: int('id').primaryKey().autoincrement(),
  teacherId: int('teacher_id').notNull(),
  sectionId: int('section_id').notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  taskType: varchar('task_type', { length: 50 }).notNull(),
  timerMinutes: int('timer_minutes'),
  dueDate: timestamp('due_date'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Task Submissions
export const taskSubmissions = mysqlTable('task_submissions', {
  id: int('id').primaryKey().autoincrement(),
  taskId: int('task_id').notNull(),
  studentId: int('student_id').notNull(),
  submittedAt: timestamp('submitted_at').defaultNow(),
  fileUrl: text('file_url'),
  score: decimal('score', { precision: 5, scale: 2 }),
  feedback: text('feedback'),
});

// Teacher Meetings
export const teacherMeetings = mysqlTable('teacher_meetings', {
  id: int('id').primaryKey().autoincrement(),
  teacherId: int('teacher_id').notNull(),
  sectionId: int('section_id').notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  meetingUrl: text('meeting_url').notNull(),
  scheduledAt: timestamp('scheduled_at').notNull(),
  durationMinutes: int('duration_minutes').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Notifications
export const notifications = mysqlTable('notifications', {
  id: int('id').primaryKey().autoincrement(),
  recipientId: int('recipient_id').notNull(),
  message: text('message').notNull(),
  link: text('link'),
  isRead: boolean('is_read').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

// Guidance Office Tables
export const guidanceBehaviorRecords = mysqlTable('guidance_behavior_records', {
  id: int('id').primaryKey().autoincrement(),
  studentId: int('student_id').notNull(),
  reportedBy: int('reported_by').notNull(),
  incidentType: varchar('incident_type', { length: 100 }).notNull(),
  description: text('description').notNull(),
  actionTaken: text('action_taken'),
  status: varchar('status', { length: 50 }).default('Pending').notNull(),
  dateReported: timestamp('date_reported').defaultNow().notNull(),
});

export const guidanceCounselingSessions = mysqlTable('guidance_counseling_sessions', {
  id: int('id').primaryKey().autoincrement(),
  studentId: int('student_id').notNull(),
  counselorId: int('counselor_id').notNull(),
  sessionDate: varchar('session_date', { length: 50 }).notNull(),
  sessionNotes: text('session_notes'),
  followUpDate: varchar('follow_up_date', { length: 50 }),
  confidentialityLevel: varchar('confidentiality_level', { length: 50 }).default('Internal').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const guidanceWellnessPrograms = mysqlTable('guidance_wellness_programs', {
  id: int('id').primaryKey().autoincrement(),
  programName: varchar('program_name', { length: 255 }).notNull(),
  description: text('description'),
  startDate: date('start_date').notNull(),
  endDate: date('end_date').notNull(),
  createdBy: int('created_by').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const guidanceProgramParticipants = mysqlTable('guidance_program_participants', {
  id: int('id').primaryKey().autoincrement(),
  programId: int('program_id').notNull(),
  studentId: int('student_id').notNull(),
  joinedAt: timestamp('joined_at').defaultNow().notNull(),
});

// Registrar office features
export const registrarEnrollmentRequests = mysqlTable('registrar_enrollment_requests', {
  id: int('id').primaryKey().autoincrement(),
  studentId: int('student_id').notNull(),
  schoolYear: varchar('school_year', { length: 9 }).notNull(),
  gradeLevel: varchar('grade_level', { length: 50 }).notNull(),
  sectionId: int('section_id'),
  status: varchar('status', { length: 20 }).default('Pending').notNull(),
  dateRequested: timestamp('date_requested').defaultNow().notNull(),
  dateProcessed: timestamp('date_processed'),
});

export const registrarSubjects = mysqlTable('registrar_subjects', {
  id: int('id').primaryKey().autoincrement(),
  subjectCode: varchar('subject_code', { length: 20 }).notNull(),
  subjectName: varchar('subject_name', { length: 255 }).notNull(),
  description: text('description'),
  gradeLevel: varchar('grade_level', { length: 50 }),
  semester: varchar('semester', { length: 20 }),
  prerequisiteId: int('prerequisite_id'),
});

export const academicRecords = mysqlTable('academic_records', {
  id: int('id').primaryKey().autoincrement(),
  studentId: int('student_id').notNull(),
  subjectId: int('subject_id').notNull(),
  schoolYear: varchar('school_year', { length: 9 }).notNull(),
  quarter1: decimal('quarter1', { precision: 5, scale: 2 }),
  quarter2: decimal('quarter2', { precision: 5, scale: 2 }),
  quarter3: decimal('quarter3', { precision: 5, scale: 2 }),
  quarter4: decimal('quarter4', { precision: 5, scale: 2 }),
  finalGrade: decimal('final_grade', { precision: 5, scale: 2 }),
  remarks: varchar('remarks', { length: 20 }),
  recordedAt: timestamp('recorded_at').defaultNow().notNull(),
});

export const graduationCandidates = mysqlTable('graduation_candidates', {
  id: int('id').primaryKey().autoincrement(),
  studentId: int('student_id').notNull(),
  schoolYear: varchar('school_year', { length: 9 }).notNull(),
  status: varchar('status', { length: 20 }).default('Pending').notNull(),
  dateCleared: timestamp('date_cleared'),
});

export const transcriptRequests = mysqlTable('transcript_requests', {
  id: int('id').primaryKey().autoincrement(),
  studentId: int('student_id').notNull(),
  requestDate: timestamp('request_date').defaultNow().notNull(),
  status: varchar('status', { length: 20 }).default('Pending').notNull(),
  releaseDate: timestamp('release_date'),
});

// Accounting module features
export const feeStructures = mysqlTable('fee_structures', {
  id: int('id').primaryKey().autoincrement(),
  gradeLevel: varchar('grade_level', { length: 50 }).notNull(),
  tuitionFee: decimal('tuition_fee', { precision: 12, scale: 2 }).notNull(),
  miscFee: decimal('misc_fee', { precision: 12, scale: 2 }).default('0').notNull(),
  otherFee: decimal('other_fee', { precision: 12, scale: 2 }).default('0').notNull(),
  effectiveSchoolYear: varchar('effective_school_year', { length: 9 }).notNull(),
});

export const invoices = mysqlTable('invoices', {
  id: int('id').primaryKey().autoincrement(),
  studentId: int('student_id').notNull(),
  schoolYear: varchar('school_year', { length: 9 }).notNull(),
  dueDate: date('due_date').notNull(),
  totalAmount: decimal('total_amount', { precision: 12, scale: 2 }).notNull(),
  status: varchar('status', { length: 20 }).default('Unpaid').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const invoiceItems = mysqlTable('invoice_items', {
  id: int('id').primaryKey().autoincrement(),
  invoiceId: int('invoice_id').notNull(),
  description: varchar('description', { length: 255 }).notNull(),
  amount: decimal('amount', { precision: 12, scale: 2 }).notNull(),
});

export const payments = mysqlTable('payments', {
  id: int('id').primaryKey().autoincrement(),
  invoiceId: int('invoice_id').notNull(),
  paymentDate: timestamp('payment_date').defaultNow().notNull(),
  amountPaid: decimal('amount_paid', { precision: 12, scale: 2 }).notNull(),
  paymentMethod: varchar('payment_method', { length: 50 }),
  receiptNumber: varchar('receipt_number', { length: 100 }),
});

export const scholarships = mysqlTable('scholarships', {
  id: int('id').primaryKey().autoincrement(),
  studentId: int('student_id').notNull(),
  scholarshipName: varchar('scholarship_name', { length: 255 }).notNull(),
  discountPercentage: decimal('discount_percentage', { precision: 5, scale: 2 }).notNull(),
  effectiveSchoolYear: varchar('effective_school_year', { length: 9 }).notNull(),
});

export const schoolExpenses = mysqlTable('school_expenses', {
  id: int('id').primaryKey().autoincrement(),
  expenseDate: date('expense_date').notNull(),
  category: varchar('category', { length: 100 }).notNull(),
  description: text('description'),
  amount: decimal('amount', { precision: 12, scale: 2 }).notNull(),
  recordedBy: int('recorded_by').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Real-time chat system features
export const conversations = mysqlTable('conversations', {
  id: int('id').primaryKey().autoincrement(),
  conversationType: varchar('conversation_type', { length: 20 }).default('private').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const conversationMembers = mysqlTable('conversation_members', {
  id: int('id').primaryKey().autoincrement(),
  conversationId: int('conversation_id').notNull(),
  userId: int('user_id').notNull(),
  joinedAt: timestamp('joined_at').defaultNow().notNull(),
});

export const messages = mysqlTable('messages', {
  id: int('id').primaryKey().autoincrement(),
  conversationId: int('conversation_id').notNull(),
  senderId: int('sender_id').notNull(),
  messageText: text('message_text'),
  attachmentUrl: text('attachment_url'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  isRead: boolean('is_read').default(false).notNull(),
});

export const userStatus = mysqlTable('user_status', {
  userId: int('user_id').primaryKey(),
  isOnline: boolean('is_online').default(false).notNull(),
  lastSeen: timestamp('last_seen').defaultNow().notNull(),
});

// Legacy assignments table (keeping for compatibility)
export const assignments = mysqlTable('assignments', {
  id: int('id').primaryKey().autoincrement(),
  sectionId: int('section_id').notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  type: varchar('type', { length: 20 }).notNull(),
  dueDate: date('due_date'),
  fileUrl: varchar('file_url', { length: 255 }),
  createdBy: int('created_by').notNull(),
});

// Chat messages table
export const chatMessages = mysqlTable('chat_messages', {
  id: int('id').primaryKey().autoincrement(),
  senderId: int('sender_id').notNull(),
  receiverId: int('receiver_id'),
  message: text('message').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Meetings table
export const meetings = mysqlTable('meetings', {
  id: int('id').primaryKey().autoincrement(),
  sectionId: int('section_id').notNull(),
  title: varchar('title', { length: 255 }),
  meetingLink: varchar('meeting_link', { length: 255 }),
  date: timestamp('date'),
  createdBy: int('created_by').notNull(),
});

// Hero images table
export const heroImages = mysqlTable('hero_images', {
  id: int('id').primaryKey().autoincrement(),
  imageUrl: varchar('image_url', { length: 255 }).notNull(),
  uploadedBy: int('uploaded_by'),
});

// Announcements table
export const announcements = mysqlTable('announcements', {
  id: int('id').primaryKey().autoincrement(),
  title: varchar('title', { length: 255 }).notNull(),
  content: text('content').notNull(),
  datePosted: timestamp('date_posted').defaultNow(),
  postedBy: int('posted_by'),
});

// News table
export const news = mysqlTable('news', {
  id: int('id').primaryKey().autoincrement(),
  title: varchar('title', { length: 255 }).notNull(),
  summary: text('summary'),
  imageUrl: varchar('image_url', { length: 255 }),
  datePosted: timestamp('date_posted').defaultNow(),
  postedBy: int('posted_by'),
});

// Teacher Folders for Learning Materials
export const teacherFolders = mysqlTable('teacher_folders', {
  id: int('id').primaryKey().autoincrement(),
  teacherId: int('teacher_id').notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Folder Documents
export const folderDocuments = mysqlTable('folder_documents', {
  id: int('id').primaryKey().autoincrement(),
  folderId: int('folder_id').notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  fileUrl: text('file_url').notNull(),
  fileType: varchar('file_type', { length: 50 }),
  fileSize: int('file_size'),
  uploadedAt: timestamp('uploaded_at').defaultNow(),
});

// Folder Section Access
export const folderSectionAccess = mysqlTable('folder_section_access', {
  id: int('id').primaryKey().autoincrement(),
  folderId: int('folder_id').notNull(),
  sectionId: int('section_id').notNull(),
  grantedAt: timestamp('granted_at').defaultNow(),
});

// Events table
export const events = mysqlTable('events', {
  id: int('id').primaryKey().autoincrement(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  date: date('date'),
  location: varchar('location', { length: 255 }),
  postedBy: int('posted_by'),
});

// Roles table for flexible role management
export const roles = mysqlTable('roles', {
  id: int('id').primaryKey().autoincrement(),
  roleName: varchar('role_name', { length: 50 }).notNull(),
});

// Subjects table
export const subjects = mysqlTable('subjects', {
  id: int('id').primaryKey().autoincrement(),
  name: varchar('name', { length: 100 }).notNull(),
  gradeLevel: int('grade_level').notNull(),
});

// Teacher assignments table - Enhanced for Academic Coordinator
export const teacherAssignments = mysqlTable('teacher_assignments', {
  id: int('id').primaryKey().autoincrement(),
  teacherId: int('teacher_id'),
  sectionId: int('section_id'),
  subjectId: int('subject_id'),
  isAdvisory: boolean('is_advisory').default(false),
  schoolYear: varchar('school_year', { length: 9 }).default('2024-2025'),
  assignedBy: int('assigned_by'),
  assignedAt: timestamp('assigned_at').defaultNow(),
});

// Organizational chart table
export const orgChart = mysqlTable('org_chart', {
  id: int('id').primaryKey().autoincrement(),
  name: varchar('name', { length: 100 }).notNull(),
  position: varchar('position', { length: 100 }).notNull(),
  photoUrl: varchar('photo_url', { length: 255 }),
  reportsTo: int('reports_to'),
});

// School settings table
export const schoolSettings = mysqlTable('school_settings', {
  id: int('id').primaryKey().autoincrement(),
  schoolYear: varchar('school_year', { length: 20 }).notNull(),
  startDate: date('start_date'),
  endDate: date('end_date'),
});

// Tuition fees table
export const tuitionFees = mysqlTable('tuition_fees', {
  id: int('id').primaryKey().autoincrement(),
  gradeLevel: int('grade_level').notNull(),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  dueDate: date('due_date'),
});

// Academic Management Tables
export const academicSubjects = mysqlTable('academic_subjects', {
  id: int('id').primaryKey().autoincrement(),
  subjectCode: varchar('subject_code', { length: 20 }).notNull(),
  subjectName: varchar('subject_name', { length: 255 }).notNull(),
  description: text('description'),
  gradeLevel: varchar('grade_level', { length: 50 }).notNull(),
  semester: varchar('semester', { length: 20 }).notNull(),
  units: int('units').notNull(),
  prerequisiteSubjectId: int('prerequisite_subject_id'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
});

export const teacherRegistrations = mysqlTable('teacher_registrations', {
  id: int('id').primaryKey().autoincrement(),
  userId: int('user_id').notNull(),
  employeeId: varchar('employee_id', { length: 50 }).notNull(),
  specialization: varchar('specialization', { length: 255 }),
  qualifications: text('qualifications'),
  experience: text('experience'),
  isAdvisory: boolean('is_advisory').default(false),
  status: varchar('status', { length: 20 }).default('Active').notNull(),
  dateHired: date('date_hired'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const subjectAssignments = mysqlTable('subject_assignments', {
  id: int('id').primaryKey().autoincrement(),
  teacherRegistrationId: int('teacher_registration_id').notNull(),
  subjectId: int('subject_id').notNull(),
  sectionId: int('section_id').notNull(),
  schoolYear: varchar('school_year', { length: 9 }).notNull(),
  semester: varchar('semester', { length: 20 }).notNull(),
  status: varchar('status', { length: 20 }).default('Active').notNull(),
  assignedAt: timestamp('assigned_at').defaultNow(),
});

export const advisoryAssignments = mysqlTable('advisory_assignments', {
  id: int('id').primaryKey().autoincrement(),
  teacherRegistrationId: int('teacher_registration_id').notNull(),
  sectionId: int('section_id').notNull(),
  schoolYear: varchar('school_year', { length: 9 }).notNull(),
  status: varchar('status', { length: 20 }).default('Active').notNull(),
  assignedAt: timestamp('assigned_at').defaultNow(),
});

export const classSchedules = mysqlTable('class_schedules', {
  id: int('id').primaryKey().autoincrement(),
  subjectAssignmentId: int('subject_assignment_id').notNull(),
  dayOfWeek: varchar('day_of_week', { length: 20 }).notNull(),
  startTime: varchar('start_time', { length: 10 }).notNull(),
  endTime: varchar('end_time', { length: 10 }).notNull(),
  room: varchar('room', { length: 50 }),
  status: varchar('status', { length: 20 }).default('Active').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const teacherEvaluations = mysqlTable('teacher_evaluations', {
  id: int('id').primaryKey().autoincrement(),
  teacherRegistrationId: int('teacher_registration_id').notNull(),
  evaluatorId: int('evaluator_id').notNull(),
  evaluationPeriod: varchar('evaluation_period', { length: 50 }).notNull(),
  overallRating: decimal('overall_rating', { precision: 3, scale: 2 }),
  strengths: text('strengths'),
  areasForImprovement: text('areas_for_improvement'),
  comments: text('comments'),
  status: varchar('status', { length: 20 }).default('Draft').notNull(),
  evaluatedAt: timestamp('evaluated_at').defaultNow(),
});

// Insert and Select types
export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = z.infer<typeof selectUserSchema>;

export const insertSectionSchema = createInsertSchema(sections);
export const selectSectionSchema = createSelectSchema(sections);
export type InsertSection = z.infer<typeof insertSectionSchema>;
export type Section = z.infer<typeof selectSectionSchema>;

export const insertSubjectSchema = createInsertSchema(subjects);
export const selectSubjectSchema = createSelectSchema(subjects);
export type InsertSubject = z.infer<typeof insertSubjectSchema>;
export type Subject = z.infer<typeof selectSubjectSchema>;

export const insertTeacherAssignmentSchema = createInsertSchema(teacherAssignments);
export const selectTeacherAssignmentSchema = createSelectSchema(teacherAssignments);
export type InsertTeacherAssignment = z.infer<typeof insertTeacherAssignmentSchema>;
export type TeacherAssignment = z.infer<typeof selectTeacherAssignmentSchema>;

export const insertGradeSchema = createInsertSchema(grades);
export const selectGradeSchema = createSelectSchema(grades);
export type InsertGrade = z.infer<typeof insertGradeSchema>;
export type Grade = z.infer<typeof selectGradeSchema>;

export const insertAnnouncementSchema = createInsertSchema(announcements);
export const selectAnnouncementSchema = createSelectSchema(announcements);
export type InsertAnnouncement = z.infer<typeof insertAnnouncementSchema>;
export type Announcement = z.infer<typeof selectAnnouncementSchema>;

export const insertNewsSchema = createInsertSchema(news);
export const selectNewsSchema = createSelectSchema(news);
export type InsertNews = z.infer<typeof insertNewsSchema>;
export type News = z.infer<typeof selectNewsSchema>;

export const insertEventSchema = createInsertSchema(events);
export const selectEventSchema = createSelectSchema(events);
export type InsertEvent = z.infer<typeof insertEventSchema>;
export type Event = z.infer<typeof selectEventSchema>;

export const insertRoleSchema = createInsertSchema(roles);
export const selectRoleSchema = createSelectSchema(roles);
export type InsertRole = z.infer<typeof insertRoleSchema>;
export type Role = z.infer<typeof selectRoleSchema>;

export const insertEnrollmentSchema = createInsertSchema(enrollments);
export const selectEnrollmentSchema = createSelectSchema(enrollments);
export type InsertEnrollment = z.infer<typeof insertEnrollmentSchema>;
export type Enrollment = z.infer<typeof selectEnrollmentSchema>;

export const insertTeacherTaskSchema = createInsertSchema(teacherTasks).omit({ id: true, createdAt: true });
export const selectTeacherTaskSchema = createSelectSchema(teacherTasks);
export type InsertTeacherTask = z.infer<typeof insertTeacherTaskSchema>;
export type TeacherTask = z.infer<typeof selectTeacherTaskSchema>;

export const insertTaskSubmissionSchema = createInsertSchema(taskSubmissions).omit({ id: true, submittedAt: true });
export const selectTaskSubmissionSchema = createSelectSchema(taskSubmissions);
export type InsertTaskSubmission = z.infer<typeof insertTaskSubmissionSchema>;
export type TaskSubmission = z.infer<typeof selectTaskSubmissionSchema>;

export const insertTeacherMeetingSchema = createInsertSchema(teacherMeetings).omit({ id: true, createdAt: true });
export const selectTeacherMeetingSchema = createSelectSchema(teacherMeetings);
export type InsertTeacherMeeting = z.infer<typeof insertTeacherMeetingSchema>;
export type TeacherMeeting = z.infer<typeof selectTeacherMeetingSchema>;

export const insertNotificationSchema = createInsertSchema(notifications).omit({ id: true, createdAt: true });
export const selectNotificationSchema = createSelectSchema(notifications);
export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type Notification = z.infer<typeof selectNotificationSchema>;

export const insertChatMessageSchema = createInsertSchema(chatMessages).omit({ id: true, createdAt: true });
export const selectChatMessageSchema = createSelectSchema(chatMessages);
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
export type ChatMessage = z.infer<typeof selectChatMessageSchema>;

export const insertConversationSchema = createInsertSchema(conversations).omit({ id: true, createdAt: true });
export const selectConversationSchema = createSelectSchema(conversations);
export type InsertConversation = z.infer<typeof insertConversationSchema>;
export type Conversation = z.infer<typeof selectConversationSchema>;

export const insertConversationMemberSchema = createInsertSchema(conversationMembers).omit({ id: true, joinedAt: true });
export const selectConversationMemberSchema = createSelectSchema(conversationMembers);
export type InsertConversationMember = z.infer<typeof insertConversationMemberSchema>;
export type ConversationMember = z.infer<typeof selectConversationMemberSchema>;

export const insertMessageSchema = createInsertSchema(messages).omit({ id: true, createdAt: true });
export const selectMessageSchema = createSelectSchema(messages);
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = z.infer<typeof selectMessageSchema>;

export const insertUserStatusSchema = createInsertSchema(userStatus).omit({ lastSeen: true });
export const selectUserStatusSchema = createSelectSchema(userStatus);
export type InsertUserStatus = z.infer<typeof insertUserStatusSchema>;
export type UserStatus = z.infer<typeof selectUserStatusSchema>;

// Guidance office types
export const insertGuidanceBehaviorRecordSchema = createInsertSchema(guidanceBehaviorRecords).omit({ id: true, dateReported: true });
export const selectGuidanceBehaviorRecordSchema = createSelectSchema(guidanceBehaviorRecords);
export type InsertGuidanceBehaviorRecord = z.infer<typeof insertGuidanceBehaviorRecordSchema>;
export type GuidanceBehaviorRecord = z.infer<typeof selectGuidanceBehaviorRecordSchema>;

export const insertGuidanceCounselingSessionSchema = createInsertSchema(guidanceCounselingSessions).omit({ id: true, createdAt: true });
export const selectGuidanceCounselingSessionSchema = createSelectSchema(guidanceCounselingSessions);
export type InsertGuidanceCounselingSession = z.infer<typeof insertGuidanceCounselingSessionSchema>;
export type GuidanceCounselingSession = z.infer<typeof selectGuidanceCounselingSessionSchema>;

export const insertGuidanceWellnessProgramSchema = createInsertSchema(guidanceWellnessPrograms).omit({ id: true, createdAt: true });
export const selectGuidanceWellnessProgramSchema = createSelectSchema(guidanceWellnessPrograms);
export type InsertGuidanceWellnessProgram = z.infer<typeof insertGuidanceWellnessProgramSchema>;
export type GuidanceWellnessProgram = z.infer<typeof selectGuidanceWellnessProgramSchema>;

export const insertGuidanceProgramParticipantSchema = createInsertSchema(guidanceProgramParticipants).omit({ id: true, joinedAt: true });
export const selectGuidanceProgramParticipantSchema = createSelectSchema(guidanceProgramParticipants);
export type InsertGuidanceProgramParticipant = z.infer<typeof insertGuidanceProgramParticipantSchema>;
export type GuidanceProgramParticipant = z.infer<typeof selectGuidanceProgramParticipantSchema>;

// Registrar office types
export const insertRegistrarEnrollmentRequestSchema = createInsertSchema(registrarEnrollmentRequests).omit({ id: true, dateRequested: true });
export const selectRegistrarEnrollmentRequestSchema = createSelectSchema(registrarEnrollmentRequests);
export type InsertRegistrarEnrollmentRequest = z.infer<typeof insertRegistrarEnrollmentRequestSchema>;
export type RegistrarEnrollmentRequest = z.infer<typeof selectRegistrarEnrollmentRequestSchema>;

export const insertRegistrarSubjectSchema = createInsertSchema(registrarSubjects).omit({ id: true });
export const selectRegistrarSubjectSchema = createSelectSchema(registrarSubjects);
export type InsertRegistrarSubject = z.infer<typeof insertRegistrarSubjectSchema>;
export type RegistrarSubject = z.infer<typeof selectRegistrarSubjectSchema>;

export const insertAcademicRecordSchema = createInsertSchema(academicRecords).omit({ id: true, recordedAt: true });
export const selectAcademicRecordSchema = createSelectSchema(academicRecords);
export type InsertAcademicRecord = z.infer<typeof insertAcademicRecordSchema>;
export type AcademicRecord = z.infer<typeof selectAcademicRecordSchema>;

export const insertGraduationCandidateSchema = createInsertSchema(graduationCandidates).omit({ id: true });
export const selectGraduationCandidateSchema = createSelectSchema(graduationCandidates);
export type InsertGraduationCandidate = z.infer<typeof insertGraduationCandidateSchema>;
export type GraduationCandidate = z.infer<typeof selectGraduationCandidateSchema>;

export const insertTranscriptRequestSchema = createInsertSchema(transcriptRequests).omit({ id: true, requestDate: true });
export const selectTranscriptRequestSchema = createSelectSchema(transcriptRequests);
export type InsertTranscriptRequest = z.infer<typeof insertTranscriptRequestSchema>;
export type TranscriptRequest = z.infer<typeof selectTranscriptRequestSchema>;

// Accounting module types
export const insertFeeStructureSchema = createInsertSchema(feeStructures).omit({ id: true });
export const selectFeeStructureSchema = createSelectSchema(feeStructures);
export type InsertFeeStructure = z.infer<typeof insertFeeStructureSchema>;
export type FeeStructure = z.infer<typeof selectFeeStructureSchema>;

export const insertInvoiceSchema = createInsertSchema(invoices).omit({ id: true, createdAt: true });
export const selectInvoiceSchema = createSelectSchema(invoices);
export type InsertInvoice = z.infer<typeof insertInvoiceSchema>;
export type Invoice = z.infer<typeof selectInvoiceSchema>;

export const insertInvoiceItemSchema = createInsertSchema(invoiceItems).omit({ id: true });
export const selectInvoiceItemSchema = createSelectSchema(invoiceItems);
export type InsertInvoiceItem = z.infer<typeof insertInvoiceItemSchema>;
export type InvoiceItem = z.infer<typeof selectInvoiceItemSchema>;

export const insertPaymentSchema = createInsertSchema(payments).omit({ id: true, paymentDate: true });
export const selectPaymentSchema = createSelectSchema(payments);
export type InsertPayment = z.infer<typeof insertPaymentSchema>;
export type Payment = z.infer<typeof selectPaymentSchema>;

export const insertScholarshipSchema = createInsertSchema(scholarships).omit({ id: true });
export const selectScholarshipSchema = createSelectSchema(scholarships);
export type InsertScholarship = z.infer<typeof insertScholarshipSchema>;
export type Scholarship = z.infer<typeof selectScholarshipSchema>;

export const insertSchoolExpenseSchema = createInsertSchema(schoolExpenses).omit({ id: true, createdAt: true });
export const selectSchoolExpenseSchema = createSelectSchema(schoolExpenses);
export type InsertSchoolExpense = z.infer<typeof insertSchoolExpenseSchema>;
export type SchoolExpense = z.infer<typeof selectSchoolExpenseSchema>;

// Teacher Folder System types
export const insertTeacherFolderSchema = createInsertSchema(teacherFolders).omit({ id: true, createdAt: true, updatedAt: true });
export const selectTeacherFolderSchema = createSelectSchema(teacherFolders);
export type InsertTeacherFolder = z.infer<typeof insertTeacherFolderSchema>;
export type TeacherFolder = z.infer<typeof selectTeacherFolderSchema>;

export const insertFolderDocumentSchema = createInsertSchema(folderDocuments).omit({ id: true, uploadedAt: true });
export const selectFolderDocumentSchema = createSelectSchema(folderDocuments);
export type InsertFolderDocument = z.infer<typeof insertFolderDocumentSchema>;
export type FolderDocument = z.infer<typeof selectFolderDocumentSchema>;

export const insertFolderSectionAccessSchema = createInsertSchema(folderSectionAccess).omit({ id: true, grantedAt: true });
export const selectFolderSectionAccessSchema = createSelectSchema(folderSectionAccess);
export type InsertFolderSectionAccess = z.infer<typeof insertFolderSectionAccessSchema>;
export type FolderSectionAccess = z.infer<typeof selectFolderSectionAccessSchema>;

export const insertOrgChartSchema = createInsertSchema(orgChart).omit({ id: true });
export const selectOrgChartSchema = createSelectSchema(orgChart);
export type InsertOrgChart = z.infer<typeof insertOrgChartSchema>;
export type OrgChart = z.infer<typeof selectOrgChartSchema>;

export const insertSchoolSettingsSchema = createInsertSchema(schoolSettings).omit({ id: true });
export const selectSchoolSettingsSchema = createSelectSchema(schoolSettings);
export type InsertSchoolSettings = z.infer<typeof insertSchoolSettingsSchema>;
export type SchoolSettings = z.infer<typeof selectSchoolSettingsSchema>;

export const insertTuitionFeeSchema = createInsertSchema(tuitionFees).omit({ id: true });
export const selectTuitionFeeSchema = createSelectSchema(tuitionFees);
export type InsertTuitionFee = z.infer<typeof insertTuitionFeeSchema>;
export type TuitionFee = z.infer<typeof selectTuitionFeeSchema>;