import { ButtonInteraction, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } from "discord.js";
import ModifedClient from "../../classes/ModifedClient";

export const buttonHandler = async (interaction: ButtonInteraction, client: ModifedClient) => {
    if (interaction.customId === "tickets:approve") {
        await client.ticketManager.approveTicket(interaction.channelId);
        return interaction.reply({ content: "✅ Успешно", ephemeral: true });
    };

    if (interaction.customId === "tickets:reject") {
        /*await interaction.showModal(
            new ModalBuilder()
                .setTitle("Причина")
                .setCustomId("tickets:reason")
                .setComponents([
                    new ActionRowBuilder<TextInputBuilder>().addComponents(
                        new TextInputBuilder()
                            .setStyle(TextInputStyle.Short)
                            .setCustomId("tickets:reason:reason")
                            .setLabel("Укажите причину")
                    )]
                )
        );

        return await interaction.awaitModalSubmit({ filter: (i) => i.customId == "tickets:reason", time: 60 * 60 * 1000 })
            .then(i => {
                client.ticketManager.rejectTicket(interaction.channel?.id as string, i.fields.getField("tickets:reason:reason") as any as string);
                return i.reply({ ephemeral: true, content: "✅ Успешно" });
            })
            .catch(console.error);*/

        await client.ticketManager.rejectTicket(interaction.channelId, "Sussy baka loh");
        return interaction.reply({ content: "✅ Успешно", ephemeral: true });
    };
};