import { createStore } from 'vuex'
import { saveData, getData, dbHasData, testPut, getDataByDb } from '../services/dbRequests/'

export default createStore({
    state () {
      return {
        user: {},
        sales: [],
        expense: [],
        income: [],
        archive: [],
        isRegistered: false
      }
    },

    mutations: {
      async check_user_status(state) {
        state.isRegistered = await dbHasData({target: 'user'})
      },

      async sync_user_data (state, userData) {
        state.user = userData;
        await testPut({
          target: 'user',
          payload: userData
        })
        console.log(getDataByDb({target: 'user'}));
      },

      async sync_new_values(state, {value, placement, assign = false}){
        if(assign){
          state[placement] = value
        } else {
          state[placement].push(value)
        }
        await saveData({
          target: placement,
          payload: state[placement]
        })
      },

      async get_user_data (state) {
        state.user = await getData({target: 'user'})
        state.expense = await getData({target: 'expense'})
        state.sales = await getData({target: 'sales'})
        state.income = await getData({target: 'income'})
        state.archive = await getData({target: 'archive'})
      },
    }
})    