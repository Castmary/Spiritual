const { Client, Collection } = require("discord.js");
const token = 'NzM0OTc4OTAyNzM2MzcxNzUz.XxZkcQ.t97Ttp2sOu58cF7DLK9vNBtnn4c'
const client = new Client({ restTimeOffset: 0 });

["commands", "aliases", "categories"].forEach(x => client[x] = new Collection());
["console", "event", "command"].forEach(x => require(`./handlers/${x}`)(client))

client.login(token);