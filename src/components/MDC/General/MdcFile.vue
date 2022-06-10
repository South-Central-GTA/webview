<template>
    <div class='mdc-file'>
        <div class='content row'>
            <div class='col'>
                <button class='icon-button' @click='closeFile()'>
                    <font-awesome-icon icon='chevron-left' />
                    <span class='px-2'>{{ fileName }}</span>
                </button>

                <custom-editor ref='customEditor' />

                <div class='pb-5 position-absolute bottom-0'>
                    <div v-if='isEditorVisible'>
                        <button type='button' @click='revokeEditFile()'>
                            Änderungen verwerfen
                        </button>
                        <button class='mx-2' type='button' @click='save()'>
                            Änderungen speichern
                        </button>
                    </div>
                    <div v-else>
                        <button type='button' @click='requestEdit()'>
                            Textdatei bearbeiten
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang='ts'>
import {Options, Vue} from "vue-class-component";
import alt from "@/scripts/services/alt.service";
import CustomEditor from "@/components/General/CustomEditor.vue";
import {Ref} from "vue-property-decorator";
import {FileInterface} from "@/scripts/interfaces/filesystem/file.interface";

@Options({
    components: {
        CustomEditor,
    },
})
export default class MdcFile extends Vue {
    @Ref() private readonly customEditor!: CustomEditor;

    private fileName: string = "";
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
        this.customEditor.setContent(file.context);

        this.isEditorVisible = false;
    }

    public revokeEditFile(): void {
        this.isEditorVisible = false;
        this.customEditor.showToolbar(false);

        alt.emitServer("filesystem:revokeeditfile", this.id);
    }

    private onEdit(context: string): void {
        this.isEditorVisible = true;
        this.customEditor.showToolbar(true);
        this.customEditor.setContent(context);
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

    private save(): void {
        this.isEditorVisible = false;
        this.customEditor.showToolbar(false);

        alt.emitServer("filesystem:savefile", this.id, this.customEditor.getContent);

        this.$emit("show-notification", `Datei wird gespeichert...`);
    }
}
</script>

<style lang='scss' scoped>
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

.date {
    color: dimgray;
}
</style>
