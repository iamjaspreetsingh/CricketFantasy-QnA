pragma solidity >=0.6.0 <0.8.0;
// pragma experimental ABIEncoderV2;

///  sportsdapp ~2.5% fees
// SPDX-License-Identifier: MIT

import './EIP712MetaTxn.sol';
import '../synthetix/Owned.sol';
import "@chainlink/contracts/src/v0.7/ChainlinkClient.sol";

 contract SportsDapp2 is Owned, ChainlinkClient, EIP712MetaTxn("SportsDapp","0.1",80001)  {

  using Chainlink for Chainlink.Request;

    // It will represent a single voter of each Integer qid.
    struct IntegerVoter{
        address add; //address of voter
        uint submittedans; //ans submitted by each voter
    }

    
    // This is a type for a single MCQ Option.
    struct Option {
        uint8 name;   // short name of mcq text
        uint voteCount; // number of accumulated votes
        address[] voters; // all voters who voted for particular option
    }


    struct Question {
        address author;
        uint _type; // 2=INT, 1=MCQ type
        string qcontent; // content hash of questions
        uint vote_price; // price/rate for 1 vote in SPT tokens
        uint correct_ans_id;
        Option[6] options; // all max 6 options
        
        uint totalCount;
        address[] winners;
        
        string[] winnersnames;
        string correct_answer_str;
        string correct_ans_reason;
        uint distributed_each;
        uint totalWinners;
        
        uint8 status;
        uint8 stopped;
        uint8 declared_result;
    }

    address payable public feeAddress=0xaF7eBf3480b5684e4F40AE435074c09e6dc0d2A9;

    mapping(address => uint256) public balanceOf;
    
    // for all questions
    mapping(uint => Question)  questions;
    
    mapping(address => string)  naam;

    
    // for integer questions
    mapping(uint => IntegerVoter[]) allsubmissions;

    // contribution/ditribution
    event FundTransfer(address backer, uint amount, bool isContribution);

    event QuestionCreation(address backer, uint qid, uint _type);

    event VotingDone(address backer, uint qid, uint ansid);

    event WinnerDeclared( uint qid, string name, address winner, uint rewardamt, uint ans,  uint _type);

    uint256 public price;
    
    address private oracle;
    bytes32 private jobId;
    uint256 private fee;
    

    constructor() Owned(_msgSender())
    {
        setChainlinkToken(0x70d1F773A9f81C852087B77F6Ae6d3032B02D2AB);
        oracle = 0xBf87377162512f8098f78f055DFD2aDAc34cbB47;
        jobId = "6b57e3fe0d904ba48d137b39350c7892";
        fee = 10 ** 16; // 0.01 LINK

    }

    /**
     * Create a Chainlink request to retrieve API response, find the target price
     * data, then multiply by 100 (to remove decimal places from price).
     */
    function requestBTCCNYPrice() public returns (bytes32 requestId) 
    {
        Chainlink.Request memory req = buildChainlinkRequest(jobId, address(this), this.fulfill.selector);
    
        // Set the URL to perform the GET request on
        req.add("get", "https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=BTC&to_currency=CNY&apikey=demo");
        
        string[] memory path = new string[](2);
        path[0] = "Realtime Currency Exchange Rate";
        path[1] = "5. Exchange Rate";
        req.addStringArray("path", path);
        
        // Multiply the result by 10000000000 to remove decimals
        req.addInt("times", 10000000000);
        
        // Sends the request
        return sendChainlinkRequestTo(oracle, req, fee);
    }
    
    /**
     * Receive the response in the form of uint256
     */ 
    function fulfill(bytes32 _requestId, uint256 _price) public recordChainlinkFulfillment(_requestId)
    {
        price = _price;
    }




    //_type; // 1=mcq, 2=integer type
    function postQuestion(uint _qid, string memory _qcontent,
                             uint _vote_price, uint8  _optionslength, uint _type, string memory name ) public onlyOwner{
        

        require(questions[_qid].status!=1,"Question id already exists");
        
        naam[_msgSender()]=name;

        if(_type==2){
            for (uint8 i = 0; i < _optionslength; i++) {
                questions[_qid].options[i].name=i;
                questions[_qid].options[i].voteCount = 0;
            }
            questions[_qid]._type=2;
        }
        
        else if(_type==1)
            questions[_qid]._type=1;
            questions[_qid].author=address(0xaF7eBf3480b5684e4F40AE435074c09e6dc0d2A9);
            questions[_qid].qcontent=_qcontent;
            questions[_qid].vote_price=_vote_price;
            questions[_qid].totalCount=0;
            questions[_qid].status=1;
            questions[_qid].declared_result=0;
            questions[_qid].stopped=0;
            emit QuestionCreation(address(0xaF7eBf3480b5684e4F40AE435074c09e6dc0d2A9), _qid, _type);
    }



    function stopVoting(uint _qid) public onlyOwner{
    
        // based on live feed this should be updated 
        // if match has started
        
        require(questions[_qid].stopped!=1,"Voting process has been already stopped");
        questions[_qid].stopped=1;
    }


    
    // ans id in case of mcq and integer in case of integer type question
    function submitRightSolution(uint _qid, uint _ansid, string memory _correct_answer_str,string memory _correct_ans_reason) public onlyOwner{
        
        // based on live feed this should be updated
        

        require(questions[_qid].declared_result!=1,"Right solution declared already");

        questions[_qid].correct_ans_id=_ansid;
        questions[_qid].declared_result=1;
        questions[_qid].stopped=1;
        questions[_qid].correct_answer_str=_correct_answer_str;
        questions[_qid].correct_ans_reason=_correct_ans_reason;
        
        uint typeofQ = questions[_qid]._type;
        uint totalCount= questions[_qid].totalCount;
        
        uint q_id=_qid;
        uint ans_id=_ansid;
        address payable[] memory rewardees= new address payable[](10);

        //if 1 => mcq
        if(typeofQ==1)
        {
        
            
            // refunding as q is invalid to all
            if(ans_id==999){
                uint totalreward=  (questions[q_id].vote_price);

                for(uint i=0;i<questions[q_id].options[0].voters.length;i++){
                    rewardees[i]= payable(questions[q_id].options[0].voters[i]);
                    // balanceOf[rewardees[i]]+=totalreward;
                    uint totalrewarddai=totalreward;
                    // daiToken.transfer(address(rewardees[i]),totalrewarddai);
                    rewardees[i].transfer(totalrewarddai);
                    
                   emit WinnerDeclared( q_id,naam[rewardees[i]], rewardees[i], totalreward, ans_id, 999);
                    
                }     
                
                for(uint i=0;i<questions[q_id].options[1].voters.length;i++){
                    rewardees[i]= payable(questions[q_id].options[1].voters[i]);
                    // balanceOf[rewardees[i]]+=totalreward;
                    uint totalrewarddai=totalreward;
                    // daiToken.transfer(address(rewardees[i]),totalrewarddai);
                    rewardees[i].transfer(totalrewarddai);

                   emit WinnerDeclared( q_id,naam[rewardees[i]], rewardees[i], totalreward, ans_id, 999);
                    
                }     
                for(uint i=0;i<questions[q_id].options[2].voters.length;i++){
                    rewardees[i]= payable(questions[q_id].options[2].voters[i]);
                    // balanceOf[rewardees[i]]+=totalreward;
                    uint totalrewarddai=totalreward;
                    // daiToken.transfer(address(rewardees[i]),totalrewarddai);
                    rewardees[i].transfer(totalrewarddai);

                   emit WinnerDeclared( q_id,naam[rewardees[i]], rewardees[i], totalreward, ans_id, 999);
                    
                }     
                for(uint i=0;i<questions[q_id].options[3].voters.length;i++){
                    rewardees[i]= payable(questions[q_id].options[3].voters[i]);
                    // balanceOf[rewardees[i]]+=totalreward;
                    uint totalrewarddai=totalreward;
                    // daiToken.transfer(address(rewardees[i]),totalrewarddai);
                    rewardees[i].transfer(totalrewarddai);

                   emit WinnerDeclared( q_id,naam[rewardees[i]], rewardees[i], totalreward, ans_id, 999);
                    
                }     

                
            }
            // real winner
            else{
           
                uint winningCount = questions[_qid].options[ans_id].voteCount;
                questions[_qid].totalWinners=winningCount;
                uint part = (totalCount)/winningCount;
                uint totalreward = part  * (questions[q_id].vote_price);
                
    
                questions[q_id].distributed_each=totalreward;
                
                // only 1 participant
                if(questions[q_id].options[ans_id].voters.length==1){
                    rewardees[0]= payable(questions[q_id].options[ans_id].voters[0]);
                    // balanceOf[rewardees[0]]+=totalreward;
                    uint totalrewarddai=totalreward;
                    // daiToken.transfer(address(rewardees[i]),totalrewarddai);
                    rewardees[0].transfer(totalrewarddai);

                    
                   emit WinnerDeclared( q_id,naam[rewardees[0]], rewardees[0], totalreward, ans_id, 333);
                    
                }
                else{

                    uint totalfee = totalreward/40;
                    uint totalwin = totalreward-totalfee;

                    feeAddress.transfer(totalfee);

                    for(uint i=0;i<questions[q_id].options[ans_id].voters.length;i++){
                        
                        rewardees[i]= payable(questions[q_id].options[ans_id].voters[i]);
                        balanceOf[rewardees[i]]+=totalreward;
                        uint totalrewarddai=totalwin;
                        // daiToken.transfer(address(rewardees[i]),totalrewarddai);
                        rewardees[i].transfer(totalrewarddai);
    
                        
                       emit WinnerDeclared( q_id,naam[rewardees[i]], rewardees[i], totalreward, ans_id, 1);
        
                        
                    }
                }
            }
            
           
        // string[] memory naams= new string[](10);
        //     for(uint j=0;j<rewardees.length;j++)
        //         naams[j]=naam[rewardees[j]];
            
        // emit AnsDeclared( q_id,naams, rewardees, totalreward, ans_id, 1, answer,reason);

        }
        
        // if 2=>integer
        else if(typeofQ==2){
    
            uint totalreward= totalCount*(questions[_qid].vote_price);
            uint nearest=allsubmissions[q_id][0].submittedans;
            uint nearest_diff;
            
            if(ans_id<nearest)
                nearest_diff=nearest - ans_id;
            else
                nearest_diff=ans_id - nearest;

            // rewardees are there as more than 1 can commit same integer, dividing amongst them
            // finding most accurate commit
            
            for(uint i=1;i<allsubmissions[q_id].length;i++){
                
              uint current=allsubmissions[q_id][i].submittedans;
              uint current_diff;
               
              if(allsubmissions[q_id][i].submittedans > ans_id)
                    current_diff=allsubmissions[q_id][i].submittedans - ans_id;
                else
                    current_diff=ans_id - allsubmissions[q_id][i].submittedans ;
                
              if( ( current_diff) < (nearest_diff)){
                  nearest_diff =current_diff;
                  nearest=current;
              }
            }
            
            // finding all addresses with most accurate commit
            uint cnt=0;
            for(uint i=0;i<allsubmissions[q_id].length;i++){
                
              uint current=allsubmissions[q_id][i].submittedans;
                if(current == nearest){
                    //yaha
                    rewardees[cnt] = payable(allsubmissions[q_id][i].add);
                    cnt++;
                }
            }
            
            uint distributereward = (totalreward)/cnt;
            questions[q_id].totalWinners=cnt;
            questions[q_id].distributed_each=distributereward;
            

            // distributing the reward to addresses with most accurate commit
            for(uint i=0;i<cnt;i++){
                balanceOf[rewardees[i]]+=distributereward;
                uint totalrewarddai=distributereward;
                // daiToken.transfer(address(rewardees[i]),totalrewarddai);
                rewardees[i].transfer(totalrewarddai);

                emit WinnerDeclared( q_id, naam[rewardees[i]],rewardees[i], distributereward, nearest, 2);
            }
            

            
        }
            
         
        
        questions[_qid].winners = rewardees;
        string[] memory naams= new string[](10);
        for(uint j=0;j<questions[q_id].winners.length;j++){
            if(questions[q_id].winners[j]!=0x0000000000000000000000000000000000000000)
                naams[j]=naam[questions[q_id].winners[j]];
            else naams[j]='NA';
        }
        questions[_qid].winnersnames=naams;

    }
        

        

    // ans id in case of mcq and integer in case of integer type question
    // not payable for testing
    function vote(uint _qid, uint ansid, uint _amount, string memory name) public payable{

        // allowed 1 time only for particular acct
        // not allowed after solution given

        require(questions[_qid].declared_result!=1,"Voting process has been declared");
        require(questions[_qid].stopped!=1,"Voting process has been stopped");
        require(_amount==msg.value,"Amount not equal to sent value");

        uint typeofQ = questions[_qid]._type;

        require(msg.value == questions[_qid].vote_price,"Participation fees was not equal");
                
        naam[_msgSender()]=name;

        // daiToken.transferFrom(address(_msgSender()),address(this),_amountdai);

        //if 1 => mcq
        if(typeofQ==1)
        {
            questions[_qid].options[ansid].voters.push(
               _msgSender()
            );
            questions[_qid].options[ansid].voteCount +=1;
        }
        
        // 2 => integer type
        else if(typeofQ==2){
            allsubmissions[_qid].push(IntegerVoter({
             add:_msgSender(),
             submittedans:ansid
            }));
        }

        questions[_qid].totalCount +=1;
        emit VotingDone(_msgSender(), _qid, ansid);
    }
    

    
    // when someone withdraws Matic coins balance is reset
    // INR transfer after successful txn
    function getWinnings(address rewardee) payable public{
        
        address payable recipient=0xcE11f26849e17A4d1378149365bBD5Af26926E40;
        recipient.transfer(msg.value);
        balanceOf[_msgSender()]-=msg.value;
        
        emit FundTransfer(rewardee,msg.value,false);
    }    
    
    // total winning of the account
    function getWinnningBalance(address from) public view returns(uint256){
        return balanceOf[from];
    }    
    
    // get Matic balance
    function getBalance(address from) public view returns(uint256){
        return (address(from).balance);
    }
    
    // get winners list
    function getWinners(uint _qid) public view returns(address[] memory){
        return questions[_qid].winners;
    }
    
    
    function getWinnersAnsStr(uint _qid) public view returns(string memory){
       return (questions[_qid].correct_answer_str);
     
    }
    

    function getWinnersAnsReason(uint _qid) public view returns(string memory){
       return (questions[_qid].correct_ans_reason);
    }
    
    function getWinnersDist(uint _qid) public view returns(uint){
       return (questions[_qid].distributed_each);
    }
    
    function getWinnersno(uint _qid) public view returns(uint){
       return (questions[_qid].totalWinners);
    }
    
    function getRate(uint _qid) public view returns(uint){
        return questions[_qid].vote_price;
    }
    
        
    function getQcontent(uint _qid) public view returns(string memory){
        return questions[_qid].qcontent;
    }
    
       
    
}
