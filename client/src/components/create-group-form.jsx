import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { groupBuyingContract } from "@/lib/web3"

export function CreateGroupForm({ account, onSuccess, onError }) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    minParticipants: "",
    deadline: "",
    price: "" // 참고용 가격 (원화)
  })
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!account) {
      alert("지갑을 먼저 연결해주세요!")
      return
    }

    setLoading(true)
    let imageUrl;

    try {
      // 이미지 업로드
      const imgFormData = new FormData();
      imgFormData.append('image', selectedImage);

      const uploadRes = await fetch('/api/campaigns/image', {
        method: 'POST',
        body: imgFormData
      });

      const uploadData = await uploadRes.json();
      imageUrl = uploadData.imageUrl;
      console.log('Image uploaded:', imageUrl);

      // Unix timestamp로 변환 (밀리초 -> 초)
      const deadlineTimestamp = Math.floor(new Date(formData.deadline).getTime() / 1000)

      await groupBuyingContract.methods
        .createCampaign(
          formData.title,
          parseInt(formData.price),
          parseInt(formData.minParticipants),
          deadlineTimestamp,
          imageUrl
        )
        .send({ from: account })

      onSuccess?.()
      setFormData({
        title: "",
        minParticipants: "",
        deadline: "",
        price: ""
      })
    } catch (error) {
      if (imageUrl) {
        // 이미지 업로드 성공했지만 캠페인 생성 실패 시 이미지 삭제
        await fetch('/api/campaigns/image', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ imageUrl })
        });
      }

      console.error("Failed to create campaign:", error)
      onError?.(error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">제목</Label>
        <Input
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="공동구매 제목을 입력하세요"
          required
        />
      </div>

      <div>
        <Label htmlFor="price">상품 가격 (원)</Label>
        <Input
          id="price"
          name="price"
          type="number"
          value={formData.price}
          onChange={handleChange}
          placeholder="상품 1개당 가격"
          required
        />
      </div>

      <div>
        <Label htmlFor="minParticipants">최소 참여자 수</Label>
        <Input
          id="minParticipants"
          name="minParticipants"
          type="number"
          min="2"
          value={formData.minParticipants}
          onChange={handleChange}
          placeholder="최소 참여 인원"
          required
        />
      </div>

      <div>
        <Label htmlFor="deadline">마감일</Label>
        <Input
          id="deadline"
          name="deadline"
          type="datetime-local"
          value={formData.deadline}
          onChange={handleChange}
          required
          className="text-gray-500 dark:text-gray-100 
            [&::-webkit-calendar-picker-indicator]:filter 
            [&::-webkit-calendar-picker-indicator]:invert-[.8]
            [&::-webkit-datetime-edit-fields-wrapper]:text-gray-100
            [&::-webkit-datetime-edit]:text-gray-500"
        />
      </div>

      <div>
        <Label htmlFor="image">이미지</Label>
        <div className="relative">
          <Input
            id="image"
            name="image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            required
            className="text-transparent file:text-transparent"
          />
          <div className="absolute inset-0 pointer-events-none">
            <div className="flex items-center h-full pl-3">
              <span className="text-sm text-gray-500">
                {selectedImage ? selectedImage.name : "이미지를 선택해주세요"}
              </span>
            </div>
          </div>
          <div className="absolute right-0 top-0 h-full">
            <Button
              type="button"
              variant="secondary"
              className="h-full rounded-l-none"
              onClick={() => document.getElementById('image').click()}
            >
              파일 선택
            </Button>
          </div>
        </div>
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={loading || !account}
      >
        {loading ? "처리 중..." : "공동구매 생성"}
      </Button>
    </form>
  )
}