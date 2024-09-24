<script setup lang="ts">
import AccountOption from './AccountOption.vue';
import AccountOptionForm from './AccountOptionForm.vue';
import { useWalletStore } from '@/stores/wallet';
import { WalletType, AccountType, type AccountForm } from '@/types';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import EnthroAPI from '@/scripts/enthro-api';
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { notify } from '@/reactives/notify';
import { UserResponseStatus } from '@aptos-labs/wallet-standard';
import { aptosConnectWallet } from '@/scripts/connect';

const walletStore = useWalletStore();
const router = useRouter();

// progress
const fetchingAccount = ref<boolean>(false);
const accountCreateOptions = ref<boolean>(false);
const accountCreateForm = ref<AccountForm | null>(null);

const connectWallet = async () => {
    if (walletStore.address) {
        fetchAccount(walletStore.address);
        return;
    }

    if (walletStore.walletType == WalletType.AptosConnect) {
        const response = await aptosConnectWallet.connect();

        if (response.status == UserResponseStatus.APPROVED) {
            walletStore.setAddress(response.args.address.toString());
            fetchAccount(response.args.address.toString());
        } else {
            notify.push({
                title: 'Error: Failed to connect.',
                description: 'User rejects connection.',
                category: 'error'
            });
        }
    }

    if (walletStore.walletType == WalletType.Petra) {
        notify.push({
            title: 'WIP: use Continue with Google.',
            description: 'Thank you and try again.',
            category: 'error'
        });
    }

    if (walletStore.walletType == WalletType.Martian) {
        notify.push({
            title: 'WIP: use Continue with Google.',
            description: 'Thank you and try again.',
            category: 'error'
        });
    }
};

const fetchAccount = async (address: string) => {
    fetchingAccount.value = true;
    const account = await EnthroAPI.getAccount(address);
    walletStore.setAccount(account);

    if (!account) {
        accountCreateOptions.value = true;
    } else {
        router.push('/');
    }

    fetchingAccount.value = false;
};

const selectWalletType = (walletType: WalletType) => {
    if (walletStore.walletType == walletType) return;

    walletStore.setWalletType(walletType);
    walletStore.setAddress(null);

    localStorage.setItem('wallet-type', walletType.toString());
};

const accountCreate = (accountType: AccountType) => {
    if (accountType == AccountType.Google) {
        googleAuthRequest();
    }

    if (accountType == AccountType.Manual) {
        accountCreateForm.value = {
            name: null,
            email: null,
            image: null
        };
    }
};

const accountCreation = async (form: AccountForm) => {
    if (!walletStore.address) {
        return;
    }

    if (!form.name) {
        return;
    }

    if (!form.email) {
        return;
    }

    const account = await EnthroAPI.createAccount(
        walletStore.address,
        form.name,
        form.email,
        form.image
    );

    walletStore.setAccount(account);

    if (account) {
        router.push('/');
    } else {
        notify.push({
            title: 'Error: failed to create account.',
            description: 'Please try again.',
            category: 'error'
        });
    }
};

const googleAuthRequest = async () => {
    const auth = getAuth();

    const provider = new GoogleAuthProvider();

    provider.addScope('profile');
    provider.addScope('email');

    try {
        const result = await signInWithPopup(auth, provider);
        accountCreateForm.value = {
            name: result.user.displayName,
            email: result.user.email,
            image: result.user.photoURL
        };
    } catch (error) {
        console.log(error);
        notify.push({
            title: 'Error: failed to derive account.',
            description: 'Please try again.',
            category: 'error'
        });
    }
};

onMounted(() => {

});
</script>

<template>
    <section>
        <div class="app_width">
            <div class="signin">
                <div class="signin_title">
                    <h3>Welcome to Enthro</h3>
                    <p>Choose a preferred wallet to Sign In or Sign Up with</p>
                </div>

                <div class="signin_wallets">
                    <div :class="walletStore.walletType == WalletType.AptosConnect ? `signin_wallet signin_wallet_active` : `signin_wallet`"
                        @click="() => { selectWalletType(WalletType.AptosConnect); }">
                        <div class="signin_wallet_name">
                            <img src="/images/aptos_connect.png" alt="aptos_connect">
                            <p>Continue With Google</p>
                        </div>

                        <div class="signin_wallet_radio">
                            <div class="signin_wallet_radio_inner"></div>
                        </div>
                    </div>

                    <div class="or">
                        <div></div>
                        <p>Or</p>
                    </div>

                    <div :class="walletStore.walletType == WalletType.Petra ? `signin_wallet signin_wallet_active` : `signin_wallet`"
                        @click="() => { selectWalletType(WalletType.Petra); }">
                        <div class="signin_wallet_name">
                            <img src="/images/petra.png" alt="petra">
                            <p>Petra</p>
                        </div>

                        <div class="signin_wallet_radio">
                            <div class="signin_wallet_radio_inner"></div>
                        </div>
                    </div>

                    <div :class="walletStore.walletType == WalletType.Martian ? `signin_wallet signin_wallet_active` : `signin_wallet`"
                        @click="() => { selectWalletType(WalletType.Martian); }">
                        <div class="signin_wallet_name">
                            <img src="/images/martian.png" alt="martian">
                            <p>Martian</p>
                        </div>

                        <div class="signin_wallet_radio">
                            <div class="signin_wallet_radio_inner"></div>
                        </div>
                    </div>
                </div>

                <div class="signin_action">
                    <button @click="connectWallet">Connect Wallet</button>
                </div>
            </div>
        </div>

        <AccountOption
            v-if="!walletStore.account && !fetchingAccount && walletStore.address && accountCreateOptions && !accountCreateForm"
            @close="accountCreateOptions = false" @continue="accountCreate" />

        <AccountOptionForm :form="accountCreateForm" v-if="accountCreateForm" @close="accountCreateForm = null"
            @continue="accountCreation" />
    </section>
</template>

<style scoped>
section {
    padding-top: 120px;
    padding-bottom: 60px;
}

.app_width {
    width: 1314px;
}

.signin {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 50px;
}

.signin_title {
    width: 318px;
    text-align: center;
}

.signin_title h3 {
    font-size: 30px;
    font-weight: 600;
    line-height: 36px;
    color: var(--tx-normal);
}

.signin_title p {
    margin-top: 14px;
    font-size: 14px;
    font-weight: 500;
    line-height: 21px;
    color: var(--tx-dimmed);
}

.signin_wallets {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    width: 360px;
    max-width: 100%;
}

.signin_wallet {
    width: 100%;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    border: 1px solid var(--bg-darkest);
    border-radius: 6px;
    user-select: none;
    cursor: pointer;
}

.signin_wallet_active {
    border: 1px solid var(--primary);
}

.signin_wallet_name {
    display: flex;
    align-items: center;
    gap: 16px;
}

.signin_wallet_name img {
    width: 22px;
    height: 22px;
}

.signin_wallet_name p {
    font-size: 14px;
    font-weight: 500;
    color: var(--tx-normal);
}

.signin_wallet_radio {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    border: 2px solid var(--bg-darkest);
}

.signin_wallet:hover .signin_wallet_radio {
    border: 2px solid var(--primary-light);
}

.signin_wallet_active .signin_wallet_radio {
    border: 2px solid var(--primary-light);
}

.signin_wallet_active .signin_wallet_radio_inner {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: var(--primary);
    border: 2.5px solid var(--bg);
}

.signin_action button {
    width: 360px;
    height: 50px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--primary);
    user-select: none;
    cursor: pointer;
    font-size: 14px;
    font-weight: 600;
    color: var(--bg);
    border: none;
}

.or {
    position: relative;
    margin: 20px 0;
    text-align: center;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.or>div {
    background: var(--bg-darkest);
    height: 1px;
    width: 100%;
    position: absolute;
}

.or p {
    font-weight: 500px;
    font-size: 14px;
    color: var(--tx-dimmed);
    z-index: 10;
    padding: 0 16px;
    position: absolute;
    background: var(--bg);
}
</style>