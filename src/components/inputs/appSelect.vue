<template>
    <app-input-template 
        v-model:isSelectFocused="focused"
        :label="label"
        :icon="icon"
        :align="align"
        :hasError="invalid"
        :flat="flat"
    >
        <template v-slot:input>
          <input
            class="select-value"
            type="text"
            readonly
            :value="seemValue" 
            :style="computedStyle"
          >
          
          <q-scroll-area :style="{height: optionsHeight}" class="select-options" :class="{show: focused}">
            <input 
              type="text" 
              id="select-option" 
              class="select-option"
              readonly
              :class="{selected: option.value === value, 'disabled-val': disabledOption === option.value}" 
              v-for="option in options"
              :key="option" 
              @click="updateSelectedValue(option)"
              :value="option.label"
            />  
          </q-scroll-area>
        </template>
    </app-input-template>
</template>

<script>

import inputPropsMixin from '../../mixins/inputPropsMixin.js'
export default {
    mixins: [inputPropsMixin],
    props: {
      options: {
        type: Array,
        default: []
      },
      disabledOption: [String, Number]
    },
    data(){
      return {
        focused: false,
        seemValue: this.value
      }
    },

    computed:{
      optionsHeight(){
        if(this.options.length <= 8){
          return 28 * this.options.length + 'px'
        }
        return 28 * 8 + 'px'
      },

      
    },

    methods: {
        updateSelectedValue(item){
            this.seemValue = item.label
            this.$emit('update:value', item.value)
        },

    }
}
</script>

<style lang="scss" scoped>

  .select-value {
    cursor: pointer;
  }

  .select-options {
    width: 100%;
    text-align: left;
    box-shadow: $default-shadow;
    border-radius: 3px;
    position: absolute;
    top: 0;
    left: 0;
    top: 36px;
    gap: 10px;
    opacity: 0;
    visibility: hidden;
    transition: ease-in-out 0.2s;
    z-index: 100;
    &.show {
      opacity: 1;
      visibility: visible;
    }
  }

  .select-option {
    width: 100%;
    height: 28px;
    display: flex;
    align-items: center;
    padding: 0px 12px;
    cursor: pointer;
    transition: ease-in-out 0.2s;
    &:hover,
    &.selected {
      color: $elements;
      background-color: #e6e6e6;
    }
    &.disabled-val {
      opacity: 0.4;
    }
    &.selected,
    &.disabled-val {
      pointer-events: none;
    }
  }
</style>
