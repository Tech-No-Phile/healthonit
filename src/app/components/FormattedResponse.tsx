"use client";
import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface FormattedResponseProps {
  text: string;
}

export default function FormattedResponse({ text }: FormattedResponseProps) {
  return (
    <div className="prose max-w-none markdown-body">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          table: ({ children }) => (
            <table className="border-collapse border border-gray-400 w-full my-4">
              {children}
            </table>
          ),
          th: ({ children }) => (
            <th className="border border-gray-400 bg-gray-100 px-3 py-2 text-left font-semibold">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border border-gray-300 px-3 py-2 align-top">
              {children}
            </td>
          ),
          h1: ({ children }) => (
            <h1 className="text-2xl font-bold mt-6 mb-3">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-xl font-semibold mt-5 mb-2">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-lg font-semibold mt-4 mb-2">{children}</h3>
          ),
          p: ({ children }) => (
            <p className="mb-4 leading-relaxed">{children}</p>
          ),
          li: ({ children }) => (
            <li className="mb-1 list-disc list-inside">{children}</li>
          ),
        }}
      >
        {text}
      </ReactMarkdown>
    </div>
  );
}
