const db = require('quick.db')
const {readFileSync} = require('fs')

module.exports = {
    config: {
        name: 'factoryreset',
        description: 'Deletes all Spiritual server settings on the server (cannot be undone)',
        usage: 'factoryreset',
        accessableby: 'Administrators',
        aliases: [],
        category: 'config',
    },
    run: async (client, message, args) => {
        if (!message.member.hasPermission('ADMINISTRATOR')) return message.channel.send(`${message.author.username}, you need the \`Administrator\` permission to execute this command.`)
      
        const defaults = JSON.parse(readFileSync('./defaultSettings.json', 'utf8'))
        
        const embed = client.MessageEmbed(message)
            .setDescription(`Are you sure you wish to continue? This action cannot be undone (yes/no)`)
            .setTimestamp()

            const embed1 = client.MessageEmbed(message)

        let msg = await message.channel.send(embed)
        
        let response = await message.channel.awaitMessages(m => m.author.id == message.author.id && ['yes', 'no'].some(r => m.content.toLowerCase().includes(r)), {max: 1, time: 10000})
        if (!response.first()) return msg.edit(embed.setDescription('You took to long to respond, command cancelled.'))
        else if (response.first().content.toLowerCase().includes('no')) return msg.edit(embed.setDescription('Command cancelled'))
      
        message.channel.send(embed1.setDescription('<:check_mark:734142905798754394> Successfully deleted all Spiritual server data'))
      
        db.set(message.guild.id, defaults);
        db.set(`members.${message.guild.id}`, {})
    }
}
