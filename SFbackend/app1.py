from datetime import date
from datetime import timedelta
import json
import requests
import pymongo
from datetime import datetime
import time
import blockchaintxns as block

pkey = 'be14e8033ca7636453d385d6bab0d53f379f1a2f451d7f8aee8bd9bcd5aba7c8'
pubkey = '0x1676F7E820816b6A5dfCFB5F1caFdac5D75CC851'

class asknplay:

    def Q_generation(self, mid, data, client):
        q_arr = [{"que": "To Win the Match", "qno": "1", "teamid": "", "playerid": "", "type": "1", "oplen": 2,
                  "before": "Before the match starts",
                  "options": json.dumps([data["localteam"]["name"], data["visitorteam"]["name"], "Draw"])},
                 {"que": "To Win the Toss", "qno": "2", "teamid": "", "playerid": "", "type": "1", "oplen": 2,
                  "before": "Before a hour the match starts",
                  "options": json.dumps([data["localteam"]["name"], data["visitorteam"]["name"]])}]

        batter1 = []
        batter2 = []
        bowler1 = []
        bowler2 = []
        all_rounder1 = []
        all_rounder2 = []
        team1_id = data['localteam_id']
        team2_id = data['visitorteam_id']
        team1 = self.getSquad(data['localteam_id'], data['season_id'])
        if team1['data']['squad']==[]:
            team1 = self.getSquad2(data['localteam_id'])
        team2 = self.getSquad(data['visitorteam_id'], data['season_id'])
        if team2['data']['squad']==[]:
            team2 = self.getSquad2(data['visitorteam_id'])

        

        for player in team1['data']['squad']:

            if player['position']['name'] == 'Batsman':
                batter1.append(player['fullname'])

            elif player['position']['name'] == 'Bowler':
                bowler1.append(player['fullname'])

            else:
                all_rounder1.append(player['fullname'])

        client.CRICKETUPCOMINGLIVE['scorecard'].update({'_id':str(mid)},{'$set':{'localteamsquad':team1,'visitorteamsquad':team2}})

        q_arr.append({"que": "Player of the match","qno": "9",
                 "oplen": len(batter1)+len(bowler1)+len(all_rounder1)+len(batter2)+len(bowler2)+len(all_rounder2), "teamid": "", "playerid": "", "type": "1", "before": "Before the match starts","options": json.dumps(batter1+bowler1+all_rounder1+batter2+bowler2+all_rounder2)})

        q_arr.append({"que": "1st Over Total Runs","qno": "10",
                 "oplen": 2, "teamid": "", "playerid": "", "type": "1", "before": "Before the match starts","options": json.dumps(["Over 1.5","Under 1.5"])})
        q_arr.append({"que": "1st Wicket Method","qno": "11",
                 "oplen": 6, "teamid": "", "playerid": "", "type": "1", "before": "Before the match starts","options": json.dumps(["Caught","Bowled","LBW","Run Out","Stumped","Others"])})
        q_arr.append({"que": "Most Match Sixes","qno": "12",
                 "oplen": 3, "teamid": "", "playerid": "", "type": "1", "before": "Before the match starts","options": json.dumps([data["localteam"]["name"],"Tie",data["visitorteam"]["name"]])})
        q_arr.append({"que": "Most Match Fours","qno": "13",
                 "oplen": 3, "teamid": "", "playerid": "", "type": "1", "before": "Before the match starts","options": json.dumps([data["localteam"]["name"],"Tie",data["visitorteam"]["name"]])})
        q_arr.append({"que": "Most Run Outs (Fielding)","qno": "14",
                 "oplen": 3, "teamid": "", "playerid": "", "type": "1", "before": "Before the match starts","options": json.dumps([data["localteam"]["name"],"Tie",data["visitorteam"]["name"]])})
        q_arr.append({"que": "Runs at Fall of 1st Wicket","qno": "15",
                 "oplen": 2, "teamid": "", "playerid": "", "type": "1", "before": "Before the match starts","options": json.dumps(["Under 28.5","Over 28.5"])})
        q_arr.append({"que": "A Hundred to be Scored in the Match","qno": "16",
                 "oplen": 2, "teamid": "", "playerid": "", "type": "1", "before": "Before the match starts","options": json.dumps(["No","Yes"])})
        q_arr.append({"que":data["localteam"]["name"]+ " Opening Partnership Total","qno": "17", "oplen": 2, "teamid": str(team1_id), "playerid": "", "type": "1", "before": "Before the match starts","options": json.dumps(["Over 26.5","Under 26.5"])})
        q_arr.append({"que":data["visitorteam"]["name"]+ " Opening Partnership Total","qno": "17", "oplen": 2, "teamid": str(team2_id), "playerid": "", "type": "1", "before": "Before the match starts","options": json.dumps(["Over 26.5","Under 26.5"])})

        if len(batter1) >= 6:
            q_arr.append(
                {"que": "Who will score maximum runs in the match from {}?".format(data["localteam"]["name"]),"qno": "3",
                 "oplen": 6, "teamid": str(team1_id), "playerid": "", "type": "1", "before": "Before the match starts","options": json.dumps(batter1[:6])})
            q_arr.append(
                {"que": "Who's strike rate will be best from {}?".format(data["localteam"]["name"]), "qno": "4","oplen": 6, "teamid": str(team1_id),
                 "playerid": "", "type": "1", "before": "Before the match starts", "options": json.dumps(batter1[:6])})
        else:
            q_arr.append(
                {"que": "Who will score maximum runs in the match from {}?".format(data["localteam"]["name"]),
                 "qno": "3","oplen": 6, "teamid": str(team1_id), "playerid": "", "type": "1", "before": "Before the match starts",
                 "options": json.dumps(batter1+all_rounder1[:6-len(batter1)])})
            q_arr.append(
                {"que": "Who's strike rate will be best from {}?".format(data["localteam"]["name"]), "qno": "4",
                 "oplen": 6, "teamid": str(team1_id),"playerid": "", "type": "1", "before": "Before the match starts", "options": json.dumps(batter1+all_rounder1[:6-len(batter1)])})

        if len(batter2) >= 6:
            q_arr.append(
                {"que": "Who will score maximum runs in the match from {}?".format(data["visitorteam"]["name"]),
                 "qno": "3","oplen": 6, "teamid": str(team2_id), "playerid": "", "type": "1", "before": "Before the match starts",
                 "options": json.dumps(batter2[:6])})
            q_arr.append(
                {"que": "Who's strike rate will be best from {}?".format(data["visitorteam"]["name"]), "qno": "4",
                 "oplen": 6, "teamid": str(team2_id), "playerid": "", "type": "1", "before": "Before the match starts","options": json.dumps(batter2[:6])})
        else:
            q_arr.append(
                {"que": "Who will score maximum runs in the match from {}?".format(data["visitorteam"]["name"]),
                 "qno": "3", "oplen": 6, "teamid": str(team2_id), "playerid": "", "type": "1",
                 "before": "Before the match starts","options": json.dumps(batter2+all_rounder2[:6-len(batter2)])})
            q_arr.append(
                {"que": "Who's strike rate will be best from {}?".format(data["visitorteam"]["name"]), "qno": "4",
                 "oplen": 6, "teamid": str(team2_id), "playerid": "", "type": "1", "before": "Before the match starts",
                 "options": json.dumps(batter2+all_rounder2[:6-len(batter2)])})

        if len(bowler1) >= 6:
            q_arr.append(
                {"que": "Who will take maximum wickets economically from {}".format(data["localteam"]["name"]),
                 "qno": "5", "oplen": 6, "teamid": str(team1_id), "playerid": "", "type": "1", "before": "Before the match starts",
                 "options": json.dumps(bowler1[:6])})
            q_arr.append(
                {"que": "Who will have the best economy from {}".format(data["localteam"]["name"]), "qno": "6",
                 "oplen": 6, "teamid": str(team1_id), "playerid": "", "type": "1", "before": "Before the match starts",
                 "options": json.dumps(bowler1[:6])})
        else:
            q_arr.append(
                {"que": "Who will take maximum wickets economically from {}".format(data["localteam"]["name"]),
                 "qno": "5","oplen": 6, "teamid": str(team1_id), "playerid": "", "type": "1", "before": "Before the match starts",
                 "options": json.dumps(bowler1+all_rounder1[:6-len(bowler1)])})
            q_arr.append(
                {"que": "Who will have the best economy from {}".format(data["localteam"]["name"]), "qno": "6",
                 "oplen": 6, "teamid": str(team1_id), "playerid": "", "type": "1", "before": "Before the match starts",
                 "options": json.dumps(bowler1+all_rounder1[:6-len(bowler1)])})

        if len(bowler2) >= 6:
            q_arr.append(
                {"que": "Who will take maximum wickets economically from {}".format(data["visitorteam"]["name"]),
                 "qno": "5", "oplen": 6, "teamid": str(team2_id), "playerid": "", "type": "1", "before": "Before the match starts",
                 "options": json.dumps(bowler2[:6])})
            q_arr.append(
                {"que": "Who will have the best economy from {}".format(data["visitorteam"]["name"]), "qno": "6",
                 "oplen": 6, "teamid": str(team2_id), "playerid": "", "type": "1", "before": "Before the match starts",
                 "options": json.dumps(bowler2[:6])})
        else:
            q_arr.append(
                {"que": "Who will take maximum wickets economically from {}".format(data["visitorteam"]["name"]),
                 "qno": "5", "oplen": 6, "teamid": str(team2_id), "playerid": "", "type": "1", "before": "Before the match starts",
                 "options": json.dumps(bowler2+all_rounder2[:6-len(bowler2)])})
            q_arr.append(
                {"que": "Who will have the best economy from {}".format(data["visitorteam"]["name"]), "qno": "6",
                 "oplen": 6, "teamid": str(team2_id), "playerid": "", "type": "1", "before": "Before the match starts",
                 "options": json.dumps(bowler2+all_rounder2[:6-len(bowler2)])})

        wicketsarr = ['0', '1', '2', '3+']
        runsarr = ['0-20', '21-40', '41-60', '60+']

        for i in team1['data']['squad']:
            if i['position']['name'] in set(['Batsman','Wicketkeeper']):
                q_arr.append({"que": "How many runs will {} score?".format(i["fullname"]), "qno": "7", "oplen": 4, "teamid": "","playerid": str(i["id"]), "type": "1", "before": "Before the match starts","options": json.dumps(runsarr)})

            elif i['position']['name'] == 'Bowler':
                q_arr.append({"que": "How many wickets will {} take?".format(i["fullname"]),"qno":"8","oplen":4,"teamid":"","playerid":str(i["id"]),"type":"1","before":"Before the match starts","options":json.dumps(wicketsarr)})

        for i in team2['data']['squad']:
            if i['position']['name'] in set(['Batsman','Wicketkeeper']):
                q_arr.append({"que": "How many runs will {} score?".format(i["fullname"]), "qno": "7", "oplen": 4, "teamid": "","playerid": str(i["id"]), "type": "1", "before": "Before the match starts","options": json.dumps(runsarr)})

            elif i['position']['name'] == 'Bowler':
                q_arr.append({"que": "How many wickets will {} take?".format(i["fullname"]),"qno":"8","oplen":4,"teamid":"","playerid":str(i["id"]),"type":"1","before":"Before the match starts","options":json.dumps(wicketsarr)})


        return q_arr


    def livematches(self):
        print('api call,livematches')
        today = date.today()
        url = "https://cricket.sportmonks.com/api/v2.0/fixtures?" \
              "api_token=h5Ab6JWRICYXpmB7TiRxlBOvvEDLWe3uiSQxvSiRI1mCMUJG1DhfUsVozqZn" \
              "&filter[starts_between]="+str(today)+","+str(today+timedelta(days=2))+\
              "&include=localteam,visitorteam,batting,bowling,lineup,scoreboards.team,league&sort=starting_at"

        res = requests.request("GET", url)
        print(res.text)
        if res.status_code == 200 and res:
            return json.loads(res.text)

    def getSquad(self, id, sid):
        print('api call, getsquad1')
        url = "https://cricket.sportmonks.com/api/v2.0/teams/"+str(id)+"/squad/"+str(sid)+"?" \
            "api_token=h5Ab6JWRICYXpmB7TiRxlBOvvEDLWe3uiSQxvSiRI1mCMUJG1DhfUsVozqZn"

        res = requests.request("GET", url)
        if res.status_code == 200 and res:
            return json.loads(res.text)
    
    def getSquad2(self, id):
        print('API Call,getsquad2')
        url="https://cricket.sportmonks.com/api/v2.0/teams/"+str(id)+"?" \
            "api_token=h5Ab6JWRICYXpmB7TiRxlBOvvEDLWe3uiSQxvSiRI1mCMUJG1DhfUsVozqZn&include=squad"
        try:
            res = requests.request("GET", url)
            if res.status_code == 200 and res:
                return json.loads(res.text)
        except:
            print('getSqaud2:connection refused')


    def quiz_gen(self):
     
        client = pymongo.MongoClient('localhost',27017)
        data = self.livematches()
        print(data)
        try:
            for k in data["data"]:
                mid = str(k['id'])
                print('mid', mid)
                
                qlink = list(client.CRICKETUPCOMINGLIVE[str(mid)].find({'_id': 'normal'}, {'_id': 0}))
                d2 = datetime.strptime(k['starting_at'], "%Y-%m-%dT%H:%M:%S.%fZ")
                d1 = datetime.now()+timedelta(hours = 24)
                if k['status'] == 'NS' and k['type'] not in set(['TEST','4day','Test/5day']) and d1>d2:
                    print('Creating questions now in MongoDB collection of MID')
                    print(qlink)
                    if (len(qlink) == 0 or '0' not in qlink[0]):

                        print('updating in scorecard collection of CRICKETUPCOMINGLIVE DB of Mongodb')

                        if len(list(client.CRICKETUPCOMINGLIVE['scorecard'].find({'_id':str(mid)},{'_id':0})))==0:
                            client.CRICKETUPCOMINGLIVE['scorecard'].insert_one({'_id': str(mid),'status':k['status'],'League':k['league']['name'],'code':k['league']['name'],'local_team':k['localteam']['name'],'local_team_code':k['localteam']['code'],'visitor_team':k['visitorteam']['name'],'visitor_team_code':k['visitorteam']['code'],'start_at':k['starting_at'],'round':k['round'],'local_flag':k['localteam']['image_path'], 'visitor_flag':k['visitorteam']['image_path'],'Batsman':None, 'Bowlers':None, 'Scorecard':None, 'result':'Result Awaited', 'Type':k['type'], 'localteamsquad':None, 'visitorteamsquad':None})

                        print('Generate questions locally')
                        q_arr = self.Q_generation(mid, k,client)
                        length = len(q_arr)

                        print('updating in smatches collection of CRICKETUPCOMINGLIVE DB of Mongodb')
                        if len(list(client.CRICKETUPCOMINGLIVE['matches'].find({'_id':str(mid)},{'_id':0})))==0:
                            client.CRICKETUPCOMINGLIVE['matches'].insert_one({'_id':str(mid), 'League':k['league']['name'],'code':k['league']['name'],'local_team':k['localteam']['name'],'local_team_code':k['localteam']['code'],'Type':k['type'],'visitor_team':k['visitorteam']['name'],'visitor_team_code':k['visitorteam']['code'],'start_at':k['starting_at'],'round':k['round'],'local_flag':k['localteam']['image_path'], 'visitor_flag':k['visitorteam']['image_path'],'status':k['status']})

                        for n in range(0, length):
                            quiz = {}
                            quiz['reviewed'] = "0"
                            quiz["curparticipation"] = "1"
                            quiz['q_id'] = str(n)
                            quiz["match_id"] = mid
                            quiz["season_id"] = k["season_id"]
                            qqno = int(q_arr[n]['qno'])

                            if qqno < 3:
                                quiz['pfee'] = '3'
                            elif qqno >= 3 and qqno <= 6:
                                quiz['pfee'] = '2'
                            else:
                                quiz['pfee'] = '1'

                            quiz['rewardsystem'] = '1'
                            quiz['creator'] = 'auto'
                            quiz['stopvoting'] = "0"
                            quiz['private'] = '0'
                            quiz['status'] = 'Question is Live.'
                            quiz['qno'] = q_arr[n]['qno']
                            quiz['teamid'] = q_arr[n]['teamid']
                            quiz['playerid'] = q_arr[n]['playerid']

                            today = date.today()
                            d2 = today.strftime("%B %d, %Y")

                            quiz['desc'] = k["localteam"]["name"] + ' vs ' + k["visitorteam"]["name"] + ', ' + d2

                            if q_arr[n]["type"] == "1":
                                quiz["content"] = q_arr[n]['que']
                                quiz["type"] = "1"
                                quiz["options"] = q_arr[n]['options']
                                quiz["before"] = q_arr[n]['before']

                            else:
                                quiz["content"] = q_arr[n]['que']
                                quiz["options"] = []
                                quiz["type"] = "2"
                                quiz["before"] = q_arr[n]['before']
                                
                            pfee = quiz['pfee']
                            quiz = json.dumps(quiz)

                            print('updating in mid collection of Mongodb')

                            if len(list(client.CRICKET[str(mid)].find({'_id': str(mid)}, {'_id': 0}))) > 0:
                                client.CRICKET[str(mid)].update({'_id': str(mid)}, {'$set': {str(n):quiz}})
                            else:
                                client.CRICKET[str(mid)].insert_one({'_id': str(mid), str(n): quiz})

                            if len(list(client.CRICKETUPCOMINGLIVE[str(mid)].find({'_id': 'normal'}, {'_id': 0}))) > 0:
                                client.CRICKETUPCOMINGLIVE[str(mid)].update({'_id': 'normal'}, {'$set': {str(n): quiz}})
                            else:
                                client.CRICKETUPCOMINGLIVE[str(mid)].insert_one({'_id': 'normal', str(n): quiz})
                            
                                
                            bcqid = str(mid) + str(n)
                            print('Creating question onchain, API call:')
                            print(bcqid)
                            print(quiz)
                            # block.postQuestion(int(bcqid),q_arr[n]['que'],int(float(pfee)*10**18),pkey,pubkey)
                            url = "http://localhost:8080/postQuestion"
                            payload = "qid={}&qcontent={}&pfee={}&options=6&type={}&pkey=be14e8033ca7636453d385d6bab0d53f379f1a2f451d7f8aee8bd9bcd5aba7c8&name=auto".format(bcqid, q_arr[n]['que'],pfee, q_arr[n]["type"])
                            headers = {
                                'content-type': "application/x-www-form-urlencoded",
                                'cache-control': "no-cache",
                                'postman-token': "218578ec-41d6-1c3a-6135-462556660f35"
                            }
                            print(payload)

                            response = requests.request("POST", url, data=payload, headers=headers)
                            time.sleep(10)

                            print(response.text)



        except Exception as e:
            print(e)


a = asknplay()
a.quiz_gen()

# a = asknplay()
# while True:
    # a.quiz_gen()
    # time.sleep(1000)
# brew services start mongodb-community
