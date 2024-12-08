import Web3 from 'web3';

// GroupBuying 컨트랙트 ABI
export const GROUP_BUYING_ABI = [
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "campaignId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "enum GroupBuying.Status",
        "name": "status",
        "type": "uint8"
      }
    ],
    "name": "CampaignCompleted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "campaignId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "title",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "creator",
        "type": "address"
      }
    ],
    "name": "CampaignCreated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "campaignId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "creator",
        "type": "address"
      }
    ],
    "name": "CampaignDeleted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "campaignId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "participant",
        "type": "address"
      }
    ],
    "name": "ParticipantJoined",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "campaignCount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "campaigns",
    "outputs": [
      {
        "internalType": "string",
        "name": "title",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "price",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "minParticipants",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "deadline",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "currentParticipants",
        "type": "uint256"
      },
      {
        "internalType": "enum GroupBuying.Status",
        "name": "status",
        "type": "uint8"
      },
      {
        "internalType": "address",
        "name": "creator",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "imageUrl",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_title",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "_price",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_minParticipants",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_deadline",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "_imageUrl",
        "type": "string"
      }
    ],
    "name": "createCampaign",
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
        "name": "_campaignId",
        "type": "uint256"
      }
    ],
    "name": "deleteCampaign",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_campaignId",
        "type": "uint256"
      }
    ],
    "name": "join",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_campaignId",
        "type": "uint256"
      }
    ],
    "name": "checkStatus",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_campaignId",
        "type": "uint256"
      }
    ],
    "name": "getCampaign",
    "outputs": [
      {
        "internalType": "string",
        "name": "title",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "price",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "minParticipants",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "deadline",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "currentParticipants",
        "type": "uint256"
      },
      {
        "internalType": "enum GroupBuying.Status",
        "name": "status",
        "type": "uint8"
      },
      {
        "internalType": "address",
        "name": "creator",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "imageUrl",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_campaignId",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "_participant",
        "type": "address"
      }
    ],
    "name": "hasJoined",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  }
];

// 컨트랙트 주소
export const GROUP_BUYING_ADDRESS = '0xa20d811C8B6293fdF6f8C35EF465824215c22a8c';

// Web3 인스턴스 및 컨트랙트 인스턴스 생성
let web3;
let groupBuyingContract;

if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
  web3 = new Web3(window.ethereum);
  groupBuyingContract = new web3.eth.Contract(GROUP_BUYING_ABI, GROUP_BUYING_ADDRESS);
} else {
  const provider = new Web3.providers.HttpProvider('http://127.0.0.1:8546');
  web3 = new Web3(provider);
  groupBuyingContract = new web3.eth.Contract(GROUP_BUYING_ABI, GROUP_BUYING_ADDRESS);
}

export { web3, groupBuyingContract };

// 캠페인 상태 매핑
export const CampaignStatus = {
  OPEN: 0,
  SUCCESS: 1,
  FAILED: 2
};

// 유틸리티 함수들
export const connectWallet = async () => {
  try {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    return accounts[0];
  } catch (error) {
    console.error('Failed to connect wallet:', error);
    throw error;
  }
};

export const checkCampaignStatus = async (campaignId) => {
  try {
    await groupBuyingContract.methods.checkStatus(campaignId)
      .send({ from: window.ethereum.selectedAddress });
  } catch (error) {
    console.error('Failed to check campaign status:', error);
    throw error;
  }
};

export const getCampaigns = async () => {
  try {
    const count = await groupBuyingContract.methods.campaignCount().call();
    const campaigns = [];

    for (let i = 0; i < count; i++) {
      try {
        const campaign = await groupBuyingContract.methods.getCampaign(i).call();
        // 생성자 주소가 0이 아닌 경우만 추가
        if (campaign.creator !== '0x0000000000000000000000000000000000000000') {
          campaigns.push({
            id: i,
            title: campaign.title,
            price: Number(campaign.price),
            minParticipants: Number(campaign.minParticipants),
            deadline: new Date(Number(campaign.deadline) * 1000),
            currentParticipants: Number(campaign.currentParticipants),
            status: Number(campaign.status),
            creator: campaign.creator,
            imageUrl: campaign.imageUrl
          });
        }
      } catch (err) {
        console.log("Error fetching campaign", i, ":", err);
      }
    }

    return campaigns;
  } catch (error) {
    console.error("Error in getCampaigns:", error);
    throw error;
  }
};

export const deleteCampaign = async (campaignId, account) => {
  try {
    await groupBuyingContract.methods.deleteCampaign(campaignId)
      .send({ from: account });
  } catch (error) {
    console.error('Failed to delete campaign:', error);
    throw error;
  }
};