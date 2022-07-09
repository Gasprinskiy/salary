<template>
  <div class="calculations-title title">
      Расчеты
  </div>
  <div class="calculations-wrapper">
      <div class="calculations-input">
          <money-input
          label="Значение" 
          v-model:value="calculationsValue"
          :invalid="isValueValid"
          />
      </div>
      <div class="calculations-buttons">
        <div class="calculations-buttons-item buttons-item" v-for="item in operations" :key="item">
            <app-button
                class="calculations-button"
                :class="item.operation"
                @click="addAndSave(item.operation)"
                :icon="icons[item.icon]"
                :rounded="true"
                :bordered="true"
                :flat="true"
                fontSize="45px"
            />
            <div class="buttons-item-title" :class="item.operation">{{item.label}}</div>
        </div>
      </div>
  </div>
</template>

<script>

import appButton from '../components/btns/appButton.vue'
import moneyInput from '../components/inputs/moneyInput.vue'


import useVuelidate from '@vuelidate/core'
import { isZero } from '../services/customValidators'
import { useNotification } from 'naive-ui'
import { saveData } from '../services/dbRequests'
import { formatNumber } from '../services/helpers'
import { AddOutline, RemoveOutline, RefreshOutline, 
ListCircle} from '@vicons/ionicons5'

const icons = {
    AddOutline, 
    RefreshOutline,
    RemoveOutline,
    ListCircle
}

export default {
    components: {
        appButton, 
        moneyInput, 
        icons
    },
    setup() {
        return {
            icons,
            v$: useVuelidate(),
            notif: useNotification()
        }
    },
    data(){
        return {
            calculationsValue: 0,
            operations: [
                {label: 'Продажа', operation: 'sales', icon: 'AddOutline'},
                {label: 'Доход', operation: 'income', icon: 'AddOutline'},
                {label: 'Аванс', operation: 'expense', icon: 'RemoveOutline'},
            ]
        }
    },

    computed: {
        isValueValid(){
            return this.v$.calculationsValue.$dirty && this.v$.calculationsValue.$invalid
        }
    },

    validations () {
        return {
            calculationsValue: {isZero},
        }
    },

    methods: {
        async add(target){
            const payload = {
                no: this.$store.state[target].length + 1,
                value: this.calculationsValue
            }
            await this.$store.commit('sync_new_values', {
                value: payload,
                placement: target
            })
            this.notif.success({
                content: this.defineNotificationTitle(target),
                meta: `Сумма: ${formatNumber(this.calculationsValue)}`,
                duration: 5000
            })
            this.calculationsValue = 0
        },

        defineNotificationTitle(word){
            switch(word){
                case 'sales': return 'Продажа добавлена'
                case 'income': return 'Доход добавлен'
                case 'expense': return 'Аванс снят'
            }
        },

        async addAndSave(target){
            this.v$.$validate()
            if(!this.v$.$invalid){
              this.v$.$reset()
              await this.add(target)
            }  
        },
    },

}
</script>

<style lang="scss" scoped>
    .calculations-title {
        width: 100%;
        text-align: left;
        padding: 24px 12px;
    }
    .calculations-wrapper {
        height: 85%;
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        // align-items: center;
        padding: 12px;
    }
    .calculations-input {
        margin-bottom: 20px;
    }
    .calculations-buttons {
        display: flex;
        width: 100%;
        margin: 0 auto;
        max-width: calc(150px + 35px);
        justify-content: center;
        flex-wrap: wrap;
        .calculations-buttons-item {
            min-width: 70px;
            max-width: 70px;
            display: flex;
            flex-direction: column;
            align-items: center;
            margin: 10px;
            .buttons-item-title {
                color: $elements;
                font-weight: 500;
                word-wrap: break-word;
                &.income {
                    color: $default;
                }
                &.expense {
                    color: $negative;
                }
                &.reset {
                    color: $warn;
                }
            }
        }
        .calculations-button {
            border-color: $elements;
            color: $elements;
            margin-bottom: 5px;
            &.income {
                border-color: $default;
                color: $default;
            }
            &.expense {
                border-color: $negative;
                color: $negative;
            }
            &.reset {
                border-color: $warn;
                color: $warn;
            }
        }
        .add-expense-button {
            background-color: $negative;
        }
        .add-additional-income-button {
            background-color: $elements;
        }
        .refresh-button {
            background-color: $warn;
            margin-top: 25px;
        }
    }


</style>