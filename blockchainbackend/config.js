module.exports = {

  PRIVATE_KEY: '0xfd32136c7a01c144494ca5bbd3779b77d1d6c09279d1af7c2c5af9ed5d2d93b4', // A sample private key prefix with `0x`
  FROM_ADDRESS: '0x32d724807B77B8ebf4892E672105e087B746b49c',// Your address 
  MATIC_TEST_TOKEN: '0x0000000000000000000000000000000000001010',//s'0xc82c13004c06E4c627cF2518612A55CE7a3Db699', // Contract for ERC20 in Matic testnet
  MATIC_MAINNET_TOKEN:'0x0000000000000000000000000000000000001010',  
  SD_TEST_TOKEN:'0x37841bf931C2c23FacD866B51dDa14b6c0330C65',	
  SD_CONTRACT_ADDRESS:'0x653316e3710c9117A68e5cb996a83Aa3874aC929',
  ERC20ABI:[
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "name_",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "symbol_",
          "type": "string"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "spender",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "Approval",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "userAddress",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "address payable",
          "name": "relayerAddress",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "bytes",
          "name": "functionSignature",
          "type": "bytes"
        }
      ],
      "name": "MetaTransactionExecuted",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "Transfer",
      "type": "event"
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
          "name": "spender",
          "type": "address"
        }
      ],
      "name": "allowance",
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
          "name": "spender",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "approve",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
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
      "inputs": [],
      "name": "decimals",
      "outputs": [
        {
          "internalType": "uint8",
          "name": "",
          "type": "uint8"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "spender",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "subtractedValue",
          "type": "uint256"
        }
      ],
      "name": "decreaseAllowance",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
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
          "internalType": "address",
          "name": "spender",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "addedValue",
          "type": "uint256"
        }
      ],
      "name": "increaseAllowance",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "name",
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
      "inputs": [],
      "name": "symbol",
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
      "inputs": [],
      "name": "totalSupply",
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
          "name": "recipient",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "transfer",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "sender",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "recipient",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "transferFrom",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ]
  ,
  ABI:[
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "backer",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "cid",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "pfee",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "winnings",
          "type": "uint256"
        }
      ],
      "name": "ContestCreation",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "backer",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "bool",
          "name": "isContribution",
          "type": "bool"
        }
      ],
      "name": "FundTransfer",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "userAddress",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "address payable",
          "name": "relayerAddress",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "bytes",
          "name": "functionSignature",
          "type": "bytes"
        }
      ],
      "name": "MetaTransactionExecuted",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "backer",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "qid",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "_type",
          "type": "uint256"
        }
      ],
      "name": "QuestionCreation",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address[]",
          "name": "Admins",
          "type": "address[]"
        }
      ],
      "name": "SetAdmins",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "backer",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "qid",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "ansid",
          "type": "uint256"
        }
      ],
      "name": "VotingDone",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "qid",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "name",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "winner",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "rewardamt",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "ans",
          "type": "uint256"
        },
        {
          "indexed": false,
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
}

