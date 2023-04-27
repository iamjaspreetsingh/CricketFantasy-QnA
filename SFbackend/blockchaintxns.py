from web3 import Web3
import json
import time

abi = [
  {
    "anonymous": False,
    "inputs": [
      {
        "indexed": False,
        "internalType": "address",
        "name": "backer",
        "type": "address"
      },
      {
        "indexed": False,
        "internalType": "uint256",
        "name": "cid",
        "type": "uint256"
      },
      {
        "indexed": False,
        "internalType": "uint256",
        "name": "pfee",
        "type": "uint256"
      },
      {
        "indexed": False,
        "internalType": "uint256",
        "name": "winnings",
        "type": "uint256"
      }
    ],
    "name": "ContestCreation",
    "type": "event"
  },
  {
    "anonymous": False,
    "inputs": [
      {
        "indexed": False,
        "internalType": "address",
        "name": "backer",
        "type": "address"
      },
      {
        "indexed": False,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "indexed": False,
        "internalType": "bool",
        "name": "isContribution",
        "type": "bool"
      }
    ],
    "name": "FundTransfer",
    "type": "event"
  },
  {
    "anonymous": False,
    "inputs": [
      {
        "indexed": False,
        "internalType": "address",
        "name": "userAddress",
        "type": "address"
      },
      {
        "indexed": False,
        "internalType": "address payable",
        "name": "relayerAddress",
        "type": "address"
      },
      {
        "indexed": False,
        "internalType": "bytes",
        "name": "functionSignature",
        "type": "bytes"
      }
    ],
    "name": "MetaTransactionExecuted",
    "type": "event"
  },
  {
    "anonymous": False,
    "inputs": [
      {
        "indexed": False,
        "internalType": "address",
        "name": "backer",
        "type": "address"
      },
      {
        "indexed": False,
        "internalType": "uint256",
        "name": "qid",
        "type": "uint256"
      },
      {
        "indexed": False,
        "internalType": "uint256",
        "name": "_type",
        "type": "uint256"
      }
    ],
    "name": "QuestionCreation",
    "type": "event"
  },
  {
    "anonymous": False,
    "inputs": [
      {
        "indexed": False,
        "internalType": "address[]",
        "name": "Admins",
        "type": "address[]"
      }
    ],
    "name": "SetAdmins",
    "type": "event"
  },
  {
    "anonymous": False,
    "inputs": [
      {
        "indexed": False,
        "internalType": "address",
        "name": "backer",
        "type": "address"
      },
      {
        "indexed": False,
        "internalType": "uint256",
        "name": "qid",
        "type": "uint256"
      },
      {
        "indexed": False,
        "internalType": "uint256",
        "name": "ansid",
        "type": "uint256"
      }
    ],
    "name": "VotingDone",
    "type": "event"
  },
  {
    "anonymous": False,
    "inputs": [
      {
        "indexed": False,
        "internalType": "uint256",
        "name": "qid",
        "type": "uint256"
      },
      {
        "indexed": False,
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "indexed": False,
        "internalType": "address",
        "name": "winner",
        "type": "address"
      },
      {
        "indexed": False,
        "internalType": "uint256",
        "name": "rewardamt",
        "type": "uint256"
      },
      {
        "indexed": False,
        "internalType": "uint256",
        "name": "ans",
        "type": "uint256"
      },
      {
        "indexed": False,
        "internalType": "uint256",
        "name": "_type",
        "type": "uint256"
      }
    ],
    "name": "WinnerDeclared",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "AdminByAddress",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "Admins",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "balanceOf",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "contestID",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_pfee",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_reward",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_totalParticipants",
        "type": "uint256"
      },
      {
        "internalType": "uint256[]",
        "name": "_winningBreakdown",
        "type": "uint256[]"
      }
    ],
    "name": "createContest",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "contestID",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "playerID1",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "playerID2",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "playerID3",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "playerID4",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "playerID5",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "playerID6",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "playerID7",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "playerID8",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "playerID9",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "captainID",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "vcID",
        "type": "uint256"
      }
    ],
    "name": "createTeam",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "userAddress",
        "type": "address"
      },
      {
        "internalType": "bytes",
        "name": "functionSignature",
        "type": "bytes"
      },
      {
        "internalType": "bytes32",
        "name": "sigR",
        "type": "bytes32"
      },
      {
        "internalType": "bytes32",
        "name": "sigS",
        "type": "bytes32"
      },
      {
        "internalType": "uint8",
        "name": "sigV",
        "type": "uint8"
      }
    ],
    "name": "executeMetaTransaction",
    "outputs": [
      {
        "internalType": "bytes",
        "name": "",
        "type": "bytes"
      }
    ],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "feeAddress",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getAdmins",
    "outputs": [
      {
        "internalType": "address[]",
        "name": "",
        "type": "address[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "from",
        "type": "address"
      }
    ],
    "name": "getBalance",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "contestID",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "playerID",
        "type": "uint256"
      }
    ],
    "name": "getContestPlayerPoints",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "contestID",
        "type": "uint256"
      }
    ],
    "name": "getContestRankings",
    "outputs": [
      {
        "components": [
          {
            "internalType": "address",
            "name": "_add",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "_points",
            "type": "uint256"
          }
        ],
        "internalType": "struct SportsDapp.Participant[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "user",
        "type": "address"
      }
    ],
    "name": "getNonce",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "nonce",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "contestID",
        "type": "uint256"
      }
    ],
    "name": "getParticipantPoints",
    "outputs": [
      {
        "components": [
          {
            "internalType": "address",
            "name": "_add",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "_points",
            "type": "uint256"
          }
        ],
        "internalType": "struct SportsDapp.Participant[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_qid",
        "type": "uint256"
      }
    ],
    "name": "getQ",
    "outputs": [
      {
        "components": [
          {
            "internalType": "address",
            "name": "author",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "_type",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "qcontent",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "vote_price",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "correct_ans_id",
            "type": "uint256"
          },
          {
            "components": [
              {
                "internalType": "uint8",
                "name": "name",
                "type": "uint8"
              },
              {
                "internalType": "uint256",
                "name": "voteCount",
                "type": "uint256"
              },
              {
                "internalType": "address[]",
                "name": "voters",
                "type": "address[]"
              }
            ],
            "internalType": "struct SportsDapp.Option[6]",
            "name": "options",
            "type": "tuple[6]"
          },
          {
            "internalType": "uint256",
            "name": "totalCount",
            "type": "uint256"
          },
          {
            "internalType": "address[]",
            "name": "winners",
            "type": "address[]"
          },
          {
            "internalType": "string[]",
            "name": "winnersnames",
            "type": "string[]"
          },
          {
            "internalType": "string",
            "name": "correct_answer_str",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "correct_ans_reason",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "distributed_each",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "totalWinners",
            "type": "uint256"
          },
          {
            "internalType": "bool",
            "name": "status",
            "type": "bool"
          },
          {
            "internalType": "bool",
            "name": "stopped",
            "type": "bool"
          },
          {
            "internalType": "bool",
            "name": "declared_result",
            "type": "bool"
          }
        ],
        "internalType": "struct SportsDapp.Question",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_qid",
        "type": "uint256"
      }
    ],
    "name": "getQcontent",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_qid",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "participant",
        "type": "address"
      }
    ],
    "name": "getQidWinning",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_qid",
        "type": "uint256"
      }
    ],
    "name": "getRate",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "contestID",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "_participant",
        "type": "address"
      }
    ],
    "name": "getTeam",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256[9]",
            "name": "playerIDs",
            "type": "uint256[9]"
          },
          {
            "internalType": "uint256",
            "name": "captainID",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "vcID",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "totalPoints",
            "type": "uint256"
          },
          {
            "internalType": "bool",
            "name": "rewarded",
            "type": "bool"
          },
          {
            "internalType": "bool",
            "name": "updated",
            "type": "bool"
          },
          {
            "internalType": "bool",
            "name": "participated",
            "type": "bool"
          }
        ],
        "internalType": "struct SportsDapp.Team",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "contestID",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "participantsIndex",
        "type": "uint256"
      }
    ],
    "name": "getTeamParticipantPoints",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_qid",
        "type": "uint256"
      }
    ],
    "name": "getWinners",
    "outputs": [
      {
        "internalType": "address[]",
        "name": "",
        "type": "address[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_qid",
        "type": "uint256"
      }
    ],
    "name": "getWinnersAnsReason",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_qid",
        "type": "uint256"
      }
    ],
    "name": "getWinnersAnsStr",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_qid",
        "type": "uint256"
      }
    ],
    "name": "getWinnersDist",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_qid",
        "type": "uint256"
      }
    ],
    "name": "getWinnersno",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "from",
        "type": "address"
      }
    ],
    "name": "getWinnningBalance",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "erc20Token",
        "type": "address"
      }
    ],
    "name": "initialize",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "manager",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_qid",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "_qcontent",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "_vote_price",
        "type": "uint256"
      },
      {
        "internalType": "uint8",
        "name": "_optionslength",
        "type": "uint8"
      },
      {
        "internalType": "uint256",
        "name": "_type",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      }
    ],
    "name": "postQuestion",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "contestID",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "rank",
        "type": "uint256"
      }
    ],
    "name": "receiveReward",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address[]",
        "name": "_Admins",
        "type": "address[]"
      }
    ],
    "name": "setAdmins",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_qid",
        "type": "uint256"
      }
    ],
    "name": "stopVoting",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "contestID",
        "type": "uint256"
      },
      {
        "internalType": "uint256[]",
        "name": "_playerIDs",
        "type": "uint256[]"
      },
      {
        "internalType": "uint256[]",
        "name": "_playerPoints",
        "type": "uint256[]"
      }
    ],
    "name": "submitPoints",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_qid",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_ansid",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "_correct_answer_str",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_correct_ans_reason",
        "type": "string"
      }
    ],
    "name": "submitRightSolution",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "contestID",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "_participant",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      }
    ],
    "name": "updatePoints",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "contestID",
        "type": "uint256"
      },
      {
        "internalType": "uint256[]",
        "name": "participantsIndex",
        "type": "uint256[]"
      }
    ],
    "name": "verifySort",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_qid",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "ansid",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      }
    ],
    "name": "vote",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
]

# Fill in your infura API key here
_url = "https://matic-mumbai.chainstacklabs.com"

web3 = Web3(Web3.HTTPProvider(_url))

print(web3.isConnected())

print(web3.eth.blockNumber)

# Fill in your account here
balance = web3.eth.getBalance("0xaF7eBf3480b5684e4F40AE435074c09e6dc0d2A9")
print(web3.fromWei(balance, "ether"))

contractAddress = "0x653316e3710c9117A68e5cb996a83Aa3874aC929"
# '0xe333d95Cebd079409E36d60910a8f4C5d3Dc5786'

contract = web3.eth.contract(address=contractAddress, abi=abi)

address= '0x5884EDC0802dDF15C8de64E679c370Cf783F86e3'

# totalSupply = contract.functions.totalSupply().call()
# print(web3.fromWei(totalSupply, 'ether'))
# print(contract.functions.name().call())
# print(contract.functions.symbol().call())
# balance = contract.functions.balanceOf('0xd26114cd6EE289AccF82350c8d8487fedB8A0C07').call()
# print(web3.fromWei(balance, 'ether'))
'''print('admin : {}'.format(
    contract.functions.owner().call()
))'''

privateKey = '67989a9b477b9f3155ce2cc6c19e29f0ea322a1ec9b1ea299340cd54ec42126f'
adminpkey = 'e47d565eb3b976d9ecdcd576f7b27067c25b7b53145d24274b558b978fc54ec5'
adminaddress = '0x81Ef2DcFc18D55d68D83c54937Ca30a76A05624C'




def postQuestion(qid,qcontent,pfee,pkey,pubkey):

    # updatePoints(uint contestID, address _participant)
    # we need to call this for every participant in that contest
    address = pubkey
    nonce = web3.eth.getTransactionCount(address)

    tx=contract.functions.postQuestion(qid,qcontent,pfee,6,1,"auto").buildTransaction({
        'nonce': nonce,
        'value': web3.toWei(0, 'ether'),
        'gas': 2000000})

    signed_tx = web3.eth.account.signTransaction(tx,pkey)

    tx_hash = web3.eth.sendRawTransaction(signed_tx.rawTransaction)
    print(web3.toHex(tx_hash))
    receipt = web3.eth.waitForTransactionReceipt(tx_hash)

def checksubmitsol2(qid,ans,bans,breason,pkey,pubkey):
    
    address = pubkey
    nonce = web3.eth.getTransactionCount(address)

    tx=contract.functions.submitRightSolution(qid,ans,bans,breason).buildTransaction({    
        'nonce': nonce,
        'value': web3.toWei(0, 'ether'),
        'gas': 9000000})
       

    signed_tx = web3.eth.account.signTransaction(tx, pkey)

    tx_hash = web3.eth.sendRawTransaction(signed_tx.rawTransaction)
    print(web3.toHex(tx_hash))
    try:
        receipt = web3.eth.waitForTransactionReceipt(tx_hash)
    except:
        time.sleep(5)

def getQidWinning(qid,participant):

    address='0x056e967750F8C1221f8Ab257aBdC1243E24288DF'
    priKey='419f9fcbfa0af5369ea988859fb750bb7b820c6ead389bcff0da3dd725b63fdf'

    nonce = web3.eth.getTransactionCount(address)

    tx=contract.functions.getQidWinning(qid,participant).buildTransaction({    
	    'nonce': nonce,
	    'value': web3.toWei(0, 'ether'),
	    'gas': 2000000})
		

    signed_tx = web3.eth.account.signTransaction(tx, priKey)

    tx_hash = web3.eth.sendRawTransaction(signed_tx.rawTransaction)
    print(web3.toHex(tx_hash))
    return tx_hash



# def verifySort(contestID):

#  # fetch` points to be sorted
#     participants=contract.functions.getParticipantPoints(contestID).call()

#     print('participants : {}'.format(
#         participants
#     ))

#     participantsPointsUnsorted= [x[1] for x in participants]

#     print('participants points unsorted : {}'.format(
#         participantsPointsUnsorted
#     ))

#     participantsIndex=[i[0] for i in sorted(enumerate(participantsPointsUnsorted), key=lambda k: k[1], reverse=True)]


#     print('participants index sorted : {}'.format(
#         participantsIndex
#     ))

#     # 84,777,44..
#     # to

#     # 777,84,44
#     #indexes = 0 to 2
#     # sorted indexes in descending order= 1,0,2

#     #  verifySort(uint contestID, uint[] memory participantsIndex) 
#     nonce = web3.eth.getTransactionCount(address)

#     tx=contract.functions.verifySort(contestID,participantsIndex).buildTransaction({    
#         'nonce': nonce,
#         'value': web3.toWei(0, 'ether'),
#         'gas': 200000,
#         'gasPrice': web3.toWei('50', 'gwei'),})
       

#     signed_tx = web3.eth.account.signTransaction(tx, privateKey)

#     tx_hash = web3.eth.sendRawTransaction(signed_tx.rawTransaction)
#     print(web3.toHex(tx_hash))
#     try:
#         receipt = web3.eth.waitForTransactionReceipt(tx_hash)
#     except:
#         time.sleep(5)
#     return web3.toHex(tx_hash)



#  receiveReward(uint contestID, uint rank) 
# for ranks to be recieved
# if 3 winners => call 3 times with 
# rank=1, rank=2, rank=3
# call for every rank reqd to be sent winning

def receiveReward(contestID,rank):

    nonce = web3.eth.getTransactionCount(address)

    tx=contract.functions.receiveReward(contestID,rank).buildTransaction({    
        'nonce': nonce,
        'value': web3.toWei(0, 'ether'),
        'gas': 200000,
        'gasPrice': web3.toWei('50', 'gwei'),})


    signed_tx = web3.eth.account.signTransaction(tx, privateKey)

    tx_hash = web3.eth.sendRawTransaction(signed_tx.rawTransaction)
    print(web3.toHex(tx_hash))
    receipt = web3.eth.waitForTransactionReceipt(tx_hash)


# gpkey = 'be14e8033ca7636453d385d6bab0d53f379f1a2f451d7f8aee8bd9bcd5aba7c8'
# gpubkey = '0x1676F7E820816b6A5dfCFB5F1caFdac5D75CC851'

# postQuestion(int(101),"testq","1000",gpkey,gpubkey)

# https://explorer-mumbai.maticvigil.com/address/0xEd8E31c180c1772CfE43ceaD8845244Ec02Bfa46/transactions
