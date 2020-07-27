const { MessageEmbed } = require('discord.js');

module.exports = {
    config: {
        name: 'invite',
        description: 'Sends an invite for the bot so you can invite it to your server!',
        usage: 'invite',
        accessableby: 'Members',
        aliases: [],
        category: 'information',
    },
    run: async (client, message, args) => {

const embed = new MessageEmbed()
.setDescription('Want to invite me to your server? Click [Here](https://discord.com/oauth2/authorize?client_id=709948275897139261&scope=bot&permissions=8)')
.setColor(message.color)

    message.channel.send(embed)
    }
}