<template>
  <div class="desctop-nav-bar desc-nav" >
    <div class="desc-nav-buttons nav-buttons">
        <div 
        v-for="route in routes" 
        :key="route"
        class="nav-buttons-item item"
        :class="{'item-disabled': $route.path === route.path}"
        @click="$router.push(route.path)"
        >
            <app-button
            class="item-button"
            :flat="true"
            :rounded="true"
            :icon="icons[route.icon]"
            :active="$route.path === route.path"
            fontSize="35px"
            />
            <span class="item-title">{{route.title}}</span>
        </div>
      </div>  
  </div>
</template>

<script>

import navBarMixin from '../../mixins/navBarMixin.js'
import { 
    CalculatorOutline, 
    CaretBack,
    PersonCircleOutline,
    ArchiveOutline,
    HomeOutline,
    CashOutline   
} from '@vicons/ionicons5'

const icons = {
    CalculatorOutline,
    CaretBack,
    PersonCircleOutline,
    ArchiveOutline,
    HomeOutline,
    CashOutline 
}

export default {
    mixins: [navBarMixin],
    setup(){
        return {
            icons
        }
    },
    props: {
        show: {
            type: Boolean,
            default: false
        }
    },
}
</script>

<style lang="scss" scoped>
    .desctop-nav-bar {
        width: 10%;
        position: absolute;
        left: 0px;
        top: 5px;
        z-index: 999;
        background-color: transparent;
        display: flex;
    }
    .desc-nav-activate-btn {
        width: 28px;
        height: 30px;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: $backgroung;
        border-top-left-radius: 3px;
        border-bottom-left-radius: 3px;
        button {
            transition: ease-in-out 0.2s; 
        }
    }
    .desc-nav-buttons {
       height: 100vh;
       width: 100%;
       background-color: $backgroung;
       margin-top: -12px;
       padding: 15px;
       .nav-buttons-item {
           display: flex;
           align-items: center;
           margin-bottom: 10px;
           cursor: pointer;
           &.item-disabled {
               pointer-events: none;
           }
           
           .item-title {
               background: transparent;
               line-height: 15px;
               font-size: 14px;
            //    font-weight: 500;
           }
           .item-button {
               margin: 4px;
           }
       }
    }
</style>