pragma solidity >=0.6.0 <0.8.0;
pragma experimental ABIEncoderV2;

// SPDX-License-Identifier: MIT
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./Initializable.sol";
import "./EIP712MetaTxnUpg.sol";

contract SportsFantasy is Initializable, EIP712MetaTxnUpg {
    using SafeMath for uint256;

    // This is a type for a single MCQ Option.
    struct Option {
        uint8 name; // short name of mcq text
        uint256 voteCount; // number of accumulated votes
        address[] voters; // all voters who voted for particular option
    }

    // participant->qid->ansid->bool
    mapping(address => mapping(uint256 => mapping(uint256 => bool))) optionsSelected;

    // participant->qid->bool
    mapping(address => mapping(uint256 => bool)) rewardProvided;

    struct Question {
        address author;
        uint256 _type; // 2=INT, 1=MCQ type
        string qcontent; // content
        uint256 vote_price; // price/rate for 1 vote
        uint256 correct_ans_id;
        Option[6] options; // all max 6 options
        uint256 totalCount;
        address[] winners;
        string[] winnersnames;
        string correct_answer_str;
        string correct_ans_reason;
        uint256 distributed_each;
        uint256 totalWinners;
        bool status; // true for live question
        bool stopped;
        bool declared_result;
    }

    address public feeAddress; //=0x397B73151D8Ee4D4B66741E49744ed1BDAB95fe9;

    IERC20 sdToken;

    struct Participant {
        address _add;
        uint256 _points;
    }
    mapping(uint256 => Participant[]) allContestParticipants;

    // sorted by rank
    mapping(uint256 => Participant[]) rankParticipants;

    mapping(address => uint256) public balanceOf;

    // for all questions
    mapping(uint256 => Question) questions;

    mapping(address => string) naam;

    // contribution/ditribution
    event FundTransfer(address backer, uint256 amount, bool isContribution);

    event QuestionCreation(address backer, uint256 qid, uint256 _type);

    event VotingDone(address backer, uint256 qid, uint256 ansid);

    event WinnerDeclared(
        uint256 qid,
        string name,
        address winner,
        uint256 rewardamt,
        uint256 ans,
        uint256 _type
    );

    function initialize(address owner, address erc20Token) public initializer {
        sdToken = IERC20(erc20Token);
        manager = owner;
        feeAddress = 0x397B73151D8Ee4D4B66741E49744ed1BDAB95fe9;
        EIP712MetaTxnUpg.__EIP712MetaTxnUpg_init("SportsDapp", "");
    }

    //_type; // 1=mcq, 2=integer type
    function postQuestion(
        uint256 _qid,
        string memory _qcontent,
        uint256 _vote_price,
        uint8 _optionslength,
        uint256 _type,
        string memory name
    ) public {
        require(questions[_qid].status != true, "Question id already exists");

        naam[msgSender()] = name;

        if (_type == 2) {
            for (uint8 i = 0; i < _optionslength; i++) {
                questions[_qid].options[i].name = i;
                questions[_qid].options[i].voteCount = 0;
            }
            questions[_qid]._type = 2;
        } else if (_type == 1) questions[_qid]._type = 1;
        questions[_qid].author = msgSender();
        questions[_qid].qcontent = _qcontent;
        questions[_qid].vote_price = _vote_price;
        questions[_qid].totalCount = 0;
        questions[_qid].status = true;
        questions[_qid].declared_result = false;
        questions[_qid].stopped = false;
        emit QuestionCreation(msgSender(), _qid, _type);
    }

    function stopVoting(uint256 _qid) public onlyAdmin {
        require(
            questions[_qid].stopped != true,
            "Voting process has been already stopped"
        );
        questions[_qid].stopped = true;
    }

    function getQidWinning(uint256 _qid, address participant)
        public
        returns (uint256)
    {
        require(
            questions[_qid].declared_result == true,
            "Result not yet declared"
        );
        require(
            rewardProvided[participant][_qid] == false,
            "Reward already provided"
        );

        uint256 ans_id = questions[_qid].correct_ans_id;
        uint256 totalreward = questions[_qid].distributed_each;

        if (ans_id == 999) {
            for (uint256 optionno = 0; optionno < 6; optionno++) {
                if (optionsSelected[participant][_qid][optionno] == true) {
                    sdToken.transfer(participant, totalreward);
                    questions[_qid].winners.push(participant);
                    questions[_qid].winnersnames.push(naam[participant]);
                    emit WinnerDeclared(
                        _qid,
                        naam[participant],
                        participant,
                        totalreward,
                        ans_id,
                        1
                    );
                    rewardProvided[participant][_qid] = true;
                    balanceOf[participant] += totalreward;
                    return totalreward;
                }
            }
        } else {
            uint256 winningCount = questions[_qid].options[ans_id].voteCount;
            if (winningCount == 0) {
                for (uint256 optionno = 0; optionno < 6; optionno++) {
                    if (optionsSelected[participant][_qid][optionno] == true) {
                        sdToken.transfer(participant, totalreward);
                        questions[_qid].winners.push(participant);
                        questions[_qid].winnersnames.push(naam[participant]);
                        emit WinnerDeclared(
                            _qid,
                            naam[participant],
                            participant,
                            totalreward,
                            ans_id,
                            1
                        );
                        rewardProvided[participant][_qid] = true;
                        balanceOf[participant] += totalreward;
                        return totalreward;
                    }
                }
            } else if (optionsSelected[participant][_qid][ans_id] == true) {
                sdToken.transfer(participant, totalreward);
                questions[_qid].winners.push(participant);
                questions[_qid].winnersnames.push(naam[participant]);

                emit WinnerDeclared(
                    _qid,
                    naam[participant],
                    participant,
                    totalreward,
                    ans_id,
                    1
                );
                rewardProvided[participant][_qid] = true;
                balanceOf[participant] += totalreward;

                return totalreward;
            }
        }

        return 0;
    }

    // ans id in case of mcq and integer in case of integer type question
    function submitRightSolution(
        uint256 _qid,
        uint256 _ansid,
        string memory _correct_answer_str,
        string memory _correct_ans_reason
    ) public onlyAdmin {
        // based on live feed this should be updated

        // require(questions[_qid].declared_result!=1,"Right solution declared already");

        questions[_qid].correct_ans_id = _ansid;
        questions[_qid].declared_result = true;
        questions[_qid].stopped = true;
        questions[_qid].correct_answer_str = _correct_answer_str;
        questions[_qid].correct_ans_reason = _correct_ans_reason;

        uint256 totalreward;

        // none answered correct or INVALID, send back fee to all
        if (_ansid == 999) {
            totalreward = (questions[_qid].vote_price);
            questions[_qid].distributed_each = totalreward;
        } else {
            uint256 winningCount = questions[_qid].options[_ansid].voteCount;
            if (winningCount == 0) {
                totalreward = (questions[_qid].vote_price);
                questions[_qid].distributed_each = totalreward;
            }
            // no fees if participants<=2 else 2.5% fee
            else if (questions[_qid].options[_ansid].voters.length <= 2) {
                uint256 totalCount = questions[_qid].totalCount;
                questions[_qid].totalWinners = winningCount;
                uint256 part = totalCount.div(winningCount);
                totalreward = part.mul(questions[_qid].vote_price);

                questions[_qid].distributed_each = totalreward;
            } else {
                uint256 totalCount = questions[_qid].totalCount;
                questions[_qid].totalWinners = winningCount;
                uint256 part = totalCount.div(winningCount);
                totalreward = part.mul(questions[_qid].vote_price);

                uint256 totalfee = totalreward / 40;
                uint256 totalwin = totalreward - totalfee;
                questions[_qid].distributed_each = totalwin;
            }
        }
    }

    // ans id in case of mcq and integer in case of integer type question
    function vote(
        uint256 _qid,
        uint256 ansid,
        string memory name
    ) public {
        // allowed 1 time only for particular acct
        // not allowed after solution given

        require(
            questions[_qid].declared_result != true,
            "Voting process has been declared"
        );
        require(
            questions[_qid].stopped != true,
            "Voting process has been stopped"
        );
        uint256 _amount = questions[_qid].vote_price;

        sdToken.transferFrom(msgSender(), address(this), _amount);

        naam[msgSender()] = name;

        questions[_qid].options[ansid].voters.push(msgSender());
        questions[_qid].options[ansid].voteCount += 1;
        optionsSelected[msgSender()][_qid][ansid] = true;

        questions[_qid].totalCount += 1;
        emit VotingDone(msgSender(), _qid, ansid);
    }

    // total winning of the account
    function getWinnningBalance(address from) public view returns (uint256) {
        return balanceOf[from];
    }

    // get Matic balance
    function getBalance(address from) public view returns (uint256) {
        return (address(from).balance);
    }

    // get winners list
    function getWinners(uint256 _qid) public view returns (address[] memory) {
        return questions[_qid].winners;
    }

    function getWinnersAnsStr(uint256 _qid)
        public
        view
        returns (string memory)
    {
        return (questions[_qid].correct_answer_str);
    }

    function getWinnersAnsReason(uint256 _qid)
        public
        view
        returns (string memory)
    {
        return (questions[_qid].correct_ans_reason);
    }

    function getWinnersDist(uint256 _qid) public view returns (uint256) {
        return (questions[_qid].distributed_each);
    }

    function getWinnersno(uint256 _qid) public view returns (uint256) {
        return (questions[_qid].totalWinners);
    }

    function getRate(uint256 _qid) public view returns (uint256) {
        return questions[_qid].vote_price;
    }

    function getQcontent(uint256 _qid) public view returns (string memory) {
        return questions[_qid].qcontent;
    }

    function getQ(uint256 _qid) public view returns (Question memory) {
        return questions[_qid];
    }

    address public manager; // address used to set Admins
    address[] public Admins;
    mapping(address => bool) public AdminByAddress;

    event SetAdmins(address[] Admins);

    modifier onlyAdmin() {
        require(AdminByAddress[msgSender()] == true);
        _;
    }

    /**
     * @dev MultiOwnable constructor sets the manager
     */
    // constructor(address _Admin) {
    //     require(_Admin != address(0), "Admin address cannot be 0");
    //     manager = _Admin;
    // }

    /**
     * @dev Function to set Admins addresses
     */
    function setAdmins(address[] memory _Admins) public {
        require(msgSender() == manager);
        _setAdmins(_Admins);
    }

    function _setAdmins(address[] memory _Admins) internal {
        for (uint256 i = 0; i < Admins.length; i++) {
            AdminByAddress[Admins[i]] = false;
        }

        for (uint256 j = 0; j < _Admins.length; j++) {
            AdminByAddress[_Admins[j]] = true;
        }
        Admins = _Admins;
        emit SetAdmins(_Admins);
    }

    function getAdmins() public view returns (address[] memory) {
        return Admins;
    }

    modifier onlyManager() {
        _onlyManager();
        _;
    }

    function _onlyManager() private view {
        require(
            msgSender() == manager,
            "Only the contract manager may perform this action"
        );
    }
}
