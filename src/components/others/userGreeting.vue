<template>
  <div class="user-greeting">
    <span class="greeting-text" v-if="name !== ''"><strong>{{name}}</strong>, {{greeting}}</span>
    <span class="greeting-text" v-if="name === ''" >{{toUpperCaseFirstLetter(greeting)}}</span>
  </div>
</template>

<script>

import {toUpperCaseFirstLetter} from '../../services/helpers'

export default {
    setup(){
        return {
            toUpperCaseFirstLetter
        }
    },
    data(){
        return {
            greeting: '',
            hours: new Date().getHours()
        }
    },
    props: {
        name: {
            type: String,
            default: ''
        }
    },

    watch: {
        hours() {
            this.greeting = `${this.greetByTime()} 👋`
        }
    },

    methods: {
        greetByTime(){
            if(this.hours >= 6 && this.hours <= 11){
                return 'доброе утро'
            } else if(this.hours > 11 && this.hours <= 16){
                return 'добрый день'
            } else if(this.hours > 16 && this.hours <= 22){
                return 'добрый вечер'
            } else if(this.hours > 22 || this.hours < 6){
                return 'доброй ночи'
            } 
        }
    },

    mounted(){
        this.greeting = `${this.greetByTime()} 👋`
    }
}
</script>

<style lang="scss" scoped>
    .greeting-text {
        font-size: 17px;
        font-weight: 500;
    }
</style>