const Discord = require('discord.js');
const moment = require('moment');
const { MessageEmbed } = require('discord.js');

module.exports = {
    config: {
        name: 'kick',
        description: 'Kick a user from the guild.',
        usage: 'kick <@mention>',
        accessableby: 'Moderators',
        aliases: ['boot'],
        category: 'moderation',
    },
    run: async (client, message, args) => {
        // Check author's permission
        if (!message.member.hasPermission('KICK_MEMBERS')) return message.channel.send(`${message.author.username}, you need the \`Kick Members\` permission to execute this command.`);

        // Provides user mention or ID
        let kUser = message.guild.member(message.mentions.users.first() || message.guild.members.cache.get(args[0]));
        if (!kUser) return message.channel.send(`${message.author.username}, please specify a valid user.`)
        if (message.author.id === kUser.id) return message.channel.send(`${message.author.username}, you cannot kick yourself`)

        // Check bot's permissions
        if (!message.guild.me.hasPermission('KICK_MEMBERS')) return message.channel.send(`${message.author.username}, I don't have permission to perform this command.`)

        // Can't kick members wuth ADMIN permission
        if (kUser.hasPermission('ADMINISTRATOR')) return message.channel.send(`${message.author.username}, you cannot kick \`${kUser.user.username}\` due to ownership of \`Administrator\` permission.`)

        let args1 = message.content.slice(1).split(/ +/);
        let kReason = args1.slice(2).join(' ');

        // No reason = no kick
        if (!kReason) return message.channel.send(`${message.author.username}, before I kick ${kUser.user.username} you need to specify a reason.`)

        // Sends the Kick Message
        let kickEmbed = new Discord.MessageEmbed()
            .setAuthor(`Kick Moderation`, message.author.avatarURL({ dynamic: true, format: 'png' }))
            .setColor(message.color)
            .addField('**User**:', `\`${kUser.user.tag}\``)
            .addField('**Responsible Moderator**:', `\`${message.author.username}\``)
            .addField('**Command Executed In**:', message.channel)
            .addField('**Date**:', moment.utc(message.createdAt).format('dddd, MMMM Do YYYY'))
            .addField('**Reason**:', kReason);

let kickEmbedDM = new MessageEmbed()
            .setAuthor(`Ban Moderation`, message.author.avatarURL({ dynamic: true, format: 'png' }))
            .setColor(message.color)
            .addField('**User**:', `\`${kUser.user.tag}\``)
            .addField('**Responsible Moderator**:', `\`${message.author.username}\``)
            .addField('**Date**:', moment.utc(message.createdAt).format('dddd, MMMM Do YYYY'))
            .addField('**Reason**:', kReason);

 kUser.send(kickEmbedDM)
        message.guild.member(kUser).kick(kReason);
        message.channel.send(kickEmbed).then(m => m.delete({ timeout: 10000 }));
        if (message.log) message.log.send(kickEmbed)
    }
}
