<template>
  <div class="exchange-retes-form form ">
    <div class="form-top">
        <div class="form-top-title title">Курс валют</div>
        <div :class="{'area-disabled': setButtonDisabled}">
            <app-button 
                class="submit-button"
                :class="{'area-disabled': !isFormValid}"
                fontSize="35px"
                @click="makeExchengeRateRequest"
                :active="isFormValid"
                :icon="icons.CurrencyExchangeSharp"
                :flat="true"
            />
        </div>
    </div>
    <div class="form-body body">
        <money-input
            class="body-input"
            label="Значение"
            v-model:value="value"
        />
        <app-select 
            class="body-input"
            label="Дополнительно"
            v-model:value="value" 
            v-model:options="sumOptions"
        />
        <app-select 
            class="body-input"
            label="Выберите валюту"
            v-model:value="from" 
            :options="currencyOptions"
            :disabledOption="to"
        />
        <n-icon
            class="body-arrow-icon body-input"
            :component="icons.KeyboardDoubleArrowDownOutlined"
        />
        <app-select 
            label="Выберите валюту"
            v-model:value="to" 
            :options="currencyOptions"
            :disabledOption="from"
        />
    </div>
    <div class="form-result title" v-show="animationActive">
        <n-number-animation
            :from="0"
            :to="result.value"
            :precision="1"
            :duration="1000"
            :active="animationActive"
            show-separator
        />
        <span>{{result.info}}</span>
    </div>
  </div>
</template>

<script>

import appButton from '../components/btns/appButton.vue'
import moneyInput from '../components/inputs/moneyInput.vue'
import appSelect from '../components/inputs/appSelect.vue'

import useVuelidate from '@vuelidate/core'
import { getExchangeRate } from '../services/exchangeRatesApiWorker/'
import { required } from '@vuelidate/validators'
import { isZero } from '../services/customValidators'

import { NIcon, NNumberAnimation, useLoadingBar, useNotification } from 'naive-ui'
import { CurrencyExchangeSharp, KeyboardDoubleArrowDownOutlined } from '@vicons/material'

const icons = {
  CurrencyExchangeSharp,
  KeyboardDoubleArrowDownOutlined
}


export default {
    components: {
        appButton, 
        moneyInput, 
        appSelect, 
        NIcon,
        NNumberAnimation, 
        icons
    },
    setup(){
        const loadingBar = useLoadingBar()
        const notif = useNotification()
        const v$ = useVuelidate()
        return {
            icons,
            loadingBar,
            notif,
            v$
        }
    },

    data(){
        return {
            value: 'Свое значение',
            to: '',
            from: '',
            currencyOptions: [
                {label: 'UZS', value: 'UZS'},
                {label: 'USD', value: 'USD'},
                {label: 'EUR', value: 'EUR'},
                {label: 'RUB', value: 'RUB'}
            ],
            setButtonDisabled: false,
            result: {
                value: 0,
                info: ''
            },
        }
    },

    validations () {
        return {
            value: { isZero },
            from: { required },
            to: { required }
        }
    },

    computed: {
        sumOptions(){
            const moreThanOneValue = this.$route.params.query.includes('&')
            const result = [{label: 'Свое значение', value: 0}]
            if(moreThanOneValue){
                const options = this.$route.params.query.split('&')
                result.push(
                    {label: 'Итоговая зарплата', value: Number(options[0])},
                    {label: 'Общая зарплата', value: Number(options[1])}
                )
            } else {
                result.push(
                    {label: 'Итоговая зарплата', value: Number(this.$route.params.query)}
                )
            }
            return result
        },

        isFormValid() {
            return !this.v$.$invalid
        },

        animationActive(){
            return this.result.value > 0
        }
    },

    methods: {

        async makeExchengeRateRequest() {
            this.setButtonDisabled = true
            this.loadingBar.start()
            this.result.value = 0
            try {
                const result = await getExchangeRate({
                    from: this.from,
                    to: this.to,
                    amount: this.value
                })
                await this.makeResult(result.data)
                this.loadingBar.finish()
            } catch(e){
                this.loadingBar.error()
                this.notif.error({
                    content: "Что-то пошло не так ☹️",
                    meta: `Код ошибки: ${e.response.status}`,
                    duration: 5000
                })
            } finally {
                this.setButtonDisabled = false
            }
        },

        makeResult(data){
            this.value = 'Свое значение'
            this.result.value = data.result 
            this.result.info = data.query.to
        }
    }
}
</script>

<style lang="scss" scoped>
    .exchange-retes-form  {
        padding: 24px 12px;
        .form-top {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
        }
        .form-body {
            margin-bottom: 30px;
        }
        .form-result {
            font-size: 35px;
            color: $elements;
            span {
                margin-left: 10px;
                color: $text-color;
            }
        }
    }

    .body-input {
        margin-bottom: 15px;
    }

    .body-sum-inputs {
        display: flex;
        justify-content: space-between;
        .sum-input {
            width: 60%;
        }
        .sum-select {
            width: 39%;
            
        }
    }

    .body-arrow-icon {
        font-size: 35px;
        color: $elements;
    }
</style>