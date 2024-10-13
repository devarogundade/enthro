<script setup lang="ts">
import LogoutIcon from '@/components/icons/LogoutIcon.vue';
import SettingsIcon from '@/components/icons/SettingsIcon.vue';
import NotificationIcon from '@/components/icons/NotificationIcon.vue';
import OutIcon from '@/components/icons/OutIcon.vue';
import WalletIcon from '@/components/icons/WalletIcon.vue';
import BalSymbolIcon from '@/components/icons/BalSymbolIcon.vue';
import { useWalletStore } from '@/stores/wallet';
import Converter from '@/scripts/converter';
import { WalletType } from '@/types';
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { aptosConnectWallet } from '@/scripts/connect';
import { getUserAPTBalance } from '@/scripts/nodit';

const router = useRouter();
const walletStore = useWalletStore();

const profile = ref(false);

const logout = async () => {
    await aptosConnectWallet.disconnect();

    walletStore.setAddress(null);
    walletStore.setAccount(null);

    router.push('/signin');
};

watch(profile, async  () => {
    if (walletStore.address && walletStore.account) {
        const balance = await getUserAPTBalance(walletStore.address)
        walletStore.setAptBalance(balance)
    }
});
</script>

<template>
    <section>
        <div class="app_width">
            <header>
                <div class="logo"></div>

                <div class="tabs">
                    <RouterLink to="/">Home</RouterLink>
                    <a href="https://devpost.com/software/thube" target="_blank">Docs
                        <OutIcon />
                    </a>
                    <a href="https://github.com/devarogundade/enthro" target="_blank">GitHub
                        <OutIcon />
                    </a>
                </div>

                <div class="connect">
                    <div class="notifications_btn" v-if="walletStore.account">
                        <NotificationIcon />
                    </div>

                    <RouterLink to="/signin" v-if="!walletStore.account">
                        <button>
                            <WalletIcon />
                            <p>Connect Wallet</p>
                        </button>
                    </RouterLink>

                    <button v-if="walletStore.account" @click="profile = !profile">
                        <img src="/images/petra.png" v-if="walletStore.walletType == WalletType.Petra" />
                        <img src="/images/aptos_connect.png" v-if="walletStore.walletType == WalletType.AptosConnect" />
                        <img src="/images/martian.png" v-if="walletStore.walletType == WalletType.Martian" />
                        <p>{{ Converter.fineAddress(walletStore.address, 5) }}</p>

                        <div class="profile" v-show="profile">
                            <img :src="walletStore.account.image || ''" alt="">
                            <div class="profile_name">
                                <p>{{ Converter.fineAddress(walletStore.address, 5) }}</p>
                                <p>
                                    <BalSymbolIcon />
                                    <span>
                                        {{ Converter.toMoney(Converter.fromOctas(walletStore.aptBalance)) }}
                                    </span>
                                    APT
                                </p>
                            </div>
                            <div class="log_out" @click="logout">
                                <LogoutIcon />
                            </div>
                        </div>
                    </button>

                    <RouterLink to="/portfolio" v-if="walletStore.account">
                        <div class="settings_btn">
                            <SettingsIcon />
                        </div>
                    </RouterLink>
                </div>
            </header>
        </div>
    </section>
</template>

<style scoped>
section {
    position: fixed;
    top: 0;
    border-bottom: 1px solid var(--bg-darkest);
    z-index: 5;
}

header {
    height: 90px;
    display: grid;
    grid-template-columns: 200px auto 320px;
    align-items: center;
    background: var(--bg);
    padding-right: 45px;
}

.tabs {
    display: flex;
    align-items: center;
    gap: 50px;
    padding: 0 100px;
}

.tabs a {
    color: var(--tx-dimmed);
    font-size: 14px;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 6px;
}

.tabs a:hover {
    color: var(--tx-normal);
}

.connect {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 20px;
}

.connect button {
    background: var(--bg);
    border: 1px solid var(--bg-darkest);
    width: 185px;
    height: 40px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    user-select: none;
    cursor: pointer;
    position: relative;
}

.connect button p {
    font-size: 14px;
    font-weight: 500;
    color: var(--tx-normal);
}

.connect button img {
    width: 18px;
    height: 18px;
}

.notifications_btn,
.settings_btn {
    background: var(--bg-dark);
    width: 40px;
    height: 40px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    user-select: none;
    cursor: pointer;
}

.profile {
    padding: 16px 20px;
    border-radius: 6px;
    background: var(--bg-dark);
    border: 1px solid var(--bg-darkest);
    display: flex;
    align-items: center;
    gap: 18px;
    position: absolute;
    right: -60px;
    top: 80px;
    z-index: 100;
}

.profile img {
    width: 38px !important;
    height: 38px !important;
    border-radius: 4px;
    object-fit: cover;
}

.profile_name p {
    font-size: 14px;
    font-weight: 500;
    color: var(--tx-normal);
    width: 170px;
    text-align: left;
}

.profile_name p:last-child {
    color: var(--tx-dimmed);
    display: flex;
    align-items: center;
    gap: 4px;
}

.profile_name p span {
    color: var(--tx-semi);
}

.log_out {
    width: 32px;
    height: 32px;
    background: var(--bg);
    border-radius: 4px;
    border: 1px solid var(--bg-darker);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
}
</style>