<template>
  <div class="goods">
   <!-- 面包屑头部导航 -->
    <Breadbcrumb :items="titles"></Breadbcrumb>
    <!-- 卡片视图区 -->
    <el-card>
      <!-- 搜索  添加商品-->
      <el-row :gutter="20">
        <el-col :span="6">
          <el-input placeholder="请输入内容" v-model="queryInfo.query">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddPage">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 订单列表 -->
      <el-table :data="goodlist" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name" width='550'></el-table-column>
        <el-table-column label="商品价格(元)" prop="goods_price" width="100px"></el-table-column>
        <el-table-column label="商品重量" prop="goods_weight" width="70px"></el-table-column>
        <el-table-column label="商品数量" prop="goods_number" width="70px"></el-table-column>
        <el-table-column label="创建时间" prop="add_time" width="140px">
          <template slot-scope="scope">{{scope.row.add_time | dataFormat }}</template>
        </el-table-column>
        <el-table-column label="操作" width="130px">
          <template>
            <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
            <el-button ype="danger" icon="el-icon-delete" size="mini"></el-button>
          </template>
        </el-table-column>
      </el-table>
       <!-- 分页区域 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import Breadbcrumb from 'components/common/BreadCrumb'

export default {
  components:{
    Breadbcrumb
  },
  data () {
    return {
      titles:["商品管理","商品列表"],
      queryInfo:{
        query:'',
        pagenum:1,
        pagesize:10
      },
      total:0,
      goodlist:[]

    }
  },
  created(){
    this.getGoods()
  },
  methods:{
    async getGoods(){
      const {data:res} = await this.$http({url:'goods',params:this.queryInfo})
      if (res.meta.status !== 200) return this.$message.error('获取商品列表失败！')
      this.goodlist = res.data.goods
      this.total=res.data.total
    },
    goAddPage(){
      this.$router.push('/goods/add')
    },
    handleSizeChange(val){
      this.queryInfo.pagesize = val
      this.getGoods()
    },
    handleCurrentChange(val){
      this.queryInfo.pagenum = val
      this.getGoods()
    },
    
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.el-card,.el-table{
  margin-top:20px
}
</style>