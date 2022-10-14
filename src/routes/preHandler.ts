
import { AppRoute, DefaultHeaders } from "../types";
import { FastifyRequest } from "fastify";
import AppRouter from "../router";
import UserDataEncoder from "../utils/auth";

const route: AppRoute = {
    register(app) {
        AppRouter.addPreHandler<{ Headers: DefaultHeaders }>(this, app);
    },
    run: async (req: FastifyRequest<{ Headers: DefaultHeaders; }>, res) => {

        if (!req.url.startsWith("/auth") && !req.headers.authorisation) return res.status(401).send();
        else if (!req.url.startsWith("/auth") && !UserDataEncoder.decodeUserData(req.headers.authorisation)) {
            return res.send(403).send();
        };
    },
    route: "none",
    method: "GET"
};

export default route;