const { ownerID } = require('../../config.json');
const request = require('request')

module.exports = {
    config: {
        name: 'reload',
        description: 'Reload a command',
        usage: `reload <command>`,
        accessableby: 'Bot Owner',
        aliases: [],
        category: 'information',
    },
    run: async (client, message, args) => {

//         if (![ownerID, '632289810035507211'].includes(message.author.id)) return message.channel.send('You cannot use this command.')
//         if (args[0]) args[0] = args[0].toLowerCase()
//         if (!args[0] || !client.commands.get(args[0])) return message.channel.send('try again but choose a command to reload')

//         try {
//             let category = client.categories.find(g => g.includes(args[0]))
//                 let command = ''
//                 delete require.cache[require.resolve(`./${args[0]}`)]
//                 client.commands.set(args[0], command)

//         } catch (err) {
//             message.channel.send(`Error while reloading command \`${args[0]}\``)
//         }

    }

}