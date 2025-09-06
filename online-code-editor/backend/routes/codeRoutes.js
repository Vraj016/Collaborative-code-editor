import express from "express";
import CodeSnippet from "../models/CodeSnippet.js";

const router = express.Router();

// Save a new code snippet
router.post("/save", async (req, res) => {
    try {
        const { title, language, code } = req.body;
        const snippet = new CodeSnippet({ title, language, code });
        await snippet.save();
        res.json({ message: "Snippet saved!", snippet });
    } catch (error) {
        res.status(500).json({ error: "Error saving snippet" });
    }
});

// Get all snippets
router.get("/snippets", async (req, res) => {
    try {
        const snippets = await CodeSnippet.find();
        res.json(snippets);
    } catch (error) {
        res.status(500).json({ error: "Error fetching snippets" });
    }
});

export default router;
