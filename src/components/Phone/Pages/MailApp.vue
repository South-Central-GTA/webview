<template>
    <div class='mail-app'>
    <span v-if='errorMessage.length !== 0' class='error-message'>
      {{ errorMessage }}
    </span>

        <span v-if='infoMessage.length !== 0' class='info-message'>
  {{ infoMessage }}
        </span>

        <div :hidden='openTabId !== 0'>
            <div class='topbar-mail'>Bleiben Sie immer vernetzt mit MailSA.</div>

            <div class='content-mail p-4'>
                <div class='d-flex justify-content-center'>
                    <div>
                        <h1 class='text-center'>MailSA</h1>
                        <figure class='text-center'>
                            <blockquote class='blockquote'>
                                <p>Ich war noch nie so gut verknüpft.</p>
                            </blockquote>
                            <figcaption class='blockquote-footer'>Liyana Fleming</figcaption>
                        </figure>
                    </div>
                </div>

                <div class='accounts-block p-5'>
                    <div v-for='mailAccount in mailAccounts' v-bind:key='mailAccount.id'>
                        <div class='mail-account' @click='selectAccount(mailAccount)'>
                            <h1>{{ mailAccount.mailAddress }}@mail.sa</h1>
                            <h2 v-if='mailAccount.type === 0'>Privatkonto</h2>
                            <h2 v-if='mailAccount.type === 1'>Gruppenkonto</h2>
                        </div>
                    </div>
                    <div v-if='mailAccounts.length === 0' class='no-accounts-block'>
                        <h2>Keine Konten verfügbar...</h2>
                    </div>
                </div>
                <div class='position-absolute bottom-0 end-0 p-2'>
                    <button class='btn btn-success' type='button' @click='openTab(1)'>
                        Neues Konto erstellen
                    </button>
                </div>
            </div>
        </div>

        <div :hidden='openTabId !== 1'>
            <div class='content-mail p-5'>
                <div class='d-flex justify-content-center'>
                    <h3 class='display-6'>
                        Willkommen bei MailSA<br />
                        <small class='text-muted'> erstellen Sie noch heute Ihr Konto.</small>
                    </h3>
                </div>
                <div class='d-flex justify-content-center p-5'>
                    <figure class='text-center'>
                        <blockquote class='blockquote'>
                            <p>Ich war noch nie so gut verknüpft.</p>
                        </blockquote>
                        <figcaption class='blockquote-footer'>Liyana Fleming</figcaption>
                    </figure>
                </div>

                <div class='d-flex justify-content-center p-5'>
                    <div>
                        <div class='form-group'>
                            <label>Mail Adresse</label>
                            <div class='input-group'>
                                <input v-model='newMailAddress' class='form-control' placeholder='max.mustermann' type='email' @input='validCreateButton' />
                                <span class='input-group-text'>@mail.sa</span>
                            </div>
                            <small class='form-text text-muted'>Wir würden nie Ihre Mail an andere verkaufen.</small>
                        </div>
                        <button :disabled='!isCreateButtonValid' class='btn btn-success w-100' type='button' @click='createNewAccount'>
                            Konto kostenfrei erstellen
                        </button>
                    </div>
                </div>

                <div class='position-absolute bottom-0 end-0 p-2'>
                    <button class='btn btn-secondary mx-2' type='button' @click='openTab(0)'>
                        Zurück
                    </button>
                </div>
            </div>
        </div>

        <div :hidden='openTabId !== 2'>
            <div class='topbar-mail'>Account: {{ currentMailAddress }}@mail.sa</div>

            <div class='content-mail p-4'>
                <div v-if='textPopupOpen || readPopupOpen || deletePopupOpen' class='block-background'></div>

                <div class='col'>
                    <h2 class='grid-title'>
                        <font-awesome-icon icon='inbox' />
                        Posteingang
                    </h2>
                    <button :disabled='!this.canSending' class='btn btn-block btn-success' @click='openTextDialog()'>
                        NEUE MAIL
                    </button>
                    <hr />
                </div>

                <div class='col mb-2'>
                    <div class='input-group'>
                        <input v-model='mailNameSearch' :readonly='!this.canReading' class='form-control' placeholder='Suche nach Absender' type='text' @input='search()' />
                    </div>
                </div>
                <div class='mails-block'>
                    <div v-for='mail in mails' v-bind:key='mail.id'>
                        <div class='list-group-item' @click='readMail(mail)'>
                            <div class='media'>
                                <div class='media-body'>
                                    <div class='media-heading'>
                                        <span class='m-r-10position-absolute top-0 start-0'>{{ mail.senderMailAddress }}@mail.sa</span>
                                        <small class='position-absolute top-0 end-0 p-2 text-muted' style='pointer-events: all'>
                                            <a :hidden='!canDeleting' @click='openDeleteDialog($event, mail)'>
                                                <font-awesome-icon icon='trash' />
                                            </a> {{ getDate(mail.sendetAtJson) }} </small>
                                    </div>
                                    <p class='msg'>{{ mail.title }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div :hidden='!mailPopupOpen' class='popup-mail'>
                    <div class='modal-header bg-light'>
                        <h5 class='modal-title'>{{ mailPopupHeader }}</h5>
                        <button class='btn-close icon-button float-end' type='button' @click='closeMailPopup()'>
                            <font-awesome-icon class='center' icon='times' />
                        </button>
                    </div>

                    <div v-if='isWriting'>
                        <div class='input-group'>
                            <span class='input-group-text'>An:</span>
                            <input v-model='targetMailAddress' class='form-control' maxlength='20' placeholder='max.mustermann' type='email' @input='validSendButton()' />
                            <span class='input-group-text'>@mail.sa</span>
                        </div>
                        <div class='input-group'>
                            <span class='input-group-text'>Betreff:</span>
                            <input v-model='newTitle' class='form-control' maxlength='50' placeholder='Betreff' type='email' @input='validSendButton()' />
                        </div>
                    </div>

                    <custom-editor ref='customEditor' />

                    <div v-if='isWriting'>
                        <button :disabled='!isSendButtonValid' class='btn btn-success w-25 fa-pull-right' type='button' @click='sendMail()'>
                            Mail senden
                        </button>
                    </div>
                </div>

                <div class='position-absolute bottom-0 end-0 p-2'>
                    <button class='btn btn-secondary' type='button' @click='logout()'>
                        Abmelden
                    </button>
                </div>

                <div :hidden='!deletePopupOpen' class='popup-mail w-25'>
                    <div class='modal-header bg-light'>
                        <h5 class='modal-title'>Mail löschen</h5>
                        <button class='btn-close-white icon-button float-end' type='button' @click='closeDeletePopup()'>
                            <font-awesome-icon class='center' icon='times' />
                        </button>
                    </div>

                    <div class='modal-body'>
                        Möchtest du diese Mail wirklich für immer löschen?
                    </div>
                    <div class='modal-footer justify-content-evenly row'>
                        <button class='btn btn-secondary col-5' type='button' @click='closeDeletePopup()'>
                            Nein
                        </button>
                        <button class='btn btn-primary col-5' type='button' @click='deleteMail()'>
                            Ja
                        </button>
                    </div>
                </div>

                <div class='position-absolute bottom-0 end-0 p-2'>
                    <button :hidden='!isOwner' class='btn btn-secondary mx-3' type='button' @click='openTab(3)'>
                        Einstellungen
                    </button>
                    <button class='btn btn-secondary' type='button' @click='logout()'>
                        Abmelden
                    </button>
                </div>
            </div>
        </div>

        <div :hidden='openTabId !== 3'>
            <div class='topbar-mail'>
                Einstellungen für Account: {{ currentMailAddress }}@mail.sa
            </div>

            <div class='content-mail p-4'>
                <div class='character-access-block'>
                    <div v-for='characterAccess in characterAccesses' v-bind:key='characterAccess.name'>
                        <div class='list-group-item'>
                            <div class='media'>
                                <div class='media-body'>
                                    <div class='media-heading'>
                                        <h5>{{ characterAccess.name }}</h5>
                                        <small class='position-absolute top-0 end-0 p-2 text-muted'>
                                            <a :hidden='characterAccess.characterId === characterId' @click='removePerson(characterAccess.characterId)'>
                                                <font-awesome-icon icon='trash' />
                                            </a> </small>
                                        <span :hidden='characterAccess.characterId !== characterId' class='text-muted'>Du bist der Besitzer dieses Kontos</span>
                                        <span :hidden='characterAccess.characterId === characterId'>
                      <input :checked='checkCanRead(characterAccess)' class='form-check-input' type='checkbox' @change='
                          toggleCanRead($event, characterAccess.characterId)
                        ' />
                      <label class='form-check-label px-2'>
                        Kann Mails lesen
                      </label>
                    </span> <span :hidden='characterAccess.characterId === characterId' class='p-2'>
                      <input :checked='checkCanSend(characterAccess)' class='form-check-input' type='checkbox' @change='
                          toggleCanSend($event, characterAccess.characterId)
                        ' />
                      <label class='form-check-label px-2'>
                        Kann Mails schreiben
                      </label>
                    </span> <span :hidden='characterAccess.characterId === characterId' class='p-2'>
                      <input :checked='checkCanDelete(characterAccess)' class='form-check-input' type='checkbox' @change='
                          toggleCanDelete($event, characterAccess.characterId)
                        ' />
                      <label class='form-check-label px-2'>
                        Kann Mails löschen
                      </label>
                    </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div v-if='characterAccesses.length === 0' class='center'>
                        <hr />
                        <h2>Keine Zugriffsrechte vergeben...</h2>
                        <hr />
                    </div>
                </div>

                <input v-model='characterName' class='form-control' placeholder='Max Mustermann' type='text' />
                <button :disabled="characterName === ''" class='btn btn-secondary w-100 mt-3' type='button' @click='addPerson()'>
                    Person hinzufügen
                </button>

                <div class='position-absolute bottom-0 start-0 p-2'>
                    <button class='btn btn-secondary' type='button' @click='openTab(2)'>
                        Zurück
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang='ts'>
import {Options, Vue} from "vue-class-component";
import {Ref} from "vue-property-decorator";
import alt from "@/scripts/services/alt.service";
import mailing from "@/scripts/services/mailing.service";
import character from "@/scripts/services/character.service";
import groupService from "@/scripts/services/group.service";
import SpawnSelector from "@/components/CharCreator/SpawnSelector.vue";
import CustomEditor from "@/components/General/CustomEditor.vue";
import {MailAccountInterface} from "@/scripts/interfaces/mail/mail-account.interface";
import {MailInterface} from "@/scripts/interfaces/mail/mail.interface";
import {MailAccountCharacterAccessInterface} from "@/scripts/interfaces/mail/mail-account-character-access.interface";
import {MailingPermission} from "@/scripts/enums/mailing.permission";
import {GroupPermission} from "@/scripts/enums/group.permission";

@Options({
    components: {CustomEditor, SpawnSelector},
})
export default class MailApp extends Vue {
    @Ref() private readonly customEditor!: CustomEditor;

    private hasAccount = false;
    private newMailAddress = "";
    private isCreateButtonValid = false;
    private isSendButtonValid = false;
    private isOwner = false;
    private openTabId = 0;
    private mailAccounts: MailAccountInterface[] = [];

    private currentAccount?: MailAccountInterface;
    private mails: MailInterface[] = [];
    private cachedMails: MailInterface[] = [];
    private currentMailAddress = "";
    private mailNameSearch = "";
    private targetMailAddress = "";
    private newTitle = "";
    private backupTitle = "";
    private backupContent = "";
    private mailPopupOpen = false;
    private isWriting = false;
    private mailPopupHeader = "";
    private deletePopupOpen = false;
    private currentMailIdToDelete: undefined | number = undefined;
    private characterAccesses: MailAccountCharacterAccessInterface[] = [];
    private characterName = "";
    private characterId?: number | undefined;

    private canSending = false;
    private canReading = false;
    private canDeleting = false;

    private errorMessage = "";
    private infoMessage = "";

    public mounted(): void {
        mailing
            .getInstance()
            .onChange.on((mailAccounts: MailAccountInterface[]) => this.update(mailAccounts));
        this.update(mailing.getInstance().getMailAccounts);
        this.characterId = character.getInstance().getCharacterId;

        this.validCreateButton();

        alt.on("mail:senderror", (args: any[]) => this.showErrorMessage(args[0]));
        alt.on("mail:sendinfo", (args: any[]) => this.showInfoMessage(args[0]));
        alt.on("mail:sendbackup", (args: any[]) => this.setBackup(args[0], args[1]));
    }

    public unmounted(): void {
        mailing
            .getInstance()
            .onChange.off((mailAccounts: MailAccountInterface[]) => this.update(mailAccounts));

        alt.off("mail:senderror");
        alt.off("mail:sendinfo");
        alt.off("mail:sendbackup");
    }

    public reset(): void {
        this.openTab(0);
    }

    public open(): void {
        if (this.currentAccount !== undefined) {
            this.openTab(2);
            this.openAccount(this.currentAccount);
            return;
        }
    }

    private showErrorMessage(error: string): void {
        this.errorMessage = error;
        this.infoMessage = "";

        setTimeout(() => {
            this.errorMessage = "";
        }, 3000);
    }

    private showInfoMessage(info: string): void {
        this.infoMessage = info;
        this.errorMessage = "";

        setTimeout(() => {
            this.infoMessage = "";
        }, 3000);
    }

    private setBackup(backupTitle: string, backupContent: string) {
        this.backupTitle = backupTitle;
        this.backupContent = backupContent;
    }

    private update(mailAccounts: MailAccountInterface[]): void {
        this.mailAccounts = mailAccounts;
        this.hasAccount = mailAccounts.length !== 0;

        if (this.currentMailAddress !== "") {
            const currentMailAccount = mailAccounts.find((m) => m.mailAddress == this.currentMailAddress);
            if (currentMailAccount !== undefined) {
                this.openAccount(currentMailAccount);
            } else {
                this.logout();
            }
        }
    }

    private selectAccount(mailAccount: MailAccountInterface): void {
        this.openTab(2);
        this.openAccount(mailAccount);
    }

    private openAccount(mailAccount: MailAccountInterface): void {
        this.canSending = false;
        this.canReading = false;
        this.canDeleting = false;
        this.isOwner = false;
        this.characterAccesses = mailAccount.characterAccesses;

        this.currentAccount = mailAccount;
        this.currentMailAddress = mailAccount.mailAddress;

        const characterAccess = mailAccount.characterAccesses.find(
            (ca) => ca.characterId == character.getInstance().getCharacterId);
        if (characterAccess !== undefined) {
            this.isOwner = characterAccess.owner;
            this.canSending = (characterAccess.permission & MailingPermission.SENDING) === MailingPermission.SENDING || characterAccess.owner;
            this.canReading = (characterAccess.permission & MailingPermission.READING) === MailingPermission.READING || characterAccess.owner;
            this.canDeleting = (characterAccess.permission & MailingPermission.DELETING) === MailingPermission.DELETING || characterAccess.owner;
        }

        if (mailAccount.type === 1) {
            const group = groupService
                .getInstance()
                .AllGroups?.find((g) => mailAccount.groupAccesses.some((ga) => ga.groupId === g.id));

            if (group !== undefined) {
                const member = group.members.find((m) => m.characterId === character.getInstance().getCharacterId);
                if (member !== undefined) {
                    if (member.owner) {
                        this.canSending = true;
                        this.canReading = true;
                        this.canDeleting = true;
                        this.isOwner = true;
                    } else {
                        const rank = group.ranks.find((r) => r.level === member.level);
                        if (rank !== undefined) {
                            this.canSending = (rank.groupPermission & GroupPermission.MAILING_SENDING) === GroupPermission.MAILING_SENDING;
                            this.canReading = (rank.groupPermission & GroupPermission.MAILING_READING) === GroupPermission.MAILING_READING;
                            this.canDeleting = (rank.groupPermission & GroupPermission.MAILING_DELETING) === GroupPermission.MAILING_DELETING;
                        }
                    }
                }
            }
        }

        if (this.canReading) {
            this.mails = mailAccount.mails
                .filter((m) => !m.isAuthor)
                .sort((a: MailInterface, b: MailInterface) => {
                    return this.getTime(b.sendetAtJson) - this.getTime(a.sendetAtJson);
                });

            this.cachedMails = this.mails;
        }
    }

    private getTime(dateJson: string) {
        const date = new Date(JSON.parse(dateJson));
        return date !== null ? date.getTime() : 0;
    }

    private openTextDialog(): void {
        this.targetMailAddress = "";

        if (this.backupTitle === "") {
            this.newTitle = "";
        } else {
            this.newTitle = this.backupTitle;
        }

        if (this.backupContent === "") {
            this.customEditor.setContent("\n");
        } else {
            this.customEditor.setContent(this.backupContent);
        }

        this.mailPopupOpen = true;
        this.isWriting = true;
        this.customEditor.showToolbar(true);
        this.mailPopupHeader = "Mail schreiben";
        this.validSendButton();
    }

    private openDeleteDialog(event: Event, mail: MailInterface) {
        event.stopPropagation();

        this.deletePopupOpen = true;
        this.currentMailIdToDelete = mail.id;
    }

    private closeMailPopup(): void {
        this.mailPopupOpen = false;
    }

    private closeDeletePopup(): void {
        this.deletePopupOpen = false;
        this.currentMailIdToDelete = undefined;
    }

    private logout(): void {
        this.currentAccount = undefined;

        this.currentMailAddress = "";

        this.openTab(0);
    }

    private search(): void {
        if (this.mailNameSearch === "") {
            this.mails = this.cachedMails;
            return;
        }

        this.mails = this.cachedMails.filter((p) => p.senderMailAddress
            .toLowerCase()
            .includes(this.mailNameSearch.toLowerCase()));
    }

    private readMail(mail: MailInterface): void {
        this.customEditor.showToolbar(false);
        this.customEditor.setContent(mail.context);
        this.mailPopupOpen = true;
        this.isWriting = false;
        this.mailPopupHeader = "Mail lesen";
    }

    private deleteMail(): void {
        if (this.currentMailIdToDelete === undefined) {
            return;
        }

        alt.emitServer("mailing:deletemail", this.currentMailAddress, this.currentMailIdToDelete);
        this.closeDeletePopup();
    }

    private sendMail(): void {
        this.validSendButton();
        if (!this.isSendButtonValid) {
            return;
        }

        alt.emitServer("mailing:sendmail", this.currentMailAddress, this.targetMailAddress, this.newTitle,
            this.customEditor.getContent);

        this.closeMailPopup();
        this.setBackup("", "");
    }

    private addPerson(): void {
        if (this.characterName === "") {
            return;
        }

        alt.emitServer("mailing:addcharacteraccess", this.currentAccount?.mailAddress, this.characterName);
        this.characterName = "";
    }

    private removePerson(characterId: number): void {
        alt.emitServer("mailing:removecharacteraccess", this.currentAccount?.mailAddress, characterId);
    }

    private openTab(id: number): void {
        this.openTabId = id;
    }

    private createNewAccount(): void {
        if (this.newMailAddress === "") {
            return;
        }

        alt.emitServer("mailing:createaccount", this.newMailAddress);
        this.newMailAddress = "";
        this.openTab(0);
    }

    private validCreateButton(): void {
        this.isCreateButtonValid = /^(?=.{8,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9À-ž._äöüÄÖÜ]+(?<![_.])$/.test(
            this.newMailAddress);
    }

    private validSendButton(): void {
        this.isSendButtonValid = /^(?=.{8,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9À-ž._äöüÄÖÜ]+(?<![_.])$/.test(
            this.targetMailAddress) || this.newTitle != "";
    }

    private getDate(jsonDate: string): string {
        const date = new Date(JSON.parse(jsonDate));
        return date.toLocaleDateString("de-DE", {
            weekday: "long", hour: "numeric", minute: "numeric", month: "long", year: "numeric", day: "numeric",
        });
    }

    private toggleCanRead(event: any, characterId: number): void {
        const state = event.currentTarget.checked;
        if (state) {
            alt.emitServer("mailing:addpermission", this.currentAccount?.mailAddress, characterId,
                MailingPermission.READING);
        } else {
            alt.emitServer("mailing:removepermission", this.currentAccount?.mailAddress, characterId,
                MailingPermission.READING);
        }
    }

    private toggleCanSend(event: any, characterId: number): void {
        const state = event.currentTarget.checked;
        if (state) {
            alt.emitServer("mailing:addpermission", this.currentAccount?.mailAddress, characterId,
                MailingPermission.SENDING);
        } else {
            alt.emitServer("mailing:removepermission", this.currentAccount?.mailAddress, characterId,
                MailingPermission.SENDING);
        }
    }

    private toggleCanDelete(event: any, characterId: number): void {
        const state = event.currentTarget.checked;
        if (state) {
            alt.emitServer("mailing:addpermission", this.currentAccount?.mailAddress, characterId,
                MailingPermission.DELETING);
        } else {
            alt.emitServer("mailing:removepermission", this.currentAccount?.mailAddress, characterId,
                MailingPermission.DELETING);
        }
    }

    private checkCanRead(characterAccess: MailAccountCharacterAccessInterface): boolean {
        return ((characterAccess.permission & MailingPermission.READING) === MailingPermission.READING);
    }

    private checkCanSend(characterAccess: MailAccountCharacterAccessInterface): boolean {
        return ((characterAccess.permission & MailingPermission.SENDING) === MailingPermission.SENDING);
    }

    private checkCanDelete(characterAccess: MailAccountCharacterAccessInterface): boolean {
        return ((characterAccess.permission & MailingPermission.DELETING) === MailingPermission.DELETING);
    }
}
</script>

<style lang='scss' scoped>
.mail-app {
    width: 100%;
    height: 100%;
    background-color: rgb(223, 230, 233);
}

.block-background {
    top: 0;
    left: 0;
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 999;
    background-color: rgba(0, 0, 0, 0.75);
}

.topbar-mail {
    padding: 3% 1% 0.5% 0.5%;
    width: 100%;
    background-color: rgb(178, 190, 195);
}

.content-mail {
    background-color: #dfe6e9;
}

.popup-mail {
    position: absolute;
    width: 90%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    pointer-events: all;
    border-radius: 0.3vw;
    z-index: 9999;
    background-color: #fff;
    overflow: hidden;
}

.accounts-block {
    overflow-y: auto;
    height: 30vh;
}

.mails-block {
    overflow-y: auto;
    height: 20vw;
}

.character-access-block {
    overflow-y: auto;
    height: 20vw;
}

.no-accounts-block h2 {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%);
    color: rgba(59, 59, 59, 0.7);
    font-size: 0.9vw;
}

.mail-account {
    background-color: rgb(37, 37, 37);
    padding: 0.8vw;
    margin: 0.3vw 10vw;
}

.mail-account h1 {
    color: white;
    font-size: 0.6vw;
    margin: unset;
}

.mail-account h2 {
    padding-top: 0.2vw;
    color: white;
    font-size: 0.5vw;
    margin: unset;
}

.mails-block .list-group-item {
    border: 0;
    margin-bottom: 1px;
    cursor: pointer;
}

.mails-block .list-group-item:hover {
    background: #eceeef;
}

.character-access-block {
    overflow: auto;
    margin: auto;
    width: 100%;
    height: 19vh;
}

.error-message {
    position: absolute;
    left: 2%;
    bottom: 2%;
    border-radius: 0.3vw;
    background-color: rgba(217, 46, 66, 0.87);
    color: white;
    padding: 0.5vw;
    z-index: 9000;
}

.info-message {
    position: absolute;
    left: 2%;
    bottom: 2%;
    border-radius: 0.3vw;
    background-color: #2c9ad5dd;
    color: white;
    padding: 0.5vw;
    z-index: 9000;
}
</style>
