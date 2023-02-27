const { EmbedBuilder } = require("discord.js");
const { readdirSync } = require("fs");

module.exports = {
    name: ["help"],
    description: "Display all commands bot has.",
    category: "Info",
    run: async (client, interaction) => {
        const embed = new EmbedBuilder()
            .setColor(client.color)
            .setAuthor({ name: `${interaction.guild.members.me.displayName} Help`, iconURL: interaction.guild.iconURL({ dynamic: true })})
            .setDescription(`The bot prefix is: **/**`)
            .setFooter({ text: `${client.commands.size} Commands` })

        const categories = readdirSync("./commands/");
        categories.forEach(category => {
            const dir = client.commands.filter(c => c.category === category);
            const capitalise = category.slice(0, 1).toUpperCase() + category.slice(1);

            try {
                embed.addFields({ name: `[${dir.size}] ${capitalise}`, value: `${dir.map(c => `\`${c.name.at(-1)}\``).join(", ")}`, inline: false })
            } catch(e) {
                console.log(e)
            }
        })
        return interaction.reply({ embeds: [embed] })
    }
}