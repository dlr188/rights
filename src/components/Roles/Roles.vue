<template>
   <div>
      <!-- 面包屑头部导航 -->
      <Breadbcrumb :items="titles"></Breadbcrumb>
      <!-- 电子卡片 -->
      <el-card>
        <el-row>
          <el-col>
            <el-button type="primary" @click="add">添加角色</el-button>
          </el-col>
        </el-row>
        <el-table :data="roles" border stripe class="rolesTable">
          <!-- 展开符 -->
          <el-table-column type="expand">
            <template slot-scope="scope">
              <el-row v-for="(one,i1) in scope.row.children" :key="one.id" :gutter="20"
              :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'vcenter']">
                <!-- {{one.authName}} -->
                <el-col :span="5">
                  <el-tag closable type="primary" @close="removeRightById(scope.row, one.id)">{{one.authName}}</el-tag> 
                  <i class="el-icon-caret-right"></i>
                </el-col>
                <el-col :span="19">
                  <el-row v-for="(two,i2) in one.children" :key="two.id" :class="[i2 === 0 ? '' : 'bdtop', 'vcenter']">
                    <el-col :span="6">
                      <el-tag closable type="success" @close="removeRightById(scope.row, two.id)">{{two.authName}}</el-tag>
                      <i class="el-icon-caret-right"></i>
                    </el-col>
                    <el-col :span="18">
                      <el-tag v-for="three in two.children" :key="three.id" closable type="warning"
                       @close="removeRightById(scope.row, three.id)">{{three.authName}}
                      </el-tag>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </template>
          </el-table-column>
          <!-- 索引列 -->
          <el-table-column type="index" label="#"></el-table-column>
          <el-table-column label="角色名称" prop="roleName"></el-table-column>
          <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
          <el-table-column label="操作" width="300px">
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)">编辑</el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeRoleById(scope.row.id)">删除</el-button>
              <el-button type="warning" icon="el-icon-setting" size="mini"  @click="showSetRightDialog(scope.row)">分配权限</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
      <!-- 添加角色对话框 -->
      <el-dialog title="添加角色" :visible.sync="AddRoleDialogVisible" width="40%" @close="addRoleDialogClosed">
        <el-form :model="addRoleForm" ref="addRoleFormRef" :rules="addRoleFormRules" label-width="100px">
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="addRoleForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="addRoleForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addRoleDialogClosed">取 消</el-button>
          <el-button type="primary" @click="addRole">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 编辑角色对话框 -->
      <el-dialog title="编辑角色" :visible.sync="editRoleDialogVisible" width="40%" @close="editRoleDialogClosed">
        <el-form :model="editRoleForm" ref="editRoleFormRef" :rules="editRoleFormRules" label-width="100px">
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="editRoleForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="editRoleForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editRoleDialogClosed">取 消</el-button>
          <el-button type="primary" @click="editRoles">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 授权对话框 -->
      <el-dialog title="权限分配" :visible.sync="setRoleDialogVisible" width="40%" @close="setRoleDialogClosed">
        <el-tree :data="rights" show-checkbox default-expand-all check-on-click-node :default-checked-keys="roleRights"
        node-key="id" ref="tree" highlight-current :props="defaultProps">
        </el-tree>
        <span slot="footer" class="dialog-footer">
          <el-button @click="setRoleDialogClosed">取 消</el-button>
          <el-button type="primary" @click="setRights()">确 定</el-button>
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
      titles:['权限管理','角色列表'],
      roles:[],
      AddRoleDialogVisible:false,
      editRoleDialogVisible:false,
      setRoleDialogVisible:false,
      // 当前即将分配权限的Id
      roleId:0,
      addRoleForm:{
        roleName:'',
        roleDesc:''
      },
      addRoleFormRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' }
        ]
      },
      editRoleForm:{
        roleId:'',
        roleName:'',
        roleDesc:''
      },
      editRoleFormRules:{
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' }
        ]
      },
      rights:[],
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      //各个角色拥有的权限
      roleRights:[]
    }
  },
  created(){
    this.getRoles()
  },
  methods:{
    // 所有角色
    async getRoles(){
      let {data:res} = await this.$http({url:'roles'})
      if (res.meta.status !== 200)  return this.$message.error('获取角色列表失败！')
      this.roles = res.data
    },
    // 编辑对话框显示
    async showEditDialog(id){
        let {data:res} = await this.$http({url:`roles/${id}`})
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.editRoleForm = res.data
        console.log(this.editRoleForm);
        this.editRoleDialogVisible=true
    },
    // 确定编辑
    async editRoles(){
      this.$refs.editRoleFormRef.validate(async valid => {
      if (!valid) return
      let {data:res} = await this.$http({url:`roles/${this.editRoleForm.roleId}`,method:'put',
      data:{roleName: this.editRoleForm.roleName,roleDesc: this.editRoleForm.roleDesc}
      })   
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.getRoles()
      this.editRoleDialogVisible = false
      this.$message.success("修改成功")
      })
    },
    // 关闭编辑对话框
    editRoleDialogClosed(){
      this.editRoleDialogVisible=false
      this.$refs.editRoleFormRef.resetFields()
    },
    // 删除
    removeRoleById(id){
        this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        let { data: res } = await this.$http({url:`roles/${id}`,method:'delete'})
        if (res.meta.status !== 200) return this.$message.error('删除用户失败！')
        this.getRoles()
        this.$message.success('删除角色成功！')
      }).catch(()=>{
        this.$message.info('已取消删除')
      }) 
    },
    // 添加对话框
    add(){
      this.AddRoleDialogVisible = true
    },
    // 增加角色
    async addRole(){
      this.$refs.addRoleFormRef.validate(async valid => {
      if (!valid) return
      const { data: res } = await this.$http({url:'roles',method:'post',
        data:{roleName:this.addRoleForm.roleName,roleDesc:this.addRoleForm.roleDesc}})
      if (res.meta.status !== 201) {
        this.$message.error(res.meta.msg)
      }
      this.$message.success('添加角色成功！')
      this.getRoles()
      this.AddRoleDialogVisible = false
      this.$refs.addRoleFormRef.resetFields()
      })
    },
    addRoleDialogClosed(){
      this.AddRoleDialogVisible = false
      this.$refs.addRoleFormRef.resetFields()
    },
    removeRightById(role,rightId){
      this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        let { data: res } = await this.$http({url:`roles/${role.id}/rights/${rightId}`,method:'delete'})
        if (res.meta.status !== 200) return this.$message.error('删除权限失败！')
        role.children = res.data
        this.$message.success('删除权限成功！')
      }).catch(()=>{
        this.$message.info('已取消删除')
      })
    },
    // 所有权限 tree
    async getRightsAll(){
      let {data:res}= await this.$http({url:'rights/tree'})
      console.log(res.data)
      this.rights = res.data
    },
    // 通过递归 获取角色下三级权限的 id, 并保存到defKeys数组
    getLeafkeys (node, arr) {
      // 没有children属性，则是三级节点
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => this.getLeafkeys(item, arr))
    },
    // 分配权限对话框显示
    showSetRightDialog(role){
      console.log(role);
      
      this.getRightsAll()
      this.roleRights=[]
      this.getLeafkeys(role, this.roleRights)
      this.roleId = role.id
      console.log(this.roleRights);
      this.setRoleDialogVisible = true
    },
    async setRights(){
      let arr = [...this.$refs.tree.getCheckedKeys(),...this.$refs.tree.getHalfCheckedKeys()].join(',')
      console.log(arr);
      let{data:res} = await this.$http({url:`roles/${this.roleId}/rights`,method:'post',
      data:{rids:arr}})
      if (res.meta.status !== 200) { return this.$message.error(res.meta.msg) }
      this.$message.success('分配权限成功!')
      this.getRoles()
      this.setRoleDialogVisible = false
    },
    setRoleDialogClosed(){
      this.setRoleDialogVisible = false
    }
  }
}
</script>

<style>
  .el-card,.rolesTable{
    margin-top:20px
  }
  .bdtop {
    border-top: 1px solid #eee;
  }
  .bdbottom {
    border-bottom: 1px solid #eee;
  }
  .vcenter {
    display: flex;
    align-items: center;
  }
  .el-tag {
    margin: 7px;
  }
</style>