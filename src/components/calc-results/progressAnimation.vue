<template>
    <div class="progress-body progress" v-if="progress > 0">
      <span class="plan-progress-title">{{title}} </span>
      <span class="plan-progress-statistics">
        <n-number-animation
          :from="0"
          :to="progress"
          :active="active"
          :precision="precision"
          :duration="1200"
          show-separator
        />
        <span v-if="isPercent">%</span>
      </span>
    </div>
</template>

<script>
import { NNumberAnimation } from 'naive-ui'

export default {
  components: { NNumberAnimation },
  props: {
    progress: {
      type: Number,
      default: 0
    },
    active: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    isPercent: {
      type: Boolean,
      default: false
    },
    precision: {
      type: Number,
      default: 0
    }
  }
}
</script>

<style lang="scss" scoped>
  .progress-body {
    .plan-progress-title {
      font-size: 18px;
      margin-right: 5px;
    }
    .plan-progress-statistics {
      font-size: 20px;
      font-weight: 500;
      color: $elements;
    }
  }
</style>
