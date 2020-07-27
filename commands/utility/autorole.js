const { MessageEmbed } = require('discord.js')
const moment = require('moment');
const db = require('quick.db')

module.exports = {
    config: {
        name: 'autorole',
        description: 'Setup roles to automatically give to new members upon joining.',
        usage: '<role | enable | disable>',
        accessableby: 'Moderators',
        aliases: [],
        category: 'utility',
    },
    run: async (client, message, args) => {
        if (!message.member.hasPermission('MANAGE_ROLES')) return message.channel.send(`${message.author.username}, you need the \`Administrator\` permission to execute this command.`)
        let autoroles = db.get(`${message.guild.id}.autoroles`)
        db.set(`${message.guild.id}.autoroles.roles`, autoroles.roles.filter(r => message.guild.roles.cache.get(r)))

        let roles = db.get(`${message.guild.id}.autoroles`).roles.map(r => message.guild.roles.cache.get(r).toString())

        const embed = new MessageEmbed()
            .setAuthor(message.author.username, message.author.avatarURL())
            .setColor(message.color)

        if (!message.mentions.roles.first() && roles.length && !['enable', 'disable', 'remove'].includes(args[0])) return message.channel.send(embed.setDescription(`Current autoroles: ${roles}\nPlease use \`${message.prefix}autrole <role | remove | enable | disable>\``))
        else if (!message.mentions.roles.first() && !['enable', 'disable', 'remove'].includes(args[0])) return message.channel.send(embed.setDescription(`There are currently no autoroles on the server\nPlease use \`${message.prefix}autrole <role | remove | enable | disable>\` to set some!`))

        if (!args[1] && message.mentions.roles.first()) {
            if (!message.mentions.roles.first().editable) return message.channel.send(embed.setDescription('I need to be above that role in order to add it to other members'))
            db.push(`${message.guild.id}.autoroles.roles`, message.mentions.roles.first().id)
            message.channel.send(embed.setDescription(`<:check_mark:734142905798754394> Successfully added ${message.mentions.roles.first()} to the autoroles!${autoroles.enabled ? '' : `\nEnable autoroles by doing \`${message.prefix}autorole enable\``}`))

            const logembed = new MessageEmbed()
                .setAuthor(`Autorole Added`, message.author.avatarURL({ dynamic: true, format: 'png' }))
                .setColor(message.color)
                .addField('**Responsible Moderator**:', `\`${message.author.username}\``)
                .addField('**Autorole:**', `${message.mentions.roles.first()}`)
                .addField('**Date**:', moment.utc(message.createdAt).format('dddd, MMMM Do YYYY'))

            if (message.log) message.log.send(logembed)

        } else if (args[0] === 'enable') {
            if (autoroles.enabled) return message.channel.send(embed.setDescription('Autoroles is already enabled!'))
            db.set(`${message.guild.id}.autoroles.enabled`, true)
            message.channel.send(embed.setDescription(`<:check_mark:734142905798754394> Successfully enabled autoroles!`))

            const logembed1 = new MessageEmbed()
                .setAuthor(`Autorole Enabled`, message.author.avatarURL({ dynamic: true, format: 'png' }))
                .setColor(message.color)
                .addField('**Responsible Moderator**:', `\`${message.author.username}\``)
                .addField('**Date**:', moment.utc(message.createdAt).format('dddd, MMMM Do YYYY'))

            if (message.log) message.log.send(logembed1)

        } else if (args[0] === 'disable') {
            if (!autoroles.enabled) return message.channel.send(embed.setDescription('Autoroles is already disabled!'))
            db.set(`${message.guild.id}.autoroles.enabled`, false)
            message.channel.send(embed.setDescription(`<:check_mark:734142905798754394> Successfully disabled autoroles!`))


            const logembed1 = new MessageEmbed()
                .setAuthor(`Autorole Disabled`, message.author.avatarURL({ dynamic: true, format: 'png' }))
                .setColor(message.color)
                .addField('**Responsible Moderator**:', `\`${message.author.username}\``)
                .addField('**Date**:', moment.utc(message.createdAt).format('dddd, MMMM Do YYYY'))

            if (message.log) message.log.send(logembed1)
        } else if (args[0] == 'remove') {
            if (!roles.length) return message.channel.send(embed.setDescription('There are no auto roles to remove!'))
            if (!args[1] || isNaN(args[1]) || args[1] < 1 || args[1] > roles.length) return message.channel.send(embed.setDescription(`Please choose one of the following roles\n${roles.map((r, i) => `${i + 1}) ${r}`).join('\n')}`))
            let removed = autoroles.roles.splice(args[1] - 1, 1)
            db.set(`${message.guild.id}.autoroles.roles`, autoroles.roles)
            message.channel.send(embed.setDescription(`<:check_mark:734142905798754394> Successfully removed the role <@&${removed}>!`))
            const logembed = new MessageEmbed()
                .setAuthor(`Autorole Removed`, message.author.avatarURL({ dynamic: true, format: 'png' }))
                .setColor(message.color)
                .addField('**Responsible Moderator**:', `\`${message.author.username}\``)
                .addField('**Autorole:**', `Removed role <@&${removed}>`)
                .addField('**Date**:', moment.utc(message.createdAt).format('dddd, MMMM Do YYYY'))
            if (message.log) message.log.send(logembed)
        }

    }
}