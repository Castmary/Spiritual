const { EventEmitter } = require('events');

class Queue extends EventEmitter {
    constructor(guildID){
        super();

        this.guildID = guildID;

        this.dispatcher = null;

        this.connection = null;

        this.songs = [];

        this.stopped = false;

        this.skipped = false;

        this.volume = 100;

        this.playing = true;

        this.repeatMode = false;
    }

};

module.exports = Queue;