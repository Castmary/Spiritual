const { MessageEmbed } = require('discord.js')

module.exports = {
    config: {
        name: 'poll',
        description: 'Create a poll to review a topic, or idea',
        usage: `poll 'question' op1, op2, etc`,
        accessableby: 'Moderators',
        aliases: [],
        category: 'utility',
    },
    run: async (client, message, args) => {
        if (!message.member.hasPermission('ADMINISTRATOR')) return message.channel.send('You dont have permissions to use this command.')

        let found, options, emojis = ['🇦', '🇧', '🇨', '🇩', '🇪', '🇫', '🇬', '🇭', '🇮', '🇯']
        let trim = a => a.map(s => s.trim().replace(/\s\s+/g, ' '))

        try {
            found = trim(args.join(' ').match(/[^"]+/g))
            options = found[1].split(',').slice(0, 10)
        } catch {
            return message.channel.send(`To create a poll, please use:\n\`!${this.config.usage}\``)
        }

        message.delete()

        const embed = new MessageEmbed()
            .setColor(message.color)
            .addField(found[0], `${emojis[0]} ${options[0]}`)
            .setFooter(`This poll was created by ${message.author.username}, message.author.avatarURL()`)

        for (let i = 1; i < options.length && i < 10; i++) embed.addField('\u200b', `${emojis[i]} ${options[i]}`)

        let msg = await message.channel.send(embed)

        for (let i in options) await msg.react(emojis[i])
    }
}