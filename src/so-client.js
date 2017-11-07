/*
so-client simply makes a request to the Stack Exchange API (http://api.stackexchange.com/docs)
*/

const request = require('request-promise-native')

const soClient = (question) => {
    const q = encodeURIComponent(question);
    return new Promise((resolve, reject) => {
        request({
            url: "http://api.stackexchange.com/2.2/search?page=1&order=desc&sort=activity&intitle=" + q + "&site=stackoverflow",
            method: "GET",
            gzip: true, //stack overflow returns responses that are gzip encoded
            headers: {
                "Content-Type": "application/json"
            },
            resolveWithFullResponse: true
        })
        .then((response) => {
            const result = JSON.parse(response.body);
            resolve(result);
        })
        .catch((err) => {
            resolve(new Error("Something is wrong"));
        })
    });
};

module.exports = soClient;