module.exports = {
    config: {
        name: 'coinflip',
        description: 'Flips a coin.',
        usage: 'coinflip',
        accessableby: 'Members',
        aliases: [],
        category: 'fun',
    },
    run: async (client, message, args) => {
        message.channel.send(`Your coin landed on **${['Tails', 'Heads'][~~(Math.random() * 2)]}.**`)
    }
}