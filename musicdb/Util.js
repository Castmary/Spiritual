class Util {

    constructor(){}
    
    static getFirstYoutubeResult(search, SYA){
        return new Promise(async (resolve, reject) => {
            search = search.replace(/<(.+)>/g, "$1");

            SYA.getVideo(search).then(async (video) => {
                video = await video.fetch();
                resolve(video);
            }).catch(async (err) => {
                if(err.message === "Bad Request"){
                    throw Error('Invalid Youtube Data v3 API key.');
                } else {
                    try {
                        let results = await SYA.searchVideos(search, 1);
                        if (results.length < 1) resolve('err');
                        let fetched = await results.shift().fetch();
                        results.push(fetched);
                        resolve(results.pop());
                    } catch (err) {
                        if (err && err.errors && err.errors[0].reason == "dailyLimitExceeded")
                            return resolve('errQuota');
                        if(err.message === "Bad Request"){
                            throw Error('Invalid Youtube Data v3 API key.');
                        } else {
                            resolve('err');
                        }
                    }
                }
            });
        });
    }

    static getFirstSearch(search, ytsr){
        return new Promise(async (resolve, reject) => {
            search = search.replace(/<(.+)>/g, "$1");
            let filter;

            ytsr.getFilters(search, function (err, filters) {
                if (err) return resolve('err');
                filter = filters.get('Type').find(o => o.name === 'Video');
                var options = {
                    limit: 1,
                    nextpageRef: filter.ref,
                }
                ytsr(null, options, function (err, searchResults) {
                    if (err) return resolve('err');
                    if (!searchResults.items || !searchResults.items[0]) return resolve('err');
                    resolve(searchResults.items[0]);
                });
            });
            
        });
    }
};

module.exports = Util;