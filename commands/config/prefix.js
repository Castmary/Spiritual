const { set, get } = require('quick.db')
const { MessageEmbed } = require('discord.js');
const { utc } = require('moment');

module.exports = {
    config: {
        name: 'prefix',
        description: 'Sets the bots prefix to the prefix of your choice.',
        usage: 'prefix <prefix>',
        accessableby: 'Administrators',
        aliases: [],
        category: 'config',
    },
    run: async (client, message, args) => {
        if (!message.member.hasPermission('ADMINISTRATOR')) return message.channel.send(`${message.author.username}, you need the \`Administrator\` permission to execute this command.`)

        const guild = get(message.guild.id)
        if (!args[0] || args[0].length > 3 || args[0] == ' ') return message.channel.send('Please choose a prefix thats between 1 and 3 characters.')
        if (args[0] === guild.prefix) return message.channel.send(`This servers prefix is already set to \`${args[0]}\``)

        const embed = new MessageEmbed()
            .setDescription(`<:check_mark:734142905798754394> Server prefix has been set to \`${args[0]}\``)
            .setTimestamp()
            .setColor(message.color)

        const embed1 = new MessageEmbed()
            .setAuthor('Server Prefix Change', message.author.avatarURL({ dynamic: true, format: 'png' }))
            .setColor(message.color)
            .addField('**Responsible Administrator**:', `\`${message.author.username}\``)
            .addField('**Original Prefix**', `${guild.prefix}`)
            .addField('**New Prefix:**', `${args[0]}`)
            .addField('**Date**:', utc(message.createdAt).format('dddd, MMMM Do YYYY'))

        set(`${message.guild.id}.prefix`, args[0])
        message.channel.send(embed)
        if (message.log) message.log.send(embed1)
    }
}