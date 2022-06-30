<template>
  <div class="main-page-top page-top">
    <user-greeting class="page-top-greeting" :name="$store.state.user.name"/>
    <total-salary-animation
      title="Общая зарплата"
      :totalValue="progress.total"
      :expense="progress.avans"
      :active="true"
    />
  </div>
  <div class="main-page-body body">
    <div class="body-top-progress">
      <progress-animation
        title="План выполнен на:"
        :progress="progress.plan"
        :active="true"
        :isPercent="true"
        :precision="1"
      />
      <progress-animation
        title="Процент от продаж:"
        :progress="progress.percentFromSales"
        :active="true"
      />
      <progress-animation
        title="Дополнительный доход:"
        :progress="progress.income"
        :active="true"
      />
    </div>
    <div class="rules-progress" v-if="$store.state.user.isPercentFloats">
      <rules-progress-table
        :rules="$store.state.user.percentChangeRules"
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
      v-if="$store.state.sales.length <= 0" 
      description="Данные о продажах не найдены"
    />
  </div>
</template>

<script>

import { separateArray } from '../services/helpers'
import {getData}
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
      progress: {
        total: 0,
        plan: 0,
        totalSales: 0,
        avans: 0, 
        income: 0
      },
      userData: {},
      recentSales: [],
      sales: [],
    }
  },

  methods: {
    markDonePercentChangeRules(reachedRules){
      reachedRules.forEach(reachedRule => {
        const index = this.$store.state.user.percentChangeRules.findIndex(rule => rule.id === reachedRule.id)
        this.$store.state.user.percentChangeRules[index].isDone = true
      });
    },

    applyPercentChangeOptions(){
      const result = core.getAwardIfPrecentFromPlanReached({
        salesArray: this.$store.state.sales, 
        plan: this.$store.state.user.salesPlan,
        percentChangeRules: this.$store.state.user.percentChangeRules
      })
      if(!result.empty){
        this.$store.state.user.fixedPercenFromSales = result.reachedPercent
        this.progress.total += result.award
        this.markDonePercentChangeRules(result.sourceRules)
      }
    },

    getPlanProgress(){
      this.progress.plan = core.calcReachedPercentFromPlan({
        salesArray: this.$store.state.sales,
        plan: this.$store.state.user.salesPlan
      })
    },

    getAvans(){
      if(this.$store.state.expense){
        this.progress.avans = core.calcTotal({
          array: this.$store.state.expense,
          target: 'value'
        })
      }
    },

    getRecentSales(){
      this.recentSales = separateArray({
          sourceArray: this.$store.state.sales,
          reverse: true,
          options: {
            limit: 6,
            page: 1
          }
        })
    },

    applyPercenFloatOptions(){
      if(this.$store.state.user.isPercentFloats){
        this.applyPercentChangeOptions()
        this.getPlanProgress()
      }
    },

    calcIncome(){
      this.progress.income = core.calcTotal({
        array: this.$store.state.income,
        target: 'value'
      })
    },

    calcTotalSalaryProgress(){
      const totalResult = core.calcTotalSalary({
        calcOptions: {
          salesArray: this.$store.state.sales,
          fixedPercenFromSales: this.$store.state.user.fixedPercenFromSales,
          fixedSalary: this.$store.state.user.fixedSalary,
          avans: this.progress.avans,
          plan: this.$store.state.user.salesPlan, 
        },
        ignorePlan: this.$store.state.user.ignorePercentFromPlan
      })
      
      this.progress.total += totalResult.total
      this.progress.percentFromSales = totalResult.percentFromSales
    },

    async makeAllCalculationsWithUserOptions(){
      await this.applyPercenFloatOptions()
      await this.getAvans()
      await this.calcTotalSalaryProgress()
    },

  },

  beforeMount(){
    this.makeAllCalculationsWithUserOptions()
      .then(()=>{
        this.getRecentSales()
        this.calcIncome()
      })
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