<template>
  <button 
    class="app-button button"
    :class="computedClass"
    :style="commutedStyle"
    >
      <span class="button-label">{{label}}</span>
      <n-icon class="button-icon" v-if="icon" :component="icon"/>
  </button>
</template>

<script>

import { NIcon } from 'naive-ui'
export default {
    components: {NIcon},
    props: {
        label: {
            type: String,
            default: ''
        },
        bordered: {
            type: Boolean,
            default: false
        },
        rounded: {
            type: Boolean,
            default: false
        },
        flat: {
            type: Boolean,
            default: false
        },
        active: {
            type: Boolean,
            default: false
        },
        icon: {
            type: Object,
            default: null
        },
        fontSize: {
            type: String,
            default: ''
        },
        noclickanimation: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        computedClass(){
            return {
                bordered: this.bordered, 
                flat: this.flat,
                rounded: this.rounded,
                active: this.active,
                'no-click-animation': this.noclickanimation
            }
        },
        commutedStyle() {
            return {
                fontSize: this.fontSize
            }
        }
    },
}
</script>

<style lang="scss" scoped>
    .app-button {
        padding: 0px 14px;
        height: 34px;
        border-radius: 3px;
        border: none;
        position: relative;
        overflow: hidden;
        cursor: pointer;
        color: $backgroung;
        background-color: $elements;
        display: flex;
        align-items: center;
        text-align: center;
        .button-icon {
            display: flex;
        }
        .button-label {
            width: 100%;
        }
        &.bordered {
            border: 1px solid $elements;
            background-color: $backgroung;
            color: $elements;
        }
        &.flat {
            background-color: transparent;
            color: $default;
            padding: 2px;
            height: unset;
        }
        &.rounded {
            border-radius: 50%;
            overflow: hidden;
        }
        &.active {
            color: $elements;
            
        }
        &.no-click-animation {
            &:focus:not(:active)::after {
                animation: none;
            } 
        }
        &::after {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            width: 5px;
            height: 5px;
            background: rgba(255, 255, 255, .5);
            opacity: 0;
            border-radius: 100%;
            transform: scale(1, 1) translate(-50%);
            transform-origin: 50% 50%;
        }
        &:focus:not(:active)::after {
            animation: ripple 1s ease-out;
        } 
    }
    
    @keyframes ripple {
        0% {
            transform: scale(0, 0);
            opacity: 1;
        }
        20% {
            transform: scale(25, 25);
            opacity: 1;
        }
        100% {
            opacity: 0;
            transform: scale(40, 40);
        }
    }
</style>