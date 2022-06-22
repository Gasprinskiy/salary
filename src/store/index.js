import { createStore } from 'vuex'

export default createStore({
    state () {
      return {
        user: {},
        sales: [],
        expense: [],
        income: [],
        archive: [],
        totalSalary: 0,
        isRegistered: false
      }
    },
})    