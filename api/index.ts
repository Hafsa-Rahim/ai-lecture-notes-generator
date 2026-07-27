import express from "express";
import Airtable from "airtable";
import { GoogleGenAI } from "@google/genai";

const app = express();

app.use(express.json());

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

// ===========================
// Health API
// ===========================
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    message: "Server is running successfully!",
  });
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
    console.error("Register Error:", error);

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
    const {
      userId,
      subject,
      topic,
      level,
      language,
      notesType,
    } = req.body;

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
      model: "gemini-3.6-flash",
      contents: prompt,
    });

    const notesText = result.text || "";

    await base(process.env.AIRTABLE_NOTES_TABLE!).create([
      {
        fields: {
          User_ID: userId || "Unknown",
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

    return res.json({
      success: true,
      notes: notesText,
    });
  } catch (error: any) {
    console.error("Generate Notes Error:", error);

    return res.status(500).json({
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

    return res.json({
      success: true,
      notes,
    });
  } catch (error: any) {
    console.error("Get Notes Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});
// ===========================
// Toggle Favorite API
// ===========================
app.patch("/api/notes/:recordId/favorite", async (req, res) => {
  try {
    const { recordId } = req.params;
    const { favorite } = req.body;

    await base(process.env.AIRTABLE_NOTES_TABLE!).update([
      {
        id: recordId,
        fields: {
          Favorite: Boolean(favorite),
        },
      },
    ]);

    return res.json({
      success: true,
      message: "Favorite updated successfully.",
      favorite: Boolean(favorite),
    });
  } catch (error: any) {
    console.error("Favorite Update Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export default app;