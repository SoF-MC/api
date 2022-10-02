import { FastifyInstance, HookHandlerDoneFunction } from "fastify";
import { AppRoute } from "./types";

export default class AppRouter {
    public static registerRoute(options: AppRoute, app: FastifyInstance) {
        app.register((fastify: FastifyInstance, _: any, done: HookHandlerDoneFunction) => {
            fastify.route({ method: options.method, url: options.route, handler: options.run })
            done();
        })
    }
}