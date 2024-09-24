import type { CurrentTokenOwnershipV2 } from "@/types";
import axios from 'axios';

const client = axios.create({
    baseURL: `https://api.testnet.aptoslabs.com/v1/graphql`,
    // baseURL: `https://aptos-testnet.nodit.io/${import.meta.env.VITE_NODIT_KEY}/v1/graphql`,
});

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