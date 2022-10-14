import { FastifyInstance, HookHandlerDoneFunction, RouteGenericInterface } from "fastify";
import { AppRoute } from "./types";

export default class AppRouter {
    public static registerRoute<T extends RouteGenericInterface>(options: AppRoute, app: FastifyInstance) {
        app.register((fastify: FastifyInstance, _: any, done: HookHandlerDoneFunction) => {
            fastify.route<T>({ method: options.method, url: options.route, handler: options.run, schema: options.schema })
            done();
        })
    };

    public static addPreHandler<T extends RouteGenericInterface>(options: AppRoute, app: FastifyInstance,) {
        app.addHook<T>("preHandler", options.run);
    };
};