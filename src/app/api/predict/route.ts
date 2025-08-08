import { NextResponse } from "next/server";
import { getDiagnosisPrompt, getDietPlanPrompt } from "@/app/utils/prompt"; // we'll add this utils file

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    // Decide which prompt to use based on user input
    let prompt: string;
    if (/diet|meal plan|nutrition/i.test(message)) {
      prompt = getDietPlanPrompt(message);
    } else {
      prompt = getDiagnosisPrompt(message);
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: [
          { role: "system", content: "You are a helpful medical assistant that analyzes symptoms and gives possible causes, advice, or diet plans depending on user request." },
          { role: "user", content: prompt }
        ],
        temperature: 0.7
      })
    });

    const data = await response.json();
    const botReply = data.choices?.[0]?.message?.content || "I couldn't process your symptoms.";

    return NextResponse.json({ reply: botReply });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
