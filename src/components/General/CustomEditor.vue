<template>
    <QuillEditor 
        ref="editorRef"
        content-type="html"
        :options="options"
        :content="content"
        @update:content="onContentUpdated" />
</template>

<script lang="ts">
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import {Options, Vue} from "vue-class-component";
import {Delta, QuillEditor} from "@vueup/vue-quill";
import {Ref} from "vue-property-decorator";

@Options({
    components: {
        QuillEditor
    }
})
export default class CustomEditor extends Vue {
    @Ref() private readonly editorRef!: typeof QuillEditor;

    private options = {
        formats: [
            'background',
            'bold',
            'color',
            'font',
            'italic',
            'underline',
            'header',
            'list',
            'align',
        ],
        modules: {
            toolbar: [
                ['bold', 'italic', 'underline', 'strike'],        // toggled buttons

                [{'header': 1}, {'header': 2}],               // custom button values
                [{'list': 'ordered'}, {'list': 'bullet'}],

                [{'header': [1, 2, 3, 4, 5, 6, false]}],

                [{'color': []}, {'background': []}],          // dropdown with defaults from theme
                [{'font': []}],
                [{'align': []}],
            ]
        },
        theme: ''
    }
    
    private content: string = "";
    get getContent(): string {
        return this.content;
    }
    
    public setHTML(content: string): void {
        this.editorRef.pasteHTML(content);

    }
    
    private onContentUpdated(content: Delta): void {
        this.content = content.toString();
    }
}
</script>

<style scoped>

</style>
