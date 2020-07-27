const { MessageEmbed } = require('discord.js');

module.exports = {
    config: {
        name: 'ping',
        description: 'Ping Pong with the bot.',
        usage: 'ping',
        accessableby: 'Members',
        aliases: [],
        category: 'fun',
    },
    run: async (client, message, args) => {
        const embed = new MessageEmbed()
            .setTitle('🏓 Pong!')
            .setDescription(`The ping is: **${Date.now() - message.createdTimestamp} ms**`)
            .setColor(message.color)

        const msg = await message.channel.send('Calculating...');
        msg.edit('', embed)
    }
}
