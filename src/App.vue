<template>
  <div id="app">
    <router-link to='goods'>商品列表</router-link>
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
@import './main.css';
</style>
