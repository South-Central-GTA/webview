<template>
    <div class='leave-group-page'>
        <button class='icon-button text-white' @click='back()'>
            <font-awesome-icon class='mx-2' icon='chevron-left' />
            <span>Gruppe verlassen</span>
        </button>

        <p class='card-text'>Hier kannst du mit deinem Charakter eigenständig die Gruppe verlassen, bedenke jedoch das du dies dennoch ausspielen musst. Einige Gruppierungen kann man IC nicht so einfach verlassen.</p>

        <p class='card-text'>Bedenke das dein Charakter
            <strong>sofort</strong> die Gruppe verlässt wenn du den Knopf drückst.</p>

        <input ref='securityQuestionLeaveInput' :placeholder="'Gebe den Name der Gruppe an. (' + groupName + ')'" class='form-control' type='text' @input='validateLeaveButton()'>

        <button :disabled='!leaveButtonEnabled' class='btn btn-danger w-100 mt-3' type='button' @click='leave()'>
            Ja mein Charakter soll die Gruppe verlassen
        </button>
    </div>
</template>

<script lang='ts'>

import {Vue} from "vue-class-component";
import {Ref} from "vue-property-decorator";

export default class LeaveGroupPage extends Vue {
    @Ref() private readonly securityQuestionLeaveInput!: HTMLInputElement;

    private leaveButtonEnabled = false;

    private groupName = "";

    public setup(groupName: string): void {
        this.groupName = groupName

        this.validateLeaveButton();
    }

    private validateLeaveButton(): void {
        this.leaveButtonEnabled = this.groupName == this.securityQuestionLeaveInput.value;
    }

    private leave(): void {
        this.securityQuestionLeaveInput.value = "";
        this.$emit("leave");
    }

    private back(): void {
        this.securityQuestionLeaveInput.value = "";
        this.$emit("back");
    }
}
</script>