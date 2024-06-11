"use client";
import React, { useRef } from 'react';
import { ArrowUp } from 'lucide-react';

const AutoResizeTextarea: React.FC = () => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleInput = () => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            if (textarea.scrollHeight <= 160) {
                textarea.style.height = `${textarea.scrollHeight}px`;
            } else {
                textarea.style.height = '160px'; // 5 lines height (adjust if needed)
            }
        }
    };

    return (
        <textarea
            ref={textareaRef}
            placeholder="Message NutriBot"
            className="flex-grow px-4 py-2 bg-gray-100 text-gray-700 rounded-full border-none focus:outline-none resize-none overflow-y-auto max-h-32"
            rows={1}
            onInput={handleInput}
        ></textarea>
    );
};

const ChatInput: React.FC = () => {
    return (
        <div className="w-full flex justify-center items-center pb-5">
            <div className="type-area flex justify-between items-end w-3/5 bg-gray-100 rounded-3xl shadow p-2 mx-4">
                <AutoResizeTextarea />
                <button type="button" className="hover:bg-gray-500 flex items-center justify-center w-10 h-10 mr-1 bg-black text-white rounded-full">
                    <ArrowUp className="w-6 h-6" />
                </button>
            </div>
        </div>
    );
};

export default ChatInput;
