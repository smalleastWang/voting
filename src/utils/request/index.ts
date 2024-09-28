import Request from './Request'
import { transform } from './interceptorHooks'

// 具体使用时先实例一个请求对象
const request = new Request({
  baseURL: '/api',
  timeout: 5000,
  interceptorHooks: transform,
})

export default request
