<template>
  <div class="app-notify notify" :class="type">
    <div class="notify-icon">
      <n-icon
        class="n-icon"
        :component="notifyIcon"
      />
    </div>
    <div class="notify-text text">
      <div class="text-title">{{ title }}</div>
      <div class="text-subtitle" v-if="subtitle !== ''">{{ subtitle }}</div>
    </div>
  </div>
</template>

<script>

import { NIcon } from 'naive-ui'
import { 
  AlertCircleOutline, 
  InformationCircleOutline, 
  CheckmarkCircleOutline,
  CloseCircleOutline
} from '@vicons/ionicons5'

const icons = {
  AlertCircleOutline,
  InformationCircleOutline,
  CheckmarkCircleOutline,
  CloseCircleOutline
}

export default {
  components: { NIcon, icons },
  setup(){
    return {
      icons
    }
  },
  computed: {
    notifyIcon(){
      switch (this.type){
        case 'info': return icons.InformationCircleOutline
        case 'alert': return icons.AlertCircleOutline
        case 'error': return icons.CloseCircleOutline
        case 'success': return icons.CheckmarkCircleOutline
      }
    },
  },
  
  props: {
    type: {
      type: String,
      default: 'success'
    },

    title: {
      type: String,
      default: ''
    },

    subtitle: {
      type: String,
      default: ''
    },
  },

}
</script>

<style lang="scss" scoped>
  .app-notify {
    position: fixed;
    min-width: 365px;
    right: 12px;
    top: 12px;
    display: flex;
    align-items: center;
    padding: 12px;
    z-index: 999;
    box-shadow: 0 0px 4px $default;
    border-radius: 3px;
    transform: translateX(calc(100% + 12px));
    transition: ease-in-out 0.2s;
    &.show {
      transform: translateX(0%);
    }
    &.alert {
      box-shadow: 0 0px 4px $warn;
      .notify-icon {
        color: $warn;
      }
    }
    &.error {
      box-shadow: 0 0px 4px $negative;
      .notify-icon {
        color: $negative;
      }
    }
    &.success {
      box-shadow: 0 0px 4px $primary;
      .notify-icon {
        color: $primary;
      }
    }
  }

  .notify-icon {
    margin-right: 15px;
    display: flex;
    color: $default;
    .n-icon {
      font-size: 28px;
    }
  }
  .text-title {
    font-size: 16px;
  }

  
</style>