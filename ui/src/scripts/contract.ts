import { Visibility, type Revenue } from '../types';
import { UserResponseStatus } from '@aptos-labs/wallet-standard';
import { aptosConnectWallet } from './connect';
import { AccountAddress, Aptos, APTOS_COIN, AptosConfig, createResourceAddress, Network } from '@aptos-labs/ts-sdk';

const enthroId: string = '0xb0373f9f60ec4e3ff6668985b48c5756368873c99a2b7cf12a150b20d59aab05';

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
    async tipStream(
        stream_address: string,
        amount: string
    ): Promise<string | null> {
        try {
            const response = await aptosConnectWallet.signAndSubmitTransaction({
                payload: {
                    function: `${enthroId}::main::tip_stream`,
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

    async tipVideo(
        video_address: string,
        amount: string
    ): Promise<string | null> {
        try {
            const response = await aptosConnectWallet.signAndSubmitTransaction({
                payload: {
                    function: `${enthroId}::main::tip_video`,
                    functionArguments: [
                        video_address,
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

    async claimStreamTips(
        stream_address: string,
        amount: bigint
    ): Promise<string | null> {
        try {
            const response = await aptosConnectWallet.signAndSubmitTransaction({
                payload: {
                    function: `${enthroId}::main::claim_stream_tips`,
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

    async claimVideoTips(
        video_address: string,
        amount: bigint
    ): Promise<string | null> {
        try {
            const response = await aptosConnectWallet.signAndSubmitTransaction({
                payload: {
                    function: `${enthroId}::main::claim_video_tips`,
                    functionArguments: [
                        video_address,
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

            // @ts-ignore
            return { unclaimed: response[0], claimed: response[1] };
        } catch (error) {
            console.log(error);
            return null;
        }
    },

    async getStreamTips(
        stream_address: string
    ): Promise<Revenue | null> {
        try {
            const response = (await aptos.view({
                payload: {
                    function: `${enthroId}::main::get_stream_tips`,
                    functionArguments: [stream_address]
                },
            }));

            // @ts-ignore
            return { unclaimed: response[0], claimed: response[1] };
        } catch (error) {
            console.log(error);
            return null;
        }
    },

    async getVideoTips(
        video_address: string
    ): Promise<Revenue | null> {
        try {
            const response = (await aptos.view({
                payload: {
                    function: `${enthroId}::main::get_video_tips`,
                    functionArguments: [video_address]
                },
            }));

            // @ts-ignore
            return { unclaimed: response[0], claimed: response[1] };
        } catch (error) {
            console.log(error);
            return null;
        }
    },

    getResourceAddress(
        streamer: string,
        seed: string
    ): string {
        return createResourceAddress(AccountAddress.from(streamer), seed).toString();
    }
};

export default Contract;

