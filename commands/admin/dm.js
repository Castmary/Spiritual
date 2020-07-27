const { ownerID } = require('../../config.json');


module.exports = {
    config: {
        name: 'dm',
        description: 'dm a user',
        usage: `eval <code>`,
        accessableby: 'Bot Owner',
        aliases: [],
        category: 'information',
    },
    run: async (client, message, args) => {
        if (![ownerID, '632289810035507211', '275419902381260802', '690414288065658881'].includes(message.author.id)) return message.channel.send('You cannot use this command.')
        try {
            let user = client.users.cache.find(u => u.tag == args[0]) || await client.users.fetch(message.mentions.users.keyArray()[0] || args[0])
            user.send(args.slice(1).join(' '))
        } catch (e) {
            message.channel.send('Couldnt find that user')
        }
    }
        
}