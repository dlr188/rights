<template>
  <div class="goods">
    <!-- 面包屑头部导航 -->
    <Breadbcrumb :items="titles"></Breadbcrumb>
    <!-- 卡片视图区 -->
    <el-card>
      <!-- 提示 步骤条 -->
      <el-alert title="添加商品信息" type="info" center show-icon :closable="false"></el-alert>
      <!-- :active=" number 类型" ，而el-tabs获取的为String类型-->
      <el-steps :space="200" :active='activeIndex-0' finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- 添加商品 Tab栏 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef">
        <el-tabs v-model="activeIndex" tabPosition="left" :before-leave="beforeTabLeave" @tab-click="tabClicked">
          <el-tab-pane label="基本信息">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="number">
              <el-input v-model="addForm.goods_number" type="goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="cat">
              <el-cascader v-model="addForm.goods_cat" :options="cateList" :props="cascaderProps" clearable></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数">
            <el-form-item v-for="item in manyTableData" :key="item.attr_id" :label="item.attr_name">
              <!-- 复选框组 -->
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox :label="cb" v-for="(cb, i) in item.attr_vals" :key="i" border></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性">
            <el-form-item :label="item.attr_name" v-for="item in onlyTableData" :key="item.attr_id">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <!-- 需在header中添加token -->
          <el-tab-pane label="商品图片">
            <el-upload
              action="https://www.liulongbin.top:8888/api/private/v1/upload"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-success="handleSuccess"
              :file-list="fileList"
              :headers="headerObj"
              list-type="picture">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容">
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>
            <el-button type="primary" class="btnAdd" @click="addGoods">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form> 
    </el-card>
    <!-- 图片预览 -->
    <el-dialog title="图片预览" :visible.sync="previewDialogVisible" width="50%">
      <img :src="picPreviewPath" alt="" class="previewImg" style="width:100%">
    </el-dialog>
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
      titles:["商品管理","添加商品"],
      curreyIndex:0,
      addForm: {
        goods_name: '',
        // 商品所属分类数组
        goods_cat: [],
        goods_price: 0,
        goods_number: 0,
        goods_weight: 0,
        // 商品详情描述
        goods_introduce: '',
        // 图片的数组
        pics: [],
        attrs: []
      },
      addFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        goods_cat: [
          { required: true, message: '请选择商品分类', trigger: 'blur' }
        ]
      },
      cateList:[],
      // 级联选择器配置
      cascaderProps: {
        expandTrigger: 'hover',
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      activeIndex:0,
      // 动态参数
      manyTableData:[],
      // 静态参数
      onlyTableData:[],
      fileList:[],
      // 图片上传组件的请求对象
      headerObj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      previewDialogVisible:false,
      picPreviewPath:''
    }
  },
  computed:{
    getCateId () {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2]
      }
      return null
    }
  },
  created(){
    this.getCateList ()
  }, 
  methods:{
    // 获取商品分类数据列表
    async getCateList () {
      const { data: res } = await this.$http({url:'categories'})
      if (res.meta.status !== 200) return this.$message.error('获取商品列表失败！')
      this.cateList = res.data
    },
    // 离开判断是否选择正确
    beforeTabLeave (activeName, odlActiveName) {
      if (odlActiveName === '0' && this.addForm.goods_cat.length !== 3) {
        this.$message.error('请先选择商品分类')
        return false
      }
    },
    // Tab标签被选中时触发
    async tabClicked () {
      // 访问动态参数面板
      if (this.activeIndex === '1') {
        const { data: res } = await this.$http({url:`categories/${this.getCateId}/attributes`,params:{sel: 'many'}})
        // console.log('动态参数');
        // console.log(res.data);
        if (res.meta.status !== 200) return this.$message.error('获取动态参数列表失败！')       
        res.data.forEach(item => {
          item.attr_vals =
            item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
        })
        this.manyTableData = res.data
      } else if (this.activeIndex === '2') {
        const { data: res } = await this.$http({url:`categories/${this.getCateId}/attributes`,params:{sel: 'only'}})
        // console.log('静态参数');
        // console.log(res.data);
        if (res.meta.status !== 200) return this.$message.error('获取静态参数列表失败！')
        this.onlyTableData = res.data
      }
    },
    handleRemove(file,fileList) {
      // 1.获取将要删除图片的临时路径
      const filePath = file.response.data.tmp_path
      // 2.从pics数组中，找到图片对应的索引值
      const i = this.addForm.pics.findIndex(x => x.pic === filePath)
      // 3.调用splice方法，移除图片信息
      this.addForm.pics.splice(i, 1)
      console.log(this.addForm.pics);
    },
    handlePreview(file) {
      this.picPreviewPath=file.response.data.url
      this.previewDialogVisible=true
    },
    handleSuccess (response,file,fileList) {
      // 1.拼接得到一个图片信息对象 临时路径
      const picInfo = { pic: response.data.tmp_path }
      // 2.将图片信息对象，push到pics数组中
      this.addForm.pics.push(picInfo)
    },
    async addGoods(){
      this.$refs.addFormRef.validate(async valid => {
      if (!valid) return this.$message.error('请填写必要的表单项！')
      let addTemp = this.addForm
      // cat处理
      addTemp.goods_cat = this.addForm.goods_cat.join(',')
      // attr处理
      this.manyTableData.forEach(item=>{
        let attr = {
          attr_id : item.attr_id,
          attr_value : item.attr_vals.join(' ')
        }
        addTemp.attrs.push(attr)
      })
      this.onlyTableData.forEach(item=>{
        let attr = {
          attr_id : item.attr_id,
          attr_value : item.attr_vals
        }
        addTemp.attrs.push(attr)
      })
      console.log(addTemp);
      const { data: res } = await this.$http({url:'goods',data:addTemp,method:'post' })
      if (res.meta.status !== 201) return this.$message.error('添加商品失败！')
      this.$message.success('添加商品成功!')
      this.$router.push('/goods')
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.el-card{
  margin-top: 20px;
  padding-top: 20px;
  height:100vh;
}
.el-alert,.el-steps{
  margin-bottom: 20px;
}
.el-cascader{
  width:100%
}
.el-checkbox {
  margin: 0 8px 0 0 !important;
}

</style>