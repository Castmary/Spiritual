const { MessageEmbed } = require('discord.js');
const moment = require('moment');

module.exports = {
    config: {
        name: 'unban',
        description: 'Unbans the person mentioned from the guild.',
        usage: 'unban <userid>',
        accessableby: 'Moderators',
        aliases: [],
        category: 'moderation',
    },
    run: async (client, message, args) => {
        if (!message.member.hasPermission('BAN_MEMBERS')) return message.channel.send('You don\'t have permission to unban this user.');
        if (!message.guild.me.hasPermission('BAN_MEMBERS')) return message.channel.send('I don\'t have the permissions to do that!');

        // User Check
        if (!args[0]) return message.channel.send('Please give me a valid ID of the user.')
        let bannedMemberInfo = await message.guild.fetchBans()
        let bannedMember = bannedMemberInfo.find(b => b.user.username.toLowerCase() === args[0].toLocaleLowerCase()) || bannedMemberInfo.get(args[0]);
        if (!bannedMember) return message.channel.send('Give me a valid ID of the user.')


        bannedMember.unban
        // Reasoning
        let reason = args.slice(1).join(' ')
        if (reason) {
            message.guild.members.unban(bannedMember.user.id, reason)
            var sembed = new MessageEmbed()
                .setColor(message.color)
                .setDescription(`Unbanned Member: => ${bannedMember.user.tag}.\n*${reason || 'No reason given'}*`)
            message.channel.send(sembed)
        }

        // Channel Check
        message.guild.members.unban(bannedMember.user.id, reason)
        const embed2 = new MessageEmbed()
            .setColor(message.color)
            .addField('**User**:', `\`${bannedMember.user.tag}\``)
            .addField('**Responsible Moderator**:', `\`${message.author.username}\``)
            .addField('**Command Executed In**:', message.channel)
            .addField('**Date**:', moment.utc(message.createdAt).format('dddd, MMMM Do YYYY'))
            .addField('**ID:**', `${bannedMember.user.id}`)
            .setAuthor(`Unban`, message.author.avatarURL({ dynamic: true, format: 'png' }));

        const embed2DM = new MessageEmbed()
            .setColor(message.color)
            .addField('**User**:', `\`${bannedMember.user.tag}\``)
            .addField('**Responsible Moderator**:', `\`${message.author.username}\``)
            .addField('**Date**:', moment.utc(message.createdAt).format('dddd, MMMM Do YYYY'))
            .setAuthor(`Unban`, message.author.avatarURL({ dynamic: true, format: 'png' }));

        bannedMember.user.send(embed2DM)
        if (message.log) message.log.send(embed2)
        message.channel.send(embed2).then(m => m.delete({ timeout: 10000 }))
    }
} 
