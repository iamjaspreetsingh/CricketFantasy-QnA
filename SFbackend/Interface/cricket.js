const request = require('request');
const { MongoClient } = require("mongodb");
const uri =
    "mongodb://localhost:27017/";
const client = new MongoClient(uri);
let culDBmid = null
let culDBscorecard = null;
let culDBmatches = null;
let culDBparticipants = null;
let cDBmid = null;
async function run() {
    await client.connect();
    culDBscorecard = await client.db("CricketUpcomingLive").collection("scorecard");
    culDBmatches = await client.db("CricketUpcomingLive").collection("matches");
    culDBparticipants = await client.db("CricketUpcomingLive").collection("participants");
    await client.db("admin").command({ ping: 1 });
    console.log("Connected successfully to server");
}
run()

const Qgeneration = async (mid, data, client) => {
    const q_arr = [{
        "que": "To Win the Match", "qno": "1", "teamid": "", "playerid": "", "type": "1", "oplen": 2,
        "before": "Before the match starts",
        "options": JSON.stringify([data["localteam"]["name"], data["visitorteam"]["name"], "Draw"])
    },
    {
        "que": "To Will the Toss", "qno": "2", "teamid": "", "playerid": "", "type": "1", "oplen": 2,
        "before": "Before a hour the match starts",
        "options": JSON.stringify([data["localteam"]["name"], data["visitorteam"]["name"]])
    }]

    const batsman1 = []
    const batsman2 = []
    const bowler1 = []
    const bowler2 = []
    const all_rounder1 = []
    const all_rounder2 = []
    const team1_id = data['localteam_id']
    const team2_id = data['visitorteam_id']
    const team1 = await getSquad(data['localteam_id'], data['season_id'])
    if (team1['data']['squad'] == []) {
        team1 = await getSquad2(data['visitorteam_id'], data['season_id'])
    }
    const team2 = await getSquad(data['visitorteam_id'], data['season_id'])
    if (team2['data']['squad'] == []) {
        team2 = await getSquad2(data['visitorteam_id'])
    }
    var player;
    for (player = 0; player < team1['data']['squad'].length; player++) {
        const seasons = await playerStatistics(player['id'])

        let credit = None;
        let credit1;
        if ('included' in seasons) {
            let found = false;
            var s;
            for (s = 0; s < seasons['included'].length; s++) {
                if (s['attributes']['season_id'] == data['season_id']) {
                    if (player['position']['name'] in ["Batsman", "Wicketkeeper", "Allrounder"]) {
                        if (s['attributes']['batting']) {
                            const avg = s['attributes']['batting']['average'];
                            if (avg >= 40 || (s['attributes']['batting']['strike_rate'] && s['attributes']['batting']['strike_rate'] >= 120 && avg >= 30)) credit = 9.0;
                            else if (30 <= avg < 40) credit = 8.5
                            else if (25 <= avg < 30) credit = 8.0
                            else if (20 <= avg < 25) credit = 7.5
                            else if (15 <= avg < 20) credit = 7.0
                            else if (10 <= avg < 15) credit = 6.5
                            else credit = 6.0
                        }
                    }

                    if (player['position']['name'] in ["Bowler", "Allrounder"]) {
                        if (s['attributes']['bowling']) {
                            const avg = s['attributes']['bowling']['average'];
                            if (avg <= 15) credit1 = 9.0
                            else if (15 < avg <= 20) credit1 = 8.5
                            else if (20 < avg <= 25) credit1 = 8.0
                            else if (25 <= avg < 30) credit1 = 7.5
                            else if (30 <= avg < 40) credit1 = 7.0
                            else if (40 <= avg < 45) credit1 = 6.5
                            else credit1 = 6.0

                            if (credit) {
                                if (credit1 >= 8) credit = credit1
                                else credit = (credit + credit1) / 2
                            }

                            else credit = credit1
                        }
                    }
                    found = true;
                    break;

                }
            }
            if (found == false) {
                for (s = 0; s < seasons['included'].length; s++) {
                    if (s['attributes']['tournament_type'] == data['type']) {
                        if (player['position']['name'] in ["Batsman", "Wicketkeeper", "Allrounder"]) {
                            if (s['attributes']['batting']) {
                                const avg = s['attributes']['batting']['average'];
                                if (avg >= 40 || (s['attributes']['batting']['strike_rate'] && s['attributes']['batting']['strike_rate'] >= 120 && avg >= 30)) credit = 9.0
                                else if (30 <= avg < 40) credit = 8.5
                                else if (25 <= avg < 30) credit = 8.0
                                else if (20 <= avg < 25) credit = 7.5
                                else if (15 <= avg < 20) credit = 7.0
                                else if (10 <= avg < 15) credit = 6.5
                                else credit = 6.0
                            }
                        }
                        if (player['position']['name'] in ["Bowler", "Allrounder"]) {
                            if (s['attributes']['bowling']) {
                                const avg = s['attributes']['bowling']['average'];
                                if (avg <= 15) credit1 = 9.0
                                else if (15 < avg <= 20) credit1 = 8.5
                                else if (20 < avg <= 25) credit1 = 8.0
                                else if (25 <= avg < 30) credit1 = 7.5
                                else if (30 <= avg < 40) credit1 = 7.0
                                else if (40 <= avg < 45) credit1 = 6.5
                                else credit1 = 6.0

                                if (credit) {
                                    if (credit1 >= 8) credit = credit1
                                    else credit = (credit + credit1) / 2
                                }
                                else credit = credit1
                            }
                        }
                        found = true;
                        break;
                    }
                }
            }
        }
        if (credit != None) player['credit'] = credit;
        else player['credit'] = 6.0;

        if (player['position']['name'] == 'Batsman') batsman1.append(player['fullname'])

        else if (player['position']['name'] == 'Bowler') bowler1.append(player['fullname'])

        else all_rounder1.append(player['fullname'])
    }
    for (player = 0; player < team2['data']['squad'].length; player++) {
        const seasons = await playerStatistics(player['id'])

        let credit = None;
        let credit1;
        if ('included' in seasons) {
            let found = false;
            var s
            for (s = 0; s < seasons['included'].length; s++) {
                if (s['attributes']['season_id'] == data['season_id']) {
                    if (player['position']['name'] in ["Batsman", "Wicketkeeper", "Allrounder"]) {
                        if (s['attributes']['batting']) {
                            const avg = s['attributes']['batting']['average'];
                            if (avg >= 40 || (s['attributes']['batting']['strike_rate'] && s['attributes']['batting']['strike_rate'] >= 120 && avg >= 30)) credit = 9.0;
                            else if (30 <= avg < 40) credit = 8.5
                            else if (25 <= avg < 30) credit = 8.0
                            else if (20 <= avg < 25) credit = 7.5
                            else if (15 <= avg < 20) credit = 7.0
                            else if (10 <= avg < 15) credit = 6.5
                            else credit = 6.0
                        }
                    }

                    if (player['position']['name'] in ["Bowler", "Allrounder"]) {
                        if (s['attributes']['bowling']) {
                            const avg = s['attributes']['bowling']['average'];
                            if (avg <= 15) credit1 = 9.0
                            else if (15 < avg <= 20) credit1 = 8.5
                            else if (20 < avg <= 25) credit1 = 8.0
                            else if (25 <= avg < 30) credit1 = 7.5
                            else if (30 <= avg < 40) credit1 = 7.0
                            else if (40 <= avg < 45) credit1 = 6.5
                            else credit1 = 6.0

                            if (credit) {
                                if (credit1 >= 8) credit = credit1
                                else credit = (credit + credit1) / 2
                            }

                            else credit = credit1
                        }
                    }
                    found = true;
                    break;

                }
            }
            if (found == false) {
                for (s = 0; s < seasons['included'].length; s++) {
                    if (s['attributes']['tournament_type'] == data['type']) {
                        if (player['position']['name'] in ["Batsman", "Wicketkeeper", "Allrounder"]) {
                            if (s['attributes']['batting']) {
                                const avg = s['attributes']['batting']['average'];
                                if (avg >= 40 || (s['attributes']['batting']['strike_rate'] && s['attributes']['batting']['strike_rate'] >= 120 && avg >= 30)) credit = 9.0
                                else if (30 <= avg < 40) credit = 8.5
                                else if (25 <= avg < 30) credit = 8.0
                                else if (20 <= avg < 25) credit = 7.5
                                else if (15 <= avg < 20) credit = 7.0
                                else if (10 <= avg < 15) credit = 6.5
                                else credit = 6.0
                            }
                        }
                        if (player['position']['name'] in ["Bowler", "Allrounder"]) {
                            if (s['attributes']['bowling']) {
                                const avg = s['attributes']['bowling']['average'];
                                if (avg <= 15) credit1 = 9.0
                                else if (15 < avg <= 20) credit1 = 8.5
                                else if (20 < avg <= 25) credit1 = 8.0
                                else if (25 <= avg < 30) credit1 = 7.5
                                else if (30 <= avg < 40) credit1 = 7.0
                                else if (40 <= avg < 45) credit1 = 6.5
                                else credit1 = 6.0

                                if (credit) {
                                    if (credit1 >= 8) credit = credit1
                                    else credit = (credit + credit1) / 2
                                }
                                else credit = credit1
                            }
                        }
                        found = true;
                        break;
                    }
                }
            }
        }
        if (credit != None) player['credit'] = credit;
        else player['credit'] = 6.0;

        if (player['position']['name'] == 'Batsman') batsman2.append(player['fullname'])

        else if (player['position']['name'] == 'Bowler') bowler2.append(player['fullname'])

        else all_rounder2.append(player['fullname'])
    }
    await culDBscorecard.update({ '_id': mid.toString() }, { '$set': { 'localteamsquad': team1, 'visitorteamsquad': team2 } });

    q_arr.append({
        "que": "Player of the match", "qno": "9",
        "oplen": batsman1.length + bowler1.length + all_rounder1.length + batsman2.length + bowler2.length + all_rounder2.length, "teamid": "", "playerid": "", "type": "1", "before": "Before the match starts", "options": JSON.stringify(batsman1 + bowler1 + all_rounder1 + batsman2 + bowler2 + all_rounder2)
    })

    q_arr.append({
        "que": "1st Over Total Runs", "qno": "10",
        "oplen": 2, "teamid": "", "playerid": "", "type": "1", "before": "Before the match starts", "options": JSON.stringify(["Over 1.5", "Under 1.5"])
    })
    q_arr.append({
        "que": "1st Wicket Method", "qno": "11",
        "oplen": 6, "teamid": "", "playerid": "", "type": "1", "before": "Before the match starts", "options": JSON.stringify(["Caught", "Bowled", "LBW", "Run Out", "Stumped", "Others"])
    })
    q_arr.append({
        "que": "Most Match Sixes", "qno": "12",
        "oplen": 3, "teamid": "", "playerid": "", "type": "1", "before": "Before the match starts", "options": JSON.stringify([data["localteam"]["name"], "Tie", data["visitorteam"]["name"]])
    })
    q_arr.append({
        "que": "Most Match Fours", "qno": "13",
        "oplen": 3, "teamid": "", "playerid": "", "type": "1", "before": "Before the match starts", "options": JSON.stringify([data["localteam"]["name"], "Tie", data["visitorteam"]["name"]])
    })
    q_arr.append({
        "que": "Most Run Outs (Fielding)", "qno": "14",
        "oplen": 3, "teamid": "", "playerid": "", "type": "1", "before": "Before the match starts", "options": JSON.stringify([data["localteam"]["name"], "Tie", data["visitorteam"]["name"]])
    })
    q_arr.append({
        "que": "Runs at Fall of 1st Wicket", "qno": "15",
        "oplen": 2, "teamid": "", "playerid": "", "type": "1", "before": "Before the match starts", "options": JSON.stringify(["Under 28.5", "Over 28.5"])
    })
    q_arr.append({
        "que": "A Hundred to be Scored in the Match", "qno": "16",
        "oplen": 2, "teamid": "", "playerid": "", "type": "1", "before": "Before the match starts", "options": JSON.stringify(["No", "Yes"])
    })
    q_arr.append({ "que": data["localteam"]["name"] + " Opening Partnership Total", "qno": "17", "oplen": 2, "teamid": team1_id.toString(), "playerid": "", "type": "1", "before": "Before the match starts", "options": JSON.stringify(["Over 26.5", "Under 26.5"]) })
    q_arr.append({ "que": data["visitorteam"]["name"] + " Opening Partnership Total", "qno": "17", "oplen": 2, "teamid": team2_id.toString(), "playerid": "", "type": "1", "before": "Before the match starts", "options": JSON.stringify(["Over 26.5", "Under 26.5"]) })

    if (batsman1 >= 6) {
        q_arr.append(
            {
                "que": "Who will score maximum runs in the match from {}?".format(data["localteam"]["name"]), "qno": "3",
                "oplen": 6, "teamid": team1_id.toString(), "playerid": "", "type": "1", "before": "Before the match starts", "options": JSON.stringify(batsman1.splice(6, batsman1.length - 1))
            })
        q_arr.append(
            {
                "que": "Who's strike rate will be best from {}?".format(data["localteam"]["name"]), "qno": "4", "oplen": 6, "teamid": team1_id.toString(),
                "playerid": "", "type": "1", "before": "Before the match starts", "options": JSON.stringify(batsman1.splice(6, batsman1.length - 1))
            })
    } else {
        q_arr.append(
            {
                "que": "Who will score maximum runs in the match from {}?".format(data["localteam"]["name"]),
                "qno": "3", "oplen": 6, "teamid": team1_id.toString, "playerid": "", "type": "1", "before": "Before the match starts",
                "options": JSON.stringify(batsman1 + all_rounder1.splice(6 - batsman1.length, all_rounder1.length - 1))
            })
        q_arr.append(
            {
                "que": "Who's strike rate will be best from {}?".format(data["localteam"]["name"]), "qno": "4",
                "oplen": 6, "teamid": team1_id.toString, "playerid": "", "type": "1", "before": "Before the match starts", "options": JSON.stringify(batsman1 + all_rounder1.splice(6 - batsman1.length, all_rounder1.length - 1))
            })
    }

    if (batsman2.length >= 6) {
        q_arr.append(
            {
                "que": "Who will score maximum runs in the match from {}?".format(data["visitorteam"]["name"]),
                "qno": "3", "oplen": 6, "teamid": team2_id.toString(), "playerid": "", "type": "1", "before": "Before the match starts",
                "options": JSON.stringify(batsman2.splice(6, batsman2.length - 1))
            })
        q_arr.append(
            {
                "que": "Who's strike rate will be best from {}?".format(data["visitorteam"]["name"]), "qno": "4",
                "oplen": 6, "teamid": team2_id.toString(), "playerid": "", "type": "1", "before": "Before the match starts", "options": JSON.stringify(batsman2.splice(6, batsman2.length - 1))
            })
    } else {
        q_arr.append(
            {
                "que": "Who will score maximum runs in the match from {}?".format(data["visitorteam"]["name"]),
                "qno": "3", "oplen": 6, "teamid": team2_id.toString(), "playerid": "", "type": "1",
                "before": "Before the match starts", "options": JSON.stringify(batsman2 + all_rounder2.splice(6 - batsman2.length, all_rounder2.length - 1))
            })
        q_arr.append(
            {
                "que": "Who's strike rate will be best from {}?".format(data["visitorteam"]["name"]), "qno": "4",
                "oplen": 6, "teamid": team2_id.toString(), "playerid": "", "type": "1", "before": "Before the match starts",
                "options": JSON.stringify(batsman2 + all_rounder2.splice(6 - batsman2.length, all_rounder2.length - 1))
            })
    }

    if (len(bowler1) >= 6) {
        q_arr.append(
            {
                "que": "Who will take maximum wickets economically from {}".format(data["localteam"]["name"]),
                "qno": "5", "oplen": 6, "teamid": team1_id.toString(), "playerid": "", "type": "1", "before": "Before the match starts",
                "options": JSON.stringify(bowler1.splice(6, bowler1.length - 1))
            })
        q_arr.append(
            {
                "que": "Who will have the best economy from {}".format(data["localteam"]["name"]), "qno": "6",
                "oplen": 6, "teamid": team1_id.toString(), "playerid": "", "type": "1", "before": "Before the match starts",
                "options": JSON.stringify(bowler1.splice(6, bowler1.length - 1))
            })
    } else {
        q_arr.append(
            {
                "que": "Who will take maximum wickets economically from {}".format(data["localteam"]["name"]),
                "qno": "5", "oplen": 6, "teamid": team1_id.toString(), "playerid": "", "type": "1", "before": "Before the match starts",
                "options": JSON.stringify(bowler1 + all_rounder1.splice(6 - bowler1.length, all_rounder1.length - 1))
            })
        q_arr.append(
            {
                "que": "Who will have the best economy from {}".format(data["localteam"]["name"]), "qno": "6",
                "oplen": 6, "teamid": team1_id.toString(), "playerid": "", "type": "1", "before": "Before the match starts",
                "options": JSON.stringify(bowler1 + all_rounder1.splice(6 - bowler1.length, all_rounder1.length - 1))
            })
    }

    if (len(bowler2) >= 6) {
        q_arr.append(
            {
                "que": "Who will take maximum wickets economically from {}".format(data["visitorteam"]["name"]),
                "qno": "5", "oplen": 6, "teamid": team2_id.toString(), "playerid": "", "type": "1", "before": "Before the match starts",
                "options": JSON.stringify(bowler2.splice(6, bowler2.length - 1))
            })
        q_arr.append(
            {
                "que": "Who will have the best economy from {}".format(data["visitorteam"]["name"]), "qno": "6",
                "oplen": 6, "teamid": team2_id.toString(), "playerid": "", "type": "1", "before": "Before the match starts",
                "options": JSON.stringify(bowler2.splice(6, bowler2.length - 1))
            })
    } else {
        q_arr.append(
            {
                "que": "Who will take maximum wickets economically from {}".format(data["visitorteam"]["name"]),
                "qno": "5", "oplen": 6, "teamid": team2_id.toString(), "playerid": "", "type": "1", "before": "Before the match starts",
                "options": JSON.stringify(bowler2 + all_rounder2.splice(6 - bowler2.length, all_rounder2.length - 1))
            })
        q_arr.append(
            {
                "que": "Who will have the best economy from {}".format(data["visitorteam"]["name"]), "qno": "6",
                "oplen": 6, "teamid": team2_id.toString(), "playerid": "", "type": "1", "before": "Before the match starts",
                "options": JSON.stringify(bowler2 + all_rounder2.splice(6 - bowler2.length, all_rounder2.length - 1))
            })
    }
    wicketsarr = ['0', '1', '2', '3+']
    runsarr = ['0-20', '21-40', '41-60', '60+']

    var i;

    for (i = 0; i < team1['data']['squad'].length; i++) {
        if (i['position']['name'] in ['Batsman', 'Wicketkeeper'])
            q_arr.append({ "que": "How many runs will {} score?".format(i["fullname"]), "qno": "7", "oplen": 4, "teamid": "", "playerid": i["id"].toString(), "type": "1", "before": "Before the match starts", "options": JSON.stringify(runsarr) })

        else if (i['position']['name'] == 'Bowler')
            q_arr.append({ "que": "How many wickets will {} take?".format(i["fullname"]), "qno": "8", "oplen": 4, "teamid": "", "playerid": i["id"].toString(), "type": "1", "before": "Before the match starts", "options": JSON.stringify(wicketsarr) })
    }
    for (i = 0; i < team2['data']['squad'].length; i++) {
        if (i['position']['name'] in ['Batsman', 'Wicketkeeper'])
            q_arr.append({ "que": "How many runs will {} score?".format(i["fullname"]), "qno": "7", "oplen": 4, "teamid": "", "playerid": i["id"].toString(), "type": "1", "before": "Before the match starts", "options": JSON.stringify(runsarr) })

        else if (i['position']['name'] == 'Bowler')
            q_arr.append({ "que": "How many wickets will {} take?".format(i["fullname"]), "qno": "8", "oplen": 4, "teamid": "", "playerid": i["id"].toString(), "type": "1", "before": "Before the match starts", "options": JSON.stringify(wicketsarr) })
    }

    return q_arr


}

const livematches = () => {
    return new Promise((resolve, reject) => {
        let ts = Date.now();
        let date_ob = new Date(ts);
        let date = date_ob.getDate();
        let after2days = date_ob.getDate() + 2;
        let month = date_ob.getMonth() + 1;
        let year = date_ob.getFullYear();
        today = year + "-" + month + "-" + date;
        date2days = year + "-" + month + "-" + after2days;
        var url = 'https://cricket.sportmonks.com/api/v2.0/fixtures?api_token=9w6l02vbMc5U1cdCIpgMFOaqi8J7vslQ3Z58v7qHzvVBIHUV99tk4N8nGYOc&filter[starts_between]=' + today + ',' + date2days + '&include=localteam,visitorteam,batting,bowling,lineup,scoreboards.team,league&sort=starting_at'
        let options = { json: true };



        request(url, options, (error, res, body) => {
            if (error) {
                reject({ status: false, error });
                return;
            }
            resolve({ status: true, body });
        });
    })


}

const getSquad = (id, sid) => {
    return new Promise((resolve, reject) => {
        var url = "https://cricket.sportmonks.com/api/v2.0/teams/" + id + "/squad/" + sid + "?api_token=9w6l02vbMc5U1cdCIpgMFOaqi8J7vslQ3Z58v7qHzvVBIHUV99tk4N8nGYOc"
        let options = { json: true };



        request(url, options, (error, res, body) => {
            if (error) {
                reject({ status: false, error });
                return;
            }
            resolve({ status: true, body });
        });
    })
}

const getSquad2 = (id) => {
    return new Promise((resolve, reject) => {
        var url = "https://cricket.sportmonks.com/api/v2.0/teams/" + id + "?api_token=9w6l02vbMc5U1cdCIpgMFOaqi8J7vslQ3Z58v7qHzvVBIHUV99tk4N8nGYOc&include=squad"
        let options = { json: true };



        request(url, options, (error, res, body) => {
            if (error) {
                reject({ status: false, error });
                return;
            }
            resolve({ status: true, body });
        });
    })
}

const playerStatistics = (pid) => {
    return new Promise((resolve, reject) => {
        var url = "https://cricket.sportmonks.com/api/v1/players/" + pid + "?api_token=9w6l02vbMc5U1cdCIpgMFOaqi8J7vslQ3Z58v7qHzvVBIHUV99tk4N8nGYOc&include=career&season=10"
        let options = { json: true };



        request(url, options, (error, res, body) => {
            if (error) {
                reject({ status: false, error });
                return;
            }
            resolve({ status: true, body });
        });
    })
}

const players = (mid) => {
    return new Promise((resolve, reject) => {
        var url = "https://cricket.sportmonks.com/api/v2.0/fixtures/" + str(mid) + "?api_token=9w6l02vbMc5U1cdCIpgMFOaqi8J7vslQ3Z58v7qHzvVBIHUV99tk4N8nGYOc&include=lineup,localteam,visitorteam"
        let options = { json: true };



        request(url, options, (error, res, body) => {
            if (error) {
                reject({ status: false, error });
                return;
            }
            resolve({ status: true, body });
        });
    })
}

const contest = (mid) => {
    return new Promise((resolve, reject) => {
        var url = "https://api.sportsdapp.co/contests/" + (mid)
        let options = { json: true };



        request(url, options, (error, res, body) => {
            if (error) {
                reject({ status: false, error });
                return;
            }
            resolve({ status: true, body });
        });
    })
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const quizGen = async () => {
    const data = await livematches();
    const b = data.body["data"];
    console.log(b)
    try {
        var d;
        for (d = 0; d < b.length; d++) {
            const mid = "2" + b[d]["id"]
            console.log(mid);
            culDBmid = await client.db("CricketUpcomingLive").collection(mid.toString());
            const qlink = await culDBmid.find({ '_id': 'normal' }, { '_id': 0 });
            var date2 = new Date(b[d]['time']['starting_at']['date_time'])
            var d2 = date2.getTime()
            var d1 = d2 + 86400000;
            if (!(b[d]["status"] == "NS" && b[d]["type"] in set(['TEST', '4day', 'Test/5day'])) && d1 > d2) {
                console.log(qlink);
                if (!(qlink.length == 0 || '0' in qlink[0])) {
                    const scorecardData = await culDBscorecard.find({ '_id': mid.toString() }, { '_id': 0 });
                    if (scorecardData.length == 0) {
                        await culDBscorecard.inserOne({ '_id': mid.toString(), 'status': b[d]['status'], 'League': b[d]['league']['name'], 'code': b[d]['league']['name'], 'local_team': b[d]['local_team']['name'], 'local_team_code': b[d]['localteam']['code'], 'visitor_team': b[d]['visitorteam']['name'], 'visitor_team_code': b[d]['visitorteam']['code'], 'start_at': b[d]['starting_at'], 'round': b[d]['round'], 'local_flag': b[d]['localteam']['image_path'], 'visitor_flag': b[d]['visitorteam']['image_path'], 'Batsman': None, 'Bowlers': None, 'Scorecard': None, 'result': 'Result Awaited', 'Type': b[d]['type'], 'localteamsquad': None, 'visitorteamsquad': None })
                    }
                    const q_arr = await Qgeneration(mid, b[d], client);
                    const length = q_arr.length;
                    const contest = await contest(mid);
                    const matchesData = await culDBmatches.find({ '_id': mid.toString() }, { '_id': 0 });
                    if (matchesData.length == 0) {
                        await culDBmatches.inserOne({ '_id': mid.toString(), 'League': b[d]['league']['name'], 'code': b[d]['league']['name'], 'local_team': b[d]['localteam']['name'], 'local_team_code': b[d]['localteam']['code'], 'Type': b[d]['type'], 'visitor_team': b[d]['visitorteam']['name'], 'visitor_team_code': b[d]['visitorteam']['code'], 'start_at': b[d]['starting_at'], 'round': b[d]['round'], 'local_flag': b[d]['localteam']['image_path'], 'visitor_flag': b[d]['visitorteam']['image_path'], 'status': b[d]['status'], 'contests': (contest['contests']).length, 'questions': length });
                    }
                    tcash = 0.0;
                    let n;
                    for (n = 0; n < length; n++) {
                        const quiz = {};
                        quiz['reviewed'] = "0";
                        quiz["curparticipation"] = "1";
                        quiz["q_id"] = n.toString();
                        quiz["match_id"] = mid;
                        quiz["season_id"] = b[d]["season_id"];
                        const qqno = parseInt(q_arr[n]['qno']);

                        if (qqno < 3) {
                            quiz["pfee"] = '3'
                            tcash += 1
                        } else if (qqno >= 3) {
                            quiz["pfee"] = '2'
                            tcash += 1
                        } else {
                            quiz["pfee"] = '1'
                            tcash += 1
                        }

                        quiz['rewardsystem'] = '1'
                        quiz['creator'] = 'auto'
                        quiz['stopvoting'] = "0"
                        quiz['private'] = '0'
                        quiz['status'] = 'Question is Live.'
                        quiz['qno'] = q_arr[n]['qno']
                        quiz['teamid'] = q_arr[n]['teamid']
                        quiz['playerid'] = q_arr[n]['playerid']

                        const d3 = moment().format('MMMM Do YYYY');
                        quiz['desc'] = b[d]["localteam"]["name"] + ' vs ' + b[d]["visitorteam"]["name"] + ', ' + d3
                        if (q_arr[n]["type"] == "1") {
                            quiz["content"] = q_arr[n]['que']
                            quiz["type"] = "1"
                            quiz["options"] = q_arr[n]['options']
                            quiz["before"] = q_arr[n]['before']
                        } else {
                            quiz["content"] = q_arr[n]['que']
                            quiz["options"] = []
                            quiz["type"] = "2"
                            quiz["before"] = q_arr[n]['before']
                        }

                        const pfee = quiz['pfee']
                        quiz = JSON.stringify(quiz)
                        const oplen = q_arr[n]['oplen']

                        cDBmid = await client.db("CRICKET").collection(mid.toString());
                        const cmiddata = cDBmid.find({ '_id': mid.toString()}, { '_id': 0 });
                        const setQuiz = {}
                        setQuiz[n.toString()] = quiz;
                        if (cmiddata.length > 0) {
                            await cDBmid.update({ '_id': mid.toString() }, { '$set': setQuiz })
                        } else {
                            await cDBmid.insertOne({ '_id': mid.toString(), setQuiz })
                        }

                        const culmiddata = culDBmid.find({ '_id': 'normal' }, { '_id': 0 });

                        if (culmiddata.length > 0) {
                            await culDBmid.update({ '_id': 'normal' }, { '$set': setQuiz })
                        } else {
                            await culDBmid.insertOne({ '_id': mid.toString(), setQuiz })
                        }

                        const setDict = {}
                        setDict[n.toString()] = [];

                        const participantsdata = await culDBparticipants.find({ '_id': mid.toString() }, { '_id': 0 })

                        if (participantsdata.length > 0) {
                            await culDBparticipants.update({ '_id': mid.toString() }, { '$set': setDict })
                        } else {
                            await culDBparticipants.insertOne({ '_id': str(mid), setQuiz })
                        }

                        const opts = { '_id': mid.toString() + n.toString() }

                        const opno = 0

                        while (opno < oplen) {
                            opts[opno] = 0
                            opno += 1
                        }
                        await culDBparticipants.insertOne(opts)

                        const bcqid = mid.toString() + n.toString();
                        // block.postQuestion(parseInt(bcqid),q_arr[n]['que'],parseInt(parseFloat(pfee)*10**18),pkey,pubkey)
                        sleep(5000);
                    }
                }
            }

        }
    } catch (e) {
        print(e)
        var message = 'Exception occured in cricket.js file ' + e.toString().replace(':', '')
        message += '\n\nTraceback Details:\n\n' + ' '.join(map(String, (console.trace()))).replace(':', '')
        return message;
    }
}

async function main() {
    try {
        const response = await quizGen();
        if (response.status) {
            return response.body
        }
    } catch (e) {
        return e
    }
}
main()
// module.exports = livematches


// brew services start mongodb-community

