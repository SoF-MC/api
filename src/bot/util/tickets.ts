import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Channel, Client, ForumChannel } from "discord.js";
import TicketsDatabase from "../../database/tickets";
import config from "../../../config";

export class TicketManager {
	private client: Client;
	//@ts-ignore
	private channel: ForumChannel;
	constructor(discordClient: Client) {
		this.client = discordClient;
		this.client.channels.fetch(config.discord.settings.channel).then((c: Channel | null) => {
			if (!(c instanceof ForumChannel)) return;
			this.channel = c;
		});
	};

	async createTicket(userId: string, data: { nick: string; age: number; desc: string; }) {
		const user = await this.client.users.fetch(userId);

		this.channel.threads.create({
			name: user.tag,
			message: {
				embeds: [{
					fields: [{
						name: "Никнейм",
						value: data.nick
					}, {
						name: "Возраст",
						value: data.age.toString()
					}, {
						name: "Описание",
						value: data.desc
					}]
				}],
				components: [
					new ActionRowBuilder<ButtonBuilder>()
						.setComponents([
							new ButtonBuilder()
								.setCustomId("tickets:approve")
								.setStyle(ButtonStyle.Success)
								.setEmoji("<:yes:806122384355491862>"),
							new ButtonBuilder()
								.setCustomId("tickets:reject")
								.setStyle(ButtonStyle.Danger)
								.setEmoji("<:no:806122450131222558>")
						]
						)
				]
			},
			appliedTags: [this.channel.availableTags.filter(v => v.name === "На рассмотрении")[0].id],
		}).then((channel) => {
			TicketsDatabase.create({ userId, data, closed: false, channelId: channel.id });
		});
	};

	async approveTicket(channelId: string) {
		const ticketChannel = await this.channel.threads.fetch(channelId);

		(await ticketChannel?.fetchStarterMessage())?.edit({
			components: [
				new ActionRowBuilder<ButtonBuilder>()
					.setComponents([
						new ButtonBuilder()
							.setCustomId("tickets:approve")
							.setStyle(ButtonStyle.Success)
							.setEmoji("<:yes:806122384355491862>")
							.setDisabled(true),
						new ButtonBuilder()
							.setCustomId("tickets:reject")
							.setStyle(ButtonStyle.Danger)
							.setEmoji("<:no:806122450131222558>")
							.setDisabled(true)
					])
			]
		});

		ticketChannel?.setAppliedTags([this.channel.availableTags.filter(v => v.name === "Принят")[0].id]);
		TicketsDatabase.close(channelId);
	};

	async rejectTicket(channelId: string, reason: string) {
		const ticketChannel = await this.channel.threads.fetch(channelId);

		(await ticketChannel?.fetchStarterMessage())?.edit({
			components: [
				new ActionRowBuilder<ButtonBuilder>()
					.setComponents([
						new ButtonBuilder()
							.setCustomId("tickets:approve")
							.setStyle(ButtonStyle.Success)
							.setEmoji("<:yes:806122384355491862>")
							.setDisabled(true),
						new ButtonBuilder()
							.setCustomId("tickets:reject")
							.setStyle(ButtonStyle.Danger)
							.setEmoji("<:no:806122450131222558>")
							.setDisabled(true)
					])
			]
		});

		ticketChannel?.setAppliedTags([this.channel.availableTags.filter(v => v.name == "Не принят")[0].id]);
		TicketsDatabase.close(channelId, reason);
	};
};