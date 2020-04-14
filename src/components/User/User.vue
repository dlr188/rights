<template>
  <div class='users'>
    <!-- 面包屑头部导航 -->
    <Breadbcrumb :items="titles"></Breadbcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-input placeholder="请输入搜索内容" v-model="queryInfo.query" @input="getUsers" clearable>
            <el-button slot="append" icon="el-icon-search" @click="getUsers"></el-button>
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-button type='primary' @click="add">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表区域 -->
      <el-table :data="userlist" border stripe>
        <el-table-column type="index" label="#" ></el-table-column>
        <el-table-column prop="username" label="姓名" width="100"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column label="状态" width="160">
          <template slot-scope="scope">
          <el-switch v-model="scope.row.mg_state" active-color="#409eff" inactive-color="#dcdfe6" @change="stateChanged(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="edit(scope.row.id)"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="del(scope.row.id)"></el-button>
            <el-tooltip class="item" effect="dark" content="角色分配" :enterable="false" placement="top">
              <el-button type="warning" icon="el-icon-setting" size="mini" @click="setting(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[2, 5, 10, 15]"
        :page-size="100"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totals">
      </el-pagination>
      <!-- 编辑对话框 -->
      <el-dialog
        title="修改用户信息" :visible.sync="editdialogVisible" :before-close="edithandleClose">
        <el-form :model="editUserForm" ref="editUserFormRef" :rules="editUserFormRules" label-width="70px">
          <el-form-item label="用户名">
            <el-input v-model="editUserForm.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editUserForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="editUserForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="edithandleClose">取 消</el-button>
          <el-button type="primary" @click="editconf">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 添加用户对话框 -->
      <el-dialog
        title="增加用户信息" :visible.sync="adddialogVisible" :before-close="addhandleClose">
        <el-form :model="addUserForm" ref="addUserFormRef" :rules="addUserFormRules" label-width="70px">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="addUserForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="addUserForm.password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="addUserForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="addUserForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addhandleClose">取 消</el-button>
          <el-button type="primary" @click="addconf">确 定</el-button>
        </span>
      </el-dialog>
       <!-- 分配角色对话框 -->
      <el-dialog title="分配角色" :visible.sync="setRoleDialogVisible" width="50%" @close="setRoleDialogClosed">
        <el-form ref="setUserFormRef" label-width="70px">
          <el-row>当前用户：{{user.username}}</el-row>
          <el-row>当前角色：{{user.role_name}}</el-row>
          <el-row>分配角色：
            <el-select v-model="selectRoleId" filterable allow-create default-first-option placeholder="请选择要分配的角色">
              <el-option v-for="item in rolesLsit" :key="item.id" :label="item.roleName" :value="item.id"></el-option>
            </el-select>
          </el-row>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="setRoleDialogClosed">取 消</el-button>
          <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import Breadbcrumb from 'components/common/BreadCrumb'
export default {
  name:'user',
  components:{
    Breadbcrumb
  },
  data(){
    // 自定义邮箱规则
    var checkEmail = (rule, value, callback) => {
      const regEmail = /^\w+@\w+(\.\w+)+$/
      if (regEmail.test(value)) {
        return callback()
      }
      callback(new Error('请输入合法邮箱'))
    }
    // 自定义手机号规则
    var checkMobile = (rule, value, callback) => {
      const regMobile = /^1[34578]\d{9}$/
      if (regMobile.test(value)) {
        return callback()
      }
      callback(new Error('请输入合法的手机号码'))
    }
    return{
      titles:["用户管理","用户列表"],
      queryInfo:{
        query: '',
        pagenum: 1,
        pagesize: 2,
      },
      totals:0,
      userlist:[],
      adddialogVisible:false,
      editdialogVisible:false,
      setRoleDialogVisible:false,
      editUserForm:{
        id:0,
        username:'',
        email:'',
        mobile:''
      },
      editUserFormRules:{
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      addUserForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      addUserFormRules: {
        username: [
          {required: true, message: '请输入用户名', trigger: 'blur' },
          {min: 3,max: 8,message: '用户名的长度在3~8个字',trigger: 'blur'}
        ],
        password: [
          {required: true, message: '请输入用户密码', trigger: 'blur' },
          {min: 3,max: 8,message: '用户密码的长度在3～8个字',trigger: 'blur'
          }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      selectRoleId:'',
      rolesLsit:[],
      user:{}
    }
  },
  created(){
    this.getUsers()
  },
  methods:{
    // 获取用户列表
    async getUsers(){
      let {data:res} = await this.$http({url:'users',method:'get',params:this.queryInfo})
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.userlist = res.data.users
      this.totals = res.data.total
      // console.log(this.userlist)
    },
    // 滑块修改用户状态
    async stateChanged(info){
      let {data:res} = await this.$http({url:`users/${info.id}/state/${info.mg_state}`,method:'put'})
      // console.log(res)
      if (res.meta.status !== 200) {
        info.mg_state=!info.mg_state;
        return this.$message.error(res.meta.msg)       
      }else{
        this.$message.success('更新用户状态成功！')
      }
    },
    // 编辑用户信息
    async edit(id){
      let {data:res} = await this.$http({url:`users/${id}`,method:'get'})
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)       
      this.editUserForm = res.data
      this.editdialogVisible = true
    },
    // 关闭编辑对话框
    edithandleClose(){
      this.editdialogVisible = false
      this.$refs.editUserFormRef.resetFields()
    },
    // 确认修改
    editconf(){
      this.$refs.editUserFormRef.validate(async valid => {
      if (!valid) return
      let {data:res} = await this.$http({url:`users/${this.editUserForm.id}`,method:'put',
      data:{email: this.editUserForm.email,mobile: this.editUserForm.mobile}
      })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.getUsers()
      this.editdialogVisible = false
      this.$message.success("修改成功")
      })
    },
    // 删除用户
    del(id){
      const confirmResult =this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        let { data: res } = await this.$http({url:`users/${id}`,method:'delete'})
        if (res.meta.status !== 200) return this.$message.error('删除用户失败！')
        // this.$message.success('删除用户成功！')
        this.getUsers()
        this.$message.success('删除用户成功！')
      }).catch(()=>{
        this.$message.info('已取消删除')
      })  
    },
    // 每页显示条数改变
    handleSizeChange(val) {
      this.queryInfo.pagesize = val;
      this.getUsers()
    },
    // 跳转到第几页
    handleCurrentChange(val) {
      this.queryInfo.pagenum = val;
      this.getUsers()
    },
    // 添加用户
    add(){
      this.adddialogVisible = true
    },
    // 关闭添加对话框
    addhandleClose(){
      this.adddialogVisible = false
      this.$refs.addUserFormRef.resetFields()
    },
    // 确认添加
    addconf(){
      this.$refs.addUserFormRef.validate(async valid => {
      if (!valid) return
      let {data:res} = await this.$http({url:'users',method:'post',data:this.addUserForm})
      if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
      this.getUsers()
      this.adddialogVisible = false
      this.$message.success("添加成功")
      })
    },
    // 角色授权 角色显示
    async setting(user){
      this.user = user
      // 展示对话框之前，获取所有角色列表
      const { data: res } = await this.$http({url:'roles'})
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败！')
      }
      this.rolesLsit = res.data
      this.setRoleDialogVisible = true
    },
    setRoleDialogClosed(){
      this.setRoleDialogVisible = false
      this.$refs.setUserFormRef.resetFields()
    },
    // 角色确认
    async saveRoleInfo(){
      if (!this.selectRoleId) return this.$message.error('请选择要分配的角色')
      let {data:res} = await this.$http({url:`users/${this.user.id}/role`,data:{rid: this.selectRoleId},method:'put'})
      if (res.meta.status !== 200) {
        return this.$message.error('更新用户角色失败！')
      }
      this.$message.success('更新角色成功！')
      this.getUsers()
      this.setRoleDialogVisible = false
      this.$refs.setUserFormRef.resetFields()
    }

  }
}
</script>

<style scoped>
.el-card{
  margin-top: 20px;
}
.el-table{
  margin-top: 15px;
}
</style>