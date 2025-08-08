"use client";

import React, { useState, useRef, useEffect } from "react";
import { Mic, Send, Upload, StopCircle } from "lucide-react";
import FormattedResponse from "@/app/components/FormattedResponse";
import { downloadPDF } from "@/app/utils/download";

interface Message {
  type: "user" | "bot";
  text: string;
  file?: File | null;
}

const MealPlanTables = ({ text }: { text: string }) => {
  const dayBlocks = text.split(/(?=Day\s*\d+)/i).filter(Boolean);

  return (
    <div className="space-y-6">
      {dayBlocks.map((block, i) => {
        const lines = block.trim().split("\n").map(l => l.trim()).filter(Boolean);
        const dayTitle = lines[0];

        // Find table start
        const tableLines = lines.slice(1).filter(l => l.includes("|"));

        if (tableLines.length === 0) {
          return (
            <div key={i} className="border rounded-lg shadow p-3 bg-white">
              <h3 className="text-lg font-semibold mb-2">{dayTitle}</h3>
              <p className="text-sm text-gray-500">No meal plan available for this day.</p>
            </div>
          );
        }

        // First row is headers
        const headers = tableLines[0]
          .split("|")
          .map(h => h.trim())
          .filter(h => h.length > 0);

        // Remaining rows (skip markdown separator if exists)
        const rows = tableLines
          .slice(1)
          .filter(l => !/^[-\s|]+$/.test(l)) // skip |---|---|
          .map(line =>
            line
              .split("|")
              .map(cell => cell.trim())
              .filter(c => c.length > 0)
          )
          .filter(row => row.length > 0);

        return (
          <div key={i} className="border rounded-lg shadow p-3 bg-white overflow-x-auto">
            <h3 className="text-lg font-semibold mb-2">{dayTitle}</h3>
            <table className="table-auto w-full border-collapse border border-gray-300 text-sm">
              <thead>
                <tr>
                  {headers.map((header, idx) => (
                    <th
                      key={idx}
                      className="border border-gray-300 px-2 py-1 bg-gray-100 text-left"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, idx) => (
                  <tr key={idx}>
                    {headers.map((_, cIdx) => (
                      <td
                        key={cIdx}
                        className="border border-gray-300 px-2 py-1 align-top"
                      >
                        {row[cIdx] || ""}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
};



export default function SymptomChecker() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { type: "bot", text: "Symptom Checker Started... Describe your symptoms, attach files, or use voice input." }
  ]);
  const [isListening, setIsListening] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleVoiceInput = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Your browser does not support speech recognition.");
      return;
    }

    if (!isListening) {
      const recognition = new (window as any).webkitSpeechRecognition() as SpeechRecognition;
      recognition.lang = "en-US";
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript;
        setInput(prev => prev + (prev ? " " : "") + transcript);
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
      };

      recognition.addEventListener("end", () => {
        setIsListening(false);
      });

      recognition.start();
      recognitionRef.current = recognition;
      setIsListening(true);
    } else {
      recognitionRef.current?.stop();
      setIsListening(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSend = async (customMessage?: string) => {
    const finalMessage = customMessage || input;
    if (!finalMessage && !file) return;

    // Add user message instantly
    setMessages(prev => [...prev, { type: "user", text: finalMessage, file }]);
    setInput("");
    setFile(null);

    try {
      const res = await fetch("/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: finalMessage })
      });

      const data = await res.json();

      setMessages(prev => [...prev, { type: "bot", text: data.reply }]);

      // Auto-offer diet plan if it's a diagnosis
      if (!/diet|meal plan|nutrition/i.test(finalMessage)) {
        setTimeout(() => {
          setMessages(prev => [
            ...prev,
            { type: "bot", text: "Would you like me to create a personalized diet plan based on your symptoms? (Yes/No)" }
          ]);
        }, 500);
      }

    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { type: "bot", text: "Error connecting to the AI service." }]);
    }
  };

  // Handle quick yes/no response
  const handleQuickReply = (reply: string) => {
    if (reply.toLowerCase() === "yes") {
      handleSend("diet plan");
    } else {
      setMessages(prev => [...prev, { type: "bot", text: "Alright, let me know if you need one later." }]);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="p-3 bg-gray-50 border-b shadow-sm">
        <h1 className="text-lg font-semibold text-gray-800">🩺 Symptom Checker</h1>
      </div>

      {/* Messages */}
      <div className="flex-1 p-3 overflow-y-auto">
        <div className="max-w-lg mx-auto space-y-2">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`p-2 rounded-lg shadow text-gray-700 text-sm ${msg.type === "user" ? "bg-blue-100 ml-auto" : "bg-white"
                } max-w-[75%]`}
            >
              {msg.type === "bot" ? (
                msg.text.match(/Day\s*\d+/i) && msg.text.includes("|")
                  ? <MealPlanTables text={msg.text} />
                  : <FormattedResponse text={msg.text} />
              ) : (
                msg.text
              )}

              {/* If bot reply looks like a diet plan, show download options */}
              {msg.type === "bot" && msg.text.includes("| Breakfast |") && (
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => downloadPDF(msg.text)}
                    className="px-3 py-1 bg-green-500 text-white rounded-full text-xs hover:bg-green-600"
                  >
                    Download PDF
                  </button>
                </div>
              )}


              {msg.text.includes("Would you like me to create a personalized diet plan") && (
                <div className="mt-2 flex gap-2">
                  <button
                    onClick={() => handleQuickReply("Yes")}
                    className="px-3 py-1 bg-green-500 text-white rounded-full text-xs hover:bg-green-600"
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => handleQuickReply("No")}
                    className="px-3 py-1 bg-gray-300 rounded-full text-xs hover:bg-gray-400"
                  >
                    No
                  </button>
                </div>
              )}

              {msg.file && (
                <div className="mt-1 text-xs text-gray-500">📎 {msg.file.name}</div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Bar */}
      <div className="p-3 bg-gray-50 border-t">
        <div className="flex items-center gap-2 max-w-2xl mx-auto px-4 py-2 rounded-full shadow-md bg-white border border-gray-200">
          <input type="file" id="file-upload" onChange={handleFileUpload} className="hidden" />
          <label htmlFor="file-upload" className="p-2 rounded-full hover:bg-gray-100 cursor-pointer transition">
            <Upload className="w-5 h-5 text-gray-600" />
          </label>

          <input
            type="text"
            placeholder="Describe your symptoms..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="flex-1 bg-transparent outline-none px-1 text-gray-700 placeholder-gray-400"
          />

          <button
            onClick={handleVoiceInput}
            className={`p-2 rounded-full transition ${isListening ? "bg-red-100 text-red-500 animate-pulse" : "hover:bg-gray-100"
              }`}
          >
            {isListening ? <StopCircle className="w-5 h-5" /> : <Mic className="w-5 h-5 text-gray-600" />}
          </button>

          <button
            onClick={() => handleSend()}
            className="ml-1 p-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white transition"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>

        {file && (
          <div className="mt-1 text-xs text-gray-600 flex items-center gap-1 max-w-2xl mx-auto">
            📎 {file.name}
          </div>
        )}
      </div>
    </div>
  );
}
