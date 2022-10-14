import { AppRoute, DefaultHeaders, UserData } from "../types";
import { FastifyRequest } from "fastify";
import TicketsDatabase from "../database/tickets";
import UserDataEncoder from "../utils/auth";
import AppRouter from "../router";

const route: AppRoute = {
    register(app) {
        AppRouter.registerRoute<{}>(this, app);
    },
    run: async (req: FastifyRequest<{ Headers: DefaultHeaders }>, res) => {
        const { authorisation } = req.headers;
        const user: UserData | undefined = UserDataEncoder.decodeUserData(authorisation);
        if (!user) return res.status(404)
        const ticket = await TicketsDatabase.findTicketByUser(user.id);
        if (!ticket) return res.status(404);
        console.log(ticket)
        return res.send(JSON.stringify(ticket.toJSON()))
    },
    route: "/tickets/get",
    method: "GET"
};

export default route;