const { MessageEmbed } = require('discord.js');

module.exports = {
    config: {
        name: 'botreport',
        description: 'Reports a bug for the bot.',
        usage: 'botreport <bug>',
        accessableby: 'Bot Users/Members',
        aliases: [],
        category: 'information',
    },
    run: async (client, message, args) => {
        let issue = args.join(' ')


        if (!issue) return message.channel.send('Please enter a report/bug you have.')

        message.channel.send(`Your issue has been successfully sent, you'll be spoken soon.`)

        let channel = client.channels.cache.get('724690611604815972')

        let embed = new MessageEmbed()
            .setColor(message.color)
            .setTitle(`New report by ${message.author.tag}:`)
            .setDescription(issue)
    }
} 