<script setup lang="ts">
import CoinsIcon from '@/components/icons/CoinsIcon.vue';
import { notify } from '@/reactives/notify';
import { useWalletStore } from '@/stores/wallet';
import ProgressBox from '@/components/ProgressBox.vue';
import { onMounted, ref } from "vue";
import Contract from '@/scripts/contract';
import Converter from '@/scripts/converter';
import { type Revenue } from '@/types';

const revenue = ref<Revenue | null>(null);
const walletStore = useWalletStore();
const loading = ref<boolean>(true);
const claimingApt = ref<boolean>(false);

const getRatio = (a: any, b: any) => {
    if (Number(a) == 0) return 0;
    return Number((Number(a) / (Number(a) + Number(b))) * 100).toFixed(0);
};

const sum = (a: any, b: any) => {
    return Number(a) + Number(b);
};

const getRevenue = async (load: boolean = true) => {
    loading.value = load;
    revenue.value = await Contract.getEarnings(walletStore.address!);
    loading.value = false;
};

const claimEarnings = async () => {
    if (claimingApt.value) return;
    if (revenue.value?.unclaimed == BigInt(0)) {
        return;
    }
    claimingApt.value = true;

    const txHash = await Contract.claimEarnings(revenue.value?.unclaimed || BigInt(0));

    if (txHash) {
        notify.push({
            title: 'Successful: Revenue claimed',
            description: 'Transaction sent',
            category: 'success'
        });
    } else {
        notify.push({
            title: 'Error: Interracting with theta api',
            description: 'Please try again',
            category: 'error'
        });
    }
    claimingApt.value = false;

    getRevenue(false);
};

// const claimStreamTips = async () => {
//     if (claimingThurbe.value) return;
//     if (revenue.value?.totalUnClaimedThurbe == BigInt(0)) {
//         return;
//     }

//     claimingThurbe.value = true;

//     const txHash = await Contract.claimStreamTips(revenue.value?.totalUnClaimedThurbe || BigInt(0));

//     if (txHash) {
//         notify.push({
//             title: 'Successful: Revenue claimed',
//             description: 'Transaction sent',
//             category: 'success'
//         });
//     } else {
//         notify.push({
//             title: 'Error: Interracting with theta api',
//             description: 'Please try again',
//             category: 'error'
//         });
//     }
//     claimingThurbe.value = false;

//     getRevenue(false);
// };

onMounted(() => {
    getRevenue();
});
</script>

<template>
    <div class="load_frame" v-if="loading">
        <ProgressBox />
    </div>

    <div class="revenue_container" v-if="!loading && revenue">
        <div class="revenue">
            <div class="revenue_title">
                <p>Total Videos & Streams Revenue</p>
                <h3>{{ sum(Converter.toMoney(Converter.fromOctas(revenue.claimed)),
                    Converter.fromOctas(revenue.unclaimed)) }} APT</h3>
            </div>
            <div class="revenue_amounts">
                <div class="revenue_amount">
                    <div class="revenue_amount_name">
                        <div class="revenue_amount_name_text">
                            <img src="/images/apt.png" alt="theta">
                            <p><span>{{ Converter.toMoney(Converter.fromOctas(revenue.unclaimed)) }}</span>
                                APT ~ $0,00</p>
                        </div>

                        <div class="revenue_amount_percent">{{
                            getRatio(Converter.fromOctas(revenue.unclaimed),
                                Converter.fromOctas(revenue.claimed))
                        }}% Unclaimed</div>
                    </div>
                    <div class="revenue_amount_progress">
                        <div class="revenue_amount_bar"
                            :style="`width: ${getRatio(Converter.fromOctas(revenue.unclaimed), Converter.fromOctas(revenue.claimed))}%;`">
                        </div>
                        <div class="revenue_amount_bar_dot"
                            :style="`left: ${getRatio(Converter.fromOctas(revenue.unclaimed), Converter.fromOctas(revenue.claimed))}%;`">
                        </div>
                    </div>
                </div>

                <div class="revenue_amount">
                    <div class="revenue_amount_name">
                        <div class="revenue_amount_name_text">
                            <img src="/images/apt.png" alt="theta">
                            <p><span>{{ Converter.toMoney(Converter.fromOctas(revenue.claimed)) }}</span> APT
                                ~ $0,00</p>
                        </div>

                        <div class="revenue_amount_percent">{{
                            getRatio(Converter.fromOctas(revenue.claimed),
                                Converter.fromOctas(revenue.unclaimed))
                        }}% Claimed</div>
                    </div>
                    <div class="revenue_amount_progress">
                        <div class="revenue_amount_bar"
                            :style="`width: ${getRatio(Converter.fromOctas(revenue.claimed), Converter.fromOctas(revenue.unclaimed))}%;`">
                        </div>
                        <div class="revenue_amount_bar_dot"
                            :style="`left: ${getRatio(Converter.fromOctas(revenue.claimed), Converter.fromOctas(revenue.unclaimed))}%;`">
                        </div>
                    </div>
                </div>
            </div>
            <div class="revenue_claim">
                <div class="revenue_claim_text">
                    <p>Unclaimed Revenue</p>
                    <div class="revenue_claim_balance">
                        <div class="revenue_claim_balance_images">
                            <img src="/images/apt.png" alt="">
                            <img src="/images/apt.png" alt="">
                        </div>
                        <p>~ $0,00</p>
                    </div>
                </div>

                <button class="revenue_claim_btn" @click="claimEarnings">
                    <CoinsIcon /> {{ claimingApt ? 'Claiming...' : 'Claim' }}
                </button>
            </div>
        </div>

        <!-- <div class="revenue">
            <div class="revenue_title">
                <p>Total Tips Revenue</p>
                <h3>{{ sum(Converter.toMoney(Converter.fromOctas(revenue.totalClaimedThurbe)),
                    Converter.fromOctas(revenue.totalUnClaimedThurbe)) }} ENTRE</h3>
            </div>
            <div class="revenue_amounts">
                <div class="revenue_amount">
                    <div class="revenue_amount_name">
                        <div class="revenue_amount_name_text">
                            <img src="/images/logo.png" alt="theta">
                            <p><span>{{ Converter.toMoney(Converter.fromOctas(revenue.totalUnClaimedThurbe)) }}</span>
                                ENTRE ~ $0,00</p>
                        </div>

                        <div class="revenue_amount_percent">{{
                            getRatio(Converter.fromOctas(revenue.totalUnClaimedThurbe),
                                Converter.fromOctas(revenue.totalClaimedThurbe))
                        }}% Unclaimed</div>
                    </div>
                    <div class="revenue_amount_progress">
                        <div class="revenue_amount_bar"
                            :style="`width: ${getRatio(Converter.fromOctas(revenue.totalUnClaimedThurbe), Converter.fromOctas(revenue.totalClaimedThurbe))}%;`">
                        </div>
                        <div class="revenue_amount_bar_dot"
                            :style="`left: ${getRatio(Converter.fromOctas(revenue.totalUnClaimedThurbe), Converter.fromOctas(revenue.totalClaimedThurbe))}%;`">
                        </div>
                    </div>
                </div>

                <div class="revenue_amount">
                    <div class="revenue_amount_name">
                        <div class="revenue_amount_name_text">
                            <img src="/images/logo.png" alt="theta">
                            <p><span>{{ Converter.toMoney(Converter.fromOctas(revenue.totalClaimedThurbe)) }}</span> ENTRE
                                ~ $0,00</p>
                        </div>

                        <div class="revenue_amount_percent">{{
                            getRatio(Converter.fromOctas(revenue.totalClaimedThurbe),
                                Converter.fromOctas(revenue.totalUnClaimedThurbe)) }}% Claimed</div>
                    </div>
                    <div class="revenue_amount_progress">
                        <div class="revenue_amount_bar"
                            :style="`width: ${getRatio(Converter.fromOctas(revenue.totalClaimedThurbe), Converter.fromOctas(revenue.totalUnClaimedThurbe))}%;`">
                        </div>
                        <div class="revenue_amount_bar_dot"
                            :style="`left: ${getRatio(Converter.fromOctas(revenue.totalClaimedThurbe), Converter.fromOctas(revenue.totalUnClaimedThurbe))}%;`">
                        </div>
                    </div>
                </div>
            </div>
            <div class="revenue_claim">
                <div class="revenue_claim_text">
                    <p>Unclaimed Revenue</p>
                    <div class="revenue_claim_balance">
                        <div class="revenue_claim_balance_images">
                            <img src="/images/logo.png" alt="">
                            <img src="/images/logo.png" alt="">
                        </div>
                        <p>~ $0,00</p>
                    </div>
                </div>

                <button class="revenue_claim_btn" @click="claimStreamTips">
                    <CoinsIcon /> {{ claimingThurbe ? 'Claiming...' : 'Claim' }}
                </button>
            </div>
        </div> -->
    </div>
</template>

<style scoped>
.revenue_container {
    padding: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 50px;
}

.revenue {
    width: 482px;
    max-width: 100%;
    border-radius: 8px;
    background: var(--bg-dark);
    overflow: hidden;
}

.revenue_title {
    padding: 24px 30px;
    border-bottom: 2px solid var(--bg);
}

.revenue_title p {
    font-size: 12px;
    font-weight: 500;
    color: var(--tx-dimmed);
}

.revenue_title h3 {
    margin-top: 14px;
    font-size: 20px;
    line-height: 20px;
    font-weight: 600;
    color: var(--tx-normal);
}

.revenue_amount {
    padding: 24px 30px;
    border-bottom: 2px solid var(--bg);
}

.revenue_amount:first-child {
    border-bottom: 2px solid var(--bg);
}

.revenue_amount_name {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.revenue_amount_name img {
    width: 24px;
    height: 24px;
    border-radius: 8px;
    object-fit: cover;
}

.revenue_amount_name_text {
    display: flex;
    align-items: center;
    gap: 10px;
}

.revenue_amount_name_text p {
    font-size: 14px;
    font-weight: 500;
    color: var(--tx-dimmed);
}

.revenue_amount_name_text p span {
    color: var(--tx-normal);
}

.revenue_amount_percent {
    font-size: 12px;
    font-weight: 500;
    color: var(--tx-normal);
}

.revenue_amount_progress {
    margin-top: 16px;
    position: relative;
    width: 100%;
    height: 4px;
    border-radius: 2px;
    background: var(--bg-darkest);
}

.revenue_amount_bar {
    height: 100%;
    border-radius: 2px;
    background: var(--primary-light);
}

.revenue_amount_bar_dot {
    width: 14px;
    height: 14px;
    border-radius: 5px;
    background: var(--primary-light);
    border: 4px solid var(--primary);
    position: absolute;
    top: 50%;
    transform: translate(0, -50%);
}

.revenue_claim {
    padding: 24px 30px;
    border-bottom: 2px solid var(--bg);
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.revenue_claim_text>p {
    font-size: 12px;
    line-height: 12px;
    font-weight: 500;
    color: var(--tx-dimmed);
}

.revenue_claim_balance {
    margin-top: 10px;
    display: flex;
    align-items: center;
    gap: 12px;
}

.revenue_claim_balance_images {
    display: flex;
    align-items: center;
}

.revenue_claim_balance_images img {
    width: 20px;
    height: 20px;
    border-radius: 6px;
    object-fit: cover;
}

.revenue_claim_balance_images img:first-child {
    z-index: 1;
}

.revenue_claim_balance_images img:last-child {
    margin-left: -6px;
}

.revenue_claim_balance>p {
    font-size: 14px;
    font-weight: 500;
    color: var(--tx-normal);
}

.revenue_claim_btn {
    background: var(--primary-light);
    width: 113px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    gap: 10px;
    border: none;
    cursor: pointer;
    user-select: none;
}
</style>