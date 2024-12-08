import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { groupBuyingContract, CampaignStatus } from "@/lib/web3"

export function JoinGroupDialog({ 
  campaign, 
  isOpen, 
  onOpenChange, 
  account,
  onSuccess,
  onError 
}) {
  const [loading, setLoading] = useState(false)

  const handleJoin = async () => {
    if (!account) {
      alert("지갑을 먼저 연결해주세요!")
      return
    }

    // 여기서 실제 결제 시스템 연동이 필요합니다
    const userConfirmed = confirm(
      `실제 서비스에서는 여기서 결제 시스템이 연동됩니다.\n` +
      `결제 금액: ${campaign.price}원\n` +
      `계속 진행하시겠습니까?`
    )

    if (!userConfirmed) return

    setLoading(true)
    try {
      // 결제 성공 가정 후 블록체인에 참여 기록
      await groupBuyingContract.methods.join(campaign.id)
        .send({ from: account })

      onSuccess?.()
      onOpenChange(false)
    } catch (error) {
      console.error("Failed to join campaign:", error)
      onError?.(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>공동구매 참여하기</DialogTitle>
          <DialogDescription>
            {campaign.title}에 참여합니다
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>상품 가격</span>
              <span>{campaign.price?.toLocaleString()}원</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>최소 참여자</span>
              <span>{campaign.minParticipants}명</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>현재 참여자</span>
              <span>{campaign.currentParticipants}명</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>마감일</span>
              <span>{campaign.deadline.toLocaleDateString()}</span>
            </div>
          </div>

          <Button 
            onClick={handleJoin}
            className="w-full"
            disabled={loading || !account || campaign.status !== CampaignStatus.OPEN}
          >
            {loading ? "처리 중..." : "참여하기"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}