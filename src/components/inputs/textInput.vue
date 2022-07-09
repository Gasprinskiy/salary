<template>
    <app-input-template 
        :label="label"
        :icon="icon"
        :align="align"
        :hasError="invalid"
        :flat="flat"
    >
        <template v-slot:input>
            <input
                type="text" 
                :value="value" 
                @input="updateValue"
                :style="computedStyle"
            >
        </template>
    </app-input-template>
</template>

<script>

import inputPropsMixin from '../../mixins/inputPropsMixin.js'
export default {
    mixins: [inputPropsMixin],
    methods: {
        updateValue(e){
            const value = e.target.value.trim()
            this.$emit('update:value', value)
        }
    }
}
</script>

