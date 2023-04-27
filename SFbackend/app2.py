import json
import requests
import pymongo
import blockchaintxns as block 

pkey = 'be14e8033ca7636453d385d6bab0d53f379f1a2f451d7f8aee8bd9bcd5aba7c8'

class asknplay():
    
    def Team_w(self, mid, data):

        if data["status"] == 'Finished':
            try:
                w_id = data['winner_team_id']
            except:
                w_id = None

            print(w_id)
            team1_id = int(data["localteam_id"])
            team2_id = int(data["visitorteam_id"])

            if w_id == team1_id:
                return "0", data["localteam"]["name"], data["status"]
            elif w_id == team2_id:
                return "1", data["visitorteam"]["name"], data["status"]
            else:
                return "2", "Draw", data["status"]
        else:
            return "Not applicable", "", ""

    def Toss_w(self, mid, data):

        w_id = data['toss_won_team_id']
        print(w_id)
        team1_id = data['localteam_id']
        team2_id = data['visitorteam_id']

        if w_id == team1_id:
            return "0", data["localteam"]["name"], data["toss_won_team_id"]

        elif w_id == team2_id:
            return "1", data["visitorteam"]["name"], data["toss_won_team_id"]

        else:
            return "Not applicable", "", ""

    def Team_bat_id(self, mid, values, teamid, options, data):
        print(mid, teamid)

        ids = {}
        if data['scoreboards']==[]:
            return -1, "No scoreard", "Sorry No scorecard available for this match"

        maxid = None
        max_runs = float('-inf')
        for i in data['lineup']:
            if i['fullname'] in options:
                ids[i['id']] = [i['fullname'], options.index(i['fullname']), 0]

        card = data['scoreboards'][0]['scoreboard']

        for i in data['scoreboards']:
            card  = max(i['scoreboard'],card)
        
        for j in data['batting']:
            if j['player_id'] in ids and i['scoreboard']==card:
                if str(j['player_id']) in values and 'score' in values[str(j['player_id'])]:
                    ids[j['player_id']][2] = int(j['score']) - int(values[str(j['player_id'])]['score'])
                else:
                    ids[j['player_id']][2] = int(j['score'])

                if ids[j['player_id']][2] > max_runs and ids[j['player_id']][2]>0:
                    max_runs = ids[j['player_id']][2]
                    maxid = j['player_id']
        print(ids)
        if len(ids) > 0 and maxid and max_runs!=0:
            rson = ids[maxid][0] + " scored maximum runs (" + str(ids[maxid][2]) + ") in the match than "
            for i in ids:
                if i != maxid:
                    rson += ids[i][0] + ' (' + str(ids[i][2]) + '), '
            print(rson[:-2])
            return ids[maxid][1], ids[maxid][0], rson[:-2]
        elif maxid==None or max_runs==0:
            return -1,'No one scored runs from provided options','All players from options scored (0)runs'

    def Team_strike_id(self, mid, values, teamid, options, data):

        ids={}

        if data['scoreboards']==[]:
            return -1, "No scoreard", "Sorry No scorecard available for this match"
        maxid = None
        maxcsr = float('-inf')
        for i in data['lineup']:
            if i['fullname'] in options:
                ids[i['id']] = [i['fullname'], options.index(i['fullname']), 0]

        card = data['scoreboards'][0]['scoreboard']

        for i in data['scoreboards']:
            card  = max(i['scoreboard'],card)
        
        for i in data['batting']:

            if i['player_id'] in ids and float(i['rate'])>0 and i['scoreboard']==card:
                if str(i['player_id']) in values and 'score' in values[str(i['player_id'])]:
                    r = float(i['score']) - float(values[str(i['player_id'])]['score'])
                    b = float(i['ball']) - float(values[str(i['player_id'])]['b'])
                    if b > 0:
                        csr = float(r / b) * 100
                    else:
                        csr = float(b) * 100
                else:
                    csr = float(i['rate'])
                ids[i['player_id']][2] = round(csr, 2)
                if csr > maxcsr and csr>0.0:
                    maxcsr = csr
                    maxid = i['player_id']

        print(ids)
        if len(ids) > 0 and maxid:
            rson = ids[maxid][0] + " scored with maximum strike rate (" + str(ids[maxid][2]) + ") in the match than "
            for i in ids:
                if i != maxid:
                    rson += ids[i][0] + ' (' + str(ids[i][2]) + '), '
            print(rson[:-2])
            return ids[maxid][1], ids[maxid][0], rson[:-2]
        elif maxid==None:
            return -1, 'No one scored runs from options provided','All players from options scored (0)runs'

    def Team_wickets_id(self, mid, values, teamid, options, data):
        if data['scoreboards']==[]:
            return -1, "No scoreard", "Sorry No scorecard available for this match"
        ids = {}
        # if float(data["Innings"][0]['ovr'])==float(max_ovr) or data['state']=="complete":
        index = 0
        maxid = None
        max_wickets = float('-inf')
        min_eco = float('inf')
        for i in data['lineup']:
            if i['fullname'] in options:
                ids[i['id']] = [i['fullname'], options.index(i['fullname']), 0]

        card = data['scoreboards'][0]['scoreboard']

        for i in data['scoreboards']:
            card  = max(i['scoreboard'],card)
        
        for i in data['bowling']:
            if i['player_id'] in ids and i['scoreboard']==card:
                if str(i['player_id']) in values and 'r' in values[str(i['player_id'])]:
                    r = float(i['runs']) - float(values[str(i['player_id'])]['r'])
                    o = float(i['overs']) - float(values[str(i['player_id'])]['o'])
                    if o>0:
                        curr_eco = float(r) / float(o)
                    else:
                        curr_eco = 0.0
                    ids[i['player_id']][2] = int(i['wickets'])- int(values[str(i['player_id'])]['w'])
                else:
                    curr_eco = float(i['rate'])
                    ids[i['player_id']][2] = int(i['wickets'])

                if ids[i['player_id']][2] > max_wickets:
                    max_wickets = ids[i['player_id']][2]
                    maxid = i['player_id']
                    min_eco = curr_eco
                elif ids[i['player_id']][2] == max_wickets and curr_eco < min_eco:
                    maxid = i['player_id']
                    min_eco = curr_eco


        if len(ids) > 0 and maxid and max_wickets!=0:
            rson = ids[maxid][0] + " took the maximum wickets (" + str(ids[maxid][2]) + ") in the match than "
            for i in ids:
                if i != maxid:
                    rson += ids[i][0] + ' (' + str(ids[i][2]) + '), '
            return ids[maxid][1], ids[maxid][0], rson[:-2]
        elif maxid == None or max_wickets==0:
            return -1,'No one took wickets','All bowlers from the options took (0)wickets'

    def Team_eco_id(self, mid, values, teamid, options, data):

        print(mid, teamid)
        ids = {}

        if data['scoreboards']==[]:
            return -1, "No scoreard", "Sorry No scorecard available for this match"

        for i in data['lineup']:
            if i['fullname'] in options:
                ids[i['id']] = [i['fullname'], options.index(i['fullname']), 0]

        maxid = None
        min_eco = float('inf')


        card = data['scoreboards'][0]['scoreboard']

        for i in data['scoreboards']:
            card  = max(i['scoreboard'],card)

        for j in data['bowling']:
            if j['player_id'] in ids and j['scoreboard']==card:
                if str(j['player_id']) in values and 'r' in values[str(j['player_id'])]:
                    r = float(j['runs']) - float(values[str(j['player_id'])]['r'])
                    o = float(j['overs']) - float(values[str(j['player_id'])]['o'])

                    if float(o)>0:
                        curr_eco = float(r)/float(o)
                    else:
                        curr_eco = 0.0
                else:
                    curr_eco = j['rate']
                ids[j['player_id']][2] = round(curr_eco, 2)
                if curr_eco < min_eco and curr_eco > 0.0:
                    min_eco = curr_eco
                    maxid = j['player_id']

        print(ids)
        if len(ids) > 0 and maxid:
            rson = ids[maxid][0] + " bowled with best economy rate (" + str(ids[maxid][2]) + ") in the match than "
            for i in ids:
                if i != maxid:
                    rson += ids[i][0] + ' (' + str(ids[i][2]) + '), '
            print(rson[:-2])
            return ids[maxid][1], ids[maxid][0], rson[:-2]
        elif maxid==None:
            return -1, 'No one bowled from options provided','All players from options bowled with (0)economy rate'

    def Batsmen_runs(self, id, values, mid, qtype,data): ##batsman id
            if data['scoreboards']==[]:
                return -1, "No scoreard", "Sorry No scorecard available for this match"
            result = None
            card = data['scoreboards'][0]['scoreboard']
            for i in data['scoreboards']:
                card  = max(i['scoreboard'],card)
            
            for i in data['batting']:
                if int(i['player_id']) == int(id) and i['scoreboard'] == card:
                    if str(id) in values and 'score' in values[str(id)]:
                        result = i['score']-int(values[str(id)]['score'])
                    else:
                        result = i['score']

            print(result)

                # elif data['state']=="complete":
                #     print("favour")
                    # return(data["Innings"][0]['batsmen'][ind]['r'])
            if result == None:
                return -1, "Didn't bat", "The question became invalid, the entry fee is returned back to participants."  ## INVALID

            elif str(qtype) == '1':
                if int(result)>=0 and int(result)<=20:
                    return '0','Option A (0-20 runs)',"Batsman scored "+str(result)+" runs"
                elif int(result)>=21 and int(result)<=40:
                    return '1','Option B (21-40 runs)',"Batsman scored "+str(result)+" runs"
                elif int(result)>=41 and int(result)<=60:
                    return '2','Option C (41-60 runs)',"Batsman scored "+str(result)+" runs"
                elif int(result) > 60:
                    return '3','Option D (>60 runs)',"Batsman scored "+str(result)+" runs"

            elif str(qtype) == '2':
                return result,"",""

            else:
                return "Not applicable",'',''


    def bowlers_wickets(self, id, values, mid, data):
        if data['scoreboards']==[]:
            return -1, "No scoreard", "Sorry No scorecard available for this match"
        
        card = data['scoreboards'][0]['scoreboard']

        for i in data['scoreboards']:
            card  = max(i['scoreboard'],card)
        
        for i in data['bowling']:
            if i['scoreboard'] == card and i['player_id'] == int(id):

                if str(id) in values and 'w' in values[str(id)]:
                    wkt = (i['wickets']) - int(values[str(id)]['w'])
                else:
                    wkt = i['wickets']
                if wkt <= 3:
                    return wkt, str(wkt)+" wickets","Bowler picked up "+str(wkt)+" wickets in the match"
                else:
                    return 3, str(wkt)+" wickets","Bowler picked up "+str(wkt)+" wickets in the match"

        return -1, "Not bowled", "The question became invalid, the entry fee is returned back to participants"

    def findautoanswer(self, mid, values, qno, teamid, playerid, options, data):
        print(qno)
        data = data['data']
        if qno == 1:
            result, ans, reason = self.Team_w(mid, data)
            return result, ans, reason
        elif qno == 2:
            result, ans, reason = self.Toss_w(mid, data)
            return result, ans, reason
        elif qno == 3:
            result, ans, reason = self.Team_bat_id(mid, values, teamid, options, data)
            return result, ans, reason
        elif qno == 4:
            result, ans, reason = self.Team_strike_id(mid, values, teamid, options, data)
            return result, ans, reason
        elif qno == 5:
            result, ans, reason = self.Team_wickets_id(mid, values, teamid, options, data)
            return result, ans, reason
        elif qno == 6:
            result, ans, reason = self.Team_eco_id(mid, values, teamid, options, data)
            return result, ans, reason
        elif qno == 7:
            result, ans, reason = self.Batsmen_runs(playerid, values, mid, "1", data)
            return result, ans, reason
        elif qno == 8:
            result, ans, reason = self.bowlers_wickets(playerid, values, mid, data)
            return result, ans, reason
        else:
            print('Unknown qno')
            return "-1", "Unknown", "Unknown"


    def id_gen(self, p_name, mid, data):

        for i in data['lineup']:
            if p_name in i['fullname'] or p_name == i['fullname']:
                return i['id']

        return -1

    def id_mapping(self, data, options):
        for i in data['lineup']:
            if i['fullname'] in options:
                index = options.index(i['fullname'])
                options[index] = i['id']
        return options

    def match_info(self, mid):
        print('API call',mid)
        url = "https://cricket.sportmonks.com/api/v2.0/fixtures/" + str(mid) + "?api_token=h5Ab6JWRICYXpmB7TiRxlBOvvEDLWe3uiSQxvSiRI1mCMUJG1DhfUsVozqZn&include=batting.batsman,bowling.bowler,visitorteam,scoreboards.team,localteam,lineup,runs"
        try:
            res = requests.request("GET", url)
            if res.status_code == 200:
                return json.loads(res.text)
            else:
                print(res.status_code,'match_status')
        except:
            print('match_info:connection refused')

    def getSquad(self, id, sid):
        print('API call, get squad')
        url = "https://cricket.sportmonks.com/api/v2.0/teams/"+str(id)+"/squad/"+str(sid)+"?" \
                "api_token=h5Ab6JWRICYXpmB7TiRxlBOvvEDLWe3uiSQxvSiRI1mCMUJG1DhfUsVozqZn"

        res = requests.request("GET", url)
        if res.status_code == 200 and res:
            return json.loads(res.text)

    def quiz_gen(self):

        client = pymongo.MongoClient('localhost',27017)
        users = client.CRICKETUPCOMINGLIVE.collection_names()

        for j in users:
            quess = list(client.CRICKETUPCOMINGLIVE[str(j)].find({'_id':'normal'},{'_id':0}))
            print(quess)
            if j in set(['matches','scorecard','participants','qidWinnings']):
                continue
            data = self.match_info(j)
            if not data:
                continue
            
            if len(quess) == 0:
                continue
            elif len(quess[0]) <= 2 and data['data']['status'] == 'Finished':
                client.CRICKETUPCOMINGLIVE[str(j)].drop()
                client.CRICKETUPCOMINGLIVE['matches'].delete_one({'_id': str(j)})
                client.CRICKETUPCOMINGLIVE['scorecard'].update({'_id':str(j)},{'$set':{'result':'Result Awaited'}})
                continue
            match_id = j
            print("MatchID:")
            print(j)
            
            try:
                    for q in quess[0]:
                        if (str(q) == 'check' or str(q)=='quesNo'):
                            # if match has completed so will remove 'check' and 'quesNo' from database
                            if data['data']['status'] == 'Finished':
                                client.CRICKETUPCOMINGLIVE[str(match_id)].update({'_id':'normal'},{'$unset':{str(q):""}})
                            else:
                                continue
                        else:
                            print(q)
                            k = quess[0][q]
                            print(k,'here')
                            parsed_json = (json.loads(k))
                            qid = str(parsed_json['q_id'])
                            bcqid = str(match_id)+str(qid)
              
                            if parsed_json['stopvoting'] == '0': #to be done 1 once stopvoting logic added
                                if (' win' in parsed_json['content'] or (parsed_json['creator']=='auto' and str(parsed_json['qno']) == '1')) and data['data']['status'] not in ['Finished','Aban.','Delayed','Cancl.','Int.']:
                                    continue

                                opp = parsed_json['options']
                                try:
                                    opp = json.loads(opp)
                                except:
                                    print('must be int q')

                                if(data['data']['status'] in ['Aban.','Delayed','Cancl.','Int.']):
                                    result,bans,breason = -1,data['data']['status'],data['data']['status']
                                    parsed_json["result"] = result
                                    parsed_json["bans"] = bans
                                    parsed_json["breason"] = breason

                                elif parsed_json["creator"] == "auto":
                                    result, bans, breason = self.findautoanswer(match_id, parsed_json["options"], int(parsed_json["qno"]), parsed_json["teamid"], parsed_json["playerid"], opp, data)
                                print('resultfound')
                                print("result = "+result)
                                parsed_json["result"] = result
                                parsed_json["bans"] = bans
                                parsed_json["breason"] = breason


                                if result == -1:
                                    parsed_json["reviewed"] = "-1"
                                    parsed_json["status"] = "The Question is invalid and hence failed"
                                    newjson = json.dumps(parsed_json)
                                    
                                    client.CRICKET[str(match_id)].update({'_id':str(match_id)},{'$set': {str(qid): newjson}})
                                    print('SUBMIITING ANS')
                                    print(bcqid)
                                    print("result -1 999")
                                    #time.sleep(10)
                                    length = len(list(client.CRICKETUPCOMINGLIVE['qidWinnings'].find({'_id':'qidWin'},{'_id':0})))
                                    if length>0:
                                        client.CRICKETUPCOMINGLIVE['qidWinnings'].update({'_id':'qidWin'},{'$set':{str(bcqid):[str(match_id),"999",bans,breason]}})
                                    else:
                                        client.CRICKETUPCOMINGLIVE['qidWinnings'].insert_one({'_id':'qidWin',str(bcqid):[str(match_id),"999",bans,breason]})

                                    client.CRICKETUPCOMINGLIVE["0"+str(match_id)].update({'_id':'normal'}, {'$unset' :{str(qid): ""}})

                                else:
                                    parsed_json["reviewed"] = "2"
                                    parsed_json["status"] = "The Winners with correct answer are rewarded"
                                    newjson = json.dumps(parsed_json)
                                    print(newjson)

                                    client.CRICKET[str(match_id)].update({'_id':str(match_id)},{'$set': {str(qid): newjson}})
                                    
                                    print('SUBMITTING ANS mongodb collectiion')
                                    print(bcqid)
                                    print(result)
                                    length = len(list(client.CRICKETUPCOMINGLIVE['qidWinnings'].find({'_id':'qidWin'},{'_id':0})))
                                    if length>0:
                                        client.CRICKETUPCOMINGLIVE['qidWinnings'].update({'_id':'qidWin'},{'$set':{str(bcqid):[str(match_id),result,bans,breason]}})
                                    else:
                                        client.CRICKETUPCOMINGLIVE['qidWinnings'].insert_one({'_id':'qidWin',str(bcqid):[str(match_id),result,bans,breason]})

                                    print('SUBMITTING ANS onchain')

                                    url = "http://localhost:8080/submitsolution"

                                    payload = "qid={}&ansid={}&ans={}&reason={}&pkey=be14e8033ca7636453d385d6bab0d53f379f1a2f451d7f8aee8bd9bcd5aba7c8".format(bcqid,result,bans,breason)
                                    headers = {
                                        'content-type': "application/x-www-form-urlencoded",
                                        'cache-control': "no-cache",
                                        'postman-token': "81a77976-acb6-13b7-31b8-ee70b059aaa3"
                                        }

                                    response = requests.request("POST", url, data=payload, headers=headers)
                                    client.CRICKETUPCOMINGLIVE[str(match_id)].update({'_id':'normal'}, {'$unset' :{str(qid): ""}})
                     

                        if data['data']['type'] in set(['TEST','4day','Test/5day']) and data['data']['status'] in ['Finished','Aban.','Delayed','Cancl.','Int.'] and len(list(client.CRICKETUPCOMINGLIVE[str(match_id)].find({'_id':'normal'},{'_id':0}))[0])==0:
                            client.CRICKETUPCOMINGLIVE[str(match_id)].drop()
                            client.CRICKETUPCOMINGLIVE['matches'].delete_one({'_id': str(match_id)})
                            client.CRICKETUPCOMINGLIVE['scorecard'].update({'_id':str(match_id)},{'$set':{'result':'Result Declared'}})

            except Exception as e:
                print(e)

a = asknplay()
a.quiz_gen()

# while True:
#     a.quiz_gen()
#     time.sleep(150)
