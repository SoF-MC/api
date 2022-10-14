import { TicketManager } from "../bot/util/tickets";
import { Client } from "discord.js";

export default class ModifedClient extends Client {
	private _ticketManager: TicketManager | null = null;

	public setTicketManager(manager: TicketManager) {
		this._ticketManager = manager;
	}

	public get ticketManager(): TicketManager {
		return this._ticketManager!;
	}
}