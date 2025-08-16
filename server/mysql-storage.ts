import {
  roles, users, sections, subjects, grades, tasks, meetings, modules,
  announcements, events, news, messages, onlineStatus, fees, payments,
  guidanceReports, enrollmentProgress, notifications, enrollmentApplications,
  enrollmentDocuments, taskQuestions, taskSubmissions, teacherSubjects,
  schedules, learningModules,
  type User, type InsertUser,
  type Role, type InsertRole,
  type Section, type InsertSection,
  type Subject, type InsertSubject,
  type Grade, type InsertGrade,
  type Task, type InsertTask,
  type Meeting, type InsertMeeting,
  type Module, type InsertModule,
  type Announcement, type InsertAnnouncement,
  type Event, type InsertEvent,
  type News, type InsertNews,
  type Message, type InsertMessage,
  type OnlineStatus, type InsertOnlineStatus,
  type Fee, type InsertFee,
  type Payment, type InsertPayment,
  type GuidanceReport, type InsertGuidanceReport,
  type EnrollmentProgress, type InsertEnrollmentProgress
} from "../shared/mysql-schema";

import { mysqlDb as db } from "./mysql-db";
import { eq, desc, and, not, gte, lte, sql } from "drizzle-orm";
import type { IStorage } from "./unified-storage";

export class MySQLStorage implements IStorage {
  // User management
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return result[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    const result = await db.insert(users).values(user);
    // For MySQL, we need to query back the inserted record
    return await this.getUser(result[0].insertId);
  }

  async updateUser(id: number, updates: Partial<InsertUser>): Promise<User> {
    await db.update(users).set(updates).where(eq(users.id, id));
    return await this.getUser(id);
  }

  async deleteUser(id: number): Promise<void> {
    await db.delete(users).where(eq(users.id, id));
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users);
  }
  
  // Announcements
  async getAnnouncements(): Promise<Announcement[]> {
    return await db.select().from(announcements).orderBy(desc(announcements.id));
  }

  async createAnnouncement(announcement: InsertAnnouncement): Promise<Announcement> {
    const result = await db.insert(announcements).values(announcement);
    return await this.getAnnouncement(result[0].insertId);
  }
  
  // Events
  async getEvents(): Promise<Event[]> {
    return await db.select().from(events).orderBy(desc(events.id));
  }

  async createEvent(event: InsertEvent): Promise<Event> {
    const result = await db.insert(events).values(event);
    return await this.getEventById(result[0].insertId);
  }
  
  // News
  async getNews(): Promise<News[]> {
    return await db.select().from(news).orderBy(desc(news.id));
  }

  async createNews(news: InsertNews): Promise<News> {
    const result = await db.insert(news).values(news);
    return await this.getNewsById(result[0].insertId);
  }
  
  // Sections
  async getSections(): Promise<Section[]> {
    return await db.select().from(sections);
  }

  async createSection(section: InsertSection): Promise<Section> {
    const result = await db.insert(sections).values(section);
    return await this.getSectionById(result[0].insertId);
  }
  
  // Subjects
  async getSubjects(): Promise<Subject[]> {
    return await db.select().from(subjects);
  }

  async getSubjectsBySection(sectionId: number): Promise<Subject[]> {
    return await db.select().from(subjects).where(eq(subjects.sectionId, sectionId));
  }
  
  // Grades
  async getGrades(): Promise<Grade[]> {
    return await db.select().from(grades);
  }

  async getGradesByStudent(studentId: number): Promise<Grade[]> {
    return await db.select().from(grades).where(eq(grades.studentId, studentId));
  }
  
  // Tasks
  async getTasks(): Promise<Task[]> {
    return await db.select().from(tasks);
  }

  async getTasksByTeacher(teacherId: number): Promise<Task[]> {
    return await db.select().from(tasks).where(eq(tasks.teacherId, teacherId));
  }
  
  // Meetings
  async getMeetings(): Promise<Meeting[]> {
    return await db.select().from(meetings);
  }

  async getMeetingsByHost(hostId: number): Promise<Meeting[]> {
    return await db.select().from(meetings).where(eq(meetings.hostId, hostId));
  }


  // Role management methods
  async getRoles(): Promise<Role[]> {
    try {
      return await db.select().from(roles);
    } catch (error) {
      console.error('Error fetching roles:', error);
      return [];
    }
  }

  async createRole(insertRole: InsertRole): Promise<Role> {
    const [role] = await db.insert(roles).values(insertRole);
    return await this.getRole(role.insertId);
  }

  async updateRole(id: number, updates: Partial<InsertRole>): Promise<Role> {
    await db.update(roles).set(updates).where(eq(roles.id, id));
    return await this.getRole(id);
  }

  async deleteRole(id: number): Promise<void> {
    await db.delete(roles).where(eq(roles.id, id));
  }

  async createSubject(insertSubject: any): Promise<any> {
    const [subject] = await db.insert(subjects).values(insertSubject);
    return await this.getSubject(subject.insertId);
  }

  // Teacher assignments methods
  async getTeacherAssignments(): Promise<any[]> {
    try {
      return await db.select().from(teacherAssignments);
    } catch (error) {
      console.error('Error fetching teacher assignments:', error);
      return [];
    }
  }

  async createTeacherAssignment(insertAssignment: any): Promise<any> {
    const [assignment] = await db.insert(teacherAssignments).values(insertAssignment);
    return await this.getTeacherAssignment(assignment.insertId);
  }

  // Organization chart methods
  async getOrgChart(): Promise<any[]> {
    try {
      return await db.select().from(orgChart);
    } catch (error) {
      console.error('Error fetching org chart:', error);
      return [];
    }
  }

  async createOrgChartEntry(insertOrgChart: any): Promise<any> {
    const [entry] = await db.insert(orgChart).values(insertOrgChart);
    return await this.getOrgChartEntry(entry.insertId);
  }

  // School settings methods
  async getSchoolSettings(): Promise<any> {
    try {
      const [settings] = await db.select().from(schoolSettings).limit(1);
      return settings || {};
    } catch (error) {
      console.error('Error fetching school settings:', error);
      return {};
    }
  }

  async updateSchoolSettings(updates: any): Promise<any> {
    try {
      if (updates.id) {
        await db.update(schoolSettings).set(updates).where(eq(schoolSettings.id, updates.id));
        return await this.getSchoolSettingsById(updates.id);
      } else {
        const [settings] = await db.insert(schoolSettings).values(updates);
        return await this.getSchoolSettingsById(settings.insertId);
      }
    } catch (error) {
      console.error('Error updating school settings:', error);
      return updates;
    }
  }

  // System settings (for compatibility with admin dashboard)
  async getSystemSettings(): Promise<SystemSettings | null> {
    try {
      const [settings] = await db.select().from(systemSettings).limit(1);
      return settings || null;
    } catch (error) {
      console.error('Error fetching system settings:', error);
      return null;
    }
  }

  async updateSystemSettings(updates: Partial<InsertSystemSettings>): Promise<SystemSettings> {
    try {
      const existing = await this.getSystemSettings();
      if (existing) {
        await db.update(systemSettings).set(updates).where(eq(systemSettings.id, existing.id));
        return await this.getSystemSettings();
      } else {
        const [settings] = await db.insert(systemSettings).values(updates);
        return await this.getSystemSettingsById(settings.insertId);
      }
    } catch (error) {
      console.error('Error updating system settings:', error);
      throw error;
    }
  }

  // Principal API methods
  async getPrincipalStats(): Promise<any> {
    // Mock implementation for MySQL compatibility
    return {
      totalStudents: 0,
      totalTeachers: 0,
      totalSections: 0,
      totalSubjects: 0
    };
  }

  async getPrincipalFinancialData(): Promise<any> {
    return {
      totalRevenue: 0,
      pendingPayments: 0,
      expenses: 0
    };
  }

  // Academic Coordinator API methods
  async getAcademicStats(): Promise<any> {
    return {
      totalCourses: 0,
      activeTeachers: 0,
      completionRate: 0
    };
  }

  async getAcademicCurriculumData(): Promise<any> {
    return [];
  }

  async getAcademicTeacherPerformance(): Promise<any> {
    return [];
  }

  // Chat System Methods
  async getUserConversations(userId: number): Promise<any[]> {
    return [];
  }

  async getConversationMessages(userId: number, partnerId: number, limit?: number): Promise<any[]> {
    return [];
  }

  async createMessage(data: any): Promise<any> {
    const result = await db.insert(messages).values(data);
    return await this.getMessageById(result[0].insertId);
  }

  async markMessageAsRead(messageId: number): Promise<void> {
    await db.update(messages).set({ isRead: true }).where(eq(messages.id, messageId));
  }

  async updateUserOnlineStatus(userId: number, isOnline: boolean): Promise<void> {
    await db.insert(onlineStatus).values({ userId, isOnline }).onDuplicateKeyUpdate({
      set: { isOnline, lastSeen: new Date() }
    });
  }

  async getOnlineUsers(): Promise<any[]> {
    return await db.select().from(onlineStatus).where(eq(onlineStatus.isOnline, true));
  }

  // Admin System Methods
  async getSystemStats(): Promise<any> {
    return {
      totalUsers: 0,
      activeUsers: 0,
      systemHealth: 'good'
    };
  }

  async getDashboardStats(): Promise<any> {
    return this.getSystemStats();
  }

  async getRoles(): Promise<any[]> {
    return await db.select().from(roles);
  }

  async getOrgChart(): Promise<any[]> {
    return [];
  }

  async createOrgChartEntry(data: any): Promise<any> {
    return { id: 1, ...data };
  }

  async updateOrgChartEntry(id: number, updates: any): Promise<void> {
    // Implementation placeholder
  }

  async deleteOrgChartEntry(id: number): Promise<void> {
    // Implementation placeholder
  }

  async getAdminGrades(): Promise<any[]> {
    return await this.getGrades();
  }

  async getAdminAssignments(): Promise<any[]> {
    return [];
  }

  async getChatMessages(): Promise<any[]> {
    return await db.select().from(messages);
  }

  async getTuitionFees(): Promise<any[]> {
    return await db.select().from(fees);
  }

  async updateAnnouncement(id: number, updates: any): Promise<void> {
    await db.update(announcements).set(updates).where(eq(announcements.id, id));
  }

  async deleteAnnouncement(id: number): Promise<void> {
    await db.delete(announcements).where(eq(announcements.id, id));
  }

  async getSystemSettings(): Promise<any> {
    return {};
  }

  async updateSystemSettings(settings: any): Promise<void> {
    // Implementation placeholder
  }

  async getSchoolSettings(): Promise<any> {
    return {};
  }

  // Teacher Methods
  async getTeacherDashboardData(teacherId: number): Promise<any> {
    return {
      totalStudents: 0,
      totalSubjects: 0,
      upcomingMeetings: [],
      recentGrades: []
    };
  }

  async getTeacherAssignments(): Promise<any[]> {
    return [];
  }

  async getTeacherAssignmentsByCoordinator(): Promise<any[]> {
    return [];
  }

  async getTeachersWithAssignments(): Promise<any[]> {
    return [];
  }

  async deleteTeacherAssignment(id: number): Promise<void> {
    // Implementation placeholder
  }

  async getTeacherFolders(teacherId: number): Promise<any[]> {
    return [];
  }

  async createTeacherFolder(data: any): Promise<any> {
    return { id: 1, ...data };
  }

  async getFolderDocuments(folderId: number): Promise<any[]> {
    return [];
  }

  async addFolderDocument(data: any): Promise<any> {
    return { id: 1, ...data };
  }

  async shareFolderWithSections(folderId: number, sectionIds: number[]): Promise<void> {
    // Implementation placeholder
  }

  async getSharedFoldersForStudent(studentId: number): Promise<any[]> {
    return [];
  }

  // Helper methods for MySQL AUTO_INCREMENT compatibility
  private async getAnnouncement(id: number): Promise<Announcement> {
    const result = await db.select().from(announcements).where(eq(announcements.id, id)).limit(1);
    return result[0];
  }

  private async getEventById(id: number): Promise<Event> {
    const result = await db.select().from(events).where(eq(events.id, id)).limit(1);
    return result[0];
  }

  private async getNewsById(id: number): Promise<News> {
    const result = await db.select().from(news).where(eq(news.id, id)).limit(1);
    return result[0];
  }

  private async getSectionById(id: number): Promise<Section> {
    const result = await db.select().from(sections).where(eq(sections.id, id)).limit(1);
    return result[0];
  }

  private async getMessageById(id: number): Promise<Message> {
    const result = await db.select().from(messages).where(eq(messages.id, id)).limit(1);
    return result[0];
  }

}