import type { Stream } from '@/types';
import axios from 'axios';

const client = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL
});

const EnthroAPI = {
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
    }
};

export default EnthroAPI;