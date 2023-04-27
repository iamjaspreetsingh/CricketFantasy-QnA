const request = require('request');
const { MongoClient } = require("mongodb");
const uri =
    "mongodb://localhost:27017/";
const client = new MongoClient(uri);
let fulDBmid = null
let fulDBscorecard = null;
let fulDBmatches = null;
let fDBmid = null;
let fulDBparticipants = null;
async function run() {
    await client.connect();
    fulDBscorecard = await client.db("FootballUpcomingLive").collection("scorecard");
    fulDBmatches = await client.db("FootballUpcomingLive").collection("matches");
    fulDBparticipants = await client.db("FootballUpcomingLive").collection("participants");
    await client.db("admin2").command({ ping: 1 });
    console.log("Connected successfully to server");
}
run()

const Qgeneration = async (mid, data) => {
    const q_arr = [{
        "que": "What will be the result of the match", "qno": "1", "teamid": "", "playerid": "", "type": "1", "oplen": 3,
        "before": "Before the match starts",
        "options": JSON.stringify([(data["localTeam"]['data']["name"]).toString(), (data["visitorTeam"]['data']["name"]).toString(), "Draw"])
    },
    {
        "que": "What will be total goals made in the match", "qno": "2", "teamid": "", "playerid": "", "type": "1", "oplen": 6,
        "before": "Before the match starts",
        "options": JSON.stringify(["0 Goals", "1-3 Goals", "4 Goals", "5 Goals", "6-7 Goals", "8+ Goals"])
    },
    {
        "que": "Which team will lead in half-time (first session)", "qno": "3", "teamid": "", "playerid": "", "type": "1",
        "oplen": 3,
        "before": "Before the match starts",
        "options": JSON.stringify([(data["localTeam"]['data']["name"]).toString(), (data["visitorTeam"]['data']["name"]).toString(), "Draw"])
    },
    {
        "que": "Which team will lead in half-full time (second session)", "qno": "4", "teamid": "", "playerid": "", "type": "1",
        "oplen": 3,
        "before": "Before the match starts",
        "options": JSON.stringify([(data["localTeam"]['data']["name"]).toString(), (data["visitorTeam"]['data']["name"]).toString(), "Draw"])
    },
    {
        "que": "In which category total goals scored in the match falls", "qno": "5", "teamid": "",
        "playerid": "", "type": "1",
        "oplen": 2,
        "before": "Before the match starts",
        "options": JSON.stringify(["Odd", "Even"])
    },
    {
        "que": "Which team will score first goal in the match", "qno": "6", "teamid": "",
        "playerid": "", "type": "1",
        "oplen": 3,
        "before": "Before the match starts",
        "options": JSON.stringify([(data["localTeam"]['data']["name"]).toString(), (data["visitorTeam"]['data']["name"]).toString(), "0 goals would be scored"])
    },
    {
        "que": "What will be total goals made till half-time (first session)", "qno": "7", "teamid": "",
        "playerid": "", "type": "1",
        "oplen": 6,
        "before": "Before the match starts",
        "options": JSON.stringify(["0 Goals", "1 Goals", "2 Goals", "3-4 Goals", "4-7 Goals", "8+ Goals"])
    },
    {
        "que": "What will be total goals made in half-full time (second session)", "qno": "8", "teamid": "",
        "playerid": "", "type": "1",
        "oplen": 6,
        "before": "Before the match starts",
        "options": JSON.stringify(["0 Goals", "1 Goals", "2 Goals", "3-4 Goals", "5-7 Goals", "8+ Goals"])
    },
    {
        "que": "How many goals " + (data["localTeam"]['data']["name"]).toString() + " will score?", "qno": "9", "teamid": data['localteam_id'], "playerid": "",
        "type": "1", "oplen": 6, "before": "Before the match starts", "options": JSON.stringify(["0", "1", "2", "3", "4", "5+"])
    },
    {
        "que": "How many goals " + (data["visitorTeam"]['data']["name"]).toString() + " will score?", "qno": "9", "teamid": data['visitorteam_id'], "playerid": "",
        "type": "1", "oplen": 6,
        "before": "Before the match starts",
        "options": JSON.stringify(["0", "1", "2", "3", "4", "5+"])
    }
    ]

    return q_arr;
}

const livematches = () => {
    return new Promise((resolve, reject) => {
        let ts = Date.now();
        let date_ob = new Date(ts);
        let date = date_ob.getDate();
        let after8days = date_ob.getDate() + 8;
        let month = date_ob.getMonth() + 1;
        let year = date_ob.getFullYear();
        today = year + "-" + month + "-" + date;
        date8days = year + "-" + month + "-" + after8days;
        var url = "https://soccer.sportmonks.com/api/v2.0/fixtures/between/" + str(today) + "/" + today + date8days + "?api_token=U4o0yu9dcTLtfPga3lFUlkxqK0V3YQ8XwXhUuRKIkVjajl0cyqNOmnc8ddcH&include=goals.team,localTeam,visitorTeam,league"
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
        var url = "https://api.sportsdapp.co/contestsFootball/{}".format(mid)
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
    try {
        const data = await livematches();
        const b = data.body["data"];
        var d;
        for (d = 0; d < b.length; d++) {
            const mid = "1" + b[d]['id']
            fulDBmid = await client.db("FootballUpcomingLive").collection(mid.toString());
            const qlink = await fulDBmid.find({ '_id': 'normal' }, { '_id': 0 })
            var date2 = new Date(b[d]['time']['starting_at']['date_time'])
            var d2 = date2.getTime()
            var d1 = d2 + 1440000000;

            if (true || (b[d]['time']['status'] == 'NS' && d1 > d2)) {
                if (qlink.length == 0 || !('0' in qlink[0])) {
                    const scorecardData = await fulDBscorecard.find({ '_id': mid.toString() }, { '_id': 0 })
                    if (scorecardData.length == 0) {
                        await fulDBscorecard.insertOne({ '_id': mid.toString(), 'status': b[d]['time']['status'], 'League': b[d]['league']['data']['name'], 'local_team': b[d]['localTeam']['data']['name'], 'local_team_code': b[d]['localTeam']['data']['short_code'], 'visitor_team': b[d]['visitorTeam']['data']['name'], 'visitor_team_code': b[d]['visitorTeam']['data']['short_code'], 'start_at': b[d]['time']['starting_at']['date_time'], 'local_flag': b[d]['localTeam']['data']['logo_path'], 'visitor_flag': b[d]['visitorTeam']['data']['logo_path'], 'goals': None, 'result': 'Result Awaited', 'Type': b[d]['league']['data']['type'], 'localteamsquad': None, 'visitorteamsquad': None })
                    }

                    const q_arr = await Qgeneration(mid, b[d])
                    const length = q_arr.length
                    const contest = await contest(mid)
                    const matchesData = await fulDBmatches.find({ '_id': mid.toString() }, { '_id': 0 })
                    if (matchesData.length == 0) {
                        await fulDBmatches.insertOne({ '_id': mid.toString(), 'League': b[d]['league']['data']['name'], 'local_team': b[d]['localTeam']['data']['name'], 'local_team_code': { $cond: { if: b[d]['localTeam']['data']['short_code'] != None, then: b[d]['localTeam']['data']['short_code'], else: b[d]['localTeam']['data']['name'].splice(3, b[d]['localTeam']['data']['name'].length - 1) } }, 'Type': b[d]['league']['data']['type'], 'visitor_team': b[d]['visitorTeam']['data']['name'], 'visitor_team_code': { $cond: { if: b[d]['visitorTeam']['data']['short_code'] != None, then: b[d]['visitorTeam']['data']['short_code'], else: b[d]['visitorTeam']['data']['name'].splice(3, b[d]['visitorTeam']['data']['name'].length - 1) } }, 'start_at': b[d]['time']['starting_at']['date_time'], 'local_flag': b[d]['localTeam']['data']['logo_path'], 'visitor_flag': b[d]['visitorTeam']['data']['logo_path'], 'status': b[d]['time']['status'], 'questions': length, 'contest': contest['contests'].length })
                    }
                    var n;
                    for (n = 0; n < length; n++) {
                        var quiz = {};
                        quiz['reviewed'] = "0"
                        quiz["curparticipation"] = "0"
                        quiz['q_id'] = n.toString()
                        quiz["match_id"] = mid
                        quiz["season_id"] = b[d]["season_id"]
                        const qqno = parseInt(q_arr[n]['qno'])

                        if (qqno < 3) quiz['pfee'] = '3'
                        else if (qqno >= 3 && qqno <= 6) quiz['pfee'] = '2'
                        else quiz['pfee'] = '1'

                        quiz['rewardsystem'] = '1'
                        quiz['creator'] = 'auto'
                        quiz['stopvoting'] = "0"
                        quiz['private'] = '0'
                        quiz['status'] = 'Question is Live.'
                        quiz['qno'] = q_arr[n]['qno']
                        quiz['teamid'] = q_arr[n]['teamid']
                        quiz['playerid'] = q_arr[n]['playerid']

                        const d3 = moment().format('MMMM Do YYYY');
                        quiz['desc'] = (b[d]["localTeam"]['data']["name"]).toString() + ' vs ' + (b[d]["visitorTeam"]['data']["name"]).toString() + ', ' + d3

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

                        fDBmid = await client.db("FOOTBALL").collection(mid.toString());
                        const fmiddata = await fDBmid.find({ '_id': str(mid) }, { '_id': 0 });
                        const setQuiz = {}
                        setQuiz[n.toString()] = quiz;
                        if (fmiddata.length > 0) {
                            await fDBmid.update({ '_id': mid.toString() }, { '$set': setQuiz })
                        } else {
                            await fDBmid.insertOne({ '_id': mid.toString(), setQuiz })
                        }

                        const fulmiddata = fulDBmid.find({ '_id': 'normal' }, { '_id': 0 })
                        if (fulmiddata.length > 0) {
                            await fulDBmid.update({ '_id': 'normal' }, { '$set': setQuiz })
                        } else {
                            await fulDBmid.insertOne({ '_id': 'normal', setQuiz })
                        }
                        const fulparticipantsdata = await fulDBparticipants.find({ '_id': mid.toString() }, { '_id': 0 })
                        const setDict = {}
                        setDict[n.toString()] = [];

                        if (fulparticipantsdata.length > 0) {
                            await fulDBparticipants.update({ '_id': mid.toString() }, { '$set': setDict })
                        } else {
                            await fulDBparticipants.insertOne({ '_id': mid.toString(), setDict })
                        }
                        const opts = { '_id': mid.toString() + n.toString() }

                        const opno = 0

                        while (opno < oplen) {
                            opts[opno.toString()] = 0
                            opno += 1
                        }
                        await fulDBparticipants.insertOne(opts)

                        const bcqid = mid.toString() + n.toString

                        sleep(5000)


                    }
                }
            }
        }
    } catch (e) {
        print(e)
        var message = 'Exception occured in football.js file ' + e.toString().replace(':', '')
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


