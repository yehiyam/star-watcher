const request = require('request-promise');

const WEBHOOK_URL = process.env.WEBHOOK_URL;

exports.iHaveAStar = async (req, res) => {
    const body = JSON.parse(req.body)
    const { repository, sender } = body;

    const repo = repository.name;
    const stars = repository.stargazers_count;
    const username = sender.login;
    const url = sender.html_url;

    try {
        await sendToSlack(repo, stars, username, url);
    } catch (err) {
        console.log(err);
        res.status(500).send('error');
        return
    }
    res.status(200).send('Ok');
    return 
};

const sendToSlack = async (repo, stars, username, url) => {
    const text = [
        `New Github star for _${repo}_ repo!.`,
        `The *${repo}* repo now has *${stars}* stars! :tada:.`,
        `Your new fan is <${url}|${username}>`
    ].join('\n');
    var options = {
        method: 'POST',
        uri: WEBHOOK_URL,
        body: {
            text
        },
        json: true // Automatically stringifies the body to JSON
    };
    resp = await request(options);
    // Use getBody to check if there was an error.
    resp.getBody();
}

