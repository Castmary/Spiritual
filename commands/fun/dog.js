const { MessageEmbed } = require('discord.js');
const request = require('request');

module.exports = {
    config: {
        name: 'dog',
        description: 'Sends a random dog!',
        usage: 'dog',
        accessableby: 'Members',
        aliases: [],
        category: 'fun',
    },
    run: async (client, message, args) => {
        //Send the request to the API website.
        request('https://dog.ceo/api/breeds/image/random', async (error, response, body) => {
            if (error) return

            var embed = new MessageEmbed()
                .setTitle('Here is your random dog!')
                .setImage(JSON.parse(body).message)
                .setColor(message.color)

            message.channel.send(embed);

        })
    }
}