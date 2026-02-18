import { useState } from "react";
import type { FaqSectionData } from "../types/project.types";

interface Props {
  data: FaqSectionData;
  onChange: (data: FaqSectionData) => void;
}

export default function FaqSection({ data, onChange }: Props) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const addFaq = () => {
    const newIndex = data.items.length;
    onChange({
      items: [...data.items, { question: "", answer: "" }]
    });
    // Auto-expand the newly added FAQ
    setExpandedIndex(newIndex);
  };

  const updateFaq = (
    index: number,
    field: "question" | "answer",
    value: string
  ) => {
    const updated = [...data.items];
    updated[index] = { ...updated[index], [field]: value };
    onChange({ items: updated });
  };

  const removeFaq = (index: number) => {
    if (window.confirm("Are you sure you want to remove this FAQ?")) {
      onChange({
        items: data.items.filter((_, i) => i !== index)
      });
      if (expandedIndex === index) {
        setExpandedIndex(null);
      }
    }
  };

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200/80 shadow-lg shadow-gray-100/50 p-8 mb-6 backdrop-blur-sm">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="w-1 h-8 bg-gradient-to-b from-blue-600 to-blue-400 rounded-full"></div>
          <h3 className="text-xl font-bold text-gray-900">Frequently Asked Questions</h3>
        </div>
        <button
          onClick={addFaq}
          className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add FAQ
        </button>
      </div>

      <div className="space-y-4">
        {data.items.map((faq, index) => {
          const isExpanded = expandedIndex === index;

          return (
            <div
              key={index}
              className="border border-gray-200 rounded-lg bg-gradient-to-br from-white to-gray-50/50 hover:shadow-md transition-all duration-200 overflow-hidden"
            >
              {/* FAQ Header - Clickable to expand/collapse */}
              <div
                className="p-4 cursor-pointer flex items-center justify-between group"
                onClick={() => toggleExpand(index)}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    {faq.question ? (
                      <h4 className="font-semibold text-gray-900 truncate">{faq.question}</h4>
                    ) : (
                      <h4 className="font-medium text-gray-400 italic">New FAQ Question</h4>
                    )}
                    {faq.answer && !isExpanded && (
                      <p className="text-sm text-gray-500 mt-1 line-clamp-1">{faq.answer}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {/* Remove Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFaq(index);
                    }}
                    className="w-8 h-8 flex items-center justify-center bg-red-50 hover:bg-red-100 text-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Remove FAQ"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  {/* Expand/Collapse Icon */}
                  <svg
                    className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* FAQ Content - Expandable */}
              {isExpanded && (
                <div className="px-4 pb-4 pt-0 space-y-4 border-t border-gray-100">
                  {/* Question Input */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Question
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. What are the payment plans available?"
                      value={faq.question}
                      onChange={(e) => updateFaq(index, "question", e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm bg-white shadow-sm hover:shadow-md"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>

                  {/* Answer Input */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Answer
                    </label>
                    <textarea
                      placeholder="Provide a detailed answer to the question..."
                      value={faq.answer}
                      onChange={(e) => updateFaq(index, "answer", e.target.value)}
                      rows={4}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm bg-white shadow-sm hover:shadow-md resize-y"
                      onClick={(e) => e.stopPropagation()}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {faq.answer.length} characters
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {data.items.length === 0 && (
          <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-xl border-2 border-dashed border-gray-300">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-gray-500 font-medium text-lg mb-2">No FAQs added yet</p>
            <p className="text-gray-400 text-sm">Click the button above to add frequently asked questions</p>
          </div>
        )}
      </div>

      {/* Info Text */}
      {data.items.length > 0 && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800 flex items-start gap-2">
            <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <span>Click on any FAQ to expand and edit. FAQs will be displayed in the order shown here.</span>
          </p>
        </div>
      )}
    </div>
  );
}
