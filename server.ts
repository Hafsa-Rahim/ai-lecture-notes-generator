import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import Airtable from "airtable";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

// ===========================
// Gemini AI Configuration
// ===========================
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

// ===========================
// Airtable Configuration
// ===========================
const base = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY!,
}).base(process.env.AIRTABLE_BASE_ID!);

async function startServer() {
  const app = express();
  const PORT = 3001;

  app.use(express.json());

  // ===========================
  // Health API
  // ===========================
  app.get("/api/health", (req, res) => {
    res.json({
      status: "ok",
      message: "Server is running successfully!",
    });
  });

  // ===========================
  // Airtable Test API
  // ===========================
  app.get("/api/test-airtable", async (req, res) => {
    try {
      const records = await base(process.env.AIRTABLE_USERS_TABLE!)
        .select({ maxRecords: 5 })
        .firstPage();

      res.json({
        success: true,
        totalRecords: records.length,
        records,
      });
    } catch (error: any) {
      console.error(error);

      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  });

  // ===========================
  // Register User API
  // ===========================
  app.post("/api/register", async (req, res) => {
    try {
      const {
        userId,
        fullName,
        email,
        password,
        role,
        university,
        department,
      } = req.body;

      const record = await base(process.env.AIRTABLE_USERS_TABLE!).create([
        {
          fields: {
            User_ID: userId,
            Full_Name: fullName,
            Email: email,
            Password: password,
            Role: role,
            University: university,
            Department: department,
          },
        },
      ]);

      res.json({
        success: true,
        message: "User registered successfully.",
        record,
      });
    } catch (error: any) {
      console.error(error);

      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  });

  // ===========================
  // Login User API
  // ===========================
  app.post("/api/login", async (req, res) => {
    try {
      const { email, password } = req.body;

      const records = await base(process.env.AIRTABLE_USERS_TABLE!)
        .select({
          filterByFormula: `AND({Email}='${email}', {Password}='${password}')`,
          maxRecords: 1,
        })
        .firstPage();

      if (records.length === 0) {
        return res.status(401).json({
          success: false,
          message: "Invalid Email or Password",
        });
      }

      const user = records[0].fields;

      return res.json({
        success: true,
        message: "Login Successful!",
        user: {
  User_ID: user.User_ID,
  Full_Name: user.Full_Name,
  Email: user.Email,
  Role: user.Role,
  University: user.University,
  Department: user.Department,
},
      });
    } catch (error: any) {
      console.error("Login Error:", error);

      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  });

  // ===========================
  // Generate Notes API
  // ===========================
  app.post("/api/generate-notes", async (req, res) => {
    try {
      const { subject, topic, level, language, notesType } = req.body;

      const prompt = `
Generate professional lecture notes.

Subject: ${subject}
Topic: ${topic}
Academic Level: ${level}
Language: ${language}
Notes Type: ${notesType}

Requirements:
- Proper headings
- Detailed explanation
- Bullet points
- Examples
- Easy for exams
`;

      const result = await ai.models.generateContent({
  model: "gemini-3.5-flash",
  contents: prompt,
});
const notesText = result.text || "";

await base(process.env.AIRTABLE_NOTES_TABLE!).create([
  {
    fields: {
      User_ID: req.body.userId || "Unknown",
      Lecture_Topic: topic,
      Subject: subject,
      Academic_Level: level,
      Notes_Type: notesType,
      Language: language,
      AI_Prompt: prompt,
      AI_Response: notesText,
      Favorite: false,
    },
  },
]);
      res.json({
        success: true,
        notes: notesText,
      });
    } catch (error: any) {
      console.error(error);

      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  });
  // ===========================
// Get User Notes API
// ===========================
app.get("/api/notes/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const records = await base(process.env.AIRTABLE_NOTES_TABLE!)
      .select({
        filterByFormula: `{User_ID}='${userId}'`,
        sort: [{ field: "Created_At", direction: "desc" }],
      })
      .all();

    const notes = records.map((record) => ({
      id: record.id,
      Note_ID: record.fields.Note_ID,
      User_ID: record.fields.User_ID,
      Lecture_Topic: record.fields.Lecture_Topic,
      Subject: record.fields.Subject,
      Academic_Level: record.fields.Academic_Level,
      Notes_Type: record.fields.Notes_Type,
      Language: record.fields.Language,
      AI_Response: record.fields.AI_Response,
      Favorite: record.fields.Favorite || false,
      Created_At: record.fields.Created_At,
    }));

    res.json({
      success: true,
      notes,
    });
  } catch (error: any) {
    console.error("Get Notes Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

  // ===========================
  // Vite Middleware
  // ===========================
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
      },
      appType: "spa",
    });

    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");

    app.use(express.static(distPath));

    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  // ===========================
  // Start Server
  // ===========================
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log("✅ Airtable Connected Successfully");
  });
}

startServer();