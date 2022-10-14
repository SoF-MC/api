import { AppRoute, DefaultHeaders, TransferOptions, UserData } from "../types";
import { Card } from "../database/cards";
import { FastifyRequest } from "fastify";
import CardDatabase from "../database/cards";
import UserDataEncoder from "../utils/auth";
import AppRouter from "../router";

const route: AppRoute = {
	register(app) {
		AppRouter.registerRoute<{ Headers: DefaultHeaders, Body: TransferOptions }>(this, app);
	},
	run: async (req: FastifyRequest<{ Headers: DefaultHeaders, Body: TransferOptions }>, res) => {
		const user: UserData = UserDataEncoder.decodeUserData(req.headers.authorisation) as UserData;

		const card = await CardDatabase.findCardByOwnerId(user.id);
		const recieverCard = await CardDatabase.findCardByOwnerId(req.body.recieverId);
		if (!card || !recieverCard) return 404;

		const reply: Card | string = card.transfer(recieverCard, req.body.amount);
		if (!(reply instanceof Card)) return res.code(400).send(reply);

		return res.code(200).send(JSON.stringify(reply.data));
	},
	route: "/card/transfer",
	method: "POST"
};

export default route;