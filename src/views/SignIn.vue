<template>
    <div class="auth">
        <div class="sc-card center text-white">
            <div class="card-body">
                <h5 class="card-title">Willkommen auf South Central</h5>
                <div :hidden="loginTries === 0" class="login-tires float-end badge bg-danger">
                    {{ loginTries }} / 3
                </div>

                <p class="card-text">Hey <b>{{ $route.params.name }}</b>,
                    wir freuen uns richtig, dass du uns gefunden hast. Wir haben dich auch gefunden - melde dich mit dem
                    Passwort an.</p>

                <input class="form-control-dark mb-3" v-model="password"
                       v-on:keydown.enter="send()" type="password" placeholder="Bitte gebe ein Passwort an"
                       :disabled="tryLogin">

                <button type="button" class="btn btn-primary w-100" :disabled="tryLogin" @click="send()">
                    <span v-if="!tryLogin">Login <font-awesome-icon icon="sign-in-alt"/></span>
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
export default class SignIn extends Vue {
    private tryLogin = false;
    private loginTries = 0;
    private errorMessage = "";
    private password = "";

    public mounted(): void {
        alt.on("signin:showerror", (args: any[]) => this.setErrorMessage(args[0]));
    }

    private reset(): void {
        this.tryLogin = false;
        this.password = "";
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
        if (this.tryLogin)
            return;

        if (this.password.length === 0) {
            return;
        }

        this.tryLogin = true;
        alt.emitServer("auth:signin", this.password);
    }
}
</script>

<style scoped>
.auth {
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
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