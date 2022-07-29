<template>
  <div class="records-wrapper archive container">
    <div class="records-top">
        <div class="records-top-title title">Отчет ({{periodName}})</div>
        <div class="records-top-buttons transition"  :class="{'area-disabled': valuesEmpty}" v-if="isRedactible">
          <app-button 
            class="records-button"
            :class="{'area-disabled': valuesUnchenged}"
            :active="!valuesUnchenged"
            :icon="icons.SaveOutline"
            :flat="true"
            fontSize="35px"
            @click="updateData"
          />
          <app-button 
            class="records-button"
            fontSize="35px"
            :icon="icons.RefreshOutline"
            :active="!valuesEmpty"
            :flat="true"
            @click="openResetWindowIfValuesNotEmpty"
          />
        </div>
    </div>
    <div class="records-body">
      <div class="body-total-salary" v-if="!valuesEmpty">
        <total-salary-animation
          title="Общая зарплата"
          :totalValue="totalSalary"
          :active="true"
        />
      </div>
      
      <div class="record-table" v-for="(item, key) in values" :key="key">
        <record-table
          :title="`${item.name}:`" 
          :record="item.value"
          :recordKey="key"
          :total="computedTotal[key]"
          :readonly="!isRedactible"
          :isExpense="item.expense"
          @on-report="saveChangedValues"
        />
      </div>
      <n-empty
        class="records-empty"
        v-if="valuesEmpty" 
        description="Данные для отчета не найдены"
      />
    </div>
  </div>
  <modal-window-template 
    v-model:show="showConfirmModal"
    :closeOnBlur="true"
  >
    <template v-slot:title>
      <div class="reset-modal-title title">    
        Сброс данных
      </div>  
    </template>
    <template v-slot:body>
      <div class="reset-modal-body reset-body">
        <div class="reset-body-input transition" :class="{'area-disabled': resetAndRemoveData}">
          <text-input
            label="Название"
            v-model:value="archiveName"
          /> 
        </div>
        <div class="reset-body-switch-buttons">
          <switch-button
            label="Сохранить сброшенные данные"
            v-model:switched="resetAndSaveData"
          />
          <switch-button
            label="Удалить данные безвозвратно"
            v-model:switched="resetAndRemoveData"
          />  
        </div>
        <div class="reset-body-button">
          <app-button
            class="confirm-button"
            label="Сбросить"
            @click="reset"
          />
        </div>
      </div> 
    </template>
  </modal-window-template>
</template>

<script>

import recordTable from '../components/calc-results/recordsTabel.vue'
import appButton from '../components/btns/appButton.vue'
import modalWindowTemplate from '../components/templates/modalWindowTemplate.vue'
import textInput from '../components/inputs/textInput.vue'
import switchButton from '../components/btns/switchButton.vue'
import totalSalaryAnimation from '../components/calc-results/totalValueAnimation.vue'
import { NEmpty } from 'naive-ui'

import { core } from '../core'
import { getDbTotalCountWhereTargetEqualsOptions, getDbDataWhereOptionIsUqual, getData } from '../services/dbRequests'
import { lastMonth, makeUniq, makeItemTitle } from '../services/helpers'
import { useNotification } from 'naive-ui'
import { SaveOutline, RefreshOutline } from '@vicons/ionicons5'

const icons = {
  SaveOutline,
  RefreshOutline
}

export default {
  components: { 
    recordTable, 
    appButton, 
    textInput, 
    switchButton, 
    modalWindowTemplate,
    totalSalaryAnimation,
    NEmpty,
    icons  
  },
  setup() {
    return {
      notif: useNotification(),
      icons
    }
  },
  data(){
    return {
      showConfirmModal: false,
      periodName: 'текущий',
      resetAndSaveData: true,
      resetAndRemoveData: false,
      archiveName: '',
      archiveCount: '',
      values: {
        sales: {
          name: 'Продажи',
          value: []
        },
        income: {
          name: 'Доход',
          value: []
        },
        expense: {
          name: 'Аванс',
          value: [],
          expense: true
        },
      },
      changedValues: {
        sales: [],
        income: [],
        expense: [],
      },
      stringfiedValues: ''
    }
  },

  watch: {
    resetAndSaveData(val){
        if(val){
          this.resetAndRemoveData = false
          return
        }
        this.resetAndRemoveData = true 
      },

    resetAndRemoveData(val){
      if(val){
        this.resetAndSaveData = false
        return
      }
      this.resetAndSaveData = true 
    },
  },

  computed: {
    isRedactible(){
      if(this.$route.params.period === 'current-month'){
        return true
      }
      return false
    },

    valuesEmpty(){
      return this.values.sales.value.length <= 0 && this.values.expense.value.length <= 0 && this.values.income.value.length <= 0
    },

    valuesUnchenged(){
      return this.stringfiedValues === JSON.stringify(this.values)
    },

    totalSales(){
      return core.calcTotal({
        array: this.values.sales.value,
        target: 'value'
      })
    },

    totalIncome(){
      return core.calcTotal({
        array: this.values.income.value,
        target: 'value'
      })
    },

    totalExpense(){
      return core.calcTotal({
        array: this.values.expense.value,
        target: 'value'
      })
    },

    totalSalary(){
      const awardResult = core.getAwardIfPrecentFromPlanReached({
        salesArray: this.values.sales.value, 
        plan: this.$store.state.user.salesPlan,
        percentChangeRules: this.$store.state.user.percentChangeRules
      })
      let reached = {
        award: 0,
        percent: this.$store.state.user.fixedPercenFromSales
      }
      if(!awardResult.empty) {
        console.log(awardResult);
        reached.award = awardResult.award;
        reached.percent = awardResult.reachedPercent
      }
      const salaryResult = core.calcTotalSalary({
        calcOptions: {
          salesArray: this.values.sales.value,
          fixedPercenFromSales: reached.percent,
          fixedSalary: this.$store.state.user.fixedSalary,
          avans: 0,
          plan: this.$store.state.user.salesPlan, 
        },
        ignorePlan: this.$store.state.user.ignorePercentFromPlan
      })
      return reached.award + salaryResult.total 
    },

    computedTotal(){
      return {
        sales: this.totalSales,
        income: this.totalIncome,
        expense: this.totalExpense,
      }
    },
  },

  methods: {
    saveChangedValues(key, changedVal){
      const values = JSON.parse(this.stringfiedValues)[key].value
      .filter(item => item.no === changedVal.no)
      .find(item => item.value !== changedVal.value)
      if(values){
        const newValue = this.values[key].value.find(item => item.no === values.no)
        this.changedValues[key].push(newValue)
        this.changedValues[key] = makeUniq(this.changedValues[key])
      } else {
        this.changedValues[key] = []
      }
    },

  
    openResetWindowIfValuesNotEmpty(){
      if(!this.valuesEmpty){
        this.showConfirmModal = true
      } else {
        this.notif.warning({
          content: 'Нет данных',
          meta:'🤨',
          duration: 5000
        })
      }
    },

    async saveDataToArchive(){
      this.archiveCount = await this.getArchiveNameCount(this.archiveName)
      const payload = {
        no: this.archiveCount + 1,
        name: this.archiveName,
        sales: this.values.sales.value,
        income: this.values.income.value,
        expense: this.values.expense.value,
        totalSalary: this.totalSalary,
        totalSales: this.totalSales
      }
      await this.$store.commit('sync_new_values', {
        value: payload,
        placement: 'archive'
      })
    },

    async reset(){
      if(this.resetAndSaveData){
        await this.saveDataToArchive()
      }    
      await Object.keys(this.values).forEach(key => {
        this.values[key].value.forEach(item => {
          this.$store.commit('sync_new_values', {
            value: item,
            placement: key,
            remove: true
          })
        })
        this.values[key].value = []
        this.stringfiedValues = JSON.stringify(this.values)
      })
      this.notif.success({
        content: 'Данные сброшены',
        meta:'👌',
        duration: 5000
      })
      this.showConfirmModal = false
    },

    async updateData(){
      if(!this.valuesEmpty){
        console.log(this.changedValues);
        await Object.keys(this.changedValues).forEach(key => {
          if(this.changedValues[key].length > 0){
            this.changedValues[key].forEach(item => {
              this.$store.commit('sync_new_values', {
                value: item,
                placement: key
              })
            })
          }
        })
        this.stringfiedValues = JSON.stringify(this.values)
        this.notif.success({
          content: 'Данные сохранены',
          meta:'👌',
          duration: 5000
        })
      } else {
        this.notif.warning({
          content: 'Нет данных',
          meta:'🤨',
          duration: 5000
        })
      }
    },

    async getArchiveNameCount(equals){
      const count = await getDbTotalCountWhereTargetEqualsOptions({
        target: 'archive', 
        options: {
          where: 'name',
          equals: equals
        }
      })
      return count
    },

    async getValuesByRouteParams(){
      if(this.isRedactible){
        await Object.keys(this.values).forEach(key => {
          getData({target: key})
            .then(data => {
              this.values[key].value = data
              this.stringfiedValues = JSON.stringify(this.values)
            })
        })
        this.archiveName = lastMonth()
      } else {
        const archivePeriod = this.$route.params.period.split('&')
        this.periodName = makeItemTitle(archivePeriod[0], archivePeriod[1])
        const archive = await getDbDataWhereOptionIsUqual({
          target: 'archive', 
          where: {name: archivePeriod[0], no: Number(archivePeriod[1])},
        })
        Object.keys(this.values).forEach(key => {
          this.values[key].value = archive[key]
        })
      }
    },
  },

  beforeMount(){
    this.getValuesByRouteParams()
  }
}
</script>

<style lang="scss" scoped>
  .records-wrapper {
    padding: 24px 12px;
    .records-top {
      display: flex;
      justify-content: space-between;
      .records-top-title {
        text-align: left;
      }
    }
    .records-top-buttons {
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-end;
      width: 40%;
      flex-grow: 1;
      .records-button {
        margin: 0px 0px 0px 5px;
      }
    }
    .body-total-salary {
      display: flex;
      justify-content: center;
      padding: 5px;
    }
    .record-table {
      margin: 15px 0;
    }
    .records-empty {
      margin: 50px 0px;
    }
  }
  .reset-modal-title {
      margin-bottom: 15px;
  }
  .reset-body-input {
    margin-bottom: 5px;
  }
  .reset-body-switch-buttons {
    margin-bottom: 10px;
  }

  .reset-body-button {
    display: flex;
    justify-content: flex-end;
  }
</style>