<template>
  <modal-window-template 
  v-model:show="show"
  :closeOnBlur="true"
  >
    <template v-slot:title>
        <div class="description-title title">    
            {{title}}
        </div>  
    </template>
      
    <template v-slot:body>
        <div class="description-body">
            {{description}}
        </div> 
    </template>
  </modal-window-template>
</template>

<script>

import modalWindowTemplate from '../templates/modalWindowTemplate.vue'
import toggleMixin from '../../mixins/toggleMixin.js'

export default {
    components: {modalWindowTemplate},
    mixins: [toggleMixin],
    props: {
        title: {
            type: String,
            default: ''
        },
        description: {
            type: String,
            default: ''
        },
        show: {
            type: Boolean,
            default: false
        }
    },
    watch: {
        show(){
            if(!this.show) this.closeModal()
        }
    } 
}
</script>

<style lang="scss" scoped>
    .description-title {
        margin-bottom: 5px;
    }
    .description-body {
        font-size: 16px;
    }
</style>