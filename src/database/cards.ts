import { CardModel } from '.';
import { CardData, UserData } from '../types';
import ActionDatabase from './logs';

export default class CardDatabase {
	private constructor() { }
	public static async createCard(name: string, ownerId: string): Promise<Card> {
		new CardModel({ name, ownerId, balance: 0 }).save();
		return new Card(ownerId, name);
	};

	public static async findCardByOwnerId(ownerId: string): Promise<Card | void> {
		const data = await CardModel.findOne({ ownerId }).exec();
		if (!data) return;
		return new Card(data.ownerId, data.name, data.balance);
	};

	public static async getAllCards(): Promise<Card[]> {
		const data = await CardModel.find().exec();
		const cards: Card[] = [];
		data.forEach((data) => {
			cards.push(new Card(data.ownerId, data.name, data.balance))
		})
		return cards;
	}
}


export class Card {
	private ownerId: string;
	private name: string;
	private balance: number;

	constructor(ownerId: string, name: string, balance?: number) {
		this.ownerId = ownerId;
		this.name = name;
		this.balance = balance ?? 0
	}

	public transfer(card: Card, amount: number) {
		if (amount < 1) return "Amount must be more than 0";
		if (this.balance < amount) return "Not enough money";
		this.addBalance(-amount);
		card.addBalance(amount);
		ActionDatabase.logAction({
			userId: this.ownerId,
			amount: -amount,
			recieverId: card.ownerId
		})
		ActionDatabase.logAction({
			userId: card.ownerId,
			amount: amount,
			recieverId: this.ownerId
		})
		return this;
	};

	public async setBalance(amount: number,) {
		ActionDatabase.logAction({
			userId: this.ownerId,
			amount: this.balance - amount
		})
		this.balance = amount;
		await this.update();
		return this;
	}

	public async addBalance(num: number) {
		this.balance += num;
		await this.update();
		return this;
	}

	private async update() {
		return await CardModel.findOne({ ownerId: this.ownerId })
			.updateOne(this.data).exec()
	}

	public get data(): CardData {
		return {
			ownerId: this.ownerId,
			name: this.name,
			balance: this.balance
		}
	}

}