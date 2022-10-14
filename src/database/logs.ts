import { ActionData } from '../types';
import { LogModel } from './index';

export default class ActionDatabase {
	private constructor() { }

	public static async logAction(options: ActionData): Promise<ActionData> {
		const log = new LogModel(options);
		await log.save();
		return log as ActionData;
	};

	public static async findActionsByActionedUser(userId: string): Promise<ActionData[]> {
		return await LogModel.find({ userId }).exec();
	};

	public static async findActionsByRecievedUser(recieverId: string) {
		return await LogModel.find({ recieverId }).exec();
	};

	public static async findActionById(id: string): Promise<ActionData | null> {
		return await LogModel.findById(id).exec()
	}

	public static async getAllLogs(): Promise<ActionData[]> {
		return await LogModel.find().exec();
	}
}
