const { Connect4, Player } = require('connect4-engine')
const requests = new Map(), games = new Map()

module.exports = {
    config: {
        name: 'connect4',
        description: 'Play a game of connect-4 with a friend.',
        usage: 'connect4',
        accessableby: 'Members',
        aliases: [],
        category: 'fun',
    },
    run: async (client, message, args) => {
        if (args[0] == 'leave' && games.get(message.guild.id + message.author.id)) return games.delete(message.guild.id + message.author.id)
        if (games.get(message.guild.id + message.author.id)) return message.channel.send(`You are already playing a game of connect 4\nLeave the game by doing \`-connect4 leave\``)
        if (!message.mentions.users.first() || message.mentions.users.first().id == message.author.id) return message.channel.send('Please mention the person you want to play against')
        if (games.get(message.guild.id + message.mentions.users.first().id)) return message.channel.send('That user is already playing a game of connect 4.')
        if (requests.get(message.guild.id + message.mentions.users.first().id)) return message.channel.send('That user is already requesting to play with someone else!')

        requests.set(message.guild.id + message.author.id, true)
        requests.set(message.guild.id + message.mentions.users.first().id, true)

        setTimeout(() => {
            requests.delete(message.guild.id + message.mentions.users.first().id)
            requests.delete(message.guild.id + message.author.id)
        }, 10000)

        message.channel.send(`${message.mentions.users.first().username}, do you wish to play connect 4 with ${message.author.username}?`)
        let filter1 = response => response.content.toLowerCase().includes('yes') && response.author == message.mentions.users.first()
        let collected = await message.channel.awaitMessages(filter1, { max: 1, time: 8000 })
        if (!collected.first()) return message.channel.send(`Looks like they didnt say yes in time!`)

        games.set(message.guild.id + message.mentions.users.first().id, true)
        games.set(message.guild.id + message.author.id, true)

        const game = new Connect4([new Player(':orange_circle:'), new Player(':red_circle:')])
        const embed = client.MessageEmbed(message)
            .setTitle(`${message.author.username} vs. ${message.mentions.users.first().username}`)
            .setDescription(board(game).join('\n').replace(/,/g, ''))

        let currentPlayer = message.author.id

        message.channel.send(embed).then(emb => {
            let filter = m => m.author.id == currentPlayer && !isNaN(m.content) && m.content > 0 && m.content < 8
            let collector = message.channel.createMessageCollector(filter, { time: 30000 })

            collector.on('collect', m => {
                if (!games.get(message.guild.id + message.author.id) || !games.get(message.guild.id + message.mentions.users.first().id)) return
                if (currentPlayer == message.author.id) currentPlayer = message.mentions.users.first().id
                else currentPlayer = message.author.id
                game.insert(m.content - 1)
                emb.edit(embed.setDescription(board(game).join('\n').replace(/,/g, '')))
                m.delete()
                collector.resetTimer({ time: 30000 })
                if (game.state.winner !== null || game.state.status == '1') collector.stop()
            })

            collector.on('end', () => {
                if (!games.get(message.guild.id + message.author.id) || !games.get(message.guild.id + message.mentions.users.first().id)) return
                if (game.state.status == '0') embed.setTitle(`The winner is ${game.state.winner.color == game.players['0'].color ? message.author.username : message.mentions.users.first().username}!`)
                else if (game.state.status == '1') embed.setTitle(`Looks like you tied!`)
                else message.channel.send('The games time limit has been reached, and there is no winner!')
                emb.edit(embed)
                message.channel.send(embed.title)
                games.delete(message.guild.id + message.author.id)
                games.delete(message.guild.id + message.mentions.users.first().id)
            })
        })
    }
}


let board = game => {
    let arr = [], newarr = []
    for (let i in game.state.board) {
        if (game.state.board[i] != null) arr.push(game.state.board[i].color)
        else arr.push(':black_circle:')
    }
    while (arr.length) newarr.push(arr.splice(0, 7))
    newarr.push([':one:', ':two:', ':three:', ':four:', ':five:', ':six:', ':seven:'])
    return newarr
}