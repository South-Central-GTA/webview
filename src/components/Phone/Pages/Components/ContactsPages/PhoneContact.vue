<template>
    <div class='phone-contact'>
        <div class='contact-box' @click='openActionsPopup()'>
            <h1 class='name-label'>{{ contact.name }}</h1>
            <h2 class='number-label'>{{ getCorrectFormat() }}</h2>
        </div>
    </div>
</template>

<script lang='ts'>
import {Vue} from "vue-class-component";
import {Prop, Ref} from "vue-property-decorator";
import {PhoneContactInterface} from "@/scripts/interfaces/phone/phone-contact.interface";

export default class PhoneContact extends Vue {
    @Prop() private readonly contact!: PhoneContactInterface;

    @Ref() private readonly numberInput!: HTMLInputElement;
    @Ref() private readonly nameInput!: HTMLInputElement;

    private openActionsPopup(): void {
        this.$emit("clicked-contact", this.contact);
    }

    private getCorrectFormat(): string {
        return (this.contact.phoneNumber.substring(0, 3) + " - " + this.contact.phoneNumber.substring(3,
            this.contact.phoneNumber.length));
    }
}
</script>

<style lang='scss' scoped>
.phone-contact {
    background-color: rgb(207, 207, 207);
    width: 100%;
    height: 4vh;
    position: relative;
}

.phone-contact:hover {
    background-color: rgb(175, 175, 175);
}

.contact-box {
    padding: 0.4vw;
}

.name-label {
    margin: unset;
    font-size: 0.6vw;
    font-weight: 500;
    width: 6.8vw;

    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    text-align: left;
}

.number-label {
    margin: unset;
    font-size: 0.7vw;
    font-weight: 500;
    text-align: left;
}

h2,
h1 {
    pointer-events: none;
}
</style>
