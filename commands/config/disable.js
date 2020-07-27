const { MessageEmbed } = require('discord.js');
const moment = require('moment');
const db = require('quick.db')

module.exports = {
    config: {
        name: 'disable',
        description: 'Disable a command.',
        usage: 'prefix <command>',
        accessableby: 'Administrators',
        aliases: [],
        category: 'config',
    },
    run: async (client, message, args) => {
        if (!message.member.hasPermission('ADMINISTRATOR')) return message.channel.send(`${message.author.username}, you need the \`Administrator\` permission to execute this command.`)
        if (!client.commands.get(args[0]) || client.commands.get(args[0]).config.category == 'config') return message.channel.send('Please enter a command you would like to disable.')
        if (db.get(`${message.guild.id}.commands.${args[0]}`)) return message.channel.send('This command is already disabled.')

        const embed = new MessageEmbed()
            .setDescription(`<:check_mark:734142905798754394> Successfully disabled the ${args[0]} command`)
            .setTimestamp()
            .setColor(message.color)

        const embed1 = new MessageEmbed()
            .setAuthor('Command Disabled', message.author.avatarURL({ dynamic: true, format: 'png' }))
            .setColor(message.color)
            .addField('**Responsible Administrator**:', `\`${message.author.username}\``)
            .addField('**Command:**', `${args[0]}`)
            .addField('**Date**:', moment.utc(message.createdAt).format('dddd, MMMM Do YYYY'))

        db.set(`${message.guild.id}.commands.${args[0]}`, true)
        message.channel.send(embed)
        if (message.log) message.log.send(embed1)
    }
}