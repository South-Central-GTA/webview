<template>
    <div class='contacts-page'>
        <div :hidden='!isAddContactPopupOpen'>
            <add-phone-contact ref='addPhoneContact' v-on:add-contact='addContact($event)' />
        </div>

        <div :hidden='!isEditContactPopupOpen'>
            <edit-phone-contact ref='editPhoneContact' v-on:update-contact='updateContact($event)' />
        </div>

        <div :hidden='!isDeletePopupOpen'>
            <delete-phone-contact v-on:delete-contact='deleteContact($event)' />
        </div>

        <div class='my-phone'>
            <h1>Ich</h1>
            <h2>{{ getCorrectFormat(myNumber) }}</h2>
            <div class='new-contact-block'>
                <button class='btn new-contact-button' type='button' @click='openAddContactPopup()'>
                    <font-awesome-icon class='center' icon='plus' />
                </button>
            </div>
        </div>

        <div v-if='isActionsPopupOpen' class='actions-popup'>
            <h4>{{ currentContact.name }}</h4>
            <h5>{{ getCorrectFormat(currentContact.phoneNumber) }}</h5>
            <div class='center w-100'>
                <div style='padding-top: 20px'>
                    <button class='btn call-button' type='button' @click='callContact()'>
                        <font-awesome-icon class='center' icon='phone' />
                    </button>
                    <button class='btn text-button' type='button' @click='textContact()'>
                        <font-awesome-icon class='center' icon='comments' />
                    </button>
                </div>
                <div style='padding-top: 10px'>
                    <button class='btn delete-button' type='button' @click='openDeletePopup()'>
                        <font-awesome-icon class='center' icon='trash' />
                    </button>
                    <button class='btn edit-button' type='button' @click='openEditContactPopup()'>
                        <font-awesome-icon class='center' icon='cog' />
                    </button>
                </div>
            </div>
            <button class='btn close-button' type='button' @click='closeActionsPopup()'>
                <font-awesome-icon class='center' icon='times' />
            </button>
        </div>

        <div v-if='sortedContacts !== null' class='contacts-block'>
            <div v-for='sorted in sortedContacts' v-bind:key='sorted.Letter'>
                <h1 v-if='sorted.contacts.length !== 0'>{{ sorted.letter }}</h1>
                <div v-for='contact in sorted.contacts' v-bind:key='contact.id'>
                    <phone-contact v-bind:contact='contact' v-on:clicked-contact='openActionsPopup($event)' />
                </div>
            </div>
        </div>
    </div>
</template>

<script lang='ts'>
import {replaceUmlaut} from "@/scripts/helpers/helpers";
import PhoneContact from "./Components/ContactsPages/PhoneContact.vue";
import AddPhoneContact from "./Components/ContactsPages/AddPhoneContact.vue";
import EditPhoneContact from "./Components/ContactsPages/EditPhoneContact.vue";
import DeletePhoneContact from "./Components/ContactsPages/DeletePhoneContact.vue";
import {Options, Vue} from "vue-class-component";
import {Ref} from "vue-property-decorator";
import {PhoneContactInterface} from "@/scripts/interfaces/phone/phone-contact.interface";

interface SortedContactInterface {
    letter: string;
    contacts: PhoneContactInterface[];
}

@Options({
    components: {
        PhoneContact, AddPhoneContact, EditPhoneContact, DeletePhoneContact,
    },
})
export default class ContactsPage extends Vue {
    public isAddContactPopupOpen = false;
    public isEditContactPopupOpen = false;
    public isDeletePopupOpen = false;
    public isActionsPopupOpen = false;
    @Ref() private readonly addPhoneContact!: AddPhoneContact;
    @Ref() private readonly editPhoneContact!: EditPhoneContact;
    private sortedContacts: SortedContactInterface[] = [];
    private myNumber = "";
    private currentContact!: PhoneContactInterface;

    public setup(myNumber: string, contacts: PhoneContactInterface[]): void {
        this.sortedContacts = [];

        const alphabet = "aäbcdefghijklmnoöpqrstuüvwxyz".toUpperCase().split("");
        for (let index = 0; index < alphabet.length; index++) {
            const letter = alphabet[index];

            const sorted: SortedContactInterface = {
                letter: letter, contacts: contacts
                    .filter((c) => c.name[0].toUpperCase() === letter)
                    .sort((a, b) => a.name.localeCompare(b.name)),
            };

            this.sortedContacts.push(sorted);
        }

        // We have change the german umlaute to uni code.
        this.sortedContacts
            .flatMap((sc) => sc.contacts)
            .forEach((sc) => (sc.name = replaceUmlaut(sc.name)));

        // We have also to check all other characters to so we are just checking if there is any contacts left.
        const sortedMap = this.sortedContacts.flatMap((sc) => sc.contacts);
        const missingContacts = contacts.filter((c) => !sortedMap.find((sm) => sm.id === c.id));

        const sorted: SortedContactInterface = {
            letter: "Andere Zeichen", contacts: missingContacts.sort((a, b) => a.name.localeCompare(b.name)),
        };

        this.sortedContacts.push(sorted);

        this.myNumber = myNumber;
    }

    public openAddContactPopup(number = 0): void {
        this.isAddContactPopupOpen = true;
        if (number != 0) {
            this.addPhoneContact.setup(number);
        }
    }

    public closeAddContactPopup(): void {
        this.isAddContactPopupOpen = false;
    }

    public closeUpdateContactPopup(): void {
        this.isEditContactPopupOpen = false;
    }

    public closeDeletePopup(): void {
        this.isDeletePopupOpen = false;
    }

    public closeActionsPopup(): void {
        this.isActionsPopupOpen = false;
    }

    private openDeletePopup(): void {
        this.isDeletePopupOpen = true;
    }

    private openActionsPopup(contact: PhoneContactInterface): void {
        this.isActionsPopupOpen = true;
        this.currentContact = contact;
    }

    private addContact(contact: PhoneContactInterface): void {
        this.closeAddContactPopup();

        this.$emit("add-contact", contact);
    }

    private openEditContactPopup(): void {
        this.isEditContactPopupOpen = true;
        this.editPhoneContact.setup(this.currentContact);
    }

    private updateContact(contact: PhoneContactInterface): void {
        this.closeUpdateContactPopup();
        this.$emit("edit-contact", contact);
    }

    private deleteContact(state: boolean): void {
        if (state) {
            this.$emit("remove-contact", this.currentContact.id);
            this.closeActionsPopup();
        }

        this.closeDeletePopup();
    }

    private callContact(): void {
        this.$emit("call-contact", this.currentContact);
        this.closeActionsPopup();
    }

    private textContact(): void {
        this.$emit("text-contact", this.currentContact);
        this.closeActionsPopup();
    }

    private getCorrectFormat(numberString: string): string {
        return (numberString.substring(0, 3) + " - " + numberString.substring(3, numberString.length));
    }

    private isNumeric(value: string): boolean {
        return /^-{0,1}\d+$/.test(value);
    }
}
</script>

<style lang='scss' scoped>
.contacts-page {
    height: 100%;

    background-image: url("../../../assets/images/patterns/double-bubble.png");
    background-position: center center;
    background-size: 30vw;
}

.my-phone {
    width: 100%;
    height: 6vw;
    font-size: 0.7vw;
    background-color: #e9e9e9;
}

.my-phone h1 {
    margin: unset;
    font-size: 1vw;
    text-align: center;
    color: var(--gray);
    padding-top: 1.25vw;
}

.my-phone h2 {
    margin: unset;
    font-size: 1vw;
    text-align: center;
    color: var(--gray);
}

h1 {
    margin: unset;
    text-align: center;
    padding-top: 1.1vw;
    font-size: 1.2vw;
}

h2 {
    margin: unset;
    text-align: center;
    font-size: 0.9vw;
}

.contacts-block {
    overflow-y: scroll;
    width: 100%;
    height: 18vw;

    &::-webkit-scrollbar {
        display: none;
    }
}

.contacts-block h1 {
    font-size: 0.5vw;
    text-align: left;
    margin: unset;
    padding: 0.25vw;
    background-color: #e67e22;
    color: white;
}

.new-contact-block {
    text-align: center;
    padding: 0.5vw;
}

.new-contact-button {
    position: relative;
    width: 1.5vw;
    height: 1.5vw;
    font-size: 0.8vw;
    background-color: rgb(87, 184, 103);
    color: white;
    border-radius: 100%;
}

.actions-popup {
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.95);
    text-align: center;
    z-index: 10;
}

.actions-popup h4 {
    position: absolute;
    left: 50%;
    top: 18%;
    transform: translate(-50%, -15%);
    color: white;
    text-align: center;
    text-overflow: ellipsis;
    width: 100%;
}

.actions-popup h5 {
    position: absolute;
    left: 50%;
    top: 29%;
    transform: translate(-50%, -30%);
    color: white;
    text-align: center;
    text-overflow: ellipsis;
    width: 100%;
}

.call-button {
    position: relative;
    height: 2vw;
    width: 2vw;
    margin: 0vw 0.5vw;
    background-color: rgb(91, 201, 139);
    border-radius: 100%;
    font-size: 0.9vw;
    color: white;

    &:hover {
        background-color: rgb(70, 151, 105);
    }
}

.delete-button {
    position: relative;
    height: 2vw;
    width: 2vw;
    margin: 0vw 0.5vw;
    background-color: rgb(212, 56, 56);
    border-radius: 100%;
    font-size: 0.9vw;
    color: white;

    &:hover {
        background-color: rgb(170, 47, 47);
    }
}

.edit-button {
    position: relative;
    height: 2vw;
    width: 2vw;
    margin: 0vw 0.5vw;
    background-color: rgb(187, 160, 5);
    border-radius: 100%;
    font-size: 0.9vw;
    color: white;

    &:hover {
        background-color: rgb(150, 128, 5);
    }
}

.text-button {
    position: relative;
    height: 2vw;
    width: 2vw;
    margin: 0vw 0.5vw;
    background-color: rgb(61, 107, 206);
    border-radius: 100%;
    font-size: 0.9vw;
    color: white;

    &:hover {
        background-color: rgb(48, 88, 173);
    }
}

.close-button {
    position: absolute;
    left: 50%;
    bottom: 10%;
    transform: translate(-50%, -10%);

    height: 2vw;
    width: 2vw;
    border-radius: 100%;
    font-size: 0.9vw;
    color: white !important;
    background: rgb(19, 19, 19);

    &:hover {
        color: #ccc !important;
    }
}
</style>
