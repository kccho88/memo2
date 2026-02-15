"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const CATEGORIES = ["할일", "아이디어", "유머", "좋은글", "비밀번호", "기타"];

interface MemoInputProps {
    onAdd: (text: string, category: string) => void;
}

export function MemoInput({ onAdd }: MemoInputProps) {
    const [text, setText] = useState("");
    const [category, setCategory] = useState("기타");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (text.trim()) {
            onAdd(text.trim(), category);
            setText("");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto mb-12">
            <div className="flex flex-col gap-3 p-4 bg-white dark:bg-white border border-zinc-200 dark:border-zinc-300 rounded-xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.1)] focus-within:ring-2 focus-within:ring-green-100 transition-all duration-300">
                <Textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="여기에 메모를 입력하세요..."
                    className="w-full min-h-[100px] bg-transparent text-zinc-900 dark:text-zinc-900 border-none shadow-none focus-visible:ring-0 resize-none text-base p-0"
                />
                <div className="flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800 pt-3 mt-1">
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-zinc-400 font-medium ml-1">카테고리:</span>
                        <Select value={category} onValueChange={setCategory}>
                            <SelectTrigger className="w-[120px] h-8 text-xs bg-zinc-50 dark:bg-zinc-800 border-none shadow-none focus:ring-0">
                                <SelectValue placeholder="카테고리" />
                            </SelectTrigger>
                            <SelectContent>
                                {CATEGORIES.map((cat) => (
                                    <SelectItem key={cat} value={cat}>
                                        {cat}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <Button
                        type="submit"
                        disabled={!text.trim()}
                        className="bg-green-600 hover:bg-green-700 text-white dark:bg-green-600 dark:hover:bg-green-700 dark:text-white transition-all active:scale-95 px-6"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        <span>메모 추가</span>
                    </Button>
                </div>
            </div>
        </form>
    );
}
