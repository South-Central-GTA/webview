<template>
    <div>
        <div v-if='editor && isToolbarVisible'>
            <button class='icon-button' @click='editor.chain().focus().toggleBold().run()'>
                <font-awesome-icon :class="{ 'is-active': editor.isActive('bold') }" icon='bold' />
            </button>
            <button class='icon-button' @click='editor.chain().focus().toggleItalic().run()'>
                <font-awesome-icon :class="{ 'is-active': editor.isActive('italic') }" icon='italic' />
            </button>
            <button class='icon-button' @click='editor.chain().focus().toggleStrike().run()'>
                <font-awesome-icon :class="{ 'is-active': editor.isActive('strike') }" icon='strikethrough' />
            </button>
            <button class='icon-button' @click='editor.chain().focus().toggleCode().run()'>
                <font-awesome-icon :class="{ 'is-active': editor.isActive('code') }" icon='code' />
            </button>
            <button class='icon-button' @click='
          () => {
            editor.chain().focus().unsetAllMarks().run();
            editor.chain().focus().clearNodes().run();
          }
        '>
                <font-awesome-icon icon='eraser' />
            </button>

            <button class='icon-button' @click='editor.chain().focus().toggleHeading({ level: 1 }).run()'>
                <font-awesome-icon :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }" icon='heading' />
                1
            </button>
            <button class='icon-button' @click='editor.chain().focus().toggleHeading({ level: 2 }).run()'>
                <font-awesome-icon :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }" icon='heading' />
                2
            </button>
            <button class='icon-button' @click='editor.chain().focus().toggleHeading({ level: 3 }).run()'>
                <font-awesome-icon :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }" icon='heading' />
                3
            </button>
            <button class='icon-button' @click='editor.chain().focus().toggleHeading({ level: 4 }).run()'>
                <font-awesome-icon :class="{ 'is-active': editor.isActive('heading', { level: 4 }) }" icon='heading' />
                4
            </button>

            <button class='icon-button' @click='editor.chain().focus().toggleBulletList().run()'>
                <font-awesome-icon :class="{ 'is-active': editor.isActive('bulletList') }" icon='list-ul' />
            </button>

            <button class='icon-button' @click='editor.chain().focus().toggleOrderedList().run()'>
                <font-awesome-icon :class="{ 'is-active': editor.isActive('orderedList') }" icon='list-ol' />
            </button>

            <button class='icon-button' @click='editor.chain().focus().toggleCodeBlock().run()'>
                <font-awesome-icon :class="{ 'is-active': editor.isActive('codeBlock') }" icon='file-code' />
            </button>

            <button class='icon-button' @click='editor.chain().focus().toggleBlockquote().run()'>
                <font-awesome-icon :class="{ 'is-active': editor.isActive('blockquote') }" icon='quote-left' />
            </button>
            <button class='icon-button' @click='editor.chain().focus().setHorizontalRule().run()'>
                <font-awesome-icon icon='grip-lines' />
            </button>

            <button class='icon-button' @click='editor.chain().focus().undo().run()'>
                <font-awesome-icon icon='undo' />
            </button>
            <button class='icon-button' @click='editor.chain().focus().redo().run()'>
                <font-awesome-icon icon='redo' />
            </button>
        </div>

        <editor-content :editor='editor' />
    </div>
</template>

<script lang='ts'>
import {Options, Vue} from "vue-class-component";
import {Editor, EditorContent} from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";
import {CharacterCount} from "@tiptap/extension-character-count";

@Options({
    components: {
        EditorContent,
    },
})
export default class CustomEditor extends Vue {
    private editor: Editor = new Editor({
        extensions: [StarterKit, CharacterCount.configure({
            limit: 2000000,
        }),], editable: false,
    });

    private isToolbarVisible: boolean = false;

    get getContent(): string {
        return this.editor.getHTML();
    }

    public showToolbar(state: boolean): void {
        this.isToolbarVisible = state;
        this.editor.setOptions({editable: state});
    }

    public setContent(content: string): void {
        this.editor.commands.setContent(content);
    }
}
</script>

<style lang='scss'>
::-webkit-scrollbar-thumb {
    background: rgb(122, 123, 124);
}

.ProseMirror {
    padding: 0.5vw;

    &:focus {
        outline: none;
    }

    height: 46vh;
    overflow: auto;

    ul,
    ol {
        padding: 0 1rem;
    }

    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
        line-height: 1.1;
    }

    code {
        background-color: rgba(#616161, 0.1);
        color: #616161;
    }

    pre {
        background: #0d0d0d;
        color: #fff;
        font-family: "JetBrainsMono", monospace;
        padding: 0.75rem 1rem;
        border-radius: 0.5rem;

        code {
            color: inherit;
            padding: 0;
            background: none;
            font-size: 0.8rem;
        }
    }

    img {
        max-width: 100%;
        height: auto;
    }

    blockquote {
        padding-left: 1rem;
        border-left: 2px solid rgba(#0d0d0d, 0.1);
    }

    hr {
        border: none;
        border-top: 2px solid rgba(#0d0d0d, 0.1);
        margin: 2rem 0;
    }
}
</style>
