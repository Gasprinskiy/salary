<template>
    <div class="modal-window-wrapper" @click="closeBlur"  :class="{show: show}">  
        <div class="modal-window-container" 
            :style="{'max-width': maxWidth, 'padding': padding}" 
            @click.stop >
            <app-button 
                v-if="xbtn" 
                @click="closeModal" 
                class="modal-window-close-btn" 
                :icon="Close"
            />
            <slot name="title"/>
            <slot name="body"/>
        </div>
    </div> 
</template>

<script>

import toggleMixin from '../../mixins/toggleMixin.js'
import appButton from '../btns/appButton.vue'
import { Close } from '@vicons/ionicons5'

export default {
    mixins: [toggleMixin],
    components: {appButton, Close},
    setup(){
        return { Close }
    },
    props: {
        maxWidth: {
            type: String,
            default: '400px'
        },
        padding: {
            type: String,
            default: '20px'
        },
        closeOnBlur: {
            type: Boolean,
            default: false
        },
        xbtn: {
            type: Boolean,
            default: false
        }
    },

    methods: {
        closeBlur(){
            if(this.closeOnBlur) this.closeModal()
        }
    }
}
</script>

<style lang="scss" scoped>
    .modal-window-wrapper {
        width: 100%;
        height: 100vh;
        position: fixed;
        background-color: rgba(0, 0, 0, 0.493);
        opacity: 0;
        visibility: hidden;
        display: flex;
        z-index: 1001;
        top: 0;
        left: 0;
        transition: ease-in-out 0.2s;
        padding: 0px 10px;
        &.show {
            opacity: 1;
            visibility: visible;
        }
        .modal-window-container {
            width: 100%;
            background-color: $backgroung;
            margin: auto;
            position: relative;
            border-radius: 3px;
            &.padding-zero {
                padding: 0;
            }
            .modal-window-close-btn {
                position: absolute;
                right: 0;
                top: 0;
                &::before {
                    box-shadow: none;
                }
            }
        }
    }
</style>