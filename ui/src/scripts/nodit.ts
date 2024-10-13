import type { CurrentTokenOwnershipV2 } from "@/types";
import { APTOS_COIN } from "@aptos-labs/ts-sdk";
import axios from 'axios';

const client = axios.create({
    baseURL: import.meta.env.VITE_NODIT_URL_KEY
});

export async function getUserAPTBalance(
    accountAddress: string
): Promise<number> {
    try {
        const response = await client.post('/', {
            query: `{
                current_coin_balances(
                    where: {owner_address: {_eq: "${accountAddress}"}, coin_type: {_eq: "${APTOS_COIN}"}},
                    limit: 1                    
                ) {
                    amount
                }
            }`
        });

        return response.data.data.current_coin_balances[0].amount;
    } catch (error) {
        console.log(error);
        return 0;
    }
}

export async function hasToken(
    collection: string,
    accountAddress: string
): Promise<boolean> {
    try {
        const response = await client.post('/', {
            query: `{
                current_token_ownerships_v2(
                    where: {owner_address: {_eq: "${accountAddress}"}, current_token_data: {collection_id: {_eq: "${collection}"}}},
                    order_by: {amount: desc}
                ) {
                    current_token_data {
                        collection_id
                        token_name
                        description
                        token_uri
                        token_data_id
                    }
                    amount
                }
            }`
        });

        const tokens = response.data.data.current_token_ownerships_v2 as CurrentTokenOwnershipV2[];

        return tokens.length > 0;
    } catch (error) {
        console.log(error);
        return false;
    }
}