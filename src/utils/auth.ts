import { UserData } from '../types';

export default class UserDataEncoder {
    private constructor() { };

    private static cache: Map<string, UserData> = new Map<string, UserData>();

    public static encodeUserData(user: UserData): string {
        const token = `${Buffer.from(user.id).toString("base64")}.${Buffer.from(Date.now().toString()).toString("base64")}`
        this.cache.set(token, user);
        return token;
    }

    public static decodeUserData(token: string): UserData | undefined {
        return this.cache.get(token);
    }
}

