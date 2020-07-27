class Song {
    constructor(video, queue, requestedBy) {

        this.name = video.title;

        this.duration = video.duration;
 
        this.author = video.author;

        this.url = video.link;

        this.thumbnail = video.thumbnail;

        this.queue = queue;

        this.requestedBy = requestedBy;
    }
};

module.exports = Song;