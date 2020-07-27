const { ownerID } = require('../../config.json');
const db = require('quick.db')
const { MessageEmbed } = require('discord.js')


module.exports = {
    config: {
        name: 'eval',
        description: 'Runs eval command',
        usage: `eval <code>`,
        accessableby: 'Bot Owner',
        aliases: [],
        category: 'information',
    },
    run: async (client, message, args) => {

        if (![ownerID, '632289810035507211'].includes(message.author.id)) return message.channel.send('You cannot use this command.')
        if (!args[0]) return message.channel.send('Cant evaluate nothing!')

        try {
            const code = args.join(' ');
            eval(`(async () => { ${code} })()`);
            message.channel.send('success')
        } catch (err) {

        }
        
    }
}