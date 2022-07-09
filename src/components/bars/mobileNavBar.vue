<template>
  <div class="mobile-nav-bar mobile-nav" >
      <div 
        v-for="route in routes" 
        :key="route"
        class="nav-buttons-item"
        :class="{'item-disabled': $route.path === route.path}"
        >
            <app-button
            :flat="true"
            :rounded="true"
            :icon="icons[route.icon]"
            :active="$route.path === route.path"
            :noclickanimation="true"
            fontSize="35px"
            @click="$router.push(route.path)"
            />
            <span class="item-title">{{route.title}}</span>
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
    }
}
</script>

<style lang="scss" scoped>
    .mobile-nav-bar {
        position: absolute;
        bottom: 0;
        z-index: 999;
        width: 100%;
        display: flex;
        justify-content: space-between;
        padding: 5px 12px;
        .nav-buttons-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            max-width: 70px;
            min-width: 70px;
            &.item-disabled {
               pointer-events: none;
           }
        }
    }

    @media (max-width: 360px){
        .mobile-nav-bar {
            .nav-buttons-item {
                max-width: 60px;
                min-width: 60px;
            }
        }
    }
    
</style>