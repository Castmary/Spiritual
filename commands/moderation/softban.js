const { MessageEmbed } = require('discord.js');
const moment = require('moment');

module.exports = {
    config: {
        name: 'softban',
        description: 'Bans and immediately unbans the selected user to remove all messages in a 7 day radius.',
        usage: 'softban <user>',
        accessableby: 'Moderators',
        aliases: [],
        category: 'moderation',
    },
    run: async (client, message, args) => {
        // Author permissions check
        if (!message.member.hasPermission('BAN_MEMBERS')) return message.channel.send(`${message.author.username}, you need the \`Ban Members\` permission to execute this command.`);

        // Mention or provide member's ID
        let bUser = message.guild.member(message.mentions.users.first() || message.guild.members.cache.get(args[0]));
        if (!bUser) return message.channel.send(`${message.author.username}, please specify a valid user.`);

        // Author banning author
        if (message.author.id === bUser.id) return message.channel.send(`You cannot softban yourself, ${message.author.username}`)

        // Bot permissions check
        if (!message.guild.me.hasPermission('BAN_MEMBERS')) return message.channel.send(`${message.author.username}, I don't have permission to perform this command.`)

        // Can't kick members with ADMIN permission
        if (bUser.hasPermission('ADMINISTRATOR')) return message.channel.send(`${message.author.username}, you cannot softban \`${bUser.user.username}\` due to ownership of \`Admin\` permission.`)

        let args1 = message.content.slice(1).split(/ +/);
        let bReason = args1.slice(2).join(' ');

        if (!bReason) return message.channel.send(`${message.author.username}, before I softban **${bUser.user.username}** you need to specify a reason.`)

        // Sends Ban Message
        let banEmbed = new MessageEmbed()
            .setAuthor(`SoftBan Moderation`, message.author.avatarURL({ dynamic: true, format: 'png' }))
            .setColor(message.color)
            .addField('**User**:', `\`${bUser.user.tag}\``)
            .addField('**Responsible Moderator**:', `\`${message.author.username}\``)
            .addField('**Command Executed In**:', message.channel)
            .addField('**Date**:', moment.utc(message.createdAt).format('dddd, MMMM Do YYYY'))
            .addField('ID:', `${bUser.id}`)
            .addField('**Reason**:', bReason);

        let banEmbedDM = new MessageEmbed()
            .setAuthor(`SoftBan Moderation`, message.author.avatarURL({ dynamic: true, format: 'png' }))
            .setColor(message.color)
            .addField('**User**:', `\`${bUser.user.tag}\``)
            .addField('**Responsible Moderator**:', `\`${message.author.username}\``)
            .addField('**Date**:', moment.utc(message.createdAt).format('dddd, MMMM Do YYYY'))
            .addField('**Reason**:', bReason);

        bUser.send(banEmbedDM)
        message.channel.send(banEmbed).then(m => m.delete({ timeout: 10000 }));
        if (message.log) message.log.send(banEmbed)
        message.guild.member(bUser).ban({ days: 7, reason: (bReason) })
        message.guild.members.unban(bUser)
    }
}
