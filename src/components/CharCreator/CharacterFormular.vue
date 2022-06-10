<template>
    <div class='character-formular'>
        <h4>Eckdaten</h4>
        <div class='row g-3'>
            <div class='col-md-6'>
                <label class='form-label'>Vorname</label>
                <input v-model='form.profile.firstName' class='form-control-dark' maxlength='16' placeholder='Maxim' type='text' v-bind:class="{
            'is-invalid':
              firstNameValidation !== 'OKAY' && firstNameValidation !== '',
            'is-valid': firstNameValidation === 'OKAY',
          }" @input='send()' />
                <div v-if="firstNameValidation === 'EMPTY'" class='invalid-feedback'>
                    Bitte definiere einen Vornamen.
                </div>
                <div v-if="firstNameValidation === 'SPECIAL_CHARACTERS'" class='invalid-feedback'>
                    Diese Art von Sonderzeichen ist nicht erlaubt.
                </div>
                <div v-if="firstNameValidation === 'TO_SHORT'" class='invalid-feedback'>
                    Der Name ist zu kurz.
                </div>
            </div>
            <div class='col-md-6'>
                <label class='form-label'>Nachname</label>
                <input v-model='form.profile.lastName' class='form-control-dark' maxlength='16' placeholder='Mustermann' type='text' v-bind:class="{
            'is-invalid':
              lastNameValidation !== 'OKAY' && lastNameValidation !== '',
            'is-valid': lastNameValidation === 'OKAY',
          }" @input='send()' />
                <div v-if="lastNameValidation === 'EMPTY'" class='invalid-feedback'>
                    Bitte definiere ein Nachnamen.
                </div>
                <div v-if="lastNameValidation === 'SPECIAL_CHARACTERS'" class='invalid-feedback'>
                    Diese Art von Sonderzeichen ist nicht erlaubt.
                </div>
                <div v-if="lastNameValidation === 'TO_SHORT'" class='invalid-feedback'>
                    Der Name ist zu kurz.
                </div>
            </div>
            <div class='col-10'>
                <label class='form-label'>Herkunft</label>
                <input v-model='form.profile.origin' class='form-control-dark' maxlength='32' placeholder='San Andreas, Los Santos' type='text' v-bind:class="{
            'is-invalid':
              originValidation !== 'OKAY' && originValidation !== '',
            'is-valid': originValidation === 'OKAY',
          }" @input='send()' />

                <div v-if="originValidation === 'EMPTY'" class='invalid-feedback'>
                    Bitte definiere die Herkunft.
                </div>

                <div v-if="originValidation === 'SPECIAL_CHARACTERS'" class='invalid-feedback'>
                    Diese Art von Sonderzeichen ist nicht erlaubt.
                </div>
            </div>
            <div class='col'>
                <label class='form-label'>Alter</label>
                <input v-model='age' class='form-control-dark' placeholder='21' type='number' v-bind:class="{
            'is-invalid': ageValidation !== 'OKAY' && ageValidation !== '',
            'is-valid': ageValidation === 'OKAY',
          }" @input='send()' />
                <div v-if="ageValidation === 'EMPTY'" class='invalid-feedback'>
                    Bitte definiere das Alter.
                </div>
                <div v-if="ageValidation === 'TO_YOUNG'" class='invalid-feedback'>
                    Es ist nicht erlaubt Charaktere welche jünger als 16 Jahre sind, auszuspielen.
                </div>
                <div v-if="ageValidation === 'TO_OLD'" class='invalid-feedback'>
                    Es ist nicht erlaubt Charaktere welche älter als 99 Jahre sind, auszuspielen.
                </div>
            </div>
            <div class='col-9'>
                <label class='form-label'>Körperbau</label>
                <input v-model='form.profile.physique' class='form-control-dark' maxlength='256' placeholder='Schlaksig, sportlich, dick, dünn, durchschnittlich etc.' type='text' v-bind:class="{
            'is-invalid':
              physiqueValidation !== 'OKAY' && physiqueValidation !== '',
            'is-valid': physiqueValidation === 'OKAY',
          }" @input='send()' />
                <div v-if="physiqueValidation === 'EMPTY'" class='invalid-feedback'>
                    Bitte gebe definiere den Körperbau.
                </div>
                <div v-if="physiqueValidation === 'SPECIAL_CHARACTERS'" class='invalid-feedback'>
                    Diese Art von Sonderzeichen ist nicht erlaubt.
                </div>
            </div>
            <div class='col'>
                <label class='form-label'>Körpergröße</label>
                <div class='input-group'>
                    <input v-model='bodySize' class='form-control-dark' maxlength='3' oninput='if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);' placeholder='180' type='number' v-bind:class="{
              'is-invalid':
                bodySizeValidation !== 'OKAY' && bodySizeValidation !== '',
              'is-valid': bodySizeValidation === 'OKAY',
            }" @input='send()' /> <span class='input-group-text-dark'>cm</span>
                    <div v-if="bodySizeValidation === 'EMPTY'" class='invalid-feedback'>
                        Bitte definiere die Körpergröße.
                    </div>
                    <div v-if="bodySizeValidation === 'TO_SMALL'" class='invalid-feedback'>
                        Bitte gebe eine größere Körpergröße an. (min. 120cm)
                    </div>
                    <div v-if="bodySizeValidation === 'TO_TALL'" class='invalid-feedback'>
                        Bitte gebe eine kleinere Körpergröße an. (max. 220cm)
                    </div>
                </div>
            </div>
            <div class='col-12'>
                <label class='form-label'>Vorgeschichte</label>
                <textarea v-model='form.profile.story' class='form-control-dark' maxlength='2048' rows='9' style='resize: none' v-bind:class="{
            'is-invalid': storyValidation !== 'OKAY' && storyValidation !== '',
            'is-valid': storyValidation === 'OKAY',
          }" @input='send()'>
></textarea>
                <div v-if="storyValidation === 'EMPTY'" class='invalid-feedback'>
                    Bitte definiere die Vorgeschichte.
                </div>
                <div v-if="storyValidation === 'TO_SHORT'" class='invalid-feedback'>
                    Bitte nutze mindestens ({{ storyWordCount }}/150) Wörter um deine Vorgeschichte zu definieren.
                </div>
            </div>
            <div class='col-12'>
                <label class='form-label'>Wieviel Geld hat dein Charakter?</label>
                <div class='row g-3'>
                    <div class='col-4'>
                        <button class='btn btn-primary' style='width: 100%' type='button' @click='onLessMoneyClicked()'>
                            <font-awesome-icon icon='arrow-down' />
                        </button>
                    </div>
                    <div class='col-4'>
                        <div class='input-group'>
                            <span class='input-group-text-dark'>$</span>
                            <input v-model='form.startMoney' class='form-control-dark' readonly type='number' @input='send()' />
                        </div>
                    </div>
                    <div class='col-4'>
                        <button class='btn btn-primary' style='width: 100%' type='button' @click='onMoreMoneyClicked()'>
                            <font-awesome-icon icon='arrow-up' />
                        </button>
                    </div>
                </div>
            </div>
            <div class='col-12'>
                <label class='form-label'>Was besitzt dein Charakter?</label>
            </div>
            <div class='col-6'>
                <div class='form-check'>
                    <input v-model='this.form.hasPhone' class='form-check-input' type='checkbox' @change='send()' />
                    <label class='form-check-label'> Hat dein Charakter ein Handy? </label>
                </div>
                <div class='form-check'>
                    <input v-model='this.form.isRegistered' class='form-check-input' type='checkbox' @change='send()' />
                    <label class='form-check-label'> Ist dein Charakter im Registration Office gemeldet? </label>
                </div>
            </div>
            <div class='col-6'>
                <div class='form-check'>
                    <input v-model='this.form.hasDrivingLicense' :disabled='!this.form.isRegistered || this.form.profile.age < 21' class='form-check-input' type='checkbox' @change='send()' />
                    <label class='form-check-label'> Hat dein Charakter ein Führerschein? </label>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang='ts'>
import {countWords} from "@/scripts/helpers/helpers";
import {Vue} from "vue-class-component";
import {CharacterFormInterface} from "@/scripts/interfaces/character/character-form.interface";
import {CharProfileInterface} from "@/scripts/interfaces/character/charprofile.interface";

export default class CharacterFormular extends Vue {
    public firstNameValidation = "";
    public lastNameValidation = "";
    public originValidation = "";
    public storyValidation = "";
    public ageValidation = "";
    public bodySizeValidation = "";
    public physiqueValidation = "";

    private form: CharacterFormInterface = {
        profile: {
            firstName: "", lastName: "", origin: "", story: "", age: 0, bodySize: 0, physique: "",
        }, startMoney: 0, hasPhone: false, hasDrivingLicense: false, isRegistered: false,
    };

    private age = "";
    private bodySize = "";

    private storyWordCount = 0;

    public setup(profile: CharProfileInterface): void {
        this.form.profile = profile;
    }

    public resetMoney(): void {
        this.form.startMoney = 0;
    }

    private onLessMoneyClicked(): void {
        if (this.form.startMoney <= 0) {
            return;
        }

        this.form.startMoney -= 500;
        this.send();
    }

    private onMoreMoneyClicked(): void {
        if (this.form.startMoney >= 20000) {
            return;
        }

        this.form.startMoney += 500;
        this.send();
    }

    private send(): void {
        if (this.age !== "") {
            this.form.profile.age = Number.parseInt(this.age);
        } else {
            this.age = "";
            this.form.profile.age = 0;
        }

        if (this.bodySize !== "") {
            this.form.profile.bodySize = Number.parseInt(this.bodySize);
        } else {
            this.bodySize = "";
            this.form.profile.bodySize = 0;
        }

        if (!this.form.isRegistered || this.form.profile.age < 21) {
            this.form.hasDrivingLicense = false;
        }

        this.storyWordCount = countWords(this.form.profile.story);

        this.form.profile.firstName = this.form.profile.firstName.trim();
        this.form.profile.lastName = this.form.profile.lastName.trim();

        this.$emit("update-form", this.form);
    }
}
</script>

<style scoped>
.character-formular {
    padding: 1vw;
    height: 100%;
}
</style>
