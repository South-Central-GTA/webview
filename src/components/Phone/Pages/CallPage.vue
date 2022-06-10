<template>
    <div class='call-page'>
        <input ref='numberInput' class='form-control mt-3' maxlength='11' oninput='if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);' type='number' @blur='onFocus(false)' @focus='onFocus(true)' @input='validate()' @keypress='allowOnlyNumbers($event)' />

        <div v-if='addContactButtonVisible'>
            <a class='contact-button' @click='addAsContact()'>Kontakt hinzufügen</a>
        </div>

        <div class='number-block'>
            <div class='rows'>
                <button class='btn' type='button' @click='addNumber(1)'>1</button>
                <button class='btn' type='button' @click='addNumber(2)'>2</button>
                <button class='btn' type='button' @click='addNumber(3)'>3</button>
            </div>
            <div class='rows'>
                <button class='btn' type='button' @click='addNumber(4)'>4</button>
                <button class='btn' type='button' @click='addNumber(5)'>5</button>
                <button class='btn' type='button' @click='addNumber(6)'>6</button>
            </div>
            <div class='rows'>
                <button class='btn' type='button' @click='addNumber(7)'>7</button>
                <button class='btn' type='button' @click='addNumber(8)'>8</button>
                <button class='btn' type='button' @click='addNumber(9)'>9</button>
            </div>
            <div class='rows'>
                <button class='btn correct-button' @click='removeNumber()'>
                    <font-awesome-icon class='center' icon='caret-left' />
                </button>
                <button class='btn' type='button' @click='addNumber(0)'>0</button>
                <button class='btn call-button' @click='requestCall()'>
                    <font-awesome-icon class='center' icon='phone' />
                </button>
            </div>
        </div>
    </div>
</template>

<script lang='ts'>
import ActiveCall from "./Components/ActiveCall.vue";
import {Options, Vue} from "vue-class-component";
import {Ref} from "vue-property-decorator";
import {allowOnlyNumbers, onFocus} from "@/scripts/helpers/helpers";

@Options({
    components: {
        ActiveCall,
    },
})
export default class CallPage extends Vue {
    @Ref() private readonly numberInput!: HTMLInputElement;

    private addContactButtonVisible = false;

    public reset(): void {
        this.numberInput.value = "";
        this.addContactButtonVisible = false;
    }

    private validate(): void {
        this.addContactButtonVisible = this.getNumberLength() >= 3;
    }

    private getNumberLength(): number {
        return this.numberInput?.value.length;
    }

    private addAsContact(): void {
        this.$emit("add-contact", this.numberInput.value);
    }

    private addNumber(number: number): void {
        if (this.numberInput.value.length > 11) return;

        if (this.numberInput.selectionStart && this.numberInput.selectionEnd) {
            const startPos = this.numberInput.selectionStart;
            const endPos = this.numberInput.selectionEnd;

            this.numberInput.value = this.numberInput.value.substring(0,
                startPos) + number + this.numberInput.value.substring(endPos, this.numberInput.value.length);
        } else {
            this.numberInput.value += number;
        }

        this.validate();
    }

    private removeNumber(): void {
        this.numberInput.value = this.numberInput.value.substring(0, this.numberInput.value.length - 1);
        this.validate();
    }

    private requestCall(): void {
        if (this.numberInput.value.length === 0) return;

        this.$emit("call-number", this.numberInput.value);
        this.reset();
    }

    private onFocus(state: boolean): void {
        onFocus(state);
    }

    private allowOnlyNumbers(state: KeyboardEvent): void {
        allowOnlyNumbers(state);
    }
}
</script>

<style lang='scss' scoped>
.call-page {
    background-color: rgb(235, 235, 235);
    height: 100%;
    width: 100%;
    position: relative;
}

.form-control {
    position: absolute;
    top: 1.5vw;
    width: 90%;
    left: 50%;
    transform: translateX(-50%);
}

.contact-button {
    position: absolute;
    top: 20%;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    text-decoration: underline;
    text-align: center;
    font-size: 1vw;
}

.number-block {
    width: 100%;
    position: absolute;
    top: 75%;
    left: 50%;
    transform: translate(-50%, -75%);
    text-align: center;

    .btn {
        background-color: #676767;
        font-weight: 500 !important;
    }
}

.rows button {
    width: 2.7vw;
    height: 2.7vw;
    border-radius: 100%;
    background-color: rgb(209, 209, 209);
    color: black;
    font-size: 1vw;
    margin: 0.8vw;
}

.rows button:hover {
    background-color: rgb(190, 190, 190);
}

.correct-button {
    position: relative;
    padding-right: 10px;
}

.call-button {
    position: relative;
    background-color: rgb(91, 201, 139) !important;
    color: white !important;
}

.call-button:hover {
    background-color: rgb(70, 151, 105) !important;
}
</style>
