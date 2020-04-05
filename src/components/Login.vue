<template>
  <div class="login">
    <div class="login-container">
      <!-- 登录头像 -->
      <div class="login-img">
        <img src="~assets/logo.png" />
      </div>
      <!-- 登录框 -->
      <div class="login-form">
        <el-form ref="login" :model="login" :rules="loginrules" >
          <el-form-item prop="username">
            <el-input v-model="login.username" prefix-icon="iconfont icon-user" placeholder="请输入用户名"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="login.password" prefix-icon="iconfont icon-3702mima" placeholder="请输入密码" show-password></el-input>
          </el-form-item>
          <el-row class="btns">
            <el-button type="primary" @click='loginbtn'>登录</el-button>
            <el-button type="info" @click="resetbtn">重置</el-button>
          </el-row>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
// import {http} from 'common/http'    main.js挂载全局
export default {
  name: 'Login',
  data () {
    return {
      login:{
        username:'',
        password:''
      },
      loginrules:{
        username: [
          { required: true, message: '用户名不能为空', trigger: 'blur' },
          { min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          { min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' }
        ],
      }
    }
  },
  methods:{
    loginbtn(){
        this.$refs.login.validate(async(valid) => {
          if (!valid) return;
          // 方法一：未封装
          // let {data:data} = await this.$axios.post('login', this.login)
          // 方法二：  2.1
          let {data:res} = await this.$http({url:'login',method: 'POST',params:this.login})
          console.log(res)
          if(res.meta.status!==200){
            // 组件插件后使用
            // this.$message({message: res.meta.msg, time: 3000})
            this.$message.error(res.meta.msg);
            return;
          }
          this.$message.success('登录成功');
          sessionStorage.setItem('token', res.data.token)
          this.$router.push('/home');
          // 方法一  1.2
          // this.$axios.post('login', this.login).then((res)=>{
          //   console.log(res)
          // }).catch((err)=>{
          //   console.log(err)
          // })
          // 方法二  2.2
          // http({url:'login',method: 'POST',data:this.login}).then((data)=>{
          //    if(data.data.meta.status!==200){
          //   this.$message.error(data.data.meta.msg);
          //   return;
          // }
          // this.$message.success('登录成功');
          // sessionStorage.setItem('token', data.data.data.token)
          // this.$router.push('/goods');
          // }).catch((err)=>{
          //   console.log(err)
          // })
          
        });
    },
    resetbtn(){
      this.$refs.login.resetFields();
    }
  }
}
</script>
<style scoped>
.login{
  background: #2b4b6b;
  height:100%;
  width:100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.login-container{
  height:320px;
  width:450px;
  background: white;
  /* 与 .login felx布局效果相同
  position: relative;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%); */
  box-shadow: 1px 1px 0 888888;
  border-radius: 3px;
}
/* 登录头像 */
.login-img{
  background: fff;
  border-radius: 50%;
  position: relative;
  left: 50%;
  transform: translate(-50%,-50%);
  width:120px;
  height:120px;
  border:1px solid #eee;
  background: white;
  padding:10px;
}
.login-img img{
  width: 100%;
  border:1px solid white;
  border-radius: 50%;
  background: #eee;
}
/* 登录验证 */
.login-form{
  width:80%;
  margin:0 auto;
}
.btns{
  display: flex;
  justify-content: flex-end;
}
</style>
