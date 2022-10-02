import axios from "axios"
import config from "../../config"
import { UserData, DiscordRawApiData } from '../types';

export default class DiscordUsers {
    private static cache: Map<string, UserData> = new Map();

    private constructor() { }

    private static async getUser(id: string): Promise<UserData | void> {
        try {
            const res = await axios.get<DiscordRawApiData>(`https://discord.com/api/v10/users/${id}`, {
                headers: {
                    Authorization: `Bot ${config.discord.token}`
                }
            })
            if (res.status !== 200) return;
            const user: UserData = {
                id: res.data.id,
                username: res.data.username,
                tag: res.data.username + res.data.discriminator,
                avatar: `https://cdn.discordapp.com/avatars/${res.data.id}/${res.data.avatar}.png`,
                discriminator: res.data.discriminator
            }
            this.cache.set(id, user)
            return user;
        } catch (e) {
            return;
        }
    }

    public static async fetch(id: string) {
        if (!this.cache.get(id))
            return await this.getUser(id).then(u => {
                return this.cache.get(id)
            })
        return this.cache.get(id)
    }

    public static setInCache(id: string, user: UserData) {
        return (this.cache.set(id, user).get(id))
    }
}