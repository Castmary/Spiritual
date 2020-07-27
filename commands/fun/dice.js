module.exports = {
    config: {
        name: 'dice',
        description: 'Rolls the dice!',
        usage: 'dice',
        accessableby: 'Members',
        aliases: [],
        category: 'fun',
    },
    run: async (client, message, args) => {
        let msg = await message.channel.send('Rolling the dice...')
        msg.edit(`The dice rolled a ${~~(Math.random() * 6) + 1}`);
    }
}