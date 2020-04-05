<template>
  <el-container>
    <el-header>
      <h2>欢迎使用电商+权限管理系统</h2>
      <el-button @click="loginout">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="togleCollapse">|||</div>
        <el-menu :collapse="isCollapse" :unique-opened="true" active-text-color="#409FFF" text-color="#fff" router :collapse-transition="false" >
          <el-submenu v-for="item in menuList" :key='item.id' :index="item.id+''">
            <template slot="title">
              <i :class="icons[item.id]"></i><span>{{item.authName}}</span>
            </template>
            <el-menu-item v-for="child in item.children" :key='child.id' :index="child.path">
              <i class="el-icon-menu"></i><span>{{child.authName}}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: 'Home',
  data () {
    return {
      menuList:[],
      icons: {
        '125': 'iconfont icon-user',
        '103': 'iconfont icon-tijikongjian',
        '101': 'iconfont icon-shangpin',
        '102': 'iconfont icon-danju',
        '145': 'iconfont icon-baobiao'
      },
      isCollapse:false
    }
  },
  created(){
    this.getMenu()
  },
  methods:{
    loginout(){
      sessionStorage.clear()
      this.$router.push('login')
    },
    async getMenu(){
      let {data:res} = await this.$http({url:'menus'})
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menuList = res.data
    },
    togleCollapse(){
      this.isCollapse=!this.isCollapse
    }

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.el-container{
  height:100%;
}
.el-header{
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #373d41;
  color:white;
}
.el-aside{
  background: #333744;
  color:white
}
.el-menu,.el-menu-item{
  background: #333744;
  border: none;
}
.el-submenu__title {
    color:white !important;
  }
.el-menu span,.el-menu-item span{
  margin-left:8px;
}
.toggle-button {
  background-color: #4A5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  /* 鼠标放上去变成小手 */
  cursor: pointer;
}
.el-main{
  background: #eaedf1;
}
</style>
