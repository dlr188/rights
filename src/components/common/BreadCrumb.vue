<template>
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item v-for="(item,index) in items" :key='index'>{{item}}</el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
export default {
  name:'BreadCrumb',
  data(){
    return{}
  },
  props:{
    items:Array
  }
}
</script>

<style>

</style>