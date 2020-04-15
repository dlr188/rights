<template>
  <div>
  <!-- 面包屑头部导航 -->
    <Breadbcrumb :items="titles"></Breadbcrumb>
    <!-- 卡片视图区 -->
    <el-card>
      <el-alert title="注意：只允许为第三级分类设置相关参数！" type="warning" show-icon></el-alert>
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类：</span>
          <el-cascader v-model="selectedCateKeys" :options="cateList" :props="cateProps" @change="handleChange">
          </el-cascader>
        </el-col>
      </el-row>
      <!-- tab页签区域 -->
      <el-tabs v-model="activeTabsName" @tab-click="handleTabsClick">
        <!-- 添加动态参数面板 -->
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addDialogVisible = true">添加参数</el-button>          
          <!-- 动态参数表格 -->
          <el-table :data="manyTableData" border stripe>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag v-for="(item, i) in scope.row.attr_vals" :key="i" closable
                  @close="handleClose(i, scope.row)">{{item}}</el-tag>
                <el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue"
                  ref="saveTagInput" style="width:120px" @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"></el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column>
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeParams(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 添加静态属性面板 -->
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" size="mini" :disabled="isBtnDisabled"
            @click="addDialogVisible = true">添加属性</el-button>
          <!-- 静态参数表格 -->
          <el-table :data="onlyTableData" border stripe>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag v-for="(item, i) in scope.row.attr_vals" :key="i" closable
                  @close="handleClose(i, scope.row)">{{item}}</el-tag>
                <el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue"
                  ref="saveTagInput" @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)" style="width:120px"></el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column>
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeParams(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加参数对话框 -->
    <el-dialog :title=" '添加' + getTitleText" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
      <el-form :model="addFrom" :rules="addFromRules" ref="addFromRef" label-width="100px">
        <el-form-item :label="getTitleText" prop="attr_name">
          <el-input v-model="addFrom.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogClosed">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑参数对话框 -->
    <el-dialog :title=" '修改' + getTitleText" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
      <el-form :model="editFrom" :rules="editFromRules" ref="editFromRef" label-width="100px">
        <el-form-item :label="getTitleText" prop="attr_name">
          <el-input v-model="editFrom.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
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
  data(){
    return{
      titles:["商品管理","参数列表"],
      selectedCateKeys:[],
      cateList:[],
      cateProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      activeTabsName:'many',
      addDialogVisible:false,
      editDialogVisible:false,
      manyTableData:[],
      onlyTableData:[],
      addFrom: {
        attr_name: ''
      },
      addFromRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' }
        ]
      },
      editFrom: {},
      editFromRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' }
        ]
      }
    }
  },
  computed:{
    cateId () {
      if (this.selectedCateKeys.length === 3) {
        return this.selectedCateKeys[2]
      }
      return null
    },
    isBtnDisabled(){
      if(this.cateId) {
        return false
      }else{
        return true
      }
    },
    getTitleText () {
      if (this.activeTabsName === 'many') {
        return '动态参数'
      }
      return '静态属性'
    }
  },
  created(){
    this.getCateList()
  },
  methods:{
    // 获取级联数据--分类
    async getCateList(){
      const {data:res} = await this.$http({ url:'categories'})
      if (res.meta.status!==200) return this.$message.console.error(res.meta.msg);
      this.cateList = res.data
    },
    handleChange(){
      this.getParamsData()
    },
    // 获取选中分类的参数的列表数据
    async getParamsData () {
      // 非三级分类清空所选及数据
      if(!this.cateId) {
        this.$message.error('请选择三级分类')
        this.selectedCateKeys = []
        this.manyTableData = []
        this.onlyTableData = []
        return
      }
      // 根据所选分类的Id,和当前面板的参数, 获取对应的参数
      const { data: res } = await this.$http({url:`categories/${this.cateId}/attributes`,
        params: { sel: this.activeTabsName }})
      if (res.meta.status !== 200) return this.$message.error('获取参数列表失败！')
      console.log(res);
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        // 控制文本框的显示与隐藏
        item.inputVisible = false
        // 文本框的输入值
        item.inputValue = ''
      })
      if (this.activeTabsName === 'many') {
        this.manyTableData = res.data
      } else {
        this.onlyTableData = res.data
      }
    },
    handleTabsClick(){
      this.getParamsData()
    },
    // 添加参数
    addDialogClosed(){
      this.addDialogVisible = false
      this.$refs.addFromRef.resetFields()
    },
    addParams () {
      this.$refs.addFromRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http({url:`categories/${this.cateId}/attributes`,method:'post',
        data:{attr_name: this.addFrom.attr_name,attr_sel: this.activeTabsName}})
        if (res.meta.status !== 201) {
          return this.$message.error('添加参数失败！')
        }
        this.$message.success('添加参数成功！')
        this.addDialogVisible = false
        this.getParamsData()
      })
    },
    // 编辑参数
    async showEditDialog(id){
      const { data: res } = await this.$http({url:`categories/${this.cateId}/attributes/${id}`,params: { attr_sel: this.activeTabsName }})
      if (res.meta.status !== 200) {
        return this.$message.error('获取分类失败！')
      }
      this.editFrom = res.data
      this.editDialogVisible = true
    },
    editDialogClosed(){
      this.editDialogVisible = false
      this.$refs.editFromRef.resetFields()
    },
    editParams () {
      this.$refs.editFromRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http({url:`categories/${this.cateId}/attributes/${this.editFrom.attr_id}`,
          data:{attr_name: this.editFrom.attr_name,attr_sel: this.activeTabsName},method:'put'})
        if (res.meta.status !== 200) {
          return this.$message.error('修改参数失败！')
        }
        this.$message.success('修改参数成功！')
        this.getParamsData()
        this.editDialogVisible = false
      })
    },
    // 删除参数
    removeParams(id){
      this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        let { data: res } = await this.$http({url:`categories/${this.cateId}/attributes/${id}`,method:'delete'})
        if (res.meta.status !== 200) return this.$message.error('删除分类失败！')
        this.getParamsData()
        this.$message.success('删除分类成功！')
      }).catch(()=>{
        this.$message.info('已取消删除')
      })  
    },
    handleClose(i,row){
      row.attr_vals.splice(i,1)
      this.saveAttrVals(row)
    },
    async saveAttrVals (row) {
      const { data: res } = await this.$http({url:`categories/${this.cateId}/attributes/${row.attr_id}`,
        data:{attr_name: row.attr_name,attr_sel: row.attr_sel,attr_vals: row.attr_vals.join(' ')},method:'put'})
      if (res.meta.status !== 200) return this.$message.error('修改参数项失败！')
      this.$message.success('修改参数项成功！')
    },
    // 点击按钮显示输入框
    showInput (row) {
      row.inputVisible = true
      // $nextTick方法的作用：当页面元素被重新渲染之后，才会至指定回调函数中的代码
      this.$nextTick(_ => {
        this.$refs.saveTagInput.focus()
      })
    },
    //  文本框失去焦点,或者按下Enter触发
    handleInputConfirm (row) {
      // 输入的内容为空时，清空
      if (!row.inputValue.trim()) {
        row.inputValue = ''
        row.inputVisible = false
        return
      }
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      row.inputVisible = false
      // 提交数据库，保存修改
      this.saveAttrVals(row)
    },
  }
}
</script>

<style scoped>
.el-card,.el-table{
  margin-top:20px
}
.el-alert{
  margin-bottom:20px
}
.el-tag{
  margin:5px

}
</style>