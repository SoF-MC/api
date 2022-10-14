import { AppRoute, DefaultHeaders, UserData } from "../types";
import { FastifyRequest } from "fastify";
import UserDataEncoder from "../utils/auth";
import AppRouter from "../router";

const route: AppRoute = {
    register(app) {
        AppRouter.registerRoute<{}>(this, app);
    },
    run: (req: FastifyRequest<{ Headers: DefaultHeaders }>, res) => {
        const user: UserData | undefined = UserDataEncoder.decodeUserData(req.headers.authorisation);

        return res.send(JSON.stringify(user));
    },
    route: "/user",
    method: "GET"
};

export default route;