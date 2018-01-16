import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import HelloWorld from '@/components/HelloWorld'
import Test from '@/components/Test'
import Task from '@/components/Task'
import Login from '@/components/Login'
import Register from '@/components/Register'
import ShoppingList from '@/components/ShoppingList/ShoppingList'

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Hjem',
      component: Home
    },
    {
      path: '/home',
      name: 'Hjem',
      component: Home
    },
    {
      path: '/Login',
      name: 'Login',
      component: Login
    },
    {
      path: '/Register',
      name: 'Register',
      component: Register
    },
    {
      path: '/HelloWorld',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/Test',
      name: 'Test',
      component: Test
    },
    {
      path: '/Task',
      name: 'Task',
      component: Task
    },
    {
      path: '/ShoppingList',
      name: 'ShoppingList',
      component: ShoppingList
    },
  ]
})
