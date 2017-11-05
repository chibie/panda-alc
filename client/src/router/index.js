import Vue from 'vue'
import Router from 'vue-router'
import StudentList from '@/components/StudentList'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/students',
      name: 'Students',
      component: StudentList
    }
  ]
})
