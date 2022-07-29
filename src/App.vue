<template>
<n-notification-provider placement="top-left">
  <div class="wrapper" :class="{mobile : isMobile}">
    <desctop-nav-bar
      v-if="!isMobile && !hideNavBar"
      v-model:show="showNavBar"
    />
    <mobile-nav-bar 
      v-if="isMobile && !hideNavBar"
    />
    
    <q-scroll-area  :style="areaHeight">
      <n-loading-bar-provider>
        <router-view v-slot="{ Component }">
          <transition :name="transitionName">
            <div class="component-wrapper" :class="{desktop: !isMobile, 'hide-nav': hideNavBar}" :style="componentWrapperStyle" :key="$route.path">
              <component :is="Component"/>
            </div>
          </transition>
        </router-view>
      </n-loading-bar-provider>
    </q-scroll-area>
    
  </div>
</n-notification-provider> 

</template>

<script>

import 'vfonts/Inter.css'
import { useQuasar } from 'quasar'
import desctopNavBar from './components/bars/desctopNavBar.vue'
import mobileNavBar from './components/bars/mobileNavBar.vue'
import { NNotificationProvider, NLoadingBarProvider } from 'naive-ui'

export default {
  components: {desctopNavBar, mobileNavBar, NNotificationProvider, NLoadingBarProvider},
  setup(){
    const $q = useQuasar()
    return {
      isMobile: $q.platform.is.mobile,
    }
  },
  data(){
    return {
      transitionName: '',
      showNavBar: false,
    }
  },
  watch:{
    '$route' (to, from){
      const fromIndex = (from.meta.index instanceof Number || typeof from.meta.index === 'number') ? from.meta.index : 0
      const toIndex = to.meta.index
      this.transitionName = toIndex > fromIndex ? 'to-left' : 'to-right'
      this.showNavBar = false
    },
  },

  computed: {
    areaHeight(){
      if(this.isMobile && !this.hideNavBar){
        return 'height: calc(100vh - 80px);'
      } else if(this.isMobile && this.hideNavBar){
        return 'height: 100vh;'
      } else if(!this.isMobile){
        return 'height: 100vh;'
      }
    },
    componentWrapperStyle(){
      if(this.$route.path === '/calculations' || this.$route.path === '/'){
        return this.areaHeight
      }
    },
    hideNavBar(){
      return this.$route.meta.noNav
    }
  },
 

  methods: {
    async showUserRouteByDefinedStatus(){
      await this.$store.commit('check_user_status')
      if(this.$store.state.isRegistered){
        await this.$store.commit('get_user_data')
        this.$router.push('/main')
        return
      }
      this.$router.push('/')
    }
  },

  beforeMount(){
    this.showUserRouteByDefinedStatus()
  }
}

</script>

<style lang="scss">
@import './styles/libs-stytle-correction.scss';

*,
*::before,
*::after {
  padding: 0;
  margin: 0;
  background-color: inherit;
  box-sizing: border-box;
}

body {
  overflow: hidden;
}

input,
select {
  outline: none;
  border: none;
  border-color: inherit;
  color: inherit;
  width: 100%;
  height: 100%;
}

#app {
  font-family: "v-sans";
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: $text-color;
}

.wrapper {
  background-color: $backgroung;
  &.mobile {
    margin-top: 20px;
  }
}

.component-wrapper {
  width: 100%;
  &.desktop {
    width: calc(100% - 10%);
    margin-left: auto;
    &.hide-nav {
      width: 100%;
    }
  }
}

.container {
  padding: 0px 12px;
}

// .component-wrapper {
//   height: 100%;
//   min-height: 100%;
// }

.title {
  font-size: 18px;
  font-weight: 500;
}

.transition {
  transition: ease-in-out 0.2s;
}

.area-disabled {
  opacity: 0.6;
  pointer-events: none;
  transition: ease-in-out 0.2s;
}


.to-left-enter-active,
.to-left-leave-active,
.to-right-enter-active,
.to-right-leave-active {
  transition: ease-in-out 0.2s;
  opacity: 0;
}

.to-left-enter-from,
.to-left-leave-to {
  transform: translateX(-100%);
}

.to-right-enter-from,
.to-right-leave-to {
  transform: translateX(100%);
}

</style>
