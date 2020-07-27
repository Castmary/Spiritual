const { MessageEmbed } = require('discord.js')
const { utc } = require('moment')
const db = require('quick.db');

module.exports = {
    config: {
        name: 'muterole',
        description: 'Create a mute role to use for muting members.',
        usage: 'muterole <role> | create',
        accessableby: 'Moderators',
        aliases: [],
        category: 'moderation',
    },
    run: async (client, message, args) => {
        const embed = new MessageEmbed()
            .setColor(message.color)
            .setAuthor(message.author.username, message.author.avatarURL())
            .setDescription('This servers muted role')

        if (db.get(`${message.guild.id}.muterole`) == 'none') embed.setDescription(embed.description + ' hasnt been setup yet')
        else embed.setDescription(embed.description + ` is set to <@&${db.get(`${message.guild.id}.muterole`)}>`)

        //See if they have perms
        if (!message.member.hasPermission('ADMINISTRATOR')) return message.channel.send(embed.setDescription(`${message.author.username}, you need the \`Administrator\` permission to execute this command.`))
        if (!['set', 'create'].includes(args[0])) return message.channel.send(embed.setDescription(`${embed.description}\n\nPlease use \`muterole <role> | create\``))
        if (args[0] == 'set' && !message.mentions.roles.first()) return message.channel.send(embed.setDescription(`${embed.description}\n\nPlease mention a role, or create one with \`muterole create\``))
        if (message.muterole) return message.channel.send(embed.setDescription('There has already been a muted role created on this server.'))

        //Create a mute role, or use the role they specify
        let role;
        if (args[0] == 'create') {
            role = await message.guild.roles.create({ data: { name: 'Muted', permissions: [] } })
            db.set(`${message.guild.id}.muterole`, role.id)
        } else {
            role = message.mentions.roles.first()
            db.set(`${message.guild.id}.muterole`, role.id)
        }

        let muterole = new MessageEmbed()
            .setAuthor('Mute Role Set', message.author.avatarURL())
            .setColor(message.color)
            .addField('**Responsible Moderator**:', `\`${message.author.tag}\``)
            .addField('**Mute Role**:', role.toString())
            .addField('**Date**:', utc(message.createdAt).format('dddd, MMMM Do YYYY'))


      message.channel.send(embed.setDescription(`<:check_mark:734142905798754394> Mute role has been set to ${role.toString()}`))
        if (message.log) message.log.send(muterole)
    }
}