<template>
    <div class="signup">
        
        <img class="logo" src="@/assets/images/logo.png">
        
        <div class="sc-card center text-white">
            
            <div class="card-body">                
                <h5 class="card-title">Herzlich Willkommen auf South Central</h5>
                <div :hidden="loginTries === 0" class="login-tires float-end badge bg-danger">
                    {{ loginTries }} / 3
                </div>

                <p class="card-text">Hey <b>{{ $route.params.name }}</b>,
                    wir freuen uns richtig, dass du uns gefunden hast. Leider haben wir dich aber nicht gefunden -
                    erstelle dir doch erst mal einen Account.</p>

                <div class="col py-2">
                    <label class="form-label">Dein Passwort:</label>
                    <input v-model="password" type="password" class="form-control-dark"
                           placeholder="Bitte gib ein Passwort an"
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
                </div>

                <div class="col py-2">
                    <label class="form-label">Gebe es erneut an:</label>
                    <input v-model="securePassword" type="password" class="form-control-dark"
                           placeholder="Bitte gib das selbe Passwort erneut an"
                           v-bind:class="{ 'is-invalid': securePasswordValidation === 'NOT_EQUAL', 'is-valid': securePasswordValidation === 'OKAY' }">
                    <div v-if="securePasswordValidation === 'NOT_EQUAL'" class="invalid-feedback">
                        Die Passwörter sind nicht gleich.
                    </div>
                </div>

                <button type="button" class="btn btn-primary w-100 mt-3" :disabled="tryLogin" @click="send()">
                    <span v-if="!tryLogin">Account erstellen <font-awesome-icon icon="sign-in-alt"/></span>
                    <loading-circle v-if="tryLogin" style="bottom: 2.3vw;"/>
                </button>

                <div class="pt-4" v-if="errorMessage !== ''">
                    <div class="alert alert-danger" role="alert">
                        {{ errorMessage }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import {Options, Vue} from 'vue-class-component';
import LoadingCircle from '../components/LoadingCircle.vue';
import alt from '@/scripts/services/alt.service';

@Options({
    components: {
        LoadingCircle
    },
})
export default class SignUp extends Vue {
    public passwordValidation = ""
    public securePasswordValidation = ""

    private tryLogin = false;
    private loginTries = 0;
    private errorMessage = "";
    private password = "";
    private securePassword = "";

    public mounted(): void {
        alt.on("authmenu:showerror", (error: string) => this.setErrorMessage(error));
    }

    public unmounted(): void {
        alt.off("authmenu:showerror");
    }

    private reset(): void {
        this.tryLogin = false;
        this.password = "";
        this.securePassword = "";
    }

    private setErrorMessage(errorMessage: string): void {
        this.reset();

        this.loginTries++;
        this.errorMessage = errorMessage;

        setTimeout(() => {
            this.errorMessage = "";
        }, 5000);
    }

    private send(): void {
        if (this.tryLogin) {
            return;
        }

        if (this.password === "") {
            this.passwordValidation = "EMPTY";
            return;
        }
        if (!this.password.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm)) {
            this.passwordValidation = "NOT_VALID";
            return;
        } else {
            this.passwordValidation = "OKAY";
        }

        if (this.password !== this.securePassword) {
            this.securePasswordValidation = "NOT_EQUAL";
            return;
        } else {
            this.securePasswordValidation = "OKAY";
        }

        this.tryLogin = true;
        alt.emitServer("auth:signup", this.password);
    }
}
</script>

<style scoped>
.signup {
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
}

.logo {
    position: absolute;
    top: 20%;
    left: 50%;
    transform: translate(-50%);
}
.sc-card {
    width: 30vw;
}

.login-tires {
    position: absolute;
    top: -5%;
    right: -2%;
    padding: 0.5vw;
}
</style>