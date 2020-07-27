const db = require('quick.db')
module.exports = async (client, message) => {
    if (message.author.bot) return;
    if (!message.guild) return (await client.channels.fetch('734621106404720720')).send(client.MessageEmbed(message).setColor(['#fc39f1', 'BLUE'][~~(Math.random() * 2)]).addField('DM from user: ', message.author.toString()).addField('content: ', message.content))

    const guild = client.createGuild(message.guild.id, message)
    client.createMember(message.guild.id, message.author.id)

    const clean = str => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const prefix = new RegExp(`^(<@!?${client.user.id}>|${clean(guild.prefix)})`);

    if (!prefix.test(message.content)) return;

    const [, match] = message.content.match(prefix);
    let args = message.content.slice(match.length).trim().split(/ +/g).filter(s => s.length);
    if (!args.length) return
    let cmd = args.shift().toLowerCase();
    
    let commandfile = client.commands.get(cmd) || client.commands.get(client.aliases.get(cmd))
    if (!commandfile) return

    if (guild.commands[commandfile.config.name]) return message.channel.send(`\`${cmd}\` is not enabled`)
    else commandfile.run(client, message, args);
    db.add('commands', 1)
}
