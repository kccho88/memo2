"use client";

import { useState, useEffect } from "react";

export interface Memo {
    id: string;
    text: string;
    createdAt: number;
    color: string;
    category: string;
}

const COLORS = [
    "bg-yellow-200 dark:bg-yellow-400/90",
    "bg-blue-200 dark:bg-blue-400/90",
    "bg-emerald-200 dark:bg-emerald-400/90",
    "bg-rose-200 dark:bg-rose-400/90",
    "bg-purple-200 dark:bg-purple-400/90",
    "bg-orange-200 dark:bg-orange-400/90",
];

export function useMemos() {
    const [memos, setMemos] = useState<Memo[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        // Initial load from localStorage
        const savedMemos = localStorage.getItem("memos");
        if (savedMemos) {
            try {
                const parsed = JSON.parse(savedMemos);
                if (Array.isArray(parsed)) {
                    setMemos(parsed);
                }
            } catch (error) {
                console.error("Error loading memos from localStorage:", error);
            }
        }
        setIsLoaded(true);
    }, []);

    useEffect(() => {
        // Save to localStorage whenever memos change, but only after initial load
        if (isLoaded) {
            localStorage.setItem("memos", JSON.stringify(memos));
        }
    }, [memos, isLoaded]);

    const addMemo = (text: string, category: string = "기타") => {
        const randomColor = COLORS[Math.floor(Math.random() * COLORS.length)];
        const newMemo: Memo = {
            id: Date.now().toString(),
            text,
            createdAt: Date.now(),
            color: randomColor,
            category,
        };
        setMemos((prev) => [newMemo, ...prev]);
    };

    const deleteMemo = (id: string) => {
        setMemos((prev) => prev.filter((memo) => memo.id !== id));
    };

    const updateMemo = (id: string, text: string) => {
        setMemos((prev) =>
            prev.map((memo) => (memo.id === id ? { ...memo, text } : memo))
        );
    };

    return { memos, setMemos, addMemo, deleteMemo, updateMemo, isLoaded };
}
