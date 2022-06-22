<template>
  <modal-window-template 
  v-model:show="show"
  >
    <template v-slot:title>
        <div class="confirm-title">    
            {{title}}
        </div>  
    </template>
      
    <template v-slot:body>
        <div class="confirm-buttons">
            <app-button
                class="confirm-button"
                :label="canceleLabel"
                @click="closeModal"
                :bordered="true"
            />
            <app-button
                class="confirm-button"
                label="Ок"
                @click="emitConfirmAndCloseModal"
            />
        </div> 
    </template>
  </modal-window-template>
</template>

<script>

import modalWindowTemplate from '../templates/modalWindowTemplate.vue'
import appButton from '../btns/appButton.vue'
import toggleMixin from '../../mixins/toggleMixin.js'

export default {
    components: {modalWindowTemplate, appButton},
    mixins: [toggleMixin],
    emits: ['confirm'],
    props: {
        title: {
            type: String,
            default: ''
        },
        show: {
            type: Boolean,
            default: false
        },
        canceleLabel: {
            type: String,
            default: ''
        }
    },
    methods: {
        emitConfirmAndCloseModal(){
            this.$emit('confirm')
            this.closeModal()
        }
    }
}
</script>

<style lang="scss" scoped>
    .confirm-title {
        margin-bottom: 15px;
        font-weight: 500;
        font-size: 16px;
    }
    .confirm-buttons {
        display: flex;
        justify-content: flex-end;
        .confirm-button {
            margin: 0px 10px;
            min-width: 60px;
        }
    }
</style>