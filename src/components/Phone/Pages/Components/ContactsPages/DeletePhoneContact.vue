<template>
    <div class='delete-phone-contact'>
        <div class='center'>
            <h5>Kontakt löschen</h5>
            <div class='delete-buttons'>
                <button ref='yesButton'>Ja</button>
                <button ref='noButton'>Nein</button>
            </div>
        </div>
    </div>
</template>

<script lang='ts'>
import {Vue} from "vue-class-component";
import {Ref} from "vue-property-decorator";

export default class DeletePhoneContact extends Vue {
    @Ref() private readonly yesButton!: HTMLButtonElement;
    @Ref() private readonly noButton!: HTMLButtonElement;

    public mounted(): void {
        this.yesButton.addEventListener('click', () => this.deleteContact(true));
        this.noButton.addEventListener('click', () => this.deleteContact(false));
    }

    public unmounted(): void {
        this.yesButton.removeEventListener('click', () => this.deleteContact(true));
        this.noButton.removeEventListener('click', () => this.deleteContact(false));
    }

    private deleteContact(state: boolean): void {
        this.$emit("delete-contact", state);
    }
}
</script>

<style lang='scss' scoped>
.delete-phone-contact {
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;

    background-color: rgb(179, 179, 179);
    z-index: 100;
}


.delete-buttons {
    padding-top: 0.4vw;
    text-align: center;
}

.delete-buttons button {
    margin-top: 0.2vw;
    padding: 0.2vw 0.4vw;
    width: 8vw;
    height: 2vw;
    font-size: 0.9vw;
}

h1 {
    color: white;
    font-size: 1vw;
}
</style>
