<template>
  <div>
    <!-- 面包屑头部导航 -->
    <Breadbcrumb :items="titles"></Breadbcrumb>
    <!-- 卡片内容 -->
    <el-card>
      <el-table class="rightsTable" border stripe :data="rights" height="100vh">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="authName" label="权限名称"></el-table-column>
        <el-table-column prop="path" label="路径"></el-table-column>
        <el-table-column label="权限等级" sortable>
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level ==='0'">一级</el-tag>
            <el-tag type="success" v-if="scope.row.level ==='1'">二级</el-tag>
            <el-tag type="warning" v-if="scope.row.level ==='2'">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import Breadbcrumb from 'components/common/BreadCrumb'
export default {
  components:{
    Breadbcrumb
  },
  data(){
    return{
      titles:['权限管理','权限列表'],
      rights:[]  
    }  
  },
  created(){
    this.getRightsAll()
  },
  methods:{
    async getRightsAll(){
      let {data:res}= await this.$http({url:'rights/list'})
      console.log(res.data)
      this.rights = res.data
    },

    
  }
}
</script>

<style scoped>
.el-card{
  margin-top: 20px;
}
.rightsTable{
  overflow: auto;
}
</style>>