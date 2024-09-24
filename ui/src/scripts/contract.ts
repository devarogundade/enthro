import { Visibility, type Revenue } from '../types';
import { UserResponseStatus } from '@aptos-labs/wallet-standard';
import { aptosConnectWallet } from './connect';
import { AccountAddress, Aptos, APTOS_COIN, AptosConfig, createResourceAddress, Network } from '@aptos-labs/ts-sdk';

const enthroId: string = '0xdcbba8742ffcd7d67a364f954ab1db1cbe94e4af615d453ce9f8db71bcd4fc0a';

export const aptos = new Aptos(
    new AptosConfig({ network: Network.TESTNET })
);

const Contract = {
    // === Streamer Functions ===
    async createStreamer(
        name: string,
        about: string,
        image: string,
        cover: string,
        sFollowAmount: string,
        websiteURL: string
    ): Promise<string | null> {
        try {
            const response = await aptosConnectWallet.signAndSubmitTransaction({
                payload: {
                    function: `${enthroId}::main::create_streamer`,
                    functionArguments: [
                        name,
                        about,
                        image,
                        cover,
                        `${name} followers`,
                        `${name} super followers`,
                        sFollowAmount,
                        websiteURL
                    ]
                }
            });

            if (response.status == UserResponseStatus.APPROVED) {
                return response.args.hash;
            }

            return null;
        } catch (error) {
            console.log(error);
            return null;
        }
    },

    async startStream(
        seed: string,
        title: string,
        description: string,
        visibility: Visibility,
        tips: boolean,
        thumbnail: string,
        start_secs: string,
    ): Promise<string | null> {
        try {
            const response = await aptosConnectWallet.signAndSubmitTransaction({
                payload: {
                    function: `${enthroId}::main::start_stream`,
                    functionArguments: [
                        seed,
                        title,
                        description,
                        `Stream: ${title}`,
                        visibility,
                        tips,
                        thumbnail,
                        start_secs
                    ]
                }
            });

            if (response.status == UserResponseStatus.APPROVED) {
                return response.args.hash;
            }

            return null;
        } catch (error) {
            console.log(error);
            return null;
        }
    },

    async uploadVideo(
        seed: string,
        title: string,
        description: string,
        visibility: Visibility,
        tips: boolean,
        thumbnail: string,
    ): Promise<string | null> {
        try {
            const response = await aptosConnectWallet.signAndSubmitTransaction({
                payload: {
                    function: `${enthroId}::main::upload_video`,
                    functionArguments: [
                        seed,
                        title,
                        description,
                        `Video: ${title}`,
                        visibility,
                        tips,
                        thumbnail
                    ]
                }
            });

            if (response.status == UserResponseStatus.APPROVED) {
                return response.args.hash;
            }

            return null;
        } catch (error) {
            console.log(error);
            return null;
        }
    },

    // === Viewers Functions ===
    async tipStreamer(
        stream_address: string,
        amount: string
    ): Promise<string | null> {
        try {
            const response = await aptosConnectWallet.signAndSubmitTransaction({
                payload: {
                    function: `${enthroId}::main::tip_streamer`,
                    functionArguments: [
                        stream_address,
                        amount
                    ]
                }
            });

            if (response.status == UserResponseStatus.APPROVED) {
                return response.args.hash;
            }

            return null;
        } catch (error) {
            console.log(error);
            return null;
        }
    },

    async followStreamer(
        streamer: string,
        visibility: Visibility
    ): Promise<string | null> {
        try {
            const response = await aptosConnectWallet.signAndSubmitTransaction({
                payload: {
                    function: `${enthroId}::main::follow_streamer`,
                    functionArguments: [
                        streamer,
                        visibility
                    ],
                    typeArguments: [APTOS_COIN]
                }
            });

            if (response.status == UserResponseStatus.APPROVED) {
                return response.args.hash;
            }

            return null;
        } catch (error) {
            console.log(error);
            return null;
        }
    },

    async claimEarnings(
        amount: bigint
    ): Promise<string | null> {
        try {
            const response = await aptosConnectWallet.signAndSubmitTransaction({
                payload: {
                    function: `${enthroId}::main::claim_earnings`,
                    functionArguments: [
                        amount
                    ],
                    typeArguments: [APTOS_COIN]
                }
            });

            if (response.status == UserResponseStatus.APPROVED) {
                return response.args.hash;
            }

            return null;
        } catch (error) {
            console.log(error);
            return null;
        }
    },

    async claimTips(
        amount: bigint
    ): Promise<string | null> {
        try {
            const response = await aptosConnectWallet.signAndSubmitTransaction({
                payload: {
                    function: `${enthroId}::main::claim_tips`,
                    functionArguments: [
                        amount
                    ]
                }
            });

            if (response.status == UserResponseStatus.APPROVED) {
                return response.args.hash;
            }

            return null;
        } catch (error) {
            console.log(error);
            return null;
        }
    },

    async getEarnings(
        streamer: string
    ): Promise<Revenue | null> {
        try {
            const response = (await aptos.view({
                payload: {
                    function: `${enthroId}::main::get_earnings`,
                    functionArguments: [streamer]
                },
            }));

            return {
                // @ts-ignore
                unclaimed_apt: response[0],
                // @ts-ignore
                claimed_apt: response[1],
                // @ts-ignore
                unclaimed_enthro: response[2],
                // @ts-ignore
                claimed_enthro: response[3]
            };
        } catch (error) {
            console.log(error);
            return null;
        }
    },

    newSeed(): string {
        const array = new Uint8Array(32);
        window.crypto.getRandomValues(array);
        return `0x${Array.from(array).map(byte => byte.toString(16).padStart(2, '0')).join('')}`;
    },

    getResourceAddress(
        streamer: string,
        seed: string
    ): string {
        return createResourceAddress(AccountAddress.from(streamer), seed).toString();
    }
};

export default Contract;

