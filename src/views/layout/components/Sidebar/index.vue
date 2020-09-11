<template>
  <el-scrollbar wrapClass="scrollbar-wrapper">
    <!--<img v-show="!isCollapse" :src="logo" style="max-width:100%;max-height:100%;padding: 5px">-->
    <!--<img v-show="isCollapse" :src="logoMin" style="max-width:100%;max-height:100%;padding: 5px">-->
    <el-menu mode="vertical"
             :show-timeout="200"
             :default-active="$route.path"
             :collapse="isCollapse"
             background-color="#003859"
             text-color="#e3e3e3"
             active-text-color="#409EFF">
      <sidebar-item v-for="route in permission_routes" :key="route.name" :item="route"
                    :base-path="route.path"></sidebar-item>
    </el-menu>
  </el-scrollbar>
</template>
<script>
import {mapGetters} from 'vuex'
import SidebarItem from './SidebarItem'

export default {
  data() {
    return {}
  },
  components: {SidebarItem},
  computed: {
    ...mapGetters({
      permission_routes: 'permission_routes',
      sidebar: 'sidebar'
    }),
    routes() {
      return this.$router.options.routes
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
</style>
