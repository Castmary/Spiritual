const { stripIndents } = require('common-tags');
const { verify } = require('../../handlers/Util')
const db = require('quick.db')
module.exports = {
	config: {
		name: 'tictactoe',
		description: 'Play tic tac toe with your friends.',
		usage: 'tictactoe <user>',
		accessableby: 'Members',
		aliases: ['ttt'],
		category: 'fun',
	},
	run: async (client, message, args) => {
		    const opponent = message.mentions.members.first() || message.guild.members.cache.find(x => x.user.username.toLowerCase() === args.join(" ").toLowerCase()) || message.guild.members.cache.find(x => x.nickname !== null && x.nickname !== undefined && x.nickname.toLowerCase() === args.join(' ')) || message.guild.members.cache.get(args[0]) || message.member;
        
    if(opponent.user.bot) return message.channel.send(`Please choose someone to play against that isn't a bot.`)
    if(opponent.user.id === message.author.id) return message.channel.send(`Please mention the person you want to play against.`) 
    
    const current = db.get(`game-${message.channel.id}`)
    if(current) return message.channel.send(`There is currently a game in progress.`)
    db.set(`game-${message.channel.id}`, `true`)
    try {
      await message.channel.send(`${message.mentions.users.first().username}, do you wish to play connect 4 with ${message.author.username}?`)
     const verification = await verify(message.channel, opponent.user)
     if(!verification) {
       db.delete(`game-${message.channel.id}`)
       return message.channel.send(`Looks like they didnt say yes in time!`)
       
       
     }
      const sides = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
      const taken = [];
      let userTurn = true;
      let winner = null;
      let lastTurnTimeout = false;
      while (!winner && taken.length < 9) {
        const user = userTurn ? message.author : opponent.user
        const sign = userTurn ? 'X' : 'O';
        await message.channel.send(stripIndents`
					${user}, which side do you pick? Type \`end\` to forefeit.
					\`\`\`
					${sides[0]} | ${sides[1]} | ${sides[2]}
					—————————
					${sides[3]} | ${sides[4]} | ${sides[5]}
					—————————
					${sides[6]} | ${sides[7]} | ${sides[8]}
					\`\`\`
				`)
        const filter = res => {
					if (res.author.id !== user.id) return false;
					const choice = res.content;
					if (choice.toLowerCase() === 'end') return true;
					return sides.includes(choice) && !taken.includes(choice);
				};
        const turn = await message.channel.awaitMessages(filter, {
					max: 1,
					time: 30000
				});
        if (!turn.size) {
					await message.channel.send('Sorry, time is up!');
					if (lastTurnTimeout) {
						winner = 'time';
						break;
					} else {
						userTurn = !userTurn;
						lastTurnTimeout = true;
						continue;
					}
				}
				const choice = turn.first().content;
				if (choice.toLowerCase() === 'end') {
					winner = userTurn ? opponent : message.author;
					break;
				}
				sides[Number.parseInt(choice, 10) - 1] = sign;
				taken.push(choice);
				if (verifyWin(sides)) winner = userTurn ? message.author : opponent;
				if (lastTurnTimeout) lastTurnTimeout = false;
				userTurn = !userTurn;
      }
      db.delte(`game-${message.channel.id}`)
      if (winner === 'time') return message.channel.send('The games time limit has been reached, and there is no winner!');
			return message.channel.send(winner ? `Congrats, ${winner}!` : 'Oh... The cat won.'); //what does this mean, it means no one ah alright, one sec, there alr, where is test bot in the dev server
     
   } catch (e) {
     db.delete(`game-${message.channel.id}`)
     throw e;
   }
	}
  

   
}
  function verifyWin(sides) {
		return (sides[0] === sides[1] && sides[0] === sides[2])
			|| (sides[0] === sides[3] && sides[0] === sides[6])
			|| (sides[3] === sides[4] && sides[3] === sides[5])
			|| (sides[1] === sides[4] && sides[1] === sides[7])
			|| (sides[6] === sides[7] && sides[6] === sides[8])
			|| (sides[2] === sides[5] && sides[2] === sides[8])
			|| (sides[0] === sides[4] && sides[0] === sides[8])
			|| (sides[2] === sides[4] && sides[2] === sides[6]);
	}