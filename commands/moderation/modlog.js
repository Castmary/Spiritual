const { MessageEmbed } = require('discord.js')
const { set, get } = require('quick.db')
const moment = require('moment');

module.exports = {
    config: {
        name: 'modlog',
        description: 'Set the servers modlog channel.',
        usage: 'modlog <channel>',
        accessableby: 'Moderators',
        aliases: [],
        category: 'moderation',
    },
    run: async (client, message, args) => {
        let embed = client.MessageEmbed(message)
        
        if (!message.member.hasPermission('ADMINISTRATOR')) return message.channel.send(embed.setDescription(`${message.author.username}, you need the \`Administrator\` permission to execute this command.`))
        if (!message.mentions.channels.first()) return message.channel.send(embed.setDescription(`This servers current mod-logs channel: ${message.log || 'none'}\nMention the channel for where you want the mod-logs to be sent to. `))
        if (message.mentions.channels.first() === message.log) return message.channel.send(embed.setDescription(`The servers modlog is already set to ${message.mentions.channels.first()}`))
        embed = new MessageEmbed()
            .setDescription(`*<:check_mark:734142905798754394> Successfully set the mod-log channel to ${message.mentions.channels.first()}*`)
            .setTimestamp()
            .setColor(message.color)

        const embed1 = new MessageEmbed()
            .setAuthor(`Mod-Log Channel Change`, message.guild.iconURL({ dynamic: true, format: 'png' }))
            .setColor(message.color)
            .addField('**Responsible Moderator**:', `\`${message.author.username}\``)
            .addField('**Channel Set To**:', message.mentions.channels.first())
            .addField('**Date**:', moment.utc(message.createdAt).format('dddd, MMMM Do YYYY'))

        set(`${message.guild.id}.modlog`, message.mentions.channels.first().id)
        message.channel.send(embed)
        if (message.log) message.log.send(embed1)
    }
}