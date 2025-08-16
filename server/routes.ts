import type { Express } from "express";
import { createServer, type Server } from "http";
import { Server as SocketIOServer } from "socket.io";
import { getStorage } from "./database-switcher";
import { db } from "./db";
import bcrypt from "bcryptjs";
import { 
  insertUserSchema, insertAnnouncementSchema, insertNewsSchema, insertEventSchema,
  insertRoleSchema, insertSectionSchema, insertSubjectSchema, insertTeacherAssignmentSchema,
  insertOrgChartSchema, insertSchoolSettingsSchema, insertTuitionFeeSchema,
  insertEnrollmentSchema, insertGradeSchema, insertChatMessageSchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
      }

      const storage = await getStorage();
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const isValidPassword = await bcrypt.compare(password, user.passwordHash);
      if (!isValidPassword) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Return user without password hash
      const { passwordHash, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const storage = await getStorage();
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(409).json({ error: "User already exists" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(userData.passwordHash, 12);
      
      const newUser = await storage.createUser({
        ...userData,
        passwordHash: hashedPassword
      });

      // Return user without password hash
      const { passwordHash, ...userWithoutPassword } = newUser;
      res.status(201).json({ user: userWithoutPassword });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Data routes
  app.get("/api/announcements", async (req, res) => {
    try {
      const storage = await getStorage();
      const announcements = await storage.getAnnouncements();
      res.json(announcements);
    } catch (error) {
      console.error("Error fetching announcements:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/news", async (req, res) => {
    try {
      const storage = await getStorage();
      const news = await storage.getNews();
      res.json(news);
    } catch (error) {
      console.error("Error fetching news:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/events", async (req, res) => {
    try {
      const storage = await getStorage();
      const events = await storage.getEvents();
      res.json(events);
    } catch (error) {
      console.error("Error fetching events:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // ======================
  // ADMIN ROUTES
  // ======================

  // Users management
  app.get("/api/admin/users", async (req, res) => {
    try {
      const storage = await getStorage();
      const users = await storage.getAllUsers();
      const formattedUsers = users.map(user => ({
        id: user.id,
        name: user.name || `User ${user.id}`,
        email: user.email,
        role: user.roleId,
        isActive: user.isActive,
        createdAt: user.createdAt
      }));
      res.json(formattedUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/admin/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const hashedPassword = await bcrypt.hash(userData.passwordHash, 12);
      const storage = await getStorage();
      const newUser = await storage.createUser({
        ...userData,
        passwordHash: hashedPassword
      });
      const { passwordHash, ...userWithoutPassword } = newUser;
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.patch("/api/admin/users/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      if (updates.passwordHash) {
        updates.passwordHash = await bcrypt.hash(updates.passwordHash, 12);
      }
      const storage = await getStorage();
      const updatedUser = await storage.updateUser(id, updates);
      const { passwordHash, ...userWithoutPassword } = updatedUser;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.delete("/api/admin/users/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const storage = await getStorage();
      await storage.deleteUser(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Roles management
  app.get("/api/admin/roles", async (req, res) => {
    try {
      const storage = await getStorage();
      const roles = await storage.getRoles();
      res.json(roles);
    } catch (error) {
      console.error("Error fetching roles:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/admin/roles", async (req, res) => {
    try {
      const roleData = insertRoleSchema.parse(req.body);
      const storage = await getStorage();
      const newRole = await storage.createRole(roleData);
      res.status(201).json(newRole);
    } catch (error) {
      console.error("Error creating role:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.patch("/api/admin/roles/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const storage = await getStorage();
      const updatedRole = await storage.updateRole(id, updates);
      res.json(updatedRole);
    } catch (error) {
      console.error("Error updating role:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.delete("/api/admin/roles/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const storage = await getStorage();
      await storage.deleteRole(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting role:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // System stats for admin dashboard
  app.get("/api/admin/system-stats", async (req, res) => {
    try {
      const storage = await getStorage();
      const stats = await storage.getSystemStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching system stats:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Create HTTP server
  const httpServer = createServer(app);

  // Setup Socket.IO for real-time chat
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("join_room", (userId) => {
      socket.join(`user_${userId}`);
      console.log(`User ${userId} joined room`);
    });

    socket.on("send_message", async (data) => {
      try {
        const storage = await getStorage();
        const message = await storage.createMessage(data);
        io.to(`user_${data.receiverId}`).emit("receive_message", message);
      } catch (error) {
        console.error("Error sending message:", error);
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

  return httpServer;
}