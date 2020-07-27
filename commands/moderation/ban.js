const { MessageEmbed } = require('discord.js');
const moment = require('moment');

module.exports = {
    config: {
        name: 'ban',
        description: 'Ban a user from the guild.',
        usage: 'ban <@mention> <reason>',
        accessableby: 'Moderators',
        aliases: ['hammer'],
        category: 'moderation',
    },
    run: async (client, message, args) => {
        const logchannel = message.log
        // Author permissions check
        if (!message.member.hasPermission('BAN_MEMBERS')) return message.channel.send(`${message.author.username}, you need the \`Ban Members\` permission to execute this command.`);

        // Mention or provide member's ID
        let bUser = message.mentions.members.first() || message.guild.member(args[0])
        if (!bUser) return message.channel.send(`${message.author.username}, please specify a valid user.`);

        // Author banning author
        if (message.author.id === bUser.id) return message.channel.send(`You cannot ban yourself, ${message.author.username}.`)

        // Bot permissions check
        if (!message.guild.me.hasPermission('BAN_MEMBERS')) return message.channel.send(`${message.author.username}, I don't have permission to perform this command.`)

        // Can't kick members with ADMIN permission
        if (bUser.hasPermission('ADMINISTRATOR')) return message.channel.send(`${message.author.username}, you cannot ban \`${bUser.user.username}\` due to ownership of \`Administrator\` permission.`)

        let args1 = message.content.slice(1).split(/ +/);
        let bReason = args1.slice(2).join(' ');

        if (!bReason) return message.channel.send(`${message.author.username}, before I ban **${bUser.user.username}** you need to specify a reason.`)

        // Sends Ban Message
        let banEmbed = new MessageEmbed()
            .setAuthor(`Ban Moderation`, message.author.avatarURL({ dynamic: true, format: 'png' }))
            .setColor(message.color)
            .addField('**User**:', `\`${bUser.user.tag}\``)
            .addField('**Responsible Moderator**:', `\`${message.author.username}\``)
            .addField('**Command Executed In**:', message.channel)
            .addField('**Date**:', moment.utc(message.createdAt).format('dddd, MMMM Do YYYY'))
            .addField('**ID:**', `${bUser.id}`)
            .addField('**Reason**:', bReason);

        let banEmbedDM = new MessageEmbed()
            .setAuthor(`Ban Moderation`, message.author.avatarURL({ dynamic: true, format: 'png' }))
            .setColor(message.color)
            .addField('**User**:', `\`${bUser.user.tag}\``)
            .addField('**Responsible Moderator**:', `\`${message.author.username}\``)
            .addField('**Date**:', moment.utc(message.createdAt).format('dddd, MMMM Do YYYY'))
            .addField('**Reason**:', bReason);

        bUser.send(banEmbedDM)
        message.guild.member(bUser).ban(bReason);
        message.channel.send(banEmbed).then(m => m.delete({ timeout: 10000 }));
        if (logchannel) logchannel.send(banEmbed)
    }
}