"use client";

import { useState, useMemo, useEffect } from "react";
import { Trash2, Edit2, Check, X, GripVertical } from "lucide-react";
import { Memo } from "@/hooks/useMemos";
import { cn } from "@/lib/utils";
import { Draggable } from "@hello-pangea/dnd";

interface MemoCardProps {
    memo: Memo;
    index: number;
    onDelete: (id: string) => void;
    onUpdate: (id: string, text: string) => void;
}

export function MemoCard({ memo, index, onDelete, onUpdate }: MemoCardProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(memo.text);

    // Random rotation for natural post-it look
    const rotationDegrees = useMemo(() => {
        const angles = [-2, -1.5, -1, -0.5, 0.5, 1, 1.5, 2];
        return angles[Math.floor(Math.random() * angles.length)];
    }, []);

    const handleUpdate = () => {
        if (editText.trim() && editText !== memo.text) {
            onUpdate(memo.id, editText.trim());
        }
        setIsEditing(false);
    };

    const formatDate = (timestamp: number) => {
        return new Intl.DateTimeFormat("ko-KR", {
            month: "numeric",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }).format(new Date(timestamp));
    };

    return (
        <Draggable draggableId={memo.id} index={index}>
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    className={cn(
                        "group relative aspect-square p-6 transition-all duration-300 transform",
                        "text-zinc-900 shadow-[2px_2px_10px_rgba(0,0,0,0.1)] hover:shadow-[5px_5px_15px_rgba(0,0,0,0.15)] animate-stick",
                        snapshot.isDragging ? "z-50 scale-105 shadow-xl rotate-0" : "hover:scale-105 hover:z-10",
                        memo.color || "bg-yellow-200"
                    )}
                    style={{
                        ...provided.draggableProps.style,
                        "--rotation": `${rotationDegrees}deg`
                    } as any}
                >
                    {/* Category Badge */}
                    <div className="absolute top-2 left-6 px-1.5 py-0.5 bg-black/5 rounded text-[10px] font-sans font-bold tracking-tight uppercase opacity-50 group-hover:opacity-70 transition-opacity">
                        {memo.category || "기타"}
                    </div>

                    {/* Drag Handle */}
                    <div
                        {...provided.dragHandleProps}
                        className="absolute top-2 right-2 p-1 opacity-0 group-hover:opacity-30 hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
                    >
                        <GripVertical className="w-4 h-4" />
                    </div>

                    {/* Post-it "tape" effect */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-4 bg-white/30 backdrop-blur-sm -translate-y-1/2 pointer-events-none" />

                    <div className="flex flex-col h-full font-nanum">
                        {isEditing ? (
                            <textarea
                                value={editText}
                                onChange={(e) => setEditText(e.target.value)}
                                className="w-full flex-grow bg-transparent text-2xl outline-none resize-none leading-relaxed font-inherit border-b border-black/10"
                                autoFocus
                            />
                        ) : (
                            <p className="flex-grow text-2xl whitespace-pre-wrap leading-relaxed overflow-hidden">
                                {memo.text}
                            </p>
                        )}

                        <div className="flex items-center justify-between mt-auto pt-2">
                            <span className="text-xs font-sans opacity-50 font-semibold tracking-tighter">
                                {formatDate(memo.createdAt)}
                            </span>

                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                {isEditing ? (
                                    <>
                                        <button
                                            onClick={handleUpdate}
                                            className="p-1 hover:bg-black/5 rounded transition-colors"
                                        >
                                            <Check className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => {
                                                setIsEditing(false);
                                                setEditText(memo.text);
                                            }}
                                            className="p-1 hover:bg-black/5 rounded transition-colors"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            onClick={() => setIsEditing(true)}
                                            className="p-1 hover:bg-black/5 rounded transition-colors"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => onDelete(memo.id)}
                                            className="p-1 hover:text-rose-600 hover:bg-black/5 rounded transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Corner fold effect */}
                    <div className="absolute bottom-0 right-0 w-6 h-6 bg-black/5 rounded-tl-xl pointer-events-none" />
                </div>
            )}
        </Draggable>
    );
}
