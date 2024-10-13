<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router';
import NotifyPop from '@/components/NotifyPop.vue';
import { onMounted, ref } from 'vue';
import { useWalletStore } from '@/stores/wallet';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import EnthroAPI from '@/scripts/enthro-api';
import { aptosConnectWallet } from '@/scripts/connect';
import { getUserAPTBalance } from '@/scripts/nodit';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FS_API_KEY,
  authDomain: import.meta.env.VITE_FS_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FS_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FS_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FS_MSG_SENDER_ID,
  appId: import.meta.env.VITE_FS_APP_ID,
  measurementId: import.meta.env.VITE_FS_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);

getAnalytics(app);

const walletStore = useWalletStore();
const router = useRouter();
const route = useRoute();

const fetchAccount = async (address: string) => {
  const account = await EnthroAPI.getAccount(address);
  walletStore.setAccount(account);

  if (account) {
    if (walletStore.address && walletStore.account) {
      const balance = await getUserAPTBalance(walletStore.address);
      walletStore.setAptBalance(balance);
    }

    if (route.name == 'signin') {
      router.push('/');
    }
  }
};

onMounted(() => {
  const accounts = aptosConnectWallet.accounts;

  if (accounts.length > 0) {
    walletStore.setAddress(accounts[0].address.toString());
    fetchAccount(accounts[0].address.toString());
  }

  aptosConnectWallet.onAccountChange((account) => {
    if (account.address) {
      walletStore.setAddress(account.address.toString());
      fetchAccount(account.address.toString());
    }
  });
});
</script>

<template>
  <div>
    <RouterView />
    <NotifyPop />
  </div>
</template>
