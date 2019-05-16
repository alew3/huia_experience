import Vue from 'vue'
import Router from 'vue-router'
import Home from '../components/Home'
//import Studios from '../components/Studios'
//import StudioDetail from '../components/StudioDetail'
//import Contact from '../components/Contact'
// import Experience from '../components/Experience'
//import Projects from '../components/Projects'
//import ProjectDetail from '../components/ProjectDetail'
//import Clients from '../components/Clients'
//import Admin from '../components/Admin'


Vue.use(Router)

export default new Router({
  mode : 'history',
  routes: [
    {
      path: '/(home)?',
      name: 'Home',
      component: Home
    },
    // {
    //   path: '/projects/',
    //   name: 'Projects',
    //   component: Projects
    // },
    // {
    //   path: '/projects/:slug',
    //   name: 'ProjectDetail',
    //   component: ProjectDetail
    // },
    // {
    //   path: '/about/:slug',
    //   name: 'StudioDetail',
    //   component: StudioDetail
    // },
    // {
    //   path: '/about/',
    //   name: 'Studios',
    //   component: Studios
    // },
    // {
    //   path: '/contact/',
    //   name: 'Contact',
    //   component: Contact
    // },
    // {
    //   path: '/team/',
    //   name: 'Clients',
    //   component: Clients
    // },
    // {
    //   path: '/admin',
    //   name: 'Admin',
    //   component: Admin
    // },
    // {
    //   path: '/experience/',
    //   name: 'Experience',
    //   component: Experience
    // }
  ]
})
