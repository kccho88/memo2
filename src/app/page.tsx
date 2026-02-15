"use client";

import { useMemos } from "@/hooks/useMemos";
import { MemoInput } from "@/components/MemoInput";
import { MemoCard } from "@/components/MemoCard";
import { ThemeToggle } from "@/components/ThemeToggle";
import { StickyNote, Search, Loader2, Filter } from "lucide-react";
import { useState } from "react";
import { DragDropContext, Droppable, DropResult } from "@hello-pangea/dnd";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const CATEGORIES = ["전체", "할일", "아이디어", "유머", "좋은글", "비밀번호", "기타"];

export default function Home() {
  const { memos, setMemos, addMemo, deleteMemo, updateMemo, isLoaded } = useMemos();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("전체");

  const filteredMemos = memos.filter((memo) => {
    const matchesSearch = memo.text.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "전체" || memo.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(memos);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setMemos(items);
  };

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-100 dark:bg-zinc-100">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-zinc-200 font-sans selection:bg-yellow-200 dark:selection:bg-yellow-300 transition-colors duration-300">
      <main className="max-w-6xl mx-auto px-6 py-12 md:py-20 relative">
        {/* Theme Toggle - Top Right */}
        <div className="absolute top-6 right-6 md:top-10 md:right-10 z-50">
          <ThemeToggle />
        </div>

        {/* Header Section */}
        <div className="flex flex-col items-center gap-10 mb-20 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="p-3 bg-yellow-400 rounded-2xl shadow-sm rotate-3">
              <StickyNote className="w-8 h-8 text-zinc-950" />
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-900 font-nanum">
              나의 포스트잇 메모장
            </h1>
            <p className="text-zinc-500 dark:text-zinc-500 max-w-sm">
              오늘의 아이디어와 할 일들을 예쁜 포스트잇에 기록해 보세요.
            </p>
          </div>

          <div className="w-full flex flex-col items-center gap-6">
            <MemoInput onAdd={addMemo} />

            <div className="flex items-center gap-3 w-full max-w-md mx-auto">
              <div className="relative group flex-grow">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-zinc-900 dark:group-focus-within:text-zinc-100 transition-colors" />
                <input
                  type="text"
                  placeholder="메모 검색하기..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-6 py-2.5 bg-white dark:bg-white border border-zinc-200 dark:border-zinc-300 rounded-full shadow-sm text-sm focus:ring-2 focus:ring-yellow-100 outline-none transition-all placeholder:text-zinc-400 text-zinc-900 dark:text-zinc-900"
                />
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-white border border-zinc-200 dark:border-zinc-300 rounded-full shadow-sm text-sm font-medium hover:bg-zinc-50 dark:hover:bg-zinc-100 transition-all text-zinc-700 dark:text-zinc-800">
                    <Filter className="w-4 h-4" />
                    <span>{selectedCategory}</span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40 font-nanum">
                  {CATEGORIES.map((cat) => (
                    <DropdownMenuItem
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={cn(
                        "text-lg cursor-pointer",
                        selectedCategory === cat && "bg-zinc-100 dark:bg-zinc-800 font-bold"
                      )}
                    >
                      {cat}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Memos Grid with Drag and Drop */}
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="memos" direction="horizontal">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
              >
                {filteredMemos.length > 0 ? (
                  filteredMemos.map((memo, index) => (
                    <MemoCard
                      key={memo.id}
                      memo={memo}
                      index={index}
                      onDelete={deleteMemo}
                      onUpdate={updateMemo}
                    />
                  ))
                ) : (
                  <div className="col-span-full py-32 text-center">
                    <div className="inline-flex p-8 bg-zinc-100 dark:bg-zinc-900 rounded-full mb-6 rotate-3">
                      <StickyNote className="w-12 h-12 text-zinc-300 dark:text-zinc-700" />
                    </div>
                    <p className="text-2xl font-bold text-zinc-400 dark:text-zinc-500 font-nanum">
                      {searchQuery ? "검색 결과가 없어요." : "메모가 텅 비었네요!"}
                    </p>
                    <p className="text-zinc-400 dark:text-zinc-500 mt-2 text-sm">
                      {searchQuery ? "다른 단어로 찾아보시겠어요?" : "첫 번째 포스트잇을 붙여보세요."}
                    </p>
                  </div>
                )}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </main>

      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none -z-10 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] opacity-40 dark:opacity-5" />
    </div>
  );
}
