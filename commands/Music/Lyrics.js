const { request } = require("undici");
const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');

module.exports = { 
    name: ["music", "lyric"],
    description: "Display lyrics of a song.",
    category: "Music",
    options: [
        {
            name: "result",
            description: "Song name to return lyrics for.",
            type: ApplicationCommandOptionType.String,
            required: false,
        }
    ],
    run: async (client, interaction) => {
        const player = client.manager.players.get(interaction.guild.id);
        if (!player) return interaction.reply(`No playing in this guild!`);
        const { channel } = interaction.member.voice;
        if (!channel || interaction.member.voice.channel !== interaction.guild.members.me.voice.channel) return interaction.reply(`I'm not in the same voice channel as you!`);

        let song = interaction.options.getString("result");
        let CurrentSong = player.queue.current;
        if (!song && CurrentSong) song = CurrentSong.title;

        let lyrics = null;

        try {
            lyrics = await request(`https://api.vinndev.me/lyrics/search?q=${song}`);
            if (!lyrics || lyrics.data) return interaction.reply(`No lyrics found for ${song}`);
        } catch (err) {
            console.log(err);
            return interaction.reply(`No lyrics found for ${song}`);
        }

        const result = lyrics.data;

        let lyricsEmbed = new EmbedBuilder()
            .setColor(client.color)
            .setAuthor({ name: result.artists.map(artist => artist).join(", ") })
            .setTitle(result.title)
            .setDescription(result.lyrics.length > 4096 ? result.lyrics.substr(0, 4093)+'...' : result.lyrics)
            .setThumbnail(result.thumbnail)
            .setFooter({ text: `Source: ${result.source} | Powered by ${lyrics.provider.name}`})
            .setTimestamp();

        interaction.reply({ embeds: [lyricsEmbed] });
    }
};