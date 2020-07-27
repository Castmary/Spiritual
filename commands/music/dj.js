const { MessageEmbed } = require("discord.js");
const db = require('quick.db')
const moment = require('moment');

module.exports = {
    config: {
        name: "dj",
        description: "Set which music commands require the dj-role",
        usage: `dj <enable | disable | list> [command | all]`,
        accessableby: "Members",
        aliases: [],
        category: "music",
    },
    run: async (client, message, args) => {
         const cmds = ["loop", "nowplaying", "pause", "play", "resume", "shuffle", "skip", "stop", "volume"]
         const list = db.get(message.guild.id).dj
         const embed = client.MessageEmbed(message)
         
         if (!message.member.hasPermission('ADMINISTRATOR')) return message.channel.send(`${message.author.username}, you need the \`Administrator\` permission to execute this command.`)
         if (!message.djrole) return message.channel.send(embed.setDescription('There isnt a DJ role currently on the server, set one using \`-djrole\`.'))
      
         if (!args[0] || !['enable', 'disable', 'list'].includes(args[0])) return message.channel.send(embed.setDescription('Please use \`-dj <enable | disable | list> [command | all]\`.'))
         
         if (args[0] == 'list'){
             message.channel.send(embed.setDescription(list.length ? list.map(s => `\`${s}\``).join(', ') : 'All commands are currently available to every member.'))
         } else if (args[0] == 'enable') {
             if (!args[1] || !cmds.includes(args[1])) return message.channel.send('Please enter a valid music command to enable')
             if (list.includes(args[1])) {
                 db.set(`${message.guild.id}.dj`, list.filter(s => s !== args[1]))

const logembed = new MessageEmbed()
            .setAuthor(`DJ Command Enabled`, message.author.avatarURL({ dynamic: true, format: 'png' }))
            .setColor(message.color)
            .addField('**Responsible Moderator**:', `\`${message.author.username}\``)
            .addField('**Command:**', `${args[1]}`)
            .addField('**Date**:', moment.utc(message.createdAt).format('dddd, MMMM Do YYYY'))


                 message.channel.send(embed.setDescription(`<:check_mark:734142905798754394> ${args[1]} is now accessible to every member.`))
         if (message.log) message.log.send(logembed)
             } else return message.channel.send('That command is already accessible to every member.')
           
         } else if (args[0] == 'disable') {
             if (!args[1] || !cmds.includes(args[1])) return message.channel.send('Please enter a valid music command to disable.')
             if (!list.includes(args[1])) {
                 db.push(`${message.guild.id}.dj`, args[1])

const logembed1 = new MessageEmbed()
            .setAuthor(`DJ Command Disabled`, message.author.avatarURL({ dynamic: true, format: 'png' }))
            .setColor(message.color)
            .addField('**Responsible Moderator**:', `\`${message.author.username}\``)
            .addField('**Command:**', `${args[1]}`)
            .addField('**Date**:', moment.utc(message.createdAt).format('dddd, MMMM Do YYYY'))

                 message.channel.send(embed.setDescription(`<:check_mark:734142905798754394> ${args[1]} is now only accessible to members with the ${message.djrole || '**DJ**'} role.`))
if (message.log) message.log.send(logembed1)
             } else message.channel.send('That command is already limited to the DJ role.')
         }
    }
}