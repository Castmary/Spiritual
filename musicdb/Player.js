const ytdl = require('ytdl-core');
const SYA = require('simple-youtube-api');
const mergeOptions = require('merge-options');
const ytsr = require('ytsr');
const Queue = require('./Queue');
const Util = require('./Util');
const Song = require('./Song');

const PlayerOptions = {
    leaveOnEnd: true,
    leaveOnStop: true,
    leaveOnEmpty: true
};

class Player {
    constructor(client, youtubeToken, options = {}) {
        if (!client) throw new SyntaxError('[Discord_Client_Invalid] Invalid Discord Client');
        if (!youtubeToken) throw new SyntaxError('[Discord_Token_Invalid] Invalid Token per Discord Client');

        this.client = client;

        this.youtubeToken = youtubeToken;

        this.SYA = new SYA(this.youtubeToken);

        this.queues = [];

        this.options = mergeOptions(PlayerOptions, options);

        this.ytsr = ytsr;

        this.temp = new Map()

        client.on('voiceStateUpdate', (oldState, newState) => {
            if (!this.options.leaveOnEmpty) return;
            
            let queue = this.queues.find((g) => g.connection.channel.id === oldState.channelID);
            if (!queue) queue = this.queues.find((g) => g.connection.channel.id === newState.channelID);
            
            if (queue && (newState.id || oldState.id) == this.client.user.id && !newState.channelID) {
                this.queues = this.queues.filter((g) => g.guildID !== queue.guildID);
                this.stop(newState.id || oldState.id)
                return;
            }
            
            if (queue) {
                if (queue.connection.channel.members.size <= 1) {
                    this.temp.set(queue.guildID, setTimeout(() => {
                        if (queue.connection.channel.members.size > 1) return;
                        if (this.temp.get(queue.guildID) == 'temp') return;

                        queue.connection.channel.leave();
                        this.queues = this.queues.filter((g) => g.guildID !== queue.guildID);

                        queue.emit('channelEmpty');
                    }, 1800000))
                } else {
                    clearTimeout(this.temp.get(queue.guildID))
                    this.temp.set(queue.guildID, 'temp')
                }
            }
        });
    }


    isPlaying(guildID) {
        return this.queues.some((g) => g.guildID === guildID);
    }

    play(voiceChannel, songName, requestedBy) {
        this.queues = this.queues.filter((g) => g.guildID !== voiceChannel.id);
        return new Promise(async (resolve, reject) => {
            if (!voiceChannel || typeof voiceChannel !== "object") return reject("voiceChannel must be type of VoiceChannel. value=" + voiceChannel);
            if (typeof songName !== "string") return reject("songName must be type of string. value=" + songName);

            let video = await Util.getFirstSearch(songName, this.ytsr);
            if (!video || video == "err") {
                return resolve({ error: { type: 'YouTube_Not_Found', message: 'No Song was found with that query.' }, song: null });
            } else if (!video || video == "errQuota") {
                return resolve({ error: { type: 'YouTube_API_Error', message: 'Your API Key has been rate-limited. Read more: https://developers.google.com/youtube/v3/getting-started#quota.' }, song: null });
            } else {
                let connection = await voiceChannel.join();
                let queue = new Queue(voiceChannel.guild.id);
                queue.connection = connection;
                let song = new Song(video, queue, requestedBy);
                queue.songs.push(song);

                this.queues.push(queue);
                this._playSong(queue.guildID, true);

                return resolve({ error: null, song: song });
            }
        });
    }

    pause(guildID) {
        return new Promise(async (resolve, reject) => {
            let queue = this.queues.find((g) => g.guildID === guildID);
            if (!queue) return reject('Not playing');

            queue.dispatcher.pause();
            queue.playing = false;
            resolve(queue.songs[0]);
        });
    }

    resume(guildID) {
        return new Promise(async (resolve, reject) => {

            let queue = this.queues.find((g) => g.guildID === guildID);
            if (!queue) return reject('Not playing');

            queue.dispatcher.resume();
            queue.playing = true;

            resolve(queue.songs[0]);
        });
    }

    stop(guildID) {
        return new Promise(async (resolve, reject) => {

            let queue = this.queues.find((g) => g.guildID === guildID);
            if (!queue) return reject('Not playing');

            queue.stopped = true;
            queue.songs = [];
            queue.dispatcher.end();

            resolve();
        });
    }

    setVolume(guildID, percent) {
        return new Promise(async (resolve, reject) => {

            let queue = this.queues.find((g) => g.guildID === guildID);
            if (!queue) return reject('Not playing');

            queue.dispatcher.setVolumeLogarithmic(percent / 200);

            resolve(queue);
        });
    }

    getQueue(guildID) {
        let queue = this.queues.find((g) => g.guildID === guildID);
        return queue;
    }

    addToQueue(guildID, songName, requestedBy) {
        return new Promise(async (resolve, reject) => {

            let queue = this.queues.find((g) => g.guildID === guildID);
            if (!queue) return reject('Not playing');

            let video = await Util.getFirstSearch(songName, this.ytsr);
            if (!video || video == "err") {
                return resolve({ error: { type: 'YouTube_Not_Found', message: 'No Song was found with that query.' }, song: null });
            } else if (!video || video == "errQuota") {
                return resolve({ error: { type: 'YouTube_API_Error', message: 'Your API Key has been rate-limited. Read more: https://developers.google.com/youtube/v3/getting-started#quota.' }, song: null });
            } else {
                let song = new Song(video, queue, requestedBy);

                queue.songs.push(song);

                return resolve({ error: null, song: song });
            }
        });
    }

    setQueue(guildID, songs) {
        return new Promise(async (resolve, reject) => {

            let queue = this.queues.find((g) => g.guildID === guildID);
            if (!queue) return reject('Not playing');

            queue.songs = songs;

            resolve(queue);
        });
    }

    clearQueue(guildID) {
        return new Promise(async (resolve, reject) => {

            let queue = this.queues.find((g) => g.guildID === guildID);
            if (!queue) return reject('Not playing');

            let currentlyPlaying = queue.songs.shift();
            queue.songs = [currentlyPlaying];

            resolve(queue);
        });
    }

    skip(guildID) {
        return new Promise(async (resolve, reject) => {

            let queue = this.queues.find((g) => g.guildID === guildID);
            if (!queue) return reject('Not playing');
            let currentSong = queue.songs[0];

            queue.dispatcher.end();
            queue.skipped = true;

            resolve(currentSong);
        });
    }

    nowPlaying(guildID) {
        return new Promise(async (resolve, reject) => {

            let queue = this.queues.find((g) => g.guildID === guildID);
            if (!queue) return reject('Not playing');
            let currentSong = queue.songs[0];

            resolve(currentSong);
        });
    }

    setRepeatMode(guildID, enabled) {
        return new Promise(async (resolve, reject) => {

            let queue = this.queues.find((g) => g.guildID === guildID);
            if (!queue) return reject('Not playing');

            queue.repeatMode = enabled;

            resolve();
        });
    }

    shuffle(guildID) {
        return new Promise(async (resolve, reject) => {

            let queue = this.queues.find((g) => g.guildID === guildID);
            if (!queue) return reject('Not playing');

            let currentSong = queue.songs.shift();
            queue.songs = queue.songs.sort(() => Math.random() - 0.5);
            queue.songs.unshift(currentSong);

            resolve();
        });
    }

    remove(guildID, song) {
        return new Promise(async (resolve, reject) => {

            let queue = this.queues.find((g) => g.guildID === guildID);
            if (!queue) return reject('Not playing');

            let songFound = null;
            if (typeof song === "number") {
                songFound = queue.songs[song];
                if (songFound) {
                    queue.songs = queue.songs.filter((s) => s !== songFound);
                }
            } else {
                songFound = queue.songs.find((s) => s === song);
                if (songFound) {
                    queue.songs = queue.songs.filter((s) => s !== songFound);
                }
            }

            resolve(songFound);
        });
    }

    async _playSong(guildID, firstPlay) {
        let queue = this.queues.find((g) => g.guildID === guildID);

        if (queue.songs.length < 2 && !firstPlay && !queue.repeatMode) {
            if (this.options.leaveOnEnd && !queue.stopped) queue.connection.channel.leave();

            this.queues = this.queues.filter((g) => g.guildID !== guildID);

            if (queue.stopped) {
                if (this.options.leaveOnStop) queue.connection.channel.leave();
                return queue.emit('stop');
            }

            return queue.emit('end');
        }

        if (!firstPlay) queue.emit('songChanged', (!queue.repeatMode ? queue.songs.shift() : queue.songs[0]), queue.songs[0], queue.skipped, queue.repeatMode);
        queue.skipped = false;
        let song = queue.songs[0];

        let dispatcher = queue.connection.play(ytdl(song.url, { filter: 'audioonly', quality: 'highestaudio', highWaterMark: 1 << 25 }));
        queue.dispatcher = dispatcher;

        dispatcher.setVolumeLogarithmic(queue.volume / 200);

        dispatcher.on('finish', () => {
            return this._playSong(guildID, false);
        });
    }
};

module.exports = Player;
