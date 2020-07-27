const { MessageEmbed } = require('discord.js')
const { utc } = require('moment')
const db = require('quick.db');
const ms = require('ms');

module.exports = {
    config: {
        name: 'mute',
        description: 'Mutes the selected user for a specified amount of time.',
        usage: 'mute <member> <time> <reason>',
        accessableby: 'Moderators',
        aliases: [],
        category: 'moderation',
    },
    run: async (client, message, args) => {
        if (!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send(`${message.author.username}, you need the \`Manage Messages\` permission to execute this command.`)
        if (db.get(`${message.guild.id}.muterole`) === 'none') return message.channel.send(`A mute role hasn't been set for the server. Set one using \`muterole\``)
        if (!args[0] || !message.mentions.users.first()) return message.channel.send(`Please use \`mute <user> <time> [reason]\``)
        if (message.mentions.members.first() === message.member) return message.channel.send('Mention someone to mute other than yourself.')
        if (message.mentions.members.first().hasPermission('ADMINISTRATOR')) return message.channel.send('I can\'t mute that user.')
        if (!args[1] || !ms(args[1])) return message.channel.send('Use a valid time for the mute duration\nFor example: `1hr`')

        client.createMember(message.guild.id, message.mentions.users.first().id)

        let reason = args.slice(2).join(' ') || 'No reason given'
        let muterole = message.guild.roles.cache.get(db.get(`${message.guild.id}.muterole`))
        let member = message.mentions.members.first()
        let muteEmbed = new MessageEmbed()
            .setAuthor('Mute Moderation', message.author.avatarURL({ dynamic: true, format: 'png' }))
            .setColor(message.color)
            .addField('**User**:', `\`${member.user.tag}\``)
            .addField('**Responsible Moderator**:', `\`${message.author.username}\``)
            .addField('**Time Muted:**', (args[1]))
            .addField('**Date**:', utc(message.createdAt).format('dddd, MMMM Do YYYY'))
            .addField('**Reason**:', reason);

        if (!muterole) return message.channel.send(`Couldnt find mute role, please set or create one using \`muterole <role>\``)

        message.channel.send(muteEmbed)
        if (message.log) message.log.send(muteEmbed)

        await member.roles.add(muterole.id)
        db.set(`members.${message.guild.id}.${member.user.id}.muted`, true)

        setTimeout(() => {
            db.set(`members.${message.guild.id}.${member.user.id}.muted`, false)
            member.roles.remove(muterole.id).catch(() => { })
        }, ms(args[1]))

        message.guild.channels.cache.forEach(async channel => {
            await channel.createOverwrite(muterole, {
                SEND_MESSAGES: false,
                ADD_REACTIONS: false
            })
        })
    }
}