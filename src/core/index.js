export const core = {
    calcTotalSalary({calcOptions, ignorePlan = false}){
        let sales = this.calcTotal({
            array: calcOptions.salesArray,
            target: 'value'
        })
        if(ignorePlan){
            if(sales > calcOptions.plan){
              sales = sales - calcOptions.plan   
            } else if(sales < calcOptions.plan && sales !== 0 && calcOptions.fixedPercenFromSales === 0) {
              sales = calcOptions.plan - sales 
            } else {
                sales = 0
            }
        }
        const percentFromSales = this.calcPercentFromTotal({
            total: sales,
            percent: calcOptions.fixedPercenFromSales
        })
        return {
            total: calcOptions.fixedSalary + percentFromSales - calcOptions.avans,
            percentFromSales: percentFromSales
        } 
    },

    
    
    calcTotal({array, target}){
        return array.reduce((total, item)=> total + item[target], 0);
    },

    calcPercentFromTotal({total, percent}){
        if(percent > 0){
            return total / 100 * percent
        }
        return 0
    },

    calcReachedPercentFromPlan({salesArray, plan}){
        const totalSales = this.calcTotal({
            array: salesArray,
            target: 'value'
        })
        let result = totalSales / plan * 100
        if(result > 100) return 100
        return result
    },

    getAwardIfPrecentFromPlanReached({salesArray, plan, percentChangeRules}){
        const reachedPrecent = this.calcReachedPercentFromPlan({salesArray, plan})
        const filteredRules = percentChangeRules.filter(option => option.goal <= reachedPrecent)
        const result = {
            empty: true
        }
        if(filteredRules.length > 0){
            result.empty = false
            result.sourceRules = filteredRules
            result.reachedPercent = Math.max.apply(Math, filteredRules.map(option => option.precentChange))
            result.award = this.calcTotal({
                array: filteredRules,
                target: 'award'
            })
        }
        return result
    },

    calcAverageValue({valuesArray, value}){
        return this.calcTotal({array: valuesArray, target: value}) / valuesArray.length
    }
}
