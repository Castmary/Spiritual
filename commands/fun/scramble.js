const { shuffle } = require('lodash')
const rand = require('random-words')
const games = new Map()

module.exports = {
    config: {
        name: 'scramble',
        description: 'Play a game of scramble in the chat.',
        usage: 'scramble',
        accessableby: 'Members',
        aliases: [],
        category: 'fun',
    },
    run: async (client, message, args) => {
        if (games.get(message.guild.id + message.channel.id))
             return message.channel.send(`There is already a game of scramble playing in this channel, the word is ${games.get(message.guild.id + message.channel.id)}`)

        let word = rand(), data = { word: word, scrambled: shuffle(word).join(''), message: message }

        message.channel.send(`The word is ${data.scrambled}! You have 1 minute to guess the answer!`).then(async () => {
            let { word, scrambled, message } = data
            games.set(message.guild.id + message.channel.id, scrambled)

            let msg = await message.channel.awaitMessages(response => response.content.toLowerCase() === word.toLowerCase(), { max: 1, time: 60000 })

            if (msg.size) message.channel.send(`${msg.first().author.username} got the correct answer!`)
            else message.channel.send(`Nobody got it! The word was ${word}`)

            games.delete(message.guild.id + message.channel.id)
        })
    }
}