<template>
<div class="user-form-wrapper form container">
    <div class="form-top">
        <div class="form-top-title title">Данные пользователя</div>
        <app-button 
            class="submit-button"
            :class="{'area-disabled': valuesUnchanged}"
            :active="!valuesUnchanged"
            @click="validateAndSaveValues" 
            fontSize="35px"
            :icon="icons.SaveOutline"
            :flat="true"
        />
    </div>
    <div class="form-main-inputs inputs-column">
        <text-input
        class="form-input" 
        label="Имя"
        v-model:value="formValues.name"
        :icon="icons.PersonCircleOutline"
        />
        <money-input
        class="form-input"
        label="Оклад"
        v-model:value="formValues.fixedSalary"
        :invalid="v$.formValues.fixedSalary.$dirty && v$.formValues.fixedSalary.$invalid"
        :icon="icons.CashOutline"
        />
        <money-input
        class="form-input"
        label="Процент от продаж"
        v-model:value="formValues.fixedPercenFromSales"
        :invalid="v$.formValues.fixedPercenFromSales.$dirty && v$.formValues.fixedPercenFromSales.$invalid"
        :icon="icons.Percentage"
        :unmasked="true"
        />
        <switch-button
        label="Переменчивый процент "
        v-model:switched="formValues.isPercentFloats"
        >
            <template v-slot:label-slot>
                <app-button 
                :flat="true" 
                :rounded="true"
                :icon="icons.Help"
                fontSize="18px"
                @click="showDescritpion(1)"
                />
            </template>
        </switch-button> 
    </div>
    <div 
        class="form-percent-change-rules-input rules-inputs-column inputs-column transition"
        :class="{'area-disabled': !formValues.isPercentFloats}"
     >  
        <div class="rules-plan-input">
            <money-input
            class="form-input"
            label="План"
            v-model:value="formValues.salesPlan"
            :invalid="v$.formValues.salesPlan.$dirty && v$.formValues.salesPlan.$invalid"
            :icon="icons.PieChartOutline"
            />
            <switch-button
            label="Игнорировать план"
            v-model:switched="formValues.ignorePercentFromPlan"
            >
            <template v-slot:label-slot>
                <app-button 
                :flat="true"
                :rounded="true"
                :icon="icons.Help"
                fontSize="18px"
                @click="showDescritpion(2)"
                />
            </template>
            </switch-button> 
        </div>
            
        <div 
            class="rules-input-list" 
            v-for="(item, index) in formValues.percentChangeRules" :key="index"
        >
            <div class="form-title title">Условие #{{item.id}}</div>
            <money-input
            class="form-input"
            label="Процент выполнения"
            :icon="icons.PinOutline"
            :invalid="v$.formValues.percentChangeRules[index].goal.$dirty && v$.formValues.percentChangeRules[index].goal.$invalid"
            v-model:value="item.goal"
            />
            <money-input
            class="form-input"
            label="Смена процента при выполнении"
            :icon="icons.RefreshOutline"
            :unmasked="true"
            :invalid="v$.formValues.percentChangeRules[index].precentChange.$dirty && v$.formValues.percentChangeRules[index].precentChange.$invalid"
            v-model:value="item.precentChange"
            />
            <money-input
            class="form-input"
            label="Премия при выполнении"
            :icon="icons.CashOutline"
            v-model:value="item.award"
            />
        </div>
        <div class="rules-inputs-buttons">
            <app-button 
                v-if="formValues.percentChangeRules.length > 1"
                @click="removeRule" :bordered="true" label="Удалить"
            />
            <app-button @click="addRule" label="Добавить"/>
        </div>
    </div>
</div>
<description-modal 
    v-model:show="show"
    :title="currentFunctionDecription.title"
    :description="currentFunctionDecription.description"
/>

</template>

<script>

import moneyInput from '../components/inputs/moneyInput.vue'
import textInput from '../components/inputs/textInput.vue'
import switchButton from '../components/btns/switchButton.vue'
import appButton from '../components/btns/appButton.vue'
import descriptionModal from '../components/modal/descriptionModal.vue'

import { useNotification } from 'naive-ui'
import useVuelidate from '@vuelidate/core'
import { minLength, maxLength } from '@vuelidate/validators'
import { isZero } from '../services/customValidators'


import { saveData, getData, getUnparcedData } from '../services/dbRequests/'

import { 
    CashOutline, 
    PersonCircleOutline, 
    PodiumOutline, 
    PieChartOutline,
    RefreshOutline,
    PinOutline,
    Help,
    Close,
    SaveOutline
} from '@vicons/ionicons5'
import { Percentage } from '@vicons/carbon'

const icons = {
    CashOutline, 
    PersonCircleOutline, 
    PodiumOutline, 
    PieChartOutline,
    Percentage,
    RefreshOutline,
    PinOutline,
    Help,
    Close,
    SaveOutline
}


export default {
    emits: ['save-data'],
    components: {
        moneyInput, 
        textInput, 
        switchButton, 
        appButton,
        descriptionModal,
        icons,
    },
    setup(){
        return {
            icons,
            v$: useVuelidate(),
            notif: useNotification() 
        }
    },
    data(){
        return {
            show: false,
            formValues: {
                name: '',
                fixedSalary: 0,
                fixedPercenFromSales: 0,
                salesPlan: 0,
                isPercentFloats: false,
                ignorePercentFromPlan: false,
                percentChangeRules: [
                    {id: 1, goal: 0, precentChange: 0, award: 0, isDone: false},
                ],
            },
            currentFunctionDecription: {},
            functionDecriptionList: [
                {
                    id: 1,
                    title: "Переменчивый процент",
                    description: "Нужен в случае если меняется процент от продаж и выдается премия при достижении определенного процента от плана. Вы можете добавить n'ое количество условий, и приложение будет следить за прогрессом." 
                },
                {
                    id: 2,
                    title: "Игнорирование плана",
                    description: "Приложение не будет считать процент от плана, и начнет считать процент от продаж только после достижения заданных вами условий." 
                }
            ],
            sourceUserData: {},
        }
    },

    validations () {
        return {
            formValues: {
                fixedSalary: { isZero, maxLength: maxLength(12) },
                fixedPercenFromSales: this.computedFixedPercetRules,
                salesPlan: this.computedPlanRules,
                percentChangeRules: this.computedPercentChangeRules
            }
        }
    },


    computed: {
        computedFixedPercetRules(){
            if(this.formValues.isPercentFloats) return {minLength: minLength(1) }
            return { isZero }
        },
        computedPlanRules(){
            if(this.formValues.isPercentFloats) return {isZero, maxLength: maxLength(12)}
            return {minLength: minLength(1)}
        },
        computedPercentChangeRules(){
            const rules = []
            const rule = {}
            this.formValues.percentChangeRules.forEach(item => {
                if(this.formValues.isPercentFloats){
                  rule.goal = { isZero, maxLength: maxLength(3) }
                  rule.precentChange = {isZero}  
                } else {
                    rule.goal = { minLength: minLength(1) }
                    rule.precentChange = {minLength: minLength(1)} 
                }
                rules.push(rule)
            })
            return rules
        },

        valuesUnchanged(){
            return this.sourceUserData === JSON.stringify(this.formValues)
        }
    },

    methods: {
        addRule(){
            let newRule;
            this.formValues.percentChangeRules.map(element => {
                newRule = {
                    id: element.id + 1,
                    goal: 0,
                    precentChange: 0,
                    award: 0,
                    isDone: false,
                }
            });
            this.formValues.percentChangeRules.push(newRule)
        },

        removeRule(){
          if(this.formValues.percentChangeRules.length > 1) this.formValues.percentChangeRules.pop()
        },

        showDescritpion(id){
          this.show = true
          this.currentFunctionDecription = this.functionDecriptionList.find(d => d.id === id)
        },

        async validateAndSaveValues(){
            this.v$.$validate()
            if(!this.v$.$invalid){
              this.v$.$reset()
              if(!this.$store.state.isRegistered){
                await this.saveUserData()  
                this.$router.push('/main')
              } else {
                if(!this.valuesUnchanged){
                    await this.saveUserData()
                    this.notif.success({
                       content: 'Изменения сохранены',
                       meta:'👌',
                       duration: 5000
                    })
                    this.formValues = await getData({target: 'user'})
                    this.sourceUserData = await getUnparcedData({target: 'user'})
                } else {
                   this.notif.warning({
                       content: 'Вы ничего не меняли',
                       meta:'🤨',
                       duration: 5000
                   })
                }
              }
            }
        },

        async saveUserData(){
            await saveData({
                target: 'user',
                payload: this.formValues
            })
            this.$store.state.user = this.formValues
            this.$store.state.isRegistered = true
        },

        async checkUserStatus(){
            if(this.$store.state.isRegistered) {
                this.formValues = await getData({target: 'user'})
                this.sourceUserData = await getUnparcedData({target: 'user'})
                if(this.$route.path === '/register'){
                    this.$router.push('/user-data')
                }
            }
        }
    },

    beforeMount(){
        this.checkUserStatus()
    },
}
</script>

<style lang="scss" scoped>
    .user-form-wrapper {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 24px 12px;
        .form-top {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 20px;
        }
        .form-title {
            text-align: left;
            margin-bottom: 10px;
        }
        
    }
    .inputs-column {
        margin-bottom: 20px;
        .form-input {
            margin-bottom: 15px;
        }    
    }
    .rules-plan-input {
        margin-bottom: 20px;
    }
    .rules-inputs-buttons {
        display: flex;
        justify-content: flex-end;
        button {
            margin: 0px 0px 0px 5px;
        }
    }
    .form-submit-button {
        width: 100%;
        display: flex;
        justify-content: center;
        .submit-button {
            width: 100%;
            max-width: 700px;
        }
    }
    
</style>