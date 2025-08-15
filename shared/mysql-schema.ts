import { mysqlTable, serial, varchar, timestamp, int, boolean, decimal } from "drizzle-orm/mysql-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// =====================
// USERS & ROLES
// =====================
export const roles = mysqlTable("roles", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 50 }).notNull().unique(),
});

export const users = mysqlTable("users", {
  id: serial("id").primaryKey(),
  roleId: int("role_id").references(() => roles.id, { onDelete: "cascade" }),
  firstName: varchar("first_name", { length: 100 }).notNull(),
  lastName: varchar("last_name", { length: 100 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  profileImage: varchar("profile_image", { length: 500 }),
  isActive: boolean("is_active").default(true),
  status: varchar("status", { length: 20 }).default("active"),
  createdAt: timestamp("created_at").defaultNow(),
  lastLogin: timestamp("last_login"),
});

// =====================
// SECTIONS & SUBJECTS
// =====================
export const sections = mysqlTable("sections", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  gradeLevel: varchar("grade_level", { length: 50 }).notNull(),
  adviserId: int("adviser_id").references(() => users.id, { onDelete: "set null" }),
  capacity: int("capacity").default(40),
  schoolYear: varchar("school_year", { length: 20 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const subjects = mysqlTable("subjects", {
  id: serial("id").primaryKey(),
  sectionId: int("section_id"),
  name: varchar("name", { length: 100 }).notNull(),
  description: varchar("description", { length: 500 }),
});

export const teacherSubjects = mysqlTable("teacher_subjects", {
  id: serial("id").primaryKey(),
  teacherId: int("teacher_id").references(() => users.id, { onDelete: "cascade" }),
  subjectId: int("subject_id").references(() => subjects.id, { onDelete: "cascade" }),
  sectionId: int("section_id").references(() => sections.id, { onDelete: "cascade" }),
  schoolYear: varchar("school_year", { length: 20 }).notNull(),
  semester: varchar("semester", { length: 20 }).notNull(),
  assignedAt: timestamp("assigned_at").defaultNow(),
});

export const schedules = mysqlTable("schedules", {
  id: serial("id").primaryKey(),
  teacherId: int("teacher_id").references(() => users.id, { onDelete: "cascade" }),
  subjectId: int("subject_id").references(() => subjects.id, { onDelete: "cascade" }),
  sectionId: int("section_id").references(() => sections.id, { onDelete: "cascade" }),
  dayOfWeek: varchar("day_of_week", { length: 20 }).notNull(),
  startTime: varchar("start_time", { length: 10 }).notNull(),
  endTime: varchar("end_time", { length: 10 }).notNull(),
  room: varchar("room", { length: 50 }),
  schoolYear: varchar("school_year", { length: 20 }).notNull(),
  semester: varchar("semester", { length: 20 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// =====================
// ENROLLMENT PROGRESS
// =====================
export const enrollmentProgress = mysqlTable("enrollment_progress", {
  id: serial("id").primaryKey(),
  studentId: int("student_id").references(() => users.id, { onDelete: "cascade" }),
  currentStatus: varchar("current_status", { length: 100 }).notNull(),
  remarks: varchar("remarks", { length: 1000 }),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

export const enrollmentApplications = mysqlTable("enrollment_applications", {
  id: serial("id").primaryKey(),
  studentId: int("student_id").references(() => users.id, { onDelete: "cascade" }),
  schoolYear: varchar("school_year", { length: 20 }).notNull(),
  status: varchar("status", { length: 20 }).default("Draft"),
  submittedAt: timestamp("submitted_at"),
  decidedAt: timestamp("decided_at"),
  decidedBy: int("decided_by").references(() => users.id, { onDelete: "set null" }),
  remarks: varchar("remarks", { length: 1000 }),
  createdAt: timestamp("created_at").defaultNow(),
});

export const enrollmentDocuments = mysqlTable("enrollment_documents", {
  id: serial("id").primaryKey(),
  applicationId: int("application_id").references(() => enrollmentApplications.id, { onDelete: "cascade" }),
  documentType: varchar("document_type", { length: 100 }).notNull(),
  fileName: varchar("file_name", { length: 255 }).notNull(),
  fileUrl: varchar("file_url", { length: 500 }).notNull(),
  uploadedAt: timestamp("uploaded_at").defaultNow(),
});

// =====================
// TEACHER MODULES
// =====================
export const modules = mysqlTable("modules", {
  id: serial("id").primaryKey(),
  teacherId: int("teacher_id").references(() => users.id, { onDelete: "cascade" }),
  sectionId: int("section_id").references(() => sections.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 200 }).notNull(),
  description: varchar("description", { length: 1000 }),
  fileUrl: varchar("file_url", { length: 500 }).notNull(),
  uploadedAt: timestamp("uploaded_at").defaultNow(),
});

export const learningModules = mysqlTable("learning_modules", {
  id: serial("id").primaryKey(),
  teacherId: int("teacher_id").references(() => users.id, { onDelete: "cascade" }),
  sectionId: int("section_id").references(() => sections.id, { onDelete: "set null" }),
  subjectId: int("subject_id").references(() => subjects.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 200 }).notNull(),
  description: varchar("description", { length: 1000 }),
  fileUrl: varchar("file_url", { length: 500 }).notNull(),
  isPublic: boolean("is_public").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// =====================
// TASKS
// =====================
export const tasks = mysqlTable("tasks", {
  id: serial("id").primaryKey(),
  teacherId: int("teacher_id").references(() => users.id, { onDelete: "cascade" }),
  sectionId: int("section_id").references(() => sections.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 200 }).notNull(),
  description: varchar("description", { length: 1000 }),
  taskType: varchar("task_type", { length: 50 }).notNull(),
  timerMinutes: int("timer_minutes"),
  dueDate: timestamp("due_date"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const taskQuestions = mysqlTable("task_questions", {
  id: serial("id").primaryKey(),
  taskId: int("task_id").references(() => tasks.id, { onDelete: "cascade" }),
  question: varchar("question", { length: 1000 }).notNull(),
  questionType: varchar("question_type", { length: 50 }).notNull(),
  options: varchar("options", { length: 2000 }),
  correctAnswer: varchar("correct_answer", { length: 1000 }),
  points: int("points").default(1),
});

export const taskSubmissions = mysqlTable("task_submissions", {
  id: serial("id").primaryKey(),
  taskId: int("task_id").references(() => tasks.id, { onDelete: "cascade" }),
  studentId: int("student_id").references(() => users.id, { onDelete: "cascade" }),
  answers: varchar("answers", { length: 5000 }),
  fileUrls: varchar("file_urls", { length: 2000 }),
  score: decimal("score", { precision: 5, scale: 2 }),
  feedback: varchar("feedback", { length: 1000 }),
  submittedAt: timestamp("submitted_at").defaultNow(),
  gradedAt: timestamp("graded_at"),
});

// =====================
// MEETINGS
// =====================
export const meetings = mysqlTable("meetings", {
  id: serial("id").primaryKey(),
  hostId: int("host_id").references(() => users.id, { onDelete: "cascade" }),
  sectionId: int("section_id").references(() => sections.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 200 }).notNull(),
  meetingLink: varchar("meeting_link", { length: 500 }).notNull(),
  scheduledAt: timestamp("scheduled_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// =====================
// CHAT SYSTEM
// =====================
export const messages = mysqlTable("messages", {
  id: serial("id").primaryKey(),
  senderId: int("sender_id").references(() => users.id, { onDelete: "cascade" }),
  receiverId: int("receiver_id").references(() => users.id, { onDelete: "cascade" }),
  message: varchar("message", { length: 2000 }).notNull(),
  sentAt: timestamp("sent_at").defaultNow(),
  isRead: boolean("is_read").default(false),
});

export const onlineStatus = mysqlTable("online_status", {
  userId: int("user_id").primaryKey().references(() => users.id, { onDelete: "cascade" }),
  isOnline: boolean("is_online").default(false),
  lastSeen: timestamp("last_seen"),
});

// =====================
// ANNOUNCEMENTS & EVENTS
// =====================
export const announcements = mysqlTable("announcements", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 200 }).notNull(),
  content: varchar("content", { length: 2000 }).notNull(),
  postedBy: int("posted_by").references(() => users.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at").defaultNow(),
});

export const events = mysqlTable("events", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 200 }).notNull(),
  description: varchar("description", { length: 1000 }),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),
  createdBy: int("created_by").references(() => users.id, { onDelete: "set null" }),
});

// =====================
// ACCOUNTING
// =====================
export const fees = mysqlTable("fees", {
  id: serial("id").primaryKey(),
  studentId: int("student_id").references(() => users.id, { onDelete: "cascade" }),
  feeType: varchar("fee_type", { length: 100 }).notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  dueDate: timestamp("due_date"),
  status: varchar("status", { length: 20 }).default("Unpaid"),
});

export const payments = mysqlTable("payments", {
  id: serial("id").primaryKey(),
  feeId: int("fee_id").references(() => fees.id, { onDelete: "cascade" }),
  studentId: int("student_id").references(() => users.id, { onDelete: "cascade" }),
  amountPaid: decimal("amount_paid", { precision: 10, scale: 2 }).notNull(),
  paymentDate: timestamp("payment_date").defaultNow(),
  paymentMethod: varchar("payment_method", { length: 50 }),
  paymentStatus: varchar("payment_status", { length: 20 }).default("pending"),
  referenceNumber: varchar("reference_number", { length: 100 }),
  receiptUrl: varchar("receipt_url", { length: 500 }),
  notes: varchar("notes", { length: 1000 }),
  recordedBy: int("recorded_by").references(() => users.id, { onDelete: "set null" }),
  verifiedBy: int("verified_by").references(() => users.id, { onDelete: "set null" }),
  verifiedAt: timestamp("verified_at"),
});

// =====================
// GUIDANCE
// =====================
export const guidanceReports = mysqlTable("guidance_reports", {
  id: serial("id").primaryKey(),
  studentId: int("student_id").references(() => users.id, { onDelete: "cascade" }),
  counselorId: int("counselor_id").references(() => users.id, { onDelete: "set null" }),
  report: varchar("report", { length: 2000 }).notNull(),
  reportDate: timestamp("report_date").defaultNow(),
});

// =====================
// GRADES
// =====================
export const grades = mysqlTable("grades", {
  id: serial("id").primaryKey(),
  studentId: int("student_id").references(() => users.id, { onDelete: "cascade" }),
  subjectId: int("subject_id").references(() => subjects.id, { onDelete: "cascade" }),
  teacherId: int("teacher_id").references(() => users.id, { onDelete: "cascade" }),
  grade: decimal("grade", { precision: 5, scale: 2 }).notNull(),
  quarter: int("quarter").notNull(),
  schoolYear: varchar("school_year", { length: 20 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// =====================
// NEWS
// =====================
export const news = mysqlTable("news", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 200 }).notNull(),
  summary: varchar("summary", { length: 500 }),
  content: varchar("content", { length: 5000 }),
  postedBy: int("posted_by").references(() => users.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at").defaultNow(),
});

// =====================
// NOTIFICATIONS
// =====================
export const notifications = mysqlTable("notifications", {
  id: serial("id").primaryKey(),
  recipientId: int("recipient_id").references(() => users.id, { onDelete: "cascade" }),
  senderId: int("sender_id").references(() => users.id, { onDelete: "set null" }),
  title: varchar("title", { length: 200 }).notNull(),
  message: varchar("message", { length: 1000 }).notNull(),
  type: varchar("type", { length: 20 }).default("info"),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// =====================
// ZOD SCHEMAS
// =====================
export const insertRoleSchema = createInsertSchema(roles);
export type InsertRole = z.infer<typeof insertRoleSchema>;
export type Role = typeof roles.$inferSelect;

export const insertUserSchema = createInsertSchema(users);
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const insertSectionSchema = createInsertSchema(sections);
export type InsertSection = z.infer<typeof insertSectionSchema>;
export type Section = typeof sections.$inferSelect;

export const insertSubjectSchema = createInsertSchema(subjects);
export type InsertSubject = z.infer<typeof insertSubjectSchema>;
export type Subject = typeof subjects.$inferSelect;

export const insertTaskSchema = createInsertSchema(tasks);
export type InsertTask = z.infer<typeof insertTaskSchema>;
export type Task = typeof tasks.$inferSelect;

export const insertMeetingSchema = createInsertSchema(meetings);
export type InsertMeeting = z.infer<typeof insertMeetingSchema>;
export type Meeting = typeof meetings.$inferSelect;

export const insertMessageSchema = createInsertSchema(messages);
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;

export const insertAnnouncementSchema = createInsertSchema(announcements);
export type InsertAnnouncement = z.infer<typeof insertAnnouncementSchema>;
export type Announcement = typeof announcements.$inferSelect;

export const insertEventSchema = createInsertSchema(events);
export type InsertEvent = z.infer<typeof insertEventSchema>;
export type Event = typeof events.$inferSelect;

export const insertFeeSchema = createInsertSchema(fees);
export type InsertFee = z.infer<typeof insertFeeSchema>;
export type Fee = typeof fees.$inferSelect;

export const insertPaymentSchema = createInsertSchema(payments);
export type InsertPayment = z.infer<typeof insertPaymentSchema>;
export type Payment = typeof payments.$inferSelect;

export const insertGradeSchema = createInsertSchema(grades);
export type InsertGrade = z.infer<typeof insertGradeSchema>;
export type Grade = typeof grades.$inferSelect;

export const insertNewsSchema = createInsertSchema(news);
export type InsertNews = z.infer<typeof insertNewsSchema>;
export type News = typeof news.$inferSelect;