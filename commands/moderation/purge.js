const Discord = require('discord.js');
const moment = require('moment');

module.exports = {
    config: {
        name: 'purge',
        description: 'Delete messages in a channel from 1-99.',
        usage: 'purge <amount>',
        accessableby: 'Moderators',
        aliases: ['purge'],
        category: 'moderation',
    },
    run: async (client, message, args) => {
        // Checks if the bot has either Manage Messages or Admin Permission
        if (!message.guild.me.hasPermission(['MANAGE_MESSAGES', 'ADMINISTRATOR']))
            return message.channel.send('I don\'t have the permission to `Manage Messages`');

        // Check if the author has Manage Messages Permission
        if (!message.member.hasPermission(['MANAGE_MESSAGES']))
            return message.channel.send(`${message.author.username}, you need the \`Manage Messages\` permission to execute this command.`);

        const amount = parseInt(args[0]) + 1;

        // Check if the amount is below 1 or over 100
        if (isNaN(amount) || amount <= 1 || amount > 100)
            return message.channel.send(`${message.author.username}, please select a number between \`1-99\``);

        // Amount: 1-99 = true
        message.channel.bulkDelete(amount, true)

        // Message embed
        const embed = new Discord.MessageEmbed()
            .setColor(message.color)
            .addField('Cleared by:', `${message.author}`)
            .addField('Cleared in:', message.channel)
            .addField('Total Message/s Deleted:', amount)
            .addField('Date:', moment.utc(message.createdAt).format('dddd, MMMM Do YYYY'))
            .setAuthor(`Bulk Moderation`, message.author.avatarURL({ dynamic: true, format: 'png' }));

        message.channel.bulkDelete(amount);
        if (message.log) message.log.send(embed)
    }
}
