const { readdirSync } = require('fs')

module.exports = client => {
    require('../util.js')(client)
    readdirSync('./commands/').forEach(dir => {
        const commands = readdirSync(`./commands/${dir}/`).filter(d => d.endsWith('.js'));
        if (!dir.toLowerCase().startsWith('admin')) client.categories.set(dir, commands.map(c => c.split('.')[0]))
        
        for (let file of commands) {
            const pull = require(`../commands/${dir}/${file}`);
            client.commands.set(pull.config.name, pull);
            if (pull.config.aliases[0])
                pull.config.aliases.forEach(a => client.aliases.set(a, pull.config.name))
        };
    });
};