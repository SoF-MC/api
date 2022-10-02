import { supabase } from '.';
import { UserData } from '../types';
//import ActionDatabase from './log';

export default class CardDatabase {
    private constructor() { }
    public static async createCard(name: string, ownerId: string): Promise<Card> {
        const { data } = await supabase.from("cards").select("*").eq("ownerId", ownerId)
        if (data) throw new Error("This user alerady has card");
        await supabase.from("cards").insert([{
            ownerId,
            name,
            diamonds: 0,
            vans: 0
        }])
        return new Card(ownerId, name)
    };

    public static async findCardByOwnerId(ownerId: string): Promise<Card | void> {
        const req = await supabase.from("cards").select("*").eq("ownerId", ownerId) as any
        const data = req.data[0];
        if (!data) return;
        return new Card(ownerId, data.name, { vans: data.vans, diamonds: data.diamonds })
    };
    public static async getAllCards() {
        const req = await supabase.from("cards").select("*")
        const cards: Card[] = [];
        req.data?.forEach((data: UserData) => {
            //cards.push(new Card(data.ownerId, data.name, { vans: data.vans, diamonds: data.diamonds }))
        })
        return cards.filter((card) => { return card.data.ownerId !== "" });
    }
}


export class Card {

    private ownerId: string;
    private name: string;
    private balance: { vans: number, diamonds: number };

    constructor(ownerId: string, name: string, balance?: { vans?: number, diamonds?: number }) {
        this.ownerId = ownerId;
        this.name = name;
        this.balance = {
            vans: balance?.vans ?? 0,
            diamonds: balance?.diamonds ?? 0
        }
    }

    public transfer(card: Card, amount: number, currency: "0" | "1") {
        const bal = this.balance[currency === "0" ? "vans" : "diamonds"]
        if (amount < 1) return "Amount must be more than 0";
        if (bal < amount) return "Not enough money";
        this.addBalance(-amount, currency);
        card.addBalance(amount, currency);
        // ActionDatabase.logAction({
        //     userId: this.ownerId,
        //     amount: -amount,
        //     currency,
        //     recieverId: card.data.ownerId
        // })
        // ActionDatabase.logAction({
        //     userId: card.data.ownerId,
        //     amount,
        //     currency,
        //     recieverId: this.ownerId
        // })
        return this;
    };

    public async setBalance(amount: number, currency: "0" | "1") {
        // ActionDatabase.logAction({
        //     userId: this.ownerId,
        //     amount: amount - this.balance[currency === "0" ? "vans" : "diamonds"],
        //     currency,
        // })
        this.balance[currency === "0" ? "vans" : "diamonds"] = amount;
        const res = await this.update();
        if (res.error) return;
        return this;
    }

    public async addBalance(num: number, currency: "0" | "1") {
        const cur = currency === "0" ? "vans" : "diamonds"
        this.balance[cur] += num;
        const res = await this.update();
        if (res.error) return;
        return this;
    }

    private async update() {
        return await supabase.from("cards").update({
            name: this.name,
            vans: this.balance.vans,
            diamonds: this.balance.diamonds
        }).match({ ownerId: this.ownerId })
    }

    public get data(): { ownerId: string, name: string, balance: { vans: number, diamonds: number } } {
        return {
            ownerId: this.ownerId,
            name: this.name,
            balance: this.balance
        }
    }

}