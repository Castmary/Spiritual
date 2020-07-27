module.exports = {
	config: {
		name: '8ball',
		description: 'Ask the magic 8ball a question and recieve advice.',
		usage: '8ball',
		accessableby: 'Members',
		aliases: ['8b'],
		category: 'fun',
	},
	run: async (client, message, args) => {
		if (!args[0]) return message.channel.send('Please ask something so I can give my thoughts!')

		var rand = ['Yes', 'No', 'Why are you even trying?', 'What do you think? NO', 'Maybe', 'Never', 'Yep', 'I don\'t care']

		message.channel.send(rand[~~(Math.random() * 8)])
	}
}
