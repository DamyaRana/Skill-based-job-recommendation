import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { createClient } from "@supabase/supabase-js";

// ENV
const supabaseUrl = process.env.supabaseUrl;
const supabaseKey = process.env.supabaseKey;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Missing ENV variables");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const app = express();
app.use(express.json());
app.use(cors());

// Health check
app.get("/", (req, res) => {
  res.send("Backend chatbot server running 🚀");
});

// Chat endpoint
app.post("/chat", async (req, res) => {
  try {
    const { userId, message } = req.body;

    if (!userId || !message) {
      return res.status(400).json({ error: "userId and message are required" });
    }

    // Store user message in DB
    await supabase.from("history").insert({
      user_id: userId,
      role: "user",
      message: message
    });

    // TODO: Call AI model or hardcoded response for now
    const botReply = "This is AI reply placeholder.";

    // Store bot reply in DB
    await supabase.from("history").insert({
      user_id: userId,
      role: "assistant",
      message: botReply
    });

    res.json({ reply: botReply });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Job Recommendation Endpoint
app.post("/jobs", async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "userId required" });
    }

    const { data: user } = await supabase
      .from("users")
      .select("skills")
      .eq("id", userId)
      .single();

    const { data: jobs } = await supabase
      .from("jobs")
      .select("*");

    const recommendations = jobs.filter(job =>
      job.required_skills.some(skill => user.skills.includes(skill))
    );

    res.json({ recommendations });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal error" });
  }
});

// History Endpoint
app.get("/history", async (req, res) => {
  const userId = req.query.userId;
  if (!userId) return res.status(400).json({ error: "userId required" });

  const { data } = await supabase
    .from("history")
    .select("*")
    .eq("user_id", userId);

  res.json({ history: data });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
