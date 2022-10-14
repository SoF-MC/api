import mongoose from "mongoose";

import config from "../../config"
import { ActionData, CardData, TicketData } from '../types';

mongoose.connect(config.mongodb);

export const CardModel = mongoose.model<CardData>("cards", new mongoose.Schema<CardData>({
    ownerId: String,
    name: String,
    balance: Number
}))

export const TicketModel = mongoose.model<TicketData>("tickets", new mongoose.Schema<TicketData>({
    userId: String,
    data: {
        nick: String,
        age: String,
        desc: String
    },
    channelId: String,
    reason: { type: String, required: false },
    closed: Boolean
}))

export const LogModel = mongoose.model<ActionData>("logs", new mongoose.Schema<ActionData>({
    createdAt: String,
    userId: String,
    recieverId: String,
    amount: Number
}))