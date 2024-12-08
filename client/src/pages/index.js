import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { CreateGroupForm } from '@/components/create-group-form'
import { JoinGroupDialog } from '@/components/join-group-dialog'
import { connectWallet, getCampaigns, CampaignStatus, deleteCampaign, checkCampaignStatus } from '@/lib/web3'
import Image from 'next/image'

export default function Home() {
  const [account, setAccount] = useState(null)
  const [campaigns, setCampaigns] = useState([])
  const [loading, setLoading] = useState(true)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [selectedCampaign, setSelectedCampaign] = useState(null)
  const [joinDialogOpen, setJoinDialogOpen] = useState(false)

  useEffect(() => {
    // MetaMask 계정 변경 감지
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        setAccount(accounts[0] || null)
      })
    }

    // 초기 데이터 로드
    loadCampaigns()
  }, [])

  const loadCampaigns = async () => {
    try {
      setLoading(true)
      // 먼저 모든 캠페인의 상태를 체크
      const data = await getCampaigns()
      for (const campaign of data) {
        if (campaign.status === CampaignStatus.OPEN && new Date() > campaign.deadline) {
          await checkCampaignStatus(campaign.id)
        }
      }
      // 상태 체크 후 다시 캠페인 목록을 불러옴
      const updatedData = await getCampaigns()
      setCampaigns(updatedData)
    } catch (error) {
      console.error("Failed to load campaigns:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleConnectWallet = async () => {
    try {
      const connectedAccount = await connectWallet()
      setAccount(connectedAccount)
    } catch (error) {
      console.error("Failed to connect wallet:", error)
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case CampaignStatus.OPEN:
        return "진행중"
      case CampaignStatus.SUCCESS:
        return "성공"
      case CampaignStatus.FAILED:
        return "실패"
      default:
        return "알 수 없음"
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case CampaignStatus.OPEN:
        return "text-blue-600"
      case CampaignStatus.SUCCESS:
        return "text-green-600"
      case CampaignStatus.FAILED:
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">블록체인 공동구매</h1>
        <Button 
          variant={account ? "outline" : "default"}
          onClick={handleConnectWallet}
        >
          {account ? `${account.slice(0,6)}...${account.slice(-4)}` : "지갑 연결"}
        </Button>
      </header>

      {loading ? (
        <div className="text-center py-8">
          <p>데이터를 불러오는 중...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 새 공동구매 생성 카드 */}
          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Card className="hover:bg-gray-50 cursor-pointer border-dashed">
                <CardHeader className="text-center">
                  <CardTitle>새 공동구매 생성</CardTitle>
                  <CardDescription>
                    새로운 공동구매를 시작해보세요
                  </CardDescription>
                </CardHeader>
              </Card>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>새 공동구매 만들기</DialogTitle>
                <DialogDescription>
                  공동구매 정보를 입력해주세요
                </DialogDescription>
              </DialogHeader>
              <CreateGroupForm 
                account={account}
                onSuccess={() => {
                  loadCampaigns()
                  setCreateDialogOpen(false)
                }}
                onError={() => {
                  alert("공동구매 생성에 실패했습니다.")
                }}
              />
            </DialogContent>
          </Dialog>

          {/* 공동구매 목록 */}
          {campaigns.map((campaign) => (
            <Card key={campaign.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{campaign.title}</CardTitle>
                    <CardDescription>
                      생성자: {campaign.creator.slice(0,6)}...{campaign.creator.slice(-4)}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <span className={`px-2 py-1 rounded text-sm ${getStatusColor(campaign.status)}`}>
                      {getStatusText(campaign.status)}
                    </span>
                    {account && campaign.creator.toLowerCase() === account.toLowerCase() && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={async () => {
                          if (window.confirm('정말로 이 공동구매를 삭제하시겠습니까?')) {
                            try {
                              await deleteCampaign(campaign.id, account);
                              loadCampaigns();
                              alert('공동구매가 삭제되었습니다.');
                            } catch (error) {
                              alert('삭제 실패: ' + error.message);
                            }
                          }
                        }}
                        disabled={campaign.currentParticipants > 0 || campaign.status !== CampaignStatus.OPEN}
                      >
                        삭제
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              {campaign.imageUrl && (
                <div className="px-6 pb-4">
                  <Image
                    src={campaign.imageUrl}
                    alt={campaign.title}
                    width={400}
                    height={300}
                    className="w-full h-[200px] object-cover rounded-md"
                  />
                </div>
              )}
              {console.log(`test: ${campaign.imageUrl}, ${campaign.title}`)}
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span>참여 현황</span>
                    <span>{campaign.currentParticipants} / {campaign.minParticipants}명</span>
                  </div>
                  <Progress 
                    value={(campaign.currentParticipants / campaign.minParticipants) * 100} 
                  />
                  <div className="flex justify-between text-sm">
                    <span>가격</span>
                    <span>{campaign.price?.toLocaleString()}원</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>마감일</span>
                    <span>{campaign.deadline.toLocaleDateString()}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  onClick={() => {
                    setSelectedCampaign(campaign)
                    setJoinDialogOpen(true)
                  }}
                  disabled={!account || campaign.status !== CampaignStatus.OPEN}
                >
                  {!account 
                    ? "지갑 연결 필요" 
                    : campaign.status !== CampaignStatus.OPEN
                    ? getStatusText(campaign.status)
                    : "참여하기"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* 참여 다이얼로그 */}
      {selectedCampaign && (
        <JoinGroupDialog
          campaign={selectedCampaign}
          isOpen={joinDialogOpen}
          onOpenChange={setJoinDialogOpen}
          account={account}
          onSuccess={() => {
            loadCampaigns()
            alert("공동구매 참여가 완료되었습니다!")
          }}
          onError={() => {
            alert("공동구매 참여에 실패했습니다.")
          }}
        />
      )}
    </div>
  )
}