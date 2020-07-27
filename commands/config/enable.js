const { MessageEmbed } = require('discord.js');
const { set, get } = require('quick.db')
const { utc } = require('moment');

module.exports = {
    config: {
        name: 'enable',
        description: 'Enable a command.',
        usage: 'prefix <command>',
        accessableby: 'Administrators',
        aliases: [],
        category: 'config',
    },
    run: async (client, message, args) => {

        const logchannel = client.channels.cache.find(channel => channel.name.toLowerCase() === 'bot-logs');

        if (!message.member.hasPermission('ADMINISTRATOR')) return message.channel.send(`${message.author.username}, you need the \`Administrator\` permission to execute this command.`)
        if (!client.commands.get(args[0]) || client.commands.get(args[0]).config.category == 'config') return message.channel.send('Please enter a command you would like to enable.')
        if (get(`${message.guild.id}.commands.${args[0]}`) == false) return message.channel.send('This command is already enabled.')

        const embed = new MessageEmbed()
            .setDescription(`<:check_mark:734142905798754394> Successfully enabled the ${args[0]} command`)
            .setTimestamp()
            .setColor(message.color)

        const embed1 = new MessageEmbed()
            .setAuthor('Command Enabled', message.author.avatarURL({ dynamic: true, format: 'png' }))
            .setColor(message.color)
            .addField('**Responsible Administrator**:', `\`${message.author.username}\``)
            .addField('**Command:**', `${args[0]}`)
            .addField('**Date**:', utc(message.createdAt).format('dddd, MMMM Do YYYY'))

        set(`${message.guild.id}.commands.${args[0]}`, false)
        message.channel.send(embed)
        if (message.log) message.log.send(embed1)
    }
}