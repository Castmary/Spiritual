const { MessageEmbed } = require('discord.js');
const moment = require('moment');
const ms = require('ms');

module.exports = {
    config: {
        name: 'slowmode',
        description: 'Puts the selected channel into slowmode.',
        usage: 'slowmode [channel] <time> **OR** slowmode off/ slowmode off [channel]',
        accessableby: 'Moderators',
        aliases: ['slow-mode'],
        category: 'moderation',
    },
    run: async (client, message, args) => {
        if (!message.member.permissions.any(['ADMINISTRATOR', 'MANAGE_CHANNELS']))
            return message.channel.send(`${message.author.username}, you need the \`Administrator/Manage Channels\` permission to execute this command.`);

        let channel = message.mentions.channels.first(),
            time = args.slice(1).join(' ');

        if (!channel) time = args.join(' '), channel = message.channel;
        // If the user doesn't includes the channel.

        const embedslowdisabled = new MessageEmbed()
            .setTitle('Slowmode Disabled')
            .addField('**Responsible Moderator**:', `\`${message.author.username}\``)
            .addField('**Channel**:', message.channel)
            .addField('**Date**:', moment.utc(message.createdAt).format('dddd, MMMM Do YYYY'))

        if (args[0] === 'off') {
            channel.setRateLimitPerUser(0);
            return message.channel.send(embedslowdisabled);
        }

        if (!time) return message.channel.send('Please include the time format.');

        let convert = ms(time); // This will results the milliseconds.
        let toSecond = Math.floor(convert / 1000); // This will convert the ms to s. (seconds)

        if (!toSecond || toSecond == undefined) return message.channel.send('Please insert the valid time format!');

        if (toSecond > 21600) return message.channel.send('Timer should be less than or equal to 6 hours.');
        else if (toSecond < 1) return message.channel.send('Timer should be more than or equal to 1 second.');

        const embedslowactive = new MessageEmbed()
            .setTitle('Slowmode Applied')
            .addField('**Responsible Moderator**:', `\`${message.author.username}\``)
            .addField('**Channel**:', message.channel)
            .addField('**Date**:', moment.utc(message.createdAt).format('dddd, MMMM Do YYYY'))
            .addField('**Slowmode Time**', `${ms(ms(time))}`)
        await channel.setRateLimitPerUser(toSecond);
        message.channel.send(embedslowactive);
        if (message.log) message.log.send(embedslowactive)
    }
}

