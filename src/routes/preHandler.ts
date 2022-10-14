
import { AppRoute, DefaultHeaders } from "../types";
import { FastifyRequest } from "fastify";
import AppRouter from "../router";

const route: AppRoute = {
    register(app) {
        AppRouter.addPreHandler<{ Headers: DefaultHeaders }>(this, app);
    },
    run: async (req: FastifyRequest<{ Headers: DefaultHeaders; }>, res) => {

        if (!req.url.startsWith("/auth") && !req.headers.authorisation) return res.status(403).send();
        else if (!req.url.startsWith("/auth")) { };
    },
    route: "none",
    method: "GET"
};

export default route;