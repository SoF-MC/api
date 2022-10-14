import fastify, { FastifyInstance } from "fastify";
import { AppOptions, AppRoute } from "./types";
import { readdirSync } from "fs";
import config from "../config";
import start from "./bot";

export default class App {
    private constructor() { }

    private static options: AppOptions;
    private static app: FastifyInstance;

    public static start(options: AppOptions) {
        this.options = options;
        this.app = fastify();
        this.registerRoutes();
        this.app.listen({ port: config.port });
        start();
        console.log(`Started on http://localhost:${config.port}`);
    };

    private static registerRoutes() {
        readdirSync(__dirname + "/routes").forEach(async (fileName) => {
            const file = (await import(`./routes/${fileName}`)).default as AppRoute;
            file.register(this.app);
        });
    };
};

App.start({});