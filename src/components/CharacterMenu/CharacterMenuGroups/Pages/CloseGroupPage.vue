<template>
    <div class="close-group-page">
        <button class="icon-button text-white" @click="back()">
            <font-awesome-icon class="mx-2" icon="chevron-left"/>
            <span>Gruppe löschen</span>
        </button>

        <p class="card-text">
            Hier kannst du die Gruppe löschen, bedenke jedoch das du dies dennoch
            ausspielen musst. Einige Gruppierungen kann man IC nicht so einfach
            löschen.
        </p>

        <p class="card-text">
            Bedenke das die Gruppe <strong>sofort</strong> gelöscht wird. Der
            Hauptsitz und pachtbare Unternehmenssitze werden verkauft, Lizenzen sowie
            der Name gelöscht. Alle IC Mitglieder sofort rausgeschmissen und jegliche
            Gruppenspezifische Information gelöscht.
        </p>

        <input
            type="text"
            class="form-control"
            ref="securityQuestionInput"
            @input="validateButton()"
            @focus="onFocus(true)"
            @blur="onFocus(false)"
            :placeholder="'Gebe den Name der Gruppe an. (' + groupName + ')'"
        />

        <button
            type="button"
            class="btn btn-danger w-100 mt-3"
            :disabled="!closeButtonEnabled"
            @click="deleteGroup()"
        >
            Ja ich möchte die Gruppe löschen
        </button>
    </div>
</template>

<script lang="ts">
import {Vue} from "vue-class-component";
import {Ref} from "vue-property-decorator";
import {onFocus} from "@/scripts/helpers/helpers";

export default class CloseGroupPage extends Vue {
    @Ref() private readonly securityQuestionInput!: HTMLInputElement;

    private closeButtonEnabled = false;

    private groupName = "";

    public setup(groupName: string): void {
        this.groupName = groupName;

        this.validateButton();
    }

    private validateButton(): void {
        this.closeButtonEnabled =
            this.groupName == this.securityQuestionInput.value;
    }

    private deleteGroup(): void {
        this.securityQuestionInput.value = "";
        this.$emit("delete");
    }

    private back(): void {
        this.securityQuestionInput.value = "";
        this.$emit("back");
    }

    private onFocus(state: boolean): void {
        onFocus(state);
    }
}
</script>
