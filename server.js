const { Client, Collection } = require("discord.js");
const token = 'token'
const client = new Client({ restTimeOffset: 0 });

["commands", "aliases", "categories"].forEach(x => client[x] = new Collection());
["console", "event", "command"].forEach(x => require(`./handlers/${x}`)(client))

client.login(token);
