const makeRoutes = (store) => {
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') },
      { path: '/login', component: () => import('pages/auth/login') },
      { path: '/register', component: () => import('pages/auth/register') },
      { path: '/about',name:'about', component: () => import('pages/about') },
      { path: '/partner',name:'partner', component: () => import('pages/partner') },
      { path: '/policy',name:'policy', component: () => import('pages/policy') },
      { path: '/rules',name:'rules', component: () => import('pages/rules') }
    ]
  },
  {
    path: '/catalog',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/catalog/index.vue') },
       { path: 'add',name:'add_unit', component: () => import('pages/catalog/add.vue') },
      { path: ':category_slug', component: () => import('pages/catalog/category.vue') },
      { path: ':category_slug/:unit_slug', component: () => import('pages/catalog/unit.vue') },

    ]
  },
  {
    path: '/orders',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name:'all_orders', component: () => import('pages/order/all_orders') },
      { path: 'add', name:'new_order', component: () => import('pages/order/order_add.vue') },
      { path: ':order_slug', name:'order_info', component: () => import('pages/order/order_info.vue') },

    ]
  },
  {
    path: '/profile',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name:'profile_index', component: () => import('pages/profile/index') },
      { path: 'notifications', name:'profile_notifications', component: () => import('pages/profile/notifications') },
      { path: 'chats', name:'profile_chats', component: () => import('pages/profile/chats') },
      { path: 'favorite', name:'profile_favorite', component: () => import('pages/profile/favorite') },
      { path: 'orders', name:'profile_orders', component: () => import('pages/profile/orders') },
      { path: 'applies', name:'profile_applies', component: () => import('pages/profile/applies') },
      { path: 'refferal', name:'profile_refferal', component: () => import('pages/profile/refferal') },
      { path: 'balance', name:'profile_balance', component: () => import('pages/profile/balance') },
       { path: 'applies/:order_slug', name:'profile_apply_info', component: () => import('pages/profile/apply-info') },
      { path: 'orders/:order_slug', name:'profile_order_info', component: () => import('pages/profile/order-info') },
      { path: 'edit/:uuid', name:'profile_edit_unit', component: () => import('pages/profile/edit-unit') },



    ]
  },



  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]
  return routes
}
export default makeRoutes

