<script setup lang="ts">
import ChannelHeader from '@/components/ChannelHeader.vue';
import ProgressBox from '@/components/ProgressBox.vue';
import EnthroAPI from '@/scripts/enthro-api';
import type { Channel, Account } from "@/types";
import { onMounted, ref } from "vue";
import { useRoute } from 'vue-router';
import { useWalletStore } from '@/stores/wallet';
import { hasToken } from '@/scripts/nodit';
import Contract, { resSignerAddress } from '@/scripts/contract';

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
    if (walletStore.address && channel.value) {
        if (walletStore.address) {
            isFollow.value = await hasToken(
                Contract.createCollectionAddress(
                    resSignerAddress,
                    `${(channel.value as Channel)?.name} followers`
                ),
                walletStore.address
            );

            isSuperFollow.value = await hasToken(
                Contract.createCollectionAddress(
                    resSignerAddress,
                    `${(channel.value as Channel)?.name} super followers`
                ),
                walletStore.address
            );
        }
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