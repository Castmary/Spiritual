module.exports = client => {
    let prompt = process.openStdin()
    prompt.addListener("data", res => {
        let x = res.toString().toString().trim().split(/ + /g)
        client.channels.cache.get("709949318651576374").send(x.join(" "));
    });
}
