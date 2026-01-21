'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import Placeholder from '@tiptap/extension-placeholder';
import { Bold, Italic, List, ListOrdered, Underline as UnderlineIcon, Link as LinkIcon, PenTool } from 'lucide-react';
import { useEffect, useState } from 'react';

import { createClient } from '@/utils/supabase/client';

const supabase = createClient();

interface RichTextEditorProps {
    value: string;
    onChange: (html: string) => void;
    placeholder?: string;
}

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
    const [signatures, setSignatures] = useState<{ id: string; label: string; content: string }[]>([]);

    useEffect(() => {
        const fetchSignatures = async () => {
            const { data } = await supabase.from('email_signatures').select('id, label, content');
            if (data) setSignatures(data);
        };
        fetchSignatures();
    }, []);

    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-indigo-400 underline cursor-pointer',
                },
            }),
            Placeholder.configure({
                placeholder: placeholder || 'Escribe aquí tu mensaje...',
                emptyEditorClass: 'is-editor-empty before:content-[attr(data-placeholder)] before:text-zinc-600 before:float-left before:pointer-events-none before:h-0',
            }),
        ],
        content: value,
        editorProps: {
            attributes: {
                class: 'prose prose-invert max-w-none focus:outline-none min-h-[200px] text-zinc-300 leading-relaxed font-sans',
            },
        },
        immediatelyRender: false,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
    });

    // Sync external value changes ONLY if editor is empty (to avoid loops) or drastically different.
    useEffect(() => {
        if (editor && value && editor.isEmpty) {
            editor.commands.setContent(value);
        }
    }, [value, editor]);

    if (!editor) {
        return <div className="h-64 bg-zinc-950/50 animate-pulse rounded-lg border border-zinc-800" />;
    }

    const insertSignature = (content: string) => {
        editor?.chain().focus().insertContent(content).run();
    };


    const ToolbarButton = ({ onClick, isActive, icon: Icon, title }: any) => (
        <button
            onClick={onClick}
            className={`p-1.5 rounded transition-colors ${isActive ? 'bg-indigo-500/20 text-indigo-300' : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'}`}
            title={title}
        >
            <Icon className="w-4 h-4" />
        </button>
    );

    return (
        <div className="flex flex-col border border-zinc-800 rounded-lg overflow-hidden bg-zinc-950 focus-within:border-indigo-500/50 transition-colors">
            {/* Toolbar */}
            <div className="flex items-center justify-between p-2 border-b border-zinc-800 bg-zinc-900/50">
                <div className="flex items-center gap-1">
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        isActive={editor.isActive('bold')}
                        icon={Bold}
                        title="Negrita"
                    />
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        isActive={editor.isActive('italic')}
                        icon={Italic}
                        title="Cursiva"
                    />
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleUnderline().run()}
                        isActive={editor.isActive('underline')}
                        icon={UnderlineIcon}
                        title="Subrayado"
                    />
                    <div className="w-px h-4 bg-zinc-800 mx-1" />
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                        isActive={editor.isActive('bulletList')}
                        icon={List}
                        title="Lista con viñetas"
                    />
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleOrderedList().run()}
                        isActive={editor.isActive('orderedList')}
                        icon={ListOrdered}
                        title="Lista numérica"
                    />
                </div>

                {/* Signature Dropdown / Buttons */}
                <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold text-zinc-600 mr-1">Firmar como:</span>
                    {signatures.length === 0 ? (
                        <span className="text-xs text-zinc-600">Cargando...</span>
                    ) : (
                        signatures.map((sig) => (
                            <button
                                key={sig.id}
                                onClick={() => insertSignature(sig.content)}
                                className="px-2 py-1 text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded border border-zinc-700 transition-colors flex items-center gap-1.5"
                            >
                                <PenTool className="w-3 h-3" />
                                {sig.label.split(' - ')[0]} {/* Show only name part if formatted as "Name - Role" */}
                            </button>
                        ))
                    )}
                </div>
            </div>

            {/* Editor Area */}
            <div className="p-4 cursor-text min-h-[16rem]">
                <EditorContent editor={editor} />
            </div>
        </div>
    );
}
