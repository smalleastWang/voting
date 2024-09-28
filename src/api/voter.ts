import cos from '@/utils/cos';
import request from '@/utils/request';
import { Address } from 'viem';

interface JsonParams {
  name: string
  address: Address
  position?: string
  avatar: string
  age?: number
}

// 文件上传
export function uploadToIPFSApi(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  return cos.uploadFile({
    Bucket: 'voter-1309565142',
    Body: file,
    Region: 'ap-chongqing',
    Key: `candidate/${file.name}`,
    // ContentDisposition: 'inline',
  })
};

export function createCandidateApi(params: JsonParams) {
  return request.post('/candidate/create', params)
};

export function getCandidateByIdApi(id: string) {
  return request.get(`/candidate/${id}`)
};