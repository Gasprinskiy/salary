<template>
  <div v-if="record.length > 0">
        <q-markup-table separator="cell">
            <thead>
                <tr>
                    <th colspan="5">
                        <div class="table-title title text-left">
                            <span class="title">{{title}}</span> 
                            <span class="total" :class="{expense: isExpense}">
                              <span v-if="isExpense">-</span>
                              <n-number-animation
                                v-if="total"
                                :from="0"
                                :to="total"
                                :active="true"
                                :precision="0"
                                :duration="1000"
                                show-separator
                              />  
                            </span>
                            
                        </div>
                    </th>
                </tr>
                <tr>
                    <th>№</th>
                    <th>Значение</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in record" :key="item.no">
                    <td class="sales-td-no">
                      {{item.no}}
                    </td>
                    <td class="sales-td-value" :class="{'read-only': readonly}">
                        <money-input
                            class="table-value"
                            v-model:value="item.value"
                            align="center"
                            :flat="true"
                        />
                    </td>
                </tr>
            </tbody>
        </q-markup-table>
    </div>
</template>

<script>

import moneyInput from '../inputs/moneyInput.vue'
import { NNumberAnimation } from 'naive-ui'

export default {
    components: { NNumberAnimation, moneyInput },
    data(){
        return {
            config: {
                prefix: '',
                suffix: '',
                thousands: ' ',
                decimal: ' ',
                precision: 0,
                disableNegative: false,
                disabled: false,
                allowBlank: false,
                minimumNumberOfCharacters: 0,
            },
        }
    },
    props: {
        record: {
            type: Array,
            defalult: []
        },
        total: {
            type: Number,
            default: 0
        },
        title: {
            type: String,
            default: ''
        },
        readonly: {
            type: Boolean,
            default: false
        },
        isExpense: {
            type: Boolean,
            default: false
        },
    },

    methods: {
        updateValue(e){
            const dataNo = Number(e.target.dataset.no)
            const uIndex = this.record.findIndex(item => item.no === dataNo)
            this.record[uIndex].value = Number(e.target.value.replace(/\s/g, ''))
            this.$emit('update:record', this.sales)
        }
    },
}
</script>

<style lang="scss" scoped>
    .table-title {
        .title {
            margin-right: 5px;
        }
        .total {
            color: $elements;
            &.expense {
                color: $negative;
            }
        }
    }
    .sales-td-no {
        width: 40%;
    }
    .sales-td-value {
        text-align: center;
        font-weight: 500;
        color: $elements;
    }
    .read-only {
        pointer-events: none;
    }
</style>