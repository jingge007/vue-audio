import Vue from 'vue'
import Router from 'vue-router'
import audio from '@/components/vue-audio'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'audio',
      component: audio
    }
  ]
})
