module.exports = {
    config: {
        name: 'rps',
        description: 'Rock paper scissors!',
        usage: 'rps <rock, paper, or scissors>',
        accessableby: 'Members',
        aliases: [],
        category: 'fun',
    },
    run: async (client, message, args) => {
        if (!args[0]) return message.channel.send('Please bet on either rock, paper, or scissors.')

        var options = [`Rock <:rock:728432611328000013>`, 'Paper :page_facing_up:', 'Scissors :scissors:']

        message.channel.send(options[~~(Math.random() * 3)]);
    }
}