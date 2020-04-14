<template>
  <div>
    <!-- 面包屑头部导航 -->
    <Breadbcrumb :items="titles"></Breadbcrumb>
    <!-- 卡片视图区 -->
    <el-card>
      <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
        <el-table :data="cateList" style="width: 100%;margin-bottom: 20px;"
        row-key="cat_id" border :tree-props="{children: 'children'}">
        <el-table-column prop="cat_name" label="商品分类"></el-table-column>
        <el-table-column label="是否分类">
          <template slot-scope="scope">
            <i class="el-icon-success" style="color: lightgreen" v-if="scope.row.cat_deleted === false"></i>
          </template>
        </el-table-column>
        <el-table-column label="排序">
          <template slot-scope="scope">
            <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
            <el-tag size="mini" type="success" v-else-if="scope.row.cat_level === 1">二级</el-tag>
            <el-tag size="mini" type="warning" v-else>三级</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" sortable>
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditCateDialog(scope.row.cat_id)">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeCate(scope.row.cat_id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 添加分类的对话框 -->
    <el-dialog title="添加分类" :visible.sync="addCateDialogVisible" width="50%" @close="addCateDialogClosed">
      <el-form
        :model="addCateForm"
        :rules="addCateFormRules"
        ref="addCateFormRef"
        label-width="100px"
      >
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类：">
          <!-- options：数据源 -->
          <el-cascader
            v-model="selectedKeys"
            :options="parentCateList"
            :props="cascaderProps"
            @change="parentCateChanged"
            clearable
            style="width: 100%"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑分类的对话框 -->
    <el-dialog title="编辑分类" :visible.sync="editCateDialogVisible"  @close="editCateDialogClosed" width="50%">
      <el-form :model="editCateForm" :rules="editCateFormRules" ref="editCateFormRef" label-width="100px">
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="editCateForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editCateDialogClosed">取 消</el-button>
        <el-button type="primary" @click="eidtCate">确 定</el-button>
      </span>
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
      cateList:[],
      queryInfo:{
        type:3,
        pagenum:1,
        pagesize:10
      },
      total:0,
       addCateDialogVisible: false,
      // 添加分类对象
      addCateForm: {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0
      },
      // 添加分类表单的验证规则
      addCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      editCateDialogVisible: false,
      // 编辑分类表单验证
      editCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      editCateForm: {},
      // 选中的父级Id数组
      selectedKeys: [],
      // 父级分类列表
      parentCateList: [],
       // 指定级联选择器的配置对象
      cascaderProps: {
        // 配置触发选项 hover/click
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        checkStrictly: true
      },
    }
  },
  created(){
    this.getCateList()
  },
  methods:{
    // 获取商品分类
    async getCateList(){
      const {data:res} = await this.$http({ url:'categories',params:this.queryInfo })
      if (res.meta.status!==200) return this.$message.console.error(res.meta.msg);
      this.cateList = res.data.result
      this.total=res.data.total
    },
    // 编辑对话框
    async showEditCateDialog(id){
      const { data: res } = await this.$http({url:`categories/${id}`})
      if (res.meta.status !== 200) return this.$message.error('获取分类失败！')
      this.editCateForm = res.data
      this.editCateDialogVisible=true
    },
    // 确认修改分类
    eidtCate () {
      this.$refs.editCateFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http({url:`categories/${this.editCateForm.cat_id}`,
          data:{cat_name: this.editCateForm.cat_name},method:'put' })
        if (res.meta.status !== 200) return this.$message.error('更新分类名失败！')
        this.getCateList()
        this.$message.success('更新分类名成功！')
        this.editCateDialogVisible = false
      })    
    },
    editCateDialogClosed(){
      this.$refs.editCateFormRef.resetFields()
      this.editCateDialogVisible=false
    },
    // 删除对话框
    removeCate(id){
      this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        let { data: res } = await this.$http({url:`categories/${id}`,method:'delete'})
        if (res.meta.status !== 200) return this.$message.error('删除分类失败！')
        this.getCateList()
        this.$message.success('删除分类成功！')
      }).catch(()=>{
        this.$message.info('已取消删除')
      })  
    },
    // 监听 pageSizeChange
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getCateList()
    },
    // 监听 pagenum改变
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getCateList()
    },
    showAddCateDialog () {
      this.getParentCateList ()
      this.addCateDialogVisible = true
    },
    // 获取父级分类的数据
    async getParentCateList () {
      const { data: res } = await this.$http({url:'categories', params: { type: 2 }})
      if (res.meta.status !== 200) return this.$message.error('获取父级分类失败！')
      this.parentCateList = res.data
      console.log(this.parentCateList);
      
    },
    // 添加分类 选择项发生变化触发
    parentCateChanged () {
      // console.log(this.selectedKeys);
      if (this.selectedKeys.length > 0) {
        // 父级分类的Id
        this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
        // 当前分类的等级
        this.addCateForm.cat_level = this.selectedKeys.length
      } else {
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      }
    },
    // 确认添加
    addCate () {
      this.$refs.addCateFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http({url:'categories', data:this.addCateForm,method:'post'})
        if (res.meta.status !== 201) return this.$message.error('添加分类失败！')   
        this.$message.success('添加分类成功！')
        this.getCateList()
        this.addCateDialogVisible = false
      })
    },
    addCateDialogClosed () {
      this.$refs.addCateFormRef.resetFields()
      this.selectedKeys=[]
    },
  }
}
</script>

<style scoped>
.el-card{
  margin-top: 20px;
  padding-top: 20px;
  height:100vh;
}
.el-table{
  margin-top: 20px;
}
</style>