import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'
import MainSide from '../views/main/MainSide'
import GroupMain from '../views/group/main'
import ApiMain from '../views/group/page/api/main'
import ObjectMain from '../views/setting/object/main'
import AppMain from '../views/setting/app/main'
import AdvSettingMain from '../views/advancedSettings/main'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },
  { path: '/auth', component: () => import('@/views/auth'), hidden: true },

  {
    path: '/',
    component: Layout,
    redirect: { name: 'Zone' },
    name: 'Dashboard',
    // meta: { keepAlive: true },
    hidden: true,
    children: [
      {
        path: '/dashboard',
        redirect: { name: 'Zone' }
      },
      {
        path: '',
        component: MainSide,
        redirect: { name: 'Zone' },
        children: [{
          path: '/zone/:zoneId?',
          name: 'Zone',
          // meta: { keepAlive: true },
          component: () => import('@/views/dashboard/index')
        }
        ]
      }
    ]
  },
  {
    path: '/setting',
    component: Layout,
    redirect: '/dashboard',
    name: 'Setting',
    meta: { title: 'Setting' },
    hidden: true,
    children: [
      {
        path: 'object',
        name: 'Object',
        meta: { title: 'Object' },
        component: ObjectMain,
        redirect: { name: 'ObjectBaseInfo' },
        children: [{
          path: 'baseinfo',
          name: 'ObjectBaseInfo',
          meta: { keepAlive: true },
          component: () => import('@/views/setting/object/page/baseInfo')
        },
        {
          path: 'env',
          name: 'ObjectBaseEnv',
          meta: { keepAlive: true },
          component: () => import('@/views/setting/object/page/environment')
        }]
      },
      {
        path: 'user',
        name: 'User',
        meta: { title: 'User' },
        component: () => import('@/views/setting/user')
      },
      {
        path: 'addzone',
        name: 'AddZone',
        meta: { title: 'addZone' },
        component: () => import('@/views/setting/zone/add')
      }
    ]
  },

  {
    path: '/group/:id',
    component: Layout,
    redirect: '/dashboard',
    name: 'Group',
    hidden: true,
    meta: { title: '  ' },
    children: [
      {
        path: '',
        name: ' ',
        meta: { title: ' ' },
        props: true,
        redirect: { name: 'groupApi' },
        component: GroupMain,
        children: [
          {
            path: '',
            name: '',
            component: ApiMain,
            redirect: { name: 'groupApi' },
            children: [
              {
                path: 'api',
                name: 'groupApi',
                component: () => import('@/views/group/page/api/apiList')
              },
              {
                path: 'api/list_:listId',
                name: 'groupList',
                component: () => import('@/views/group/page/api/apiList')
              },
              {
                path: 'api/detail_:apiId',
                name: 'groupDetail',
                component: () => import('@/views/group/page/api/apiDetail')
              },
              {
                path: 'api/add',
                name: 'GroupAddApi',
                component: () => import('@/views/group/page/api/add/main')
              },
              {
                path: 'api/update/:apiId',
                name: 'GroupUpdateApi',
                component: () => import('@/views/group/page/api/edit/main')
              },
              {
                path: 'api/category/:categoryId/add',
                name: 'GroupAddApiByCategory',
                component: () => import('@/views/group/page/api/add/main')
              },
              {
                path: 'api/debug_:apiId',
                name: 'groupDebugApi',
                component: () => import('@/views/group/page/api/debug')
              },
              {
                path: 'api/test_:testId',
                name: 'groupTestApi',
                component: () => import('@/views/group/page/api/debug')
              },
              {
                path: 'api/testlist_:testListId',
                name: 'groupTestApiList',
                component: () => import('@/views/group/page/api/testList')
              }
            ]
          },
          {
            path: 'activity',
            name: 'groupActivity',
            component: () => import('@/views/group/page/activity/index')
          },
          {
            path: 'user',
            name: 'groupUser',
            component: () => import('@/views/group/page/user/index')
          },
          {
            path: 'setting',
            name: 'groupSetting',
            component: () => import('@/views/group/page/setting/main')
          },
          {
            path: 'cache',
            name: 'groupCache',
            component: () => import('@/views/group/page/cache/main')
          }
        ]
      }
    ]
  },
  {
    path: '/advancedsettings',
    component: Layout,
    name: 'advancedSettings',
    redirect: { name: 'advSettingIndex' },
    children: [
      {
        path: '',
        name: 'advSetting',
        meta: { title: 'advanced settings' },
        redirect: { name: 'advSettingIndex' },
        component: AdvSettingMain,
        children: [
          {
            path: 'index',
            name: 'advSettingIndex',
            meta: { title: 'index' },
            component: () => import('@/views/advancedSettings/index')
          },
          {
            path: 'secrets',
            name: 'advSettingSecrets',
            meta: { title: 'Secrets' },
            component: () => import('@/views/setting/secrets')
          },
          {
            path: 'app',
            meta: { title: 'App' },
            name: 'App',
            component: AppMain,
            redirect: { name: 'AppList' },
            children: [
              {
                path: 'index',
                name: 'AppList',
                component: () => import('@/views/setting/app/list')
              },
              {
                path: ':env/:appid(\\d+)',
                name: 'AppConfig',
                meta: { title: ' ' },
                component: () => import('@/views/setting/app/config')
              }
            ]
          },
          {
            path: 'wafrules',
            name: 'WafRules',
            meta: { title: '防火墙规则' },
            component: () => import('@/views/setting/filterlist/main')
          },
          {
            path: 'trafficcontrol',
            name: 'trafficControl',
            meta: { title: '流量控制' },
            component: () => import('@/views/setting/trafficControl/main')
          },
          {
            path: 'trafficcontrol/:detailId(\\d+)',
            name: 'trafficControlDetail',
            meta: { title: '流控策略-api列表' },
            component: () => import('@/views/setting/trafficControl/detail')
          }
        ]
      }
    ]
  },

  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  // mode: 'history', // 后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

