const { MessageEmbed } = require('discord.js');

module.exports = {
    config: {
        name: 'botsuggest',
        description: 'Suggest a command for the bot.',
        usage: 'botsuggest <suggestion>',
        accessableby: 'Bot Users/Members',
        aliases: [],
        category: 'information',
    },
    run: async (client, message, args) => {
        let issue = args.join(' ');


        if (!issue) return message.channel.send('Please enter a suggestion.')
        message.channel.send(
            `Your suggestion has been successfully sent and will be reviewed soon.`
        );

        let channel = client.channels.cache.get('724690604826689659');

        let embed = new MessageEmbed()
            .setColor(message.color)
            .setTitle(`New suggestion by ${message.author.tag}:`)
            .setFooter(`⬆️ Upvote | ⬇️ Downvote | ✖️ Won't Be Added | ✔️ Will Be Added / Already Possible`)
            .setDescription(issue);

        let msg = await channel.send(embed);
        msg.react('⬆️');
        await msg.react('⬇️');
    }
};