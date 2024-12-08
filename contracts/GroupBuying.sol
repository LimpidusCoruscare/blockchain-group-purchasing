// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract GroupBuying {
    enum Status { OPEN, SUCCESS, FAILED }
    
    struct Campaign {
        string title;           // 공동구매 제목
        uint256 price;          // 상품 가격
        uint256 minParticipants;// 최소 참여자 수
        uint256 deadline;       // 마감 시간 (timestamp)
        uint256 currentParticipants; // 현재 참여자 수
        Status status;          // 현재 상태
        address creator;        // 생성자
        string imageUrl;        // 상품 이미지 URL
        mapping(address => bool) participants; // 참여자 목록
    }
    
    uint256 public campaignCount;
    mapping(uint256 => Campaign) public campaigns;
    
    // 이벤트 정의
    event CampaignCreated(uint256 indexed campaignId, string title, address creator);
    event CampaignDeleted(uint256 indexed campaignId, address creator);
    event ParticipantJoined(uint256 indexed campaignId, address participant);
    event CampaignCompleted(uint256 indexed campaignId, Status status);
    
    // 공동구매 생성
    function createCampaign(
        string memory _title,
        uint256 _price,
        uint256 _minParticipants,
        uint256 _deadline,
        string memory _imageUrl
    ) public returns (uint256) {
        require(_deadline > block.timestamp, "Deadline must be in the future");
        require(_minParticipants > 0, "Minimum participants must be greater than 0");
        
        uint256 campaignId = campaignCount;
        Campaign storage campaign = campaigns[campaignId];
        
        campaign.title = _title;
        campaign.price = _price;
        campaign.minParticipants = _minParticipants;
        campaign.deadline = _deadline;
        campaign.currentParticipants = 0;
        campaign.status = Status.OPEN;
        campaign.creator = msg.sender;
        campaign.imageUrl = _imageUrl;
        
        campaignCount++;
        
        emit CampaignCreated(campaignId, _title, msg.sender);
        return campaignId;
    }
    // 공동구매 삭제
    function deleteCampaign(uint256 _campaignId) public {
        Campaign storage campaign = campaigns[_campaignId];
        require(msg.sender == campaign.creator, "Only creator can delete campaign");
        require(campaign.currentParticipants == 0, "Cannot delete campaign with participants");
        require(campaign.status == Status.OPEN, "Cannot delete completed campaign");
        
        delete campaigns[_campaignId];
        emit CampaignDeleted(_campaignId, msg.sender);
    }
    
    // 공동구매 참여
    function join(uint256 _campaignId) public {
        Campaign storage campaign = campaigns[_campaignId];
        
        require(campaign.status == Status.OPEN, "Campaign is not open");
        require(block.timestamp < campaign.deadline, "Campaign has ended");
        require(!campaign.participants[msg.sender], "Already joined");
        
        campaign.participants[msg.sender] = true;
        campaign.currentParticipants++;
        
        emit ParticipantJoined(_campaignId, msg.sender);
        
        if(campaign.currentParticipants >= campaign.minParticipants) {
            campaign.status = Status.SUCCESS;
            emit CampaignCompleted(_campaignId, Status.SUCCESS);
        }
    }
    
    // 공동구매 상태 확인
    function checkStatus(uint256 _campaignId) public {
        Campaign storage campaign = campaigns[_campaignId];
        
        if(campaign.status == Status.OPEN && block.timestamp >= campaign.deadline) {
            if(campaign.currentParticipants >= campaign.minParticipants) {
                campaign.status = Status.SUCCESS;
            } else {
                campaign.status = Status.FAILED;
            }
            emit CampaignCompleted(_campaignId, campaign.status);
        }
    }
    
    // 공동구매 정보 조회
    function getCampaign(uint256 _campaignId) public view returns (
        string memory title,
        uint256 price,
        uint256 minParticipants,
        uint256 deadline,
        uint256 currentParticipants,
        Status status,
        address creator,
        string memory imageUrl
    ) {
        Campaign storage campaign = campaigns[_campaignId];
        return (
            campaign.title,
            campaign.price,
            campaign.minParticipants,
            campaign.deadline,
            campaign.currentParticipants,
            campaign.status,
            campaign.creator,
            campaign.imageUrl
        );
    }
    
    // 참여 여부 확인
    function hasJoined(uint256 _campaignId, address _participant) public view returns (bool) {
        return campaigns[_campaignId].participants[_participant];
    }
}