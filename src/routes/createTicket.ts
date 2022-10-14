import { AppRoute, DefaultHeaders, UserData } from "../types";
import { FastifyRequest } from "fastify";
import { client } from "../bot/index";
import TicketsDatabase from "../database/tickets";
import UserDataEncoder from "../utils/auth";
import AppRouter from "../router";

interface TicketCreateRequestBody {
    nick: string,
    age: number,
    desc: string
}

const route: AppRoute = {
    register(app) {
        AppRouter.registerRoute<{}>(this, app);
    },
    run: async (req: FastifyRequest<{ Headers: DefaultHeaders, Body: TicketCreateRequestBody }>, res) => {
        const user: UserData | undefined = UserDataEncoder.decodeUserData(req.headers.authorisation);
        if (!user) return res.status(404);
        if (!await TicketsDatabase.findTicketByUser(user.id)) {
            await client.ticketManager.createTicket(user.id, req.body);
            return res.status(200);
        };
        return res.status(403);
    },
    route: "/tickets/create",
    method: "POST"
};

export default route;