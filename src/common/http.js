import axios from 'axios'

export function http (config) {
    // 创建axios实例
    const intstance = axios.create({
        baseURL:'https://www.liulongbin.top:8888/api/private/v1/',
        timeout: 5000
        // contentType: 'application/json;charset=UTF-8',
        // dataType: 'json'
    })
    
    // 1.axios 请求拦截器
    intstance.interceptors.request.use(config => {
        config.headers.Authorization = sessionStorage.getItem('token')
        return config
    }, er => {})
    
    // 2.axios 响应拦截拦截
    intstance.interceptors.response.use(res => {
        return res
    }, er => {
    })
    
    return intstance(config)
    
}


