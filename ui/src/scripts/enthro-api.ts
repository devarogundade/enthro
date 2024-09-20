import type { Account, Channel, Paged, Stream, StreamType, Video, Visibility } from '@/types';
import axios from 'axios';

const client = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL
});

const EnthroAPI = {
    async createAccount(
        address: string,
        name: string,
        email: string,
        image: string | null
    ): Promise<Account | null> {
        try {
            const response = await client.post('/create-account', {
                address, name, email, image
            });

            return response.data;
        } catch (error) {
            console.error(error);
            return null;
        }
    },

    async createChannel(
        address: string,
        name: string,
        image: string,
        cover: string | null,
        s_follow_amount: number
    ): Promise<Channel | null> {
        try {
            const channel: Channel = {
                owner: address,
                name,
                image,
                cover,
                s_follow_amount,
                created_at: new Date()
            };
            const response = await client.post('/create-channel', channel);

            return response.data;
        } catch (error) {
            console.error(error);
            return null;
        }
    },

    async followAccount(
        streamer: string,
        viewer: string
    ): Promise<boolean> {
        try {
            const response = await client.post(`/follow-account/${streamer}/${viewer}`);
            return response.data;
        } catch (error) {
            console.error(error);
            return false;
        }
    },

    async unfollowAccount(
        streamer: string,
        viewer: string
    ): Promise<boolean> {
        try {
            const response = await client.post(`/unfollow-account/${streamer}/${viewer}`);
            return response.data;
        } catch (error) {
            console.error(error);
            return false;
        }
    },

    async createStream(
        streamAddress: string,
        address: string,
        name: string,
        description: string | null,
        thetaId: string | null,
        thumbnail: string,
        visibility: Visibility,
        streamType: StreamType,
        tips: boolean,
        start_at: Date
    ): Promise<Stream | null> {
        try {
            const stream: Stream = {
                streamAddress,
                streamer: address,
                name, description,
                thumbnail,
                thetaId,
                visibility,
                tips,
                start_at,
                stream_server: null,
                stream_key: null,
                viewers: [],
                likes: [],
                created_at: new Date(),
                dislikes: [],
                streamType,
                live: false
            };
            const response = await client.post('/create-stream', stream);

            return response.data;
        } catch (error) {
            console.error(error);
            return null;
        }
    },

    async endStream(streamAddress: string): Promise<boolean> {
        try {
            const response = await client.post(`/end-stream/${streamAddress}`);
            return response.data;
        } catch (error) {
            console.error(error);
            return false;
        }
    },

    async joinStream(
        viewer: string,
        streamAddress: string
    ): Promise<boolean> {
        try {
            const response = await client.post(`/join-stream/${viewer}/${streamAddress}`);
            return response.data;
        } catch (error) {
            console.error(error);
            return false;
        }
    },

    async likeStream(
        viewer: string,
        streamAddress: string
    ): Promise<boolean> {
        try {
            const response = await client.post(`/like-stream/${viewer}/${streamAddress}`);
            return response.data;
        } catch (error) {
            console.error(error);
            return false;
        }
    },

    async likeVideo(
        viewer: string,
        videoAddress: string
    ): Promise<boolean> {
        try {
            const response = await client.post(`/like-video/${viewer}/${videoAddress}`);
            return response.data;
        } catch (error) {
            console.error(error);
            return false;
        }
    },

    async dislikeStream(
        viewer: string,
        streamAddress: string
    ): Promise<boolean> {
        try {
            const response = await client.post(`/dislike-stream/${viewer}/${streamAddress}`);
            return response.data;
        } catch (error) {
            console.error(error);
            return false;
        }
    },

    async dislikeVideo(
        viewer: string,
        videoAddress: string
    ): Promise<boolean> {
        try {
            const response = await client.post(`/dislike-video/${viewer}/${videoAddress}`);
            return response.data;
        } catch (error) {
            console.error(error);
            return false;
        }
    },

    async uploadVideo(
        videoAddress: string,
        address: string,
        name: string,
        description: string | null,
        thumbnail: string,
        visibility: Visibility,
        thetaId: string | null,
        tips: boolean,
    ): Promise<Video | null> {
        try {
            const payload: Video = {
                videoAddress,
                streamer: address,
                name,
                description,
                thumbnail,
                visibility,
                thetaId,
                tips,
                viewers: [],
                views: 0,
                created_at: new Date(),
                likes: [],
                dislikes: []
            };

            const response = await client.post('/upload-video', payload);

            return response.data;
        } catch (error) {
            console.error(error);
            return null;
        }
    },

    async watchVideo(
        viewer: string,
        videoAddress: string
    ): Promise<boolean> {
        try {
            const response = await client.post(`/watch-video/${viewer}/${videoAddress}`);
            return response.data;
        } catch (error) {
            console.error(error);
            return false;
        }
    },

    async getStreams(
        page: number,
        streamer: string | null
    ): Promise<Paged<Stream[]> | null> {
        try {
            const response = await client.get(`/streams?page=${page}&streamer=${streamer}`);
            return response.data;
        } catch (error) {
            console.error(error);
            return null;
        }
    },

    async getStream(
        streamAddress: string
    ): Promise<Stream | null> {
        try {
            const response = await client.get(`/streams/${streamAddress}`);
            return response.data;
        } catch (error) {
            console.error(error);
            return null;
        }
    },

    async startStream(streamAddress: string, streamServer: string, streamKey: string): Promise<boolean> {
        try {
            const response = await client.post(`/start-stream/${streamAddress}?streamServer=${streamServer}&streamKey=${streamKey}`);
            return response.data;
        } catch (error) {
            console.error(error);
            return false;
        }
    },

    async getVideos(
        page: number,
        streamer: string | null
    ): Promise<Paged<Video[]> | null> {
        try {
            const response = await client.get(`/videos?page=${page}&streamer=${streamer}`);
            return response.data;
        } catch (error) {
            console.error(error);
            return null;
        }
    },

    async getVideo(
        streamAddress: string
    ): Promise<Video | null> {
        try {
            const response = await client.get(`/videos/${streamAddress}`);
            return response.data;
        } catch (error) {
            console.error(error);
            return null;
        }
    },

    async getAccount(
        address: string
    ): Promise<Account | null> {
        try {
            const response = await client.get(`/accounts/${address}`);
            return response.data;
        } catch (error) {
            console.error(error);
            return null;
        }
    },

    async getChannels(
        page: number,
    ): Promise<Paged<Channel[]> | null> {
        try {
            const response = await client.get(`/channels?page=${page}`);
            return response.data;
        } catch (error) {
            console.error(error);
            return null;
        }
    },

    async getChannel(
        address: string
    ): Promise<Channel | null> {
        try {
            const response = await client.get(`/channels/${address}`);
            return response.data;
        } catch (error) {
            console.error(error);
            return null;
        }
    }
};

export default EnthroAPI;