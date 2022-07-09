<template>
  <div class="user-greeting">
    <span class="greeting-text">
        <span v-if="name">
            <strong>{{name}}</strong>,
        </span> 
        {{greeting}}
    </span>
  </div>
</template>

<script>

import {toUpperCaseFirstLetter, greetByTime} from '../../services/helpers'

export default {
    setup(){
        return {
            toUpperCaseFirstLetter, greetByTime
        }
    },

    props: {
        name: {
            type: String,
            default: ''
        }
    },

    computed: {
        greeting() {
            if(this.name === ''){
                return this.toUpperCaseFirstLetter(`${this.greetByTime()} 👋`)
            }
            return `${this.greetByTime()} 👋`
        }
    },

}
</script>

<style lang="scss" scoped>
    .greeting-text {
        font-size: 17px;
        font-weight: 500;
    }
</style>