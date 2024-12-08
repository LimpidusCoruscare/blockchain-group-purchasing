import { formidable } from 'formidable';
import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  // POST 요청 처리 전에 upload 디렉토리 존재 확인
  const uploadDir = path.join(process.cwd(), 'public', 'images', 'campaigns');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  if (req.method === 'POST') {
    try {
      const form = formidable({
        uploadDir: uploadDir,
        keepExtensions: true,
        maxFileSize: 5 * 1024 * 1024, // 5MB
      });

      const [_, files] = await form.parse(req);
      
      // files.image는 이제 배열입니다
      const imageFile = files.image?.[0];  // 첫 번째 파일 가져오기
      
      if (!imageFile) {
        throw new Error('No image file uploaded');
      }
      
      const fileName = `campaign-${Date.now()}${path.extname(imageFile.originalFilename)}`;
      const newPath = path.join(uploadDir, fileName);
      
      await fs.promises.rename(imageFile.filepath, newPath);
      
      res.status(200).json({ 
        imageUrl: `/images/campaigns/${fileName}` 
      });
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({ error: '업로드 실패' });
    }
  } else if (req.method === 'DELETE') {
    try {
      const { imageUrl } = JSON.parse(req.body);
      const filePath = path.join(process.cwd(), 'public', imageUrl);
      
      await fs.promises.unlink(filePath);
      res.status(200).json({ message: '이미지 삭제 완료' });
    } catch (error) {
      console.error('Delete error:', error);
      res.status(500).json({ error: '파일 삭제 실패' });
    }
  } else {
    res.status(405).json({ error: '허용되지 않은 메소드' });
  }
}