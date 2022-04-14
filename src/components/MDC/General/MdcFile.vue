<template>
    <div class="mdc-file">
        <div class="content row">
            <div class="col">
                <button class="icon-button" @click="closeFile()">
                    <font-awesome-icon icon="chevron-left"/>
                    <span class="px-2">{{ fileName }}</span>
                </button>
                
                <div :hidden="isEditorVisible">
                    <div class="context" v-html="context">

                    </div>

                    <div class="pt-2">
                        <button type="button" @click="requestEdit()">Textdatei bearbeiten</button>
                    </div>
                </div>
                <div class="editor" :hidden="!isEditorVisible">
                    <custom-editor ref="customEditor" />

                    <div class="pt-2">
                        <button type="button" @click="stopEdit()">Änderungen verwerfen</button>
                        <button type="button" @click="save()">Änderungen speichern</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import {Options, Vue} from "vue-class-component";
import alt from "@/scripts/services/alt.service";
import {FileInterface} from "@/scripts/interfaces/file.interface";
import CustomEditor from "@/components/General/CustomEditor.vue";
import {Ref} from "vue-property-decorator";
import GroupService from "@/scripts/services/group.service";
import MdcBase from "@/components/MDC/MdcBase.vue";

@Options({
    components: {
        CustomEditor,
    }
})
export default class MdcFile extends Vue {
    @Ref() private readonly customEditor!: CustomEditor;
    
    private fileName: string = "";
    private context: string = "";
    private id: number | undefined;
    
    private isEditorVisible: boolean = false;

    public mounted(): void {
        alt.on("filesystem:editfile", (args: any[]) => this.onEdit(args[0]));
        alt.on("filesystem:filesaved", () => this.onSaved());
        alt.on("filesystem:fileblocked", (args: any[]) => this.onFileBlocked(args[0]));
    }
    
    public unmounted(): void {
        alt.off("filesystem:editfile");
        alt.off("filesystem:filesaved");
        alt.off("filesystem:fileblocked");
    }
    
    public setup(file: FileInterface): void {
        this.id = file.id;
        this.fileName = file.title;
        this.context = file.context;
    }
    
    public revokeEditFile(): void {
        this.isEditorVisible = false;
        
        alt.emitServer("filesystem:revokeeditfile", this.id);
    }

    private onEdit(context: string): void {
        this.isEditorVisible = true;
        
        context = context.replaceAll("text-end", "ql-align-right");
        context = context.replaceAll("text-center", "ql-align-center");

        this.customEditor.setHTML(context);
        this.context = context;
    }
    
    private onSaved(): void {
        this.$emit("show-notification", `Datei wurde gespeichert.`);
    }
    
    private onFileBlocked(blockedByCharacterName: string): void {
        this.$emit("show-notification", `Die Datei wird aktuell von ${blockedByCharacterName} bearbeitet.`);
    }
    
    private closeFile(): void {
        this.$emit("close");
    }

    private requestEdit(): void {
        alt.emitServer("filesystem:requesteditfile", this.id);
    }
    
    private stopEdit(): void {
        this.isEditorVisible = false;

        alt.emitServer("filesystem:revokeeditfile", this.id);
        this.$emit("show-notification", `Bearbeitung wurde abgebrochen.`);
    }
    
    private save(): void {
        this.isEditorVisible = false;

        let context = this.customEditor.getContent;

        context = context.replaceAll("ql-align-right", "text-end");
        context = context.replaceAll("ql-align-center", "text-center");
        
        this.context = context;
        
        alt.emitServer("filesystem:savefile", this.id, this.context);

        this.$emit("show-notification", `Datei wird gespeichert...`);
    }

    private getDate(jsonDate: string): string {
        const date = new Date(JSON.parse(jsonDate));
        return date.toLocaleDateString("de-DE", {
            weekday: 'short',
            hour: 'numeric',
            minute: 'numeric',
            month: 'numeric',
            year: 'numeric',
            day: 'numeric'
        });
    }
}
</script>

<style scoped lang="scss">
.mdc-file {
    background-color: #cecece;
    height: 100%;
}

.table-holder {
    height: 26.5vw;
    overflow-x: hidden;
    overflow-y: auto;
}

::-webkit-scrollbar-thumb {
    background: rgb(122, 123, 124);
}

.editor {
    height: 20vw;
    
    & ::-webkit-scrollbar-thumb {
        background: rgb(122, 123, 124);
    }
}

.date {
    color: dimgray;
}

.context {
    padding: 2em;
    overflow-y: auto;
    height: 46.5vh;
}
</style>