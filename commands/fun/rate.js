module.exports = {
    config: {
        name: 'rate',
        description: 'Gives a rating for the mentioned user (or you) from a scale of 1-10.',
        usage: 'rate <user>',
        accessableby: 'Members',
        aliases: [],
        category: 'fun',
    },
    run: async (client, message, args) => {
        const user = message.mentions.users.first() || message.guild.members.cache.get(args[0]) || 'you'
        message.channel.send(`**I rate ${user.toString()} a ${~~(Math.random() * 10) + 1}/10.**`)
    }
}