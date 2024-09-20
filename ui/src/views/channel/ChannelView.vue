<script setup lang="ts">
import ChannelHeader from '@/components/ChannelHeader.vue';
import ProgressBox from '@/components/ProgressBox.vue';
import EnthroAPI from '@/scripts/enthro-api';
import { type Channel } from "@/types";
import { onMounted, ref } from "vue";
import { useRoute } from 'vue-router';
import { useWalletStore } from '@/stores/wallet';

const route = useRoute();
const loading = ref<boolean>(true);
const channel = ref<Channel | null>(null);
const isFollow = ref<boolean>(false);
const isSuperFollow = ref<boolean>(false);
const walletStore = useWalletStore();

const getChannel = async () => {
    loading.value = true;
    channel.value = await EnthroAPI.getChannel(route.params.id as any);

    getFollows();

    loading.value = false;
};

const getFollows = async () => {

    if (walletStore.address) {
        // if (cardId) {
        //     const cardBalance = await getNftBalance(cardId, walletStore.address);
        //     isFollow.value = cardBalance > 0;
        // }

        // if (exclusiveCardId) {
        //     const cardBalance = await getNftBalance(exclusiveCardId, walletStore.address);
        //     isSuperFollow.value = cardBalance > 0;
        // }
    }
};

onMounted(() => {
    getChannel();
});
</script>

<template>
    <div class="load_frame" v-if="loading">
        <ProgressBox />
    </div>

    <main v-else-if="!loading && channel">
        <ChannelHeader @refresh="getFollows" :channel="channel" :isFollow="isFollow" :isSuperFollow="isSuperFollow" />
        <RouterView />
    </main>
</template>