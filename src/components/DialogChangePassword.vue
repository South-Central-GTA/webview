<template>
    <div class="dialog-change-password">
        <div class="modal-dialog">
            <div class="modal-content sc-card text-white">
                <div class="modal-header">
                    <h5 class="modal-title">Passwort wechseln</h5>
                    <button type="button" class="icon-button float-end p-3" @click="closeButtonClicked()">
                        <font-awesome-icon class="center text-white" icon="times"/>
                    </button>
                </div>
                <div class="modal-body">
                    <input v-model="oldPassword" type="password" class="form-control-dark" placeholder="Dein altes Passwort"
                           v-bind:class="{ 'is-invalid': oldPasswordValidation === 'EMPTY' || oldPasswordValidation === 'NOT_VALID' || oldPasswordValidation === 'WRONG', 'is-valid': oldPasswordValidation === 'OKAY' }">
                    <div v-if="oldPasswordValidation === 'EMPTY'" class="invalid-feedback">
                        Bitte gebe dein aktuelles Passwort an.
                    </div>
                    <div v-if="oldPasswordValidation === 'WRONG'" class="invalid-feedback">
                        Dein angegebenes ales Passwort ist falsch.
                    </div>

                    <input v-model="newPassword" type="password" class="form-control-dark mt-4"
                           placeholder="Dein neues Passwort"
                           v-bind:class="{ 'is-invalid': passwordValidation === 'EMPTY' || passwordValidation === 'NOT_VALID', 'is-valid': passwordValidation === 'OKAY' }">
                    <div v-if="passwordValidation === 'EMPTY'" class="invalid-feedback">
                        Bitte gebe ein Passwort an.
                    </div>
                    <div v-if="passwordValidation === 'NOT_VALID'" class="invalid-feedback">
                        Dein Passwort muss mindestens 8 Zeichen lang sein, mindestens einen Großbuchstaben, einen
                        Kleinbuchstaben, ein Sonderzeichen sowie eine Nummer haben.
                    </div>
                    <div v-if="passwordValidation === 'TO_SHORT'" class="invalid-feedback">
                        Dein Passwort ist zu kurz.
                    </div>

                    <input v-model="newSecurePassword" type="password" class="form-control-dark mt-2"
                           placeholder="Bitte gib das selbe Passwort erneut an"
                           v-bind:class="{ 'is-invalid': securePasswordValidation === 'NOT_EQUAL', 'is-valid': securePasswordValidation === 'OKAY' }">
                    <div v-if="securePasswordValidation === 'NOT_EQUAL'" class="invalid-feedback">
                        Die Passwörter sind nicht gleich.
                    </div>

                    <p class="text-white-50 pt-4">Vergewissere dich das du das Passwort korrekt geschrieben hast.</p>
                </div>

                <div class="modal-footer">
                    <button type="button" class="btn btn-primary w-100" :disabled="tryChangePassword" @click="send()">
                        <span v-if="!tryChangePassword">Passwort ändern</span>
                        <LoadingCircle v-if="tryChangePassword" style="bottom: 2.3vw;"/>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import alt from '@/scripts/services/alt.service';
import {Options, Vue} from "vue-class-component";
import LoadingCircle from "@/components/LoadingCircle.vue";

@Options({
    components: {
        LoadingCircle
    }
})
export default class DialogChangePassword extends Vue {
    public oldPasswordValidation = ""
    public passwordValidation = ""
    public securePasswordValidation = ""

    private tryChangePassword = false;
    private oldPassword = "";
    private newPassword = "";
    private newSecurePassword = "";

    public mounted(): void {
        alt.on("passwordchangedialog:wrongoldpassword", () => this.wrongOldPassword());
        alt.on("passwordchangedialog:changesuccessfully", () => this.successfullyChanged());
    }

    public unmounted(): void {
        alt.off("passwordchangedialog:wrongoldpassword");
        alt.off("passwordchangedialog:changesuccessfully");
    }

    private wrongOldPassword(): void {
        this.oldPasswordValidation = "WRONG";
        this.tryChangePassword = false;
    }

    private successfullyChanged(): void {
        this.closeButtonClicked();
    }

    private reset(): void {
        this.tryChangePassword = false;
        this.oldPassword = "";
        this.newPassword = "";
        this.newSecurePassword = "";
        this.passwordValidation = "";
        this.oldPasswordValidation = "";
        this.securePasswordValidation = "";
    }

    private closeButtonClicked(): void {
        this.reset();
        this.$emit("close");
    }

    private send(): void {
        if (this.tryChangePassword) {
            return;
        }

        if (this.oldPassword === "") {
            this.oldPasswordValidation = "EMPTY";
        }

        if (this.newPassword === "") {
            this.passwordValidation = "EMPTY";
            return;
        }
        if (!this.newPassword.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm)) {
            this.passwordValidation = "NOT_VALID";
            return;
        } else {
            this.passwordValidation = "OKAY";
        }

        if (this.newPassword !== this.newSecurePassword) {
            this.securePasswordValidation = "NOT_EQUAL";
            return;
        } else {
            this.securePasswordValidation = "OKAY";
        }

        this.tryChangePassword = true;
        alt.emitServer("auth:changepassword", this.oldPassword, this.newPassword);
    }
}
</script>

<style scoped>
.dialog-change-password {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 999;
}
</style>
