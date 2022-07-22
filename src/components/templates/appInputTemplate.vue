<template>
<div 
    :class="computedClass" 
    v-chind-focused="changeFocus"
    ref="app-input"
>
    <div 
        class="app-input-icon" 
        v-if="icon"
    >
        <n-icon
            :component="icon"
        />
    </div>
    <div 
        class="app-input-label"
    >
        {{label}}
    </div>
    <div class="app-input-wrapper" >
        <slot name="input"/>
    </div>
    <modal-window-template
        v-if="isMobile"
        v-model:show="focused"
        :closeOnBlur="true"
    >
        <template v-slot:body>
            <div 
                class="app-input"
                :class="computedClass" 
                v-chind-focused="changeFocus"
            >
                <div 
                    class="app-input-icon" 
                    v-if="icon"
                    >
                    <n-icon
                        :component="icon"
                    />
                </div>
                <div 
                    class="app-input-label"
                >
                    {{label}}
                </div>
                <div class="app-input-wrapper" >
                    <slot name="input"/>
                </div>
            </div> 
        </template>
    </modal-window-template>
</div>
</template>

<script>

import { NIcon } from 'naive-ui'
import { useQuasar } from 'quasar'
import modalWindowTemplate from './modalWindowTemplate.vue'

export default {
    components: { modalWindowTemplate , NIcon },
    setup(){
        const $q = useQuasar()
        return {
            isMobile: $q.platform.is.mobile
        }
    },

    data(){
        return {
            focused: false,
        }
    },

    props: {
        icon: {
            type: Object,
            default: null
        },
        label: {
            type: String,
            default: ''
        },
        flat: {
            type: Boolean,
            default: false,
        },
        hasError: {
            type: Boolean,
            default: false,
        }
    },

    directives: {
        'chind-focused': {
            mounted: (el, binding) => {
                const input = el.querySelector('input')
                const select = el.querySelector('select')
                let childElement = input;
                if(select){
                    childElement = select
                }
                childElement.addEventListener('focus', ()=> binding.value(true))
                childElement.addEventListener('blur', ()=> binding.value(false))
            }
        },
    },

    computed:{
        computedClass(){
            return {
                'has-icon': this.icon, 
                'has-error': this.hasError,
                'app-input': !this.flat,
                'flat-input': this.flat,
                focused:  this.focused,
            }
        },
    },

    methods: {
        changeFocus(bool){
            this.focused = bool
           
        }
    }
}
</script>

<style scoped lang="scss">

.app-input {
    width: 100%;
    height: 34px;
    position: relative;
    display: flex;
    align-items: center;
    border-radius: 3px;
    padding: 0px 12px;
    outline: 1px solid $default;
    transition: ease-in-out 0.2s;
    color: $default;
    .app-input-icon {
        position: absolute;
        right: 10px;
        font-size: 20px;
        display: flex;
    }
    .app-input-label {
        position: absolute;
        top: -12px;
    }
    .app-input-wrapper {
        width: 100%;
        height: 100%;
    }
    &.focused {
        outline-color: $elements;
        box-shadow: $elements-shadow;
        color: inherit;
        .app-input-icon,
        .app-input-label {
            color: $elements;
        }
    }
    &.has-error {
        outline-color: $negative;
        &.focused {
            box-shadow: 0 0px 4px $negative;
        }
        .app-input-icon,
        .app-input-label {
            color: $negative;
        }
    }
}

</style>