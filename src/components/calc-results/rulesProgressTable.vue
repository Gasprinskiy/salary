<template>
    <div class="rules-progress-list progress-list" v-if="rules.length > 0">
        <q-markup-table separator="cell">
            <thead>
                <tr>
                    <th colspan="5">
                        <div class="title text-left">Условия смены процента</div>
                    </th>
                </tr>
                
            </thead>
            <tbody>
                <tr class="table-tr" v-for="rule in rules" :key="rule.id">
                    <td class="text-left">
                        <span class="table-text">Процент от продаж = <span>{{rule.precentChange}}%</span></span> <br>
                        <span class="table-text">При прогрессе <span>{{rule.goal}}%</span> </span><br>
                        <span v-if="rule.award" class="table-text">
                            Премия:
                            <span>
                                <input
                                class="table-award-value"
                                type="tel"
                                v-money="config"
                                :value="rule.award"
                                readonly
                                >
                            </span>
                        </span> 
                    </td>
                    <td>
                        <span 
                         class="table-rule-progress" 
                         :class="{done: rule.isDone}" 
                         >
                            {{status(rule.isDone)}}
                        </span>
                    </td>
                </tr>
            </tbody>
        </q-markup-table>
    </div>
</template>

<script>
export default {
    props: {
        rules: {
            type: Array,
            default: []
        }
    },
    methods: {
        status(bool){
            const message = bool ? 'выполнен' : 'выполняется'
            return message
        }
    },
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
}
</script>

<style lang="scss" scoped>
    .table-text {
        font-size: 14px;
        span {
            color: $elements;
            font-weight: 500;
        }
    }
    .table-rule-progress {
        color: $backgroung;
        background-color: $default;
        padding: 3px;
        border-radius: 3px;
        &.done {
            background-color: $elements;
        }
    }
    .table-award-value {
        height: unset;
    }
</style>