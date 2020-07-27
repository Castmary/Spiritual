const { MessageEmbed } = require('discord.js');
const request = require('request');

module.exports = {
    config: {
        name: 'cat',
        description: 'Sends a random cat!',
        usage: 'cat',
        accessableby: 'Members',
        aliases: [],
        category: 'fun',
    },
    run: async (client, message, args) => {

        request.get('http://thecatapi.com/api/images/get?format=src&type=png', {

        }, (error, response, body) => {
            if (error) return

            let emb = new MessageEmbed()
                .setImage(response.request.uri.href)
                .setColor(message.color)
                .setTitle('Here is your random cat!')

            message.channel.send(emb)
        })
    }
}