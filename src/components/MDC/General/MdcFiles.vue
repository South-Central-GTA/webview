<template>
    <div class='mdc-files'>
        <div class='content row m-4'>
            <div class='col'>
                <mdc-file ref='file' :hidden='!isFileOpen' v-on:close='onCloseFile()' v-on:show-notification='onShowNotification'></mdc-file>

                <div v-if='showDeleteDialog' class='background' style='z-index: 99999 !important'>
                    <div class='center'>
                        <div class='modal-dialog'>
                            <div class='modal-content bg-white overflow-hidden' style='border-radius: 0 !important'>
                                <div class='p-4'>
                                    <h5 class='modal-title'>Datei löschen?</h5>
                                    <span>Sind Sie sich sicher das diese Datei gelöscht werden 
                                        soll?</span>
                                </div>
                                <div class='py-2 justify-content-evenly row'>
                                    <button class='col-5' type='button' @click='deleteFile()'>
                                        Ja
                                    </button>
                                    <button class='col-5' type='button' @click='closeDialog()'>
                                        Nein
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div v-if='showSetPermissionDialog' class='background' style='z-index: 99999 !important'>
                    <div class='center'>
                        <div class='modal-dialog'>
                            <div class='modal-content bg-white overflow-hidden' style='border-radius: 0 !important'>
                                <div class='p-4'>
                                    <h5 class='modal-title'>Zugriffseinschränkung</h5>
                                    <span>Welcher Rang soll Lesezugriff auf diesen Ordner haben?</span>
                                    <select class='form-select' @change='onChangeReadPermission($event)'>
                                        <option v-for='groupRank in groupRanks' v-bind:key='groupRank.level' :selected='readGroupRankLevel === groupRank.level' :value='groupRank.level'>
                                            {{ groupRank.name }}
                                        </option>
                                    </select>

                                    <span class='pt-4'>Welcher Rang soll in dem Ordner was bearbeiten
                    dürfen?</span> <select class='form-select' @change='onChangeWritePermission($event)'>
                                    <option v-for='groupRank in groupRanks' v-bind:key='groupRank.level' :selected='writeGroupRankLevel === groupRank.level' :value='groupRank.level'>
                                        {{ groupRank.name }}
                                    </option>
                                </select>
                                </div>
                                <div class='py-2 justify-content-evenly row'>
                                    <button class='col-5' type='button' @click='closeDialog()'>
                                        Okay
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div v-if='!isFileOpen'>
                    <button v-if='directoryId !== null' class='icon-button' @click='backToRoot()'>
                        <font-awesome-icon icon='chevron-left' />
                        <span class='px-2'>{{ directoryName }}</span>
                    </button>

                    <div ref='mdcFiles' class='table-fix-head'>
                        <table class='table table-striped table-hover'>
                            <thead>
                            <tr>
                                <th></th>
                                <th @click='orderByAlphabet()'>Name</th>
                                <th @click='orderByOwner()'>Eigentümer</th>
                                <th @click='orderByLastChange()'>Letzte Änderungen</th>
                                <th></th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr v-for='file in files' v-bind:key='file.id' class='entry'>
                                <td>
                                    <font-awesome-icon :icon='getIcon(file.isDirectory)' />
                                </td>
                                <td v-if='editFileNameId !== file.id' @click='clickEntry(file)'>
                                    {{ file.title }}
                                </td>
                                <td v-if='editFileNameId === file.id'>
                                    <input v-model='file.title' maxlength='50' v-on:keyup.enter='requestFileNameChange(file)' />
                                </td>
                                <td>{{ file.creatorCharacterName }}</td>
                                <td class='date'>
                                    {{ getDate(file.lastEditAtJson) }} - <i>{{ file.lastEditCharacterName }}</i>
                                </td>
                                <td class='pointer-event'>
                                    <button v-if='
                        file.creatorCharacterId === characterId || isOperator
                      ' class='icon-button' @click='editFileName(file)'>
                                        <font-awesome-icon icon='pen' />
                                    </button>
                                    <button v-if='isOperator' class='icon-button' @click='requestDeleteFile(file)'>
                                        <font-awesome-icon icon='trash' />
                                    </button>
                                    <button v-if='isOwner && file.isDirectory' class='icon-button' @click='requestSetAccessPermission(file)'>
                                        <font-awesome-icon icon='universal-access' />
                                    </button>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>

                    <div class='pb-5 position-absolute bottom-0'>
                        <button v-if='directoryId === null' type='button' @click='createDirectory()'>
                            Ordner erstellen
                        </button>
                        <button v-if='directoryId !== null' type='button' @click='createFile()'>
                            Textdatei erstellen
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
import GroupService from "@/scripts/services/group.service";
import MdcFile from "@/components/MDC/General/MdcFile.vue";
import {Ref} from "vue-property-decorator";
import MdcService from "@/scripts/services/mdc.service";
import character from "@/scripts/services/character.service";
import {GroupRankInterface} from "@/scripts/interfaces/group/group-rank.interface";
import {FileInterface} from "@/scripts/interfaces/filesystem/file.interface";
import {FileSystemRankSetup} from "@/scripts/interfaces/filesystem/file-system-rank-setup";

@Options({
    components: {
        MdcFile,
    },
})
export default class MdcFiles extends Vue {
    @Ref() private readonly mdcFiles!: HTMLElement;
    @Ref() private readonly file!: MdcFile;

    private files: FileInterface[] = [];
    private groupId: number = -1;
    private characterId: number = -1;
    private directoryId: number | null = null;
    private editFileNameId: number | null = null;
    private directoryName: string = "";
    private isFileOpen: boolean = false;
    private isOperator: boolean = false;
    private isOwner: boolean = true;
    private showDeleteDialog: boolean = false;
    private showSetPermissionDialog: boolean = false;
    private fileToEdit: FileInterface | undefined;
    private groupRanks: GroupRankInterface[] = [];
    private writeGroupRankLevel: number = -1;
    private readGroupRankLevel: number = -1;
    private ghostElement: HTMLElement | undefined;

    public setup(): void {
        this.groupId = GroupService.getInstance().Faction?.id ?? -1;
        this.directoryId = null;

        alt.on("filesystem:opendirectory", (args: any[]) => this.onOpenDirectory(args[0], args[1], args[2]));
        alt.on("filesystem:openfile", (args: any[]) => this.onOpenFile(args[0]));

        MdcService.getInstance().onIsOperatorChanged.on((value: boolean) => this.onIsOperatorChanged(value));
        this.characterId = character.getInstance().getCharacterId;

        if (this.groupId !== -1) {
            const member = GroupService.getInstance().Faction?.members
                .find((w) => w.characterId == character.getInstance().getCharacterId);
            if (member !== undefined) {
                this.isOwner = member.owner;
            }
        }
    }

    public terminate(): void {
        alt.off("filesystem:opendirectory");
        alt.off("filesystem:openfile");

        MdcService.getInstance().onIsOperatorChanged.off((value: boolean) => this.onIsOperatorChanged(value));
    }

    public onOpenFile(file: FileInterface): void {
        this.file.setup(file);
        this.isFileOpen = true;
    }

    public onCloseFile(): void {
        this.file.revokeEditFile();
        this.isFileOpen = false;
    }

    private onShowNotification(message: string): void {
        this.$emit("show-notification", message);
    }

    private onIsOperatorChanged(value: boolean): void {
        this.isOperator = value;
    }

    private onOpenDirectory(directoryId: number | null, directoryName: string, files: FileInterface[]): void {
        this.directoryId = directoryId;
        this.directoryName = directoryName;
        this.files = files;
    }

    private onChangeReadPermission(eventData: any) {
        if (!this.fileToEdit) {
            return;
        }

        const groupLevel = Number(eventData.target.value);
        alt.emitServer("filesystem:setreadpermission", this.fileToEdit?.id, groupLevel);
        this.onShowNotification("Schreibberechtigungen wurden angepasst.");
    }

    private onChangeWritePermission(eventData: any) {
        if (!this.fileToEdit) {
            return;
        }

        const groupLevel = Number(eventData.target.value);
        alt.emitServer("filesystem:setwritepermission", this.fileToEdit?.id, groupLevel);
        this.onShowNotification("Leseberechtigungen wurden angepasst.");
    }

    private clickEntry(file: FileInterface): void {
        if (this.ghostElement) {
            return;
        }

        this.editFileNameId = null;

        if (file.isDirectory) {
            alt.emitServer("filesystem:requestdirectory", file.id);
        } else {
            alt.emitServer("filesystem:requestfile", file.id);
        }
    }

    private requestFileNameChange(file: FileInterface): void {
        if (file.isDirectory) {
            alt.emitServer("filesystem:requestrenamedirectory", file.id, file.title);
        } else {
            alt.emitServer("filesystem:requestrenamefile", file.id, file.title);
        }

        this.editFileNameId = null;

        this.onShowNotification("Datei wurde unbenannt.");
    }

    private requestDeleteFile(file: FileInterface): void {
        this.showDeleteDialog = true;
        this.fileToEdit = file;
    }

    private requestSetAccessPermission(file: FileInterface): void {
        alt.emitServerWithResponse<FileSystemRankSetup>("filesystem:getranksetup", this.groupId, file.id)
            .then((setup: FileSystemRankSetup) => {
                this.showSetPermissionDialog = true;
                this.fileToEdit = file;
                this.groupRanks = setup.ranks;
                this.writeGroupRankLevel = setup.canWriteLevel;
                this.readGroupRankLevel = setup.canReadLevel;
            });
    }

    private orderByAlphabet(): void {
        this.files.sort((a: FileInterface, b: FileInterface) => a.title.localeCompare(b.title));
        this.onShowNotification("Sortiere Liste alphabetisch.");
    }

    private orderByOwner(): void {
        this.files.sort((a: FileInterface, b: FileInterface) => {
            if (a.creatorCharacterId === b.creatorCharacterId) {
                return -1;
            } else if (a.creatorCharacterId !== b.creatorCharacterId) {
                return 1;
            }

            return 0;
        });

        this.onShowNotification("Sortiere Liste nach Besitzer.");
    }

    private orderByLastChange(): void {
        this.files.sort((a: FileInterface, b: FileInterface) => {
            return this.getTime(b.lastEditAtJson) - this.getTime(a.lastEditAtJson);
        });

        this.onShowNotification("Sortiere Liste nach letzte Änderungen.");
    }

    private deleteFile(): void {
        if (!this.fileToEdit) {
            return;
        }

        if (this.fileToEdit.isDirectory) {
            alt.emitServer("filesystem:deletedirectory", this.fileToEdit.id);
        } else {
            alt.emitServer("filesystem:deletefile", this.fileToEdit.id);
        }

        this.fileToEdit = undefined;
        this.showDeleteDialog = false;

        this.onShowNotification("Datei wurde gelöscht.");
    }

    private closeDialog(): void {
        this.showDeleteDialog = false;
        this.showSetPermissionDialog = false;
    }

    private editFileName(file: FileInterface): void {
        if (this.editFileNameId === file.id) {
            this.editFileNameId = null;
            return;
        }

        this.editFileNameId = file.id;
    }

    private backToRoot(): void {
        if (this.directoryId === null) {
            return;
        }

        this.directoryId = null;

        alt.emitServer("filesystem:openrootdirectory", this.groupId);
    }

    private createDirectory(): void {
        if (this.directoryId !== null) {
            return;
        }

        alt.emitServer("filesystem:createdirectory", this.groupId);
    }

    private createFile(): void {
        if (this.directoryId === null) {
            return;
        }

        alt.emitServer("filesystem:createfile", this.groupId, this.directoryId);
    }

    private getTime(dateJson: string) {
        const date = new Date(JSON.parse(dateJson));
        return date !== null ? date.getTime() : 0;
    }

    private getDate(jsonDate: string): string {
        const date = new Date(JSON.parse(jsonDate));
        return date.toLocaleDateString("de-DE", {
            weekday: "short", hour: "numeric", minute: "numeric", month: "numeric", year: "numeric", day: "numeric",
        });
    }

    private getIcon(isDirectory: boolean): string {
        if (isDirectory) {
            return "folder";
        } else {
            return "file";
        }
    }
}
</script>

<style lang='scss' scoped>
.mdc-files {
    background-color: #cecece;
    height: 100%;
}

::-webkit-scrollbar-thumb {
    background: rgb(122, 123, 124);
}

th {
    background-color: #cecece;
}

.form-select {
    pointer-events: all !important;
}

.date {
    color: dimgray;
}
</style>
