const API_BASE = "http://localhost:5000/api/code";

export const saveSnippet = async (snippet) => {
    const response = await fetch(`${API_BASE}/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(snippet),
    });
    return response.json();
};

export const fetchSnippets = async () => {
    const response = await fetch(`${API_BASE}/snippets`);
    return response.json();
};
