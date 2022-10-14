import { TicketData } from '../types';
import { TicketModel } from './index';
import { Document } from 'mongoose';

export default class TicketsDatabase {
    private constructor() { }

    public static async create(options: TicketData): Promise<TicketData> {
        const ticket = new TicketModel(options);
        await ticket.save();
        return ticket as TicketData;
    };

    public static async close(channelId: string, reason?: string) {
        return await TicketModel.findOne({ channelId })
            .updateOne(reason ? { closed: true } : { closed: true, reason }).exec()
    }

    public static async findTicketByUser(userId: string): Promise<Document<unknown, any, TicketData> | null> {
        return await TicketModel.findOne({ userId }).exec();
    };

    public static async findTicketByChannel(channelId: string): Promise<Document<unknown, any, TicketData> | null> {
        return await TicketModel.findOne({ channelId }).exec();
    };

    public static async findTicketsByStatus(closed: boolean): Promise<TicketData[] | null> {
        return await TicketModel.find({ closed }).exec()
    }

    public static async getAllTickets(): Promise<TicketData[]> {
        return await TicketModel.find().exec();
    }
}


