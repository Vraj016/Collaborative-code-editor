import mongoose from "mongoose";

const CodeSnippetSchema = new mongoose.Schema({
  title: { type: String, required: true },
  language: { type: String, required: true },
  code: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const CodeSnippet = mongoose.model("CodeSnippet", CodeSnippetSchema);
export default CodeSnippet;
