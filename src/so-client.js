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
        /*request({
            url: "http://api.stackexchange.com/2.2/search",
            qs: {
                page: 1,
                order: "desc",
                sort: "activity",
                intitle: q,
                site: "stackoverflow"
            },
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
            //resolveWithFullResponse: true
        }, function(error, response, body) {console.log("response body:");//console.log(body)
            const result = body;//JSON.parse(body);
            console.log(result);
            resolve(result);
        });*/
    });
}

//https://developer.chrome.com/multidevice/user-agent

/*const soClient = (question, callback) => {
    const q = encodeURIComponent(question);
    
    request({
        //url: "http://api.stackexchange.com/2.2/search",
        url: "http://api.stackexchange.com/2.2/search?page=1&order=desc&sort=activity&intitle=how%20to%20create%20android%20activity&site=stackoverflow",
        //url: "https://api.github.com/users/chieze-franklin",
        qs: {
            page: 1,
            order: "desc",
            sort: "activity",
            intitle: q,
            site: "stackoverflow"
        },
        gzip: true,
        method: "GET",
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            //"User-Agent": "Mozilla/5.0 (Linux; Android 4.0.4; Galaxy Nexus Build/IMM76B) AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.133 Mobile Safari/535.19"
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_4) AppleWebKit/600.7.12 (KHTML, like Gecko) Version/8.0.7 Safari/600.7.12",
            "Accept-Encoding": "gzip"
        }
    }, function(error, response, body) {console.log(body)
        const result = body;//JSON.parse(body);
        //console.log(result);
        callback(result);
    });
}*/

module.exports = soClient;