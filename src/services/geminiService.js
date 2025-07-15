import { GoogleGenerativeAI } from "@google/generative-ai";

// 1. Ambil Kunci API dari environment variables
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("VITE_GEMINI_API_KEY is not set in .env.local");
}

// 2. Inisialisasi Klien Gemini dengan model FLASH
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

/**
 * Menghasilkan snippet kode dari Gemini API berdasarkan bahasa yang diberikan.
 * @param {string} language - Bahasa pemrograman (e.g., 'javascript', 'python').
 * @returns {Promise<string>} - Snippet kode yang dihasilkan.
 */
async function generateCodeSnippet(language) {
  // 3. Buat prompt yang jelas untuk AI
  const prompt = `Generate a simple ${language} code snippet for a typing practice test. 
  It should be between 5 to 10 lines of code. 
  Focus on common syntax like variable declarations, loops, or simple functions. 
  Do not include any explanation, comments, or markdown formatting like \`\`\`. 
  Just provide the raw code itself.`;

  try {
    // 4. Panggil API dan dapatkan hasilnya
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    return text;
  } catch (error) {
    // 5. Tangani jika terjadi error
    console.error("Error generating content from Gemini:", error);
    throw new Error("Failed to fetch code snippet from AI. Please check your API key or network.");
  }
}

export { generateCodeSnippet };
