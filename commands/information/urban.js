const { MessageEmbed } = require('discord.js');
const urban = require('urban.js')

module.exports = {
    config: {
        name: 'urban',
        description: 'Searches the word you want on the urban dictionary to get you a definition.',
        usage: `urban <word>`,
        accessableby: 'Members',
        aliases: [],
        category: 'information',
    },
    run: async (client, message, args) => {
        if (!args[0]) return message.channel.send(`Please provide a word to search.`)
        const searchString = args.join(' ')



        urban(searchString).then(urbans => {

            const embed = new MessageEmbed()
                .setTitle('Urban Dictionary Search')
                .setDescription(`**__${urbans.word}__**\n\n-----------------------------------------------------------------------------------`)
                .addField('Definition', `${urbans.definition}`)
                .addField('Example', `${urbans.example}`)
                .addField('Tags', `👍 ${urbans.thumbsUp} Thumbs Up | 👎 ${urbans.thumbsDown} Thumbs Down`)
                .setColor(message.color)
                .setTimestamp()
                .setFooter('Keep in mind that anyone can change the definitions')

            message.channel.send(embed)
        })
    }
}