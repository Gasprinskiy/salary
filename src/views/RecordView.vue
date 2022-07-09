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
      <record-table
        class="record-table"
        title="Продажи:" 
        :record="values.sales"
        :total="totalSales"
        :readonly="!isRedactible"
      />
      <record-table
        class="record-table"
        title="Доп. доход:" 
        :record="values.income"
        :total="totalIncome"
        :readonly="!isRedactible"
      />
      <record-table
        class="record-table"
        title="Аванс:" 
        :record="values.expense"
        :total="totalExpense"
        :isExpense="true"
        :readonly="!isRedactible"
      />
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
import { NEmpty } from 'naive-ui'

import { core } from '../core'
import { saveData, getData } from '../services/dbRequests'
import { lastMonth } from '../services/helpers'
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
      archiveName: '',
      periodName: 'текущий',
      resetAndSaveData: true,
      resetAndRemoveData: false,
      values: {
        sales: [],
        income: [],
        expense: []
      },
      sourceTotal: {}
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
      return this.values.sales.length <= 0 && this.values.expense.length <= 0 && this.values.income.length <= 0
    },

    valuesUnchenged(){
      return JSON.stringify(this.sourceTotal) === JSON.stringify(this.computedTotal)
    },

    totalSales(){
      return core.calcTotal({
        array: this.values.sales,
        target: 'value'
      })
    },

    totalIncome(){
      return core.calcTotal({
        array: this.values.income,
        target: 'value'
      })
    },

    totalExpense(){
      return core.calcTotal({
        array: this.values.expense,
        target: 'value'
      })
    },

    totalSalary(){
      const awardResult = core.getAwardIfPrecentFromPlanReached({
        salesArray: this.$store.state.sales, 
        plan: this.$store.state.user.salesPlan,
        percentChangeRules: this.$store.state.user.percentChangeRules
      })
      let award = 0;
      if(!awardResult.empty) {
        award += awardResult.award
      }
      const salaryResult = core.calcTotalSalary({
        calcOptions: {
          salesArray: this.$store.state.sales,
          fixedPercenFromSales: this.$store.state.user.fixedPercenFromSales,
          fixedSalary: this.$store.state.user.fixedSalary,
          avans: 0,
          plan: this.$store.state.user.salesPlan, 
        },
        ignorePlan: this.$store.state.user.ignorePercentFromPlan
      })
      return award + salaryResult.total + this.totalExpense
    },

    computedTotal(){
      return {
        sales: this.totalSales,
        income: this.totalIncome,
        expense: this.totalExpense,
      }
    }

  },

  methods: {
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
      if(this.archiveName === ''){
        this.archiveName = lastMonth()
      }
      const has = this.$store.state.archive.filter(item => item.name === this.archiveName)
      const payload = {
        name: this.archiveName,
        no: has.length + 1,
        sales: this.$store.state.sales,
        income: this.$store.state.income,
        expense: this.$store.state.expense,
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
        this.values[key] = []
        this.$store.commit('sync_new_values', {
          value: this.values[key],
          placement: key,
          assign: true
        })
      })
      getData({target: 'user'})
        .then(data => {
          this.$store.state.user = data
          this.getValuesByRouteParams()
          this.notif.success({
            content: 'Данные сброшены',
            meta:'👌',
            duration: 5000
          })
          this.showConfirmModal = false
        })
    },

    async updateData(){
      if(!this.valuesEmpty){
        await Object.keys(this.values).forEach(key => {
          this.$store.commit('sync_new_values', {
            value: this.values[key],
            placement: key,
            assign: true
          })
        })
        this.notif.success({
          content: 'Данные сохранены',
          meta:'👌',
          duration: 5000
        })
        this.getValuesByRouteParams()
      } else {
        this.notif.warning({
          content: 'Нет данных',
          meta:'🤨',
          duration: 5000
        })
      }
    },

    async getValuesByRouteParams(){
      if(this.isRedactible){
        await Object.keys(this.values).forEach(key => {
          getData({target: key})
            .then(data => {
              this.values[key] = data
              this.sourceTotal[key] = core.calcTotal({
                array: data,
                target: 'value'
              }) 
            })
        }) 
      } else {
        const archivePeriod = this.$route.params.period.split('&')
        this.periodName = `${archivePeriod[0]}[${archivePeriod[1]}]`
        const archiveDataByPeriod = this.$store.state.archive
        .filter(item => item.name === archivePeriod[0])
        .filter(item => item.no === Number(archivePeriod[1]))
        Object.keys(this.values).forEach(key => {
          this.values[key] = archiveDataByPeriod[0][key]
        })
      }
    }
  },

  beforeMount(){
    this.archiveName = lastMonth()
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