<template>
  <div class="main-page-top page-top">
    <user-greeting class="page-top-greeting" :name="userData.name"/>
    <total-salary-animation
      title="Общая зарплата"
      :totalValue="totalSalary"
      :expense="totalAvans"
      :active="true"
    />
  </div>
  <div class="main-page-body body">
    <div class="body-top-progress">
      <progress-animation
        title="План выполнен на:"
        :progress="totalPlanProgress"
        :active="true"
        :isPercent="true"
        :precision="1"
      />
      <progress-animation
        title="Процент от продаж:"
        :progress="totalPercentFromSales"
        :active="true"
      />
      <progress-animation
        title="Дополнительный доход:"
        :progress="totalIncome"
        :active="true"
      />
    </div>
    <div class="rules-progress" v-if="userData.isPercentFloats">
      <rules-progress-table
        :rules="percentChangeRules"
      />
    </div>
    <div class="sales-table">
      <recent-sales-table
        :record="recentSales"
        :readonly="true"
        title="Недавние продажи"
      />
    </div>
    
    <n-empty
      v-if="noSales" 
      description="Данные о продажах не найдены"
    />
  </div>
</template>

<script>

// import { separateArray } from '../services/helpers'
import { getData, getReverceData } from '../services/dbRequests'
import { core } from '../core'
import totalSalaryAnimation from '../components/calc-results/totalValueAnimation.vue'
import progressAnimation from '../components/calc-results/progressAnimation.vue'
import userGreeting from '../components/others/userGreeting.vue'
import rulesProgressTable from '../components/calc-results/rulesProgressTable.vue'
import recentSalesTable from '../components/calc-results/recordsTabel.vue'
import appButton from '../components/btns/appButton.vue'
import { NEmpty } from 'naive-ui'

export default {
  components: {
    totalSalaryAnimation, 
    userGreeting, 
    progressAnimation,
    rulesProgressTable,
    recentSalesTable,
    appButton,
    NEmpty
  },

  data(){
    return {
      userData: {},
      calculationsData: {
        sales: [],
        expense: [],
        income: []
      },
      recentSales: [],
    }
  },

  computed: {
    percentChangeProgress(){
      if(this.userData.isPercentFloats){
        return core.getAwardIfPrecentFromPlanReached({
          salesArray: this.calculationsData.sales, 
          plan: this.userData.salesPlan,
          percentChangeRules: this.userData.percentChangeRules
        })
      }
    },

    totalAvans(){
      return this.calcTotalIfArrayHasData(this.calculationsData.expense)
    },

    totalIncome(){
      return this.calcTotalIfArrayHasData(this.calculationsData.income)
    },

    totalSalaryProgress(){
      return core.calcTotalSalary({
        calcOptions: {
          salesArray: this.calculationsData.sales,
          fixedPercenFromSales: this.reachedPercent,
          fixedSalary: this.userData.fixedSalary,
          avans: this.totalAvans,
          plan: this.userData.salesPlan, 
        },
        ignorePlan: this.userData.ignorePercentFromPlan
      })
    },

    totalSalary(){
      if(this.percentChangeProgress && !this.percentChangeProgress.empty){
        return this.totalSalaryProgress.total + this.percentChangeProgress.award
      }
      return this.totalSalaryProgress.total
    },

    totalPercentFromSales(){
      return this.totalSalaryProgress.percentFromSales
    },

    totalPlanProgress(){
      return core.calcReachedPercentFromPlan({
        salesArray: this.calculationsData.sales,
        plan: this.userData.salesPlan
      })
    },

    percentChangeRules(){
      return this.markDonePercentChangeRules()
    },

    reachedPercent(){
      if(this.percentChangeProgress){
        return this.percentChangeProgress.reachedPercent
      }
      return this.userData.fixedPercenFromSales
    },

    noSales(){
      return this.calculationsData.sales.length <= 0
    }
  },

  methods: {
    markDonePercentChangeRules(){
      const rules = this.userData.percentChangeRules
      if(this.percentChangeProgress && !this.percentChangeProgress.empty){
        this.percentChangeProgress.sourceRules.forEach(reachedRule => {
          const index = rules.findIndex(rule => rule.id === reachedRule.id)
          rules[index].isDone = true
        });
      }
      return rules
    },

    calcTotalIfArrayHasData(array){
      if(array.length > 0){
        return core.calcTotal({
          array: array,
          target: 'value'
        })
      }
      return 0
    },

    async getRecentSales(){
      await getReverceData({
        target: 'sales',
        limit: 8
      }).then(data =>{ 
        this.recentSales = data
      })
    },

    async getLocalUserData(){
      this.userData = await getData({
        target: 'user',
        fromLocalStore: true
      })
    },

    async getCalculationData(){
      await Object.keys(this.calculationsData).forEach(key => {
        getData({target: key}).then(data => this.calculationsData[key] = data)
      })
    }
  },

  beforeMount(){
    this.getCalculationData()
    this.getLocalUserData()
    this.getRecentSales()
  }
}
</script>

<style lang="scss" scoped>
  .main-page-top {
    background-color: $primary;
    position: relative;
    min-height: 28vh;
    color: $backgroung;
    padding: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    .page-top-greeting {
      position: absolute;
      left: 12px;
      top: 12px;
    }
  }

  .main-page-body {
    display: flex;
    flex-direction: column;
    padding: 12px;
  }
  .body-top-progress {
    margin-bottom: 20px;
    text-align: left;
  }
  .rules-progress {
    margin-bottom: 20px;
  }
  .sales-table-show-all-btn {
    margin-top: 10px;
    margin-left: auto;
  }
</style>