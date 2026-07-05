import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Link2, 
  Strikethrough, 
  Underline as UnderlineIcon, 
  Undo, 
  Redo,
  Heading1,
  Heading2,
  Heading3,
  Quote
} from 'lucide-react';

interface TiptapEditorProps {
  initialValue?: string;
  onChange?: (html: string) => void;
  inputId?: string;
}

export default function TiptapEditor({ initialValue = '', onChange, inputId }: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-brand_cta underline cursor-pointer',
        },
      }),
    ],
    content: initialValue,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      if (onChange) onChange(html);
      
      if (inputId) {
        const input = document.getElementById(inputId) as HTMLInputElement;
        if (input) {
          input.value = html;
          // Dispatch events so form validation and triggers work
          input.dispatchEvent(new Event('input', { bubbles: true }));
          input.dispatchEvent(new Event('change', { bubbles: true }));
        }
      }
    },
  });

  if (!editor) return null;

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL:', previousUrl);

    // cancelled
    if (url === null) {
      return;
    }

    // empty
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    // update link
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  return (
    <div className="border-2 border-black bg-white focus-within:border-brand_cta transition-colors">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 p-2 border-b-2 border-black bg-canvas_accent font-mono select-none">
        {/* Headings */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`p-2 border border-transparent hover:border-black hover:bg-gray-100 active:translate-y-[1px] ${editor.isActive('heading', { level: 1 }) ? 'bg-black text-white hover:bg-black' : 'text-black'}`}
          title="Heading 1"
        >
          <Heading1 size={14} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-2 border border-transparent hover:border-black hover:bg-gray-100 active:translate-y-[1px] ${editor.isActive('heading', { level: 2 }) ? 'bg-black text-white hover:bg-black' : 'text-black'}`}
          title="Heading 2"
        >
          <Heading2 size={14} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`p-2 border border-transparent hover:border-black hover:bg-gray-100 active:translate-y-[1px] ${editor.isActive('heading', { level: 3 }) ? 'bg-black text-white hover:bg-black' : 'text-black'}`}
          title="Heading 3"
        >
          <Heading3 size={14} />
        </button>

        <div className="w-[2px] bg-black my-1 mx-2"></div>

        {/* Text styling */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 border border-transparent hover:border-black hover:bg-gray-100 active:translate-y-[1px] ${editor.isActive('bold') ? 'bg-black text-white hover:bg-black' : 'text-black'}`}
          title="Bold"
        >
          <Bold size={14} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 border border-transparent hover:border-black hover:bg-gray-100 active:translate-y-[1px] ${editor.isActive('italic') ? 'bg-black text-white hover:bg-black' : 'text-black'}`}
          title="Italic"
        >
          <Italic size={14} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`p-2 border border-transparent hover:border-black hover:bg-gray-100 active:translate-y-[1px] ${editor.isActive('underline') ? 'bg-black text-white hover:bg-black' : 'text-black'}`}
          title="Underline"
        >
          <UnderlineIcon size={14} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`p-2 border border-transparent hover:border-black hover:bg-gray-100 active:translate-y-[1px] ${editor.isActive('strike') ? 'bg-black text-white hover:bg-black' : 'text-black'}`}
          title="Strikethrough"
        >
          <Strikethrough size={14} />
        </button>

        <div className="w-[2px] bg-black my-1 mx-2"></div>

        {/* Lists & Quotes */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 border border-transparent hover:border-black hover:bg-gray-100 active:translate-y-[1px] ${editor.isActive('bulletList') ? 'bg-black text-white hover:bg-black' : 'text-black'}`}
          title="Bullet List"
        >
          <List size={14} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 border border-transparent hover:border-black hover:bg-gray-100 active:translate-y-[1px] ${editor.isActive('orderedList') ? 'bg-black text-white hover:bg-black' : 'text-black'}`}
          title="Ordered List"
        >
          <ListOrdered size={14} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-2 border border-transparent hover:border-black hover:bg-gray-100 active:translate-y-[1px] ${editor.isActive('blockquote') ? 'bg-black text-white hover:bg-black' : 'text-black'}`}
          title="Blockquote"
        >
          <Quote size={14} />
        </button>

        <div className="w-[2px] bg-black my-1 mx-2"></div>

        {/* Links */}
        <button
          type="button"
          onClick={setLink}
          className={`p-2 border border-transparent hover:border-black hover:bg-gray-100 active:translate-y-[1px] ${editor.isActive('link') ? 'bg-black text-white hover:bg-black' : 'text-black'}`}
          title="Insert Link"
        >
          <Link2 size={14} />
        </button>

        <div className="w-[2px] bg-black my-1 mx-2"></div>

        {/* History */}
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="p-2 border border-transparent hover:border-black hover:bg-gray-100 active:translate-y-[1px] text-black disabled:opacity-30 disabled:hover:border-transparent disabled:hover:bg-transparent"
          title="Undo"
        >
          <Undo size={14} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="p-2 border border-transparent hover:border-black hover:bg-gray-100 active:translate-y-[1px] text-black disabled:opacity-30 disabled:hover:border-transparent disabled:hover:bg-transparent"
          title="Redo"
        >
          <Redo size={14} />
        </button>
      </div>

      {/* Editor Content Area */}
      <div className="p-4 min-h-[300px] font-mono text-sm leading-relaxed text-black">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
