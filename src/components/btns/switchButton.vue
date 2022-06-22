<template>
<div class="switch-button-wrapper">
    <div 
        class="switch-button" 
        :class="computedClass"
        @click="$emit('update:switched', switched = !switched)"
        >
        <div 
        class="switch-button-slider"
        />
    </div>
    <div 
     class="switch-button-label label"
    >
        <span class="label-text">
            {{label}}
        </span>
        <span class="label-slot">
            <slot name="label-slot"/>
        </span> 
    </div>
</div>
    
</template>

<script>
export default {
    props: {
        switched: {
            type: Boolean,
            default: false
        },
        label: {
            type: String,
            default: ''
        }
    },
    computed: {
        computedClass(){
            return {switched: this.switched}
        }
    },
}
</script>

<style lang="scss" scoped>
    .switch-button-wrapper {
        display: flex;
        align-items: center;
        height: 34px;
        .switch-button-label {
            color: $default;
            margin-left: 5px;
            display: flex;
            align-items: center;
        }
    }
    .switch-button {
        width: 40px;
        height: 22px;
        border-radius: 12px;
        padding: 0px 2px;
        display: flex;
        align-items: center;
        position: relative;
        cursor: pointer;
        transition: ease-in-out 0.3s;
        background-color: $default;
        .switch-button-slider {
            width: 18px;
            height: 18px;
            border-radius: 50%;
            background-color: $backgroung;
            transition: ease-in-out 0.2s;
        }
        &.switched {
            background-color: $elements;
            box-shadow: $elements-shadow;
            transition: ease-in-out 0.3s;
            .switch-button-slider {
              transition: ease-in-out 0.2s;
              transform: translateX(100%);  
            }  
        }
    }
</style>