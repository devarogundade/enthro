<template>
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M3.45336 10.1978C2.61497 10.6892 0.416788 11.6926 1.75563 12.9482C2.40964 13.5615 3.13805 14.0002 4.05383 14.0002H9.27946C10.1952 14.0002 10.9236 13.5615 11.5777 12.9482C12.9165 11.6926 10.7183 10.6892 9.87994 10.1978C7.91394 9.04541 5.41935 9.04541 3.45336 10.1978Z"
            :stroke="props.color || 'var(--tx-semi)'" stroke-width="1.2" stroke-linecap="round"
            stroke-linejoin="round" />
        <path
            d="M9.33333 4.66667C9.33333 6.13943 8.13943 7.33333 6.66667 7.33333C5.19391 7.33333 4 6.13943 4 4.66667C4 3.19391 5.19391 2 6.66667 2C8.13943 2 9.33333 3.19391 9.33333 4.66667Z"
            :stroke="props.color || 'var(--tx-semi)'" stroke-width="1.2" />
        <path d="M11.3333 3.80952C11.3333 3.80952 12 4.15715 12.3333 4.66667C12.3333 4.66667 13.3333 2.66667 14.6666 2"
            :stroke="props.color || 'var(--tx-semi)'" stroke-width="1.2" stroke-linecap="round"
            stroke-linejoin="round" />
    </svg>
</template>

<script setup lang="ts">
const props = defineProps({
    color: { type: String, required: false }
});
</script>
