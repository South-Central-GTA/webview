<template>
    <div class='team-menu-mails-log'>
        <h2>Mails Log</h2>
        <input @input='search()' v-model='mailSearch' type='text' class='form-control-dark mb-2' placeholder='Suche nach der E-Mail' />
        <div class='table-holder'>
            <table class='table table-striped table-hover'>
                <thead>
                <tr>
                    <th>Mail Addresse</th>
                    <th>Title</th>
                    <th>Gesendet</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for='mail in mails' v-bind:key='mail.id' class='entry' @click='openDetails(mail)'>
                    <td>{{ mail.senderMailAddress }}</td>
                    <td>{{ mail.title }}</td>
                    <td>{{ getDate(mail.sendetAtJson) }}</td>
                </tr>
                </tbody>
            </table>
        </div>

        <div class='popup' :hidden='!isPopupOpen'>
            <div class='modal-header transparent-card'>
                <h5 class='modal-title'>Mail lesen</h5>
                <button type='button' class='btn-close-white icon-button float-end' @click='closeDetails()'>
                    <font-awesome-icon class='center' icon='times' />
                </button>
            </div>

            <div class='mail-context' ref='mailContextElement'></div>
        </div>
    </div>
</template>

<script lang='ts'>
import alt from "@/scripts/services/alt.service";
import {Vue} from "vue-class-component";
import {Ref} from "vue-property-decorator";
import {MailInterface} from "@/scripts/interfaces/mail/mail.interface";

export default class TeamMenuMailsLog extends Vue {
    @Ref() private readonly mailContextElement!: HTMLDivElement;

    private mails: MailInterface[] = [];
    private cachedMails: MailInterface[] = [];
    private mailSearch = "";
    private isPopupOpen = false;

    public mounted(): void {
        alt.on("mailslog:setup", (args: any[]) => this.setup(args[0]));
    }

    public unmounted(): void {
        alt.off("mailslog:setup");
    }

    private setup(mails: MailInterface[]): void {
        this.mails = mails;
        this.cachedMails = this.mails;
    }

    private search(): void {
        if (this.mailSearch === "") {
            this.mails = this.cachedMails;
            return;
        }

        this.mails = this.cachedMails;
        this.mails = this.mails.filter((m) => m.senderMailAddress?.includes(this.mailSearch.toLowerCase()));
    }

    private openDetails(mail: MailInterface): void {
        this.mailContextElement.innerHTML = mail.context;
        this.isPopupOpen = true;
    }

    private closeDetails(): void {
        this.isPopupOpen = false;
    }

    private getDate(dateJson: string): string {
        const date = new Date(JSON.parse(dateJson));
        return date.toLocaleDateString("de-DE", {
            hour: "numeric", minute: "numeric", year: "numeric", month: "numeric", day: "numeric",
        });
    }
}
</script>

<style scoped>
.table-holder {
    height: 26.5vw;
    overflow-x: hidden;
    overflow-y: auto;
}

.popup {
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

.mail-context {
    padding: 2em;
    overflow-y: auto;
    height: 50vh;
}

.table,
.entry {
    color: white !important;
}
</style>
