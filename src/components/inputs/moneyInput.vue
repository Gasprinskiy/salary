<template>
    <app-input-template 
        :label="label"
        :icon="icon"
        :hasError="invalid"
        :flat="flat"
        :align="align"
    >
        <template v-slot:input>
            <input
                type="tel"
                v-money="config"
                :value="value"
                @input="bringValueToNumAndEmitUpdate"
                @blur="emitItemChange"
                v-if="!unmasked"
                :style="computedStyle"
            >
            <input
                type="tel"
                :value="value"
                @input="checkForSymbolsAndBringToNum"
                v-if="unmasked"
                :style="computedStyle"
            >
        </template>
    </app-input-template>
</template>

<script>

import inputPropsMixin from '../../mixins/inputPropsMixin.js'

export default {
    mixins: [inputPropsMixin],
    props: {
        unmasked: {
            type: Boolean,
            default: false
        }
    },
    data(){
        return {
            config: {
                thousands: ' ',
                precision: 0,
            },
        }
    },
    
    methods: {
        checkForSymbolsAndBringToNum(e){
            const value = e.target.value
            if(isNaN(value)){
                e.target.value = 0
            } else {
                this.bringValueToNumAndEmitUpdate(e)
            }
        },

        bringValueToNumAndEmitUpdate(e){
            const value = Number(e.target.value.replace(/\s/g, ''))
            this.$emit('update:value', value)
            // this.emitItemChange()
        },

        emitItemChange(){
            if(this.itemId > 0){
                this.$emit('report-change')
            }
        }
    },

}
</script>
