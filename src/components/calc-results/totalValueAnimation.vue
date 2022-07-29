<template>
    <div class="total-salary-wrapper total-salary">
        <div class="total-salary-title">
            {{title}}
        </div>
        <div class="total-salary-value salary-value title" :style="{color: valueColor}">
            <div class="salary-value-main" :class="{'align-center': totalValue <= 0}">
              <n-number-animation
                :from="0"
                :to="totalValue"
                :active="active"
                :precision="0"
                :duration="1000"
                show-separator
              />  
            </div>
            
            <div class="salary-value-avans avans" v-if="expense">
                <span class="avans-perfix">-</span>
                <n-number-animation
                    :from="0"
                    :to="expense"
                    :active="active"
                    :precision="0"
                    :duration="1200"
                    show-separator
                />
            </div>
        </div>
    </div>
</template>

<script>

import { NNumberAnimation } from 'naive-ui'

export default {
    components: {NNumberAnimation},
    props: {
        totalValue: {
            type: Number,
            default: 0
        },
        title: {
            type: String,
            default: ''
        },
        valueColor: {
            type: String,
            default: ''
        },
        expense: {
            type: Number,
            default: 0
        },
        active: {
            type: Boolean,
            default: false
        }
    }
}
</script>

<style lang="scss" scoped>
    .total-salary-wrapper  {
        text-align: left;
        .align-center {
            text-align: center;
        }
    }
    .total-salary-value {
        font-size: 38px;
        line-height: 40px;
        .salary-value-avans {
            font-size: 18px;
            text-align: right;
            line-height: 25px;
            color: $negative;
        }
    }
</style>