// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
// ElementUI  第一步
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
// icon
import 'assets/fonts/iconfont.css'
import {dataFormat} from 'common/filter/dataFormat'

import {http} from 'common/http'
Vue.prototype.$http=http;
// 使用ElementUI   第二步
Vue.use(ElementUI);
// ------axios 网络请求（项目使用封装好的http）
// import axios from 'axios'
// axios.defaults.baseURL='https://www.liulongbin.top:8888/api/private/v1/';
// Vue.prototype.$axios=axios;
// ------message 自己封装的提示消息插件
// import toastmessage from 'common/Message' 
// Vue.use(toastmessage)
// 富文本编辑器  1
import VueQuillEditor from 'vue-quill-editor'

import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

Vue.filter('dataFormat',function(date){
  return dataFormat(date)
})
// 富文本编辑器  2
Vue.use(VueQuillEditor)


Vue.config.productionTip = false
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render:h=>h(App)
  // components: { App },
  // template: '<App/>'
})
