import { AppRoute, DiscordRawApiData, UserData } from "../types";
import { FastifyRequest } from "fastify";
import DiscordUsers from "../utils/userFetch";
import UserDataEncoder from "../utils/auth";
import discordoauth2 from "discord-oauth2";
import AppRouter from "../router";
import config from "../../config";
const oauth2 = new discordoauth2({
	clientId: config.discord.id,
	clientSecret: config.discord.secret,
	redirectUri: config.url + "/auth"
});

const route: AppRoute = {
	register(app) {
		AppRouter.registerRoute<{ Querystring: { code: string; }; }>(this, app);
	},
	run: async (req: FastifyRequest<{ Querystring: { code: string; }; }>, res) => {
		if (!req.query.code) return res.redirect(
			oauth2.generateAuthUrl({ scope: "identify", responseType: "code" })
		);

		const accessToken = (await oauth2.tokenRequest({
			scope: "identify",
			code: req.query.code as string,
			grantType: "authorization_code",
		})).access_token;
		if (!accessToken) return res.redirect("/api/auth");

		const userRow: DiscordRawApiData = await oauth2.getUser(accessToken) as any as DiscordRawApiData;
		const user: UserData = {
			id: userRow.id,
			username: userRow.username,
			avatar: `https://cdn.discordapp.com/avatars/${userRow.id}/${userRow.avatar}.png`,
			discriminator: userRow.discriminator,
			tag: `${userRow.username}#${userRow.discriminator}`
		};

		DiscordUsers.setInCache(user.id, user);
		console.log(`${user.id} (${user.username}#${user.discriminator}) logged in at IP ${req.socket.remoteAddress}`);
		return res.redirect(config.redirectUrl + `?auth=${UserDataEncoder.encodeUserData(user)}`);
	},
	route: "/auth",
	method: "GET"
};

export default route;