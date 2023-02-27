const { Client } = require("discord.js");

module.exports = async (client) => {
    console.log(`[INFO] - ${client.user.username} (${client.user.id}) is Ready!`);

    const activity = {
        name: `/play <songs>`,
        type: 2,
    };

    client.user.setPresence({ 
        activities: [activity], 
        status: 'online'
    });
};
