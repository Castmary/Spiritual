const { utc } = require('moment')
const db = require('quick.db');

module.exports = {
    config: {
        name: "warnings",
        description: "View warning for the user mentioned.",
        usage: `warnings <user> [clear | remove] [warning position]`,
        accessableby: "Moderators",
        aliases: [],
        category: "moderation",
    },
    run: async (client, message, args) => {
        const embed = client.MessageEmbed(message)
        //Some if statements n stuff
        if (!message.member.hasPermission('MANAGE_ROLES')) return message.channel.send(embed.setDescription('You don\'t have permissions to use this command'))
        if (!message.mentions.users.first()) return message.channel.send(embed.setDescription('Please mention a user to view their warnings'))
        if (message.mentions.users.first() == message.author) return message.channel.send(embed.setDescription('Choose someone other than yourself'))
        if (args[1] && !['clear', 'remove'].includes(args[1])) return message.channel.send(embed.setDescription(`Please use \`${client.prefix(message) + cmd + this.help.usage}\``))

        //Get the member and their warnings
        let member = message.mentions.members.first()
        if (!db.get(`memebrs.${message.guild.id}.${member.id}`)) client.createMember(message.guild.id, member.id)
        let warnings = db.get(`members.${message.guild.id}.${member.user.id}.warnings`)

        //If they have no warnings, return a message
        if (!warnings[0]) return message.channel.send(embed.setDescription('This user currently has no warnings so far'))

        //If they only input their name, display all warnings
        if (!args[1]) {
            for (let i in warnings) embed.addField(`${warnings[i].mod} - ${warnings[i].time}`, warnings[i].reason)
            return message.channel.send(embed.setTitle(`Warnings for ${member.user.tag} | Total warnings: ${warnings.length}`))
        }

        //Clear all user warnings
        if (args[1] == 'clear') {
            db.set(`members.${message.guild.id}.${member.user.id}.warnings`, [])
            return message.channel.send(`Cleared all warnings for ${member.user.tag}`)
        } else if (args[1] == 'remove') {
            if (isNaN(args[2]) || args[2] - 1 >= warnings.length || args[2] <= 0) return message.channel.send(embed.setDescription(`Please specify the warning number to remove and try again.\n${member.user.tag} has a total of ${warnings.length} warnings`))
            warnings.splice(args[2] - 1, 1)
            db.set(`members.${message.guild.id}.${member.user.id}.warnings`, warnings)
            return message.channel.send(embed.setDescription(`Successfully removed warning #${args[2]} from user ${member.user.tag}`))
        }

        return message.channel.send(embed.setDescription(`Please use \`${message.prefix}warnings <user> [clear | remove] warning number\``))
    }
}
