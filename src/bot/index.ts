import { GatewayIntentBits, Interaction } from "discord.js";
import { buttonHandler } from "./handlers/buttons";
import { TicketManager } from "./util/tickets";
import ModifedClient from "../classes/ModifedClient";
import config from "../../config";

export const client = new ModifedClient({ intents: [GatewayIntentBits.Guilds] });

client.once("ready", () => {
    client.setTicketManager(new TicketManager(client));
    //client.ticketManager.createTicket("525748937349529602", { nick: "asdasd", age: 123, desc: "иди нахуй" });

    console.log("Logged in as " + client.user?.tag);
});

client.on("interactionCreate", (interaction: Interaction) => {
    //@ts-ignore
    console.log("Recieved interaction with custom id: " + interaction.customId);

    if (interaction.isButton()) buttonHandler(interaction, client);
});

export default () => {
    client.login(config.discord.token);
};