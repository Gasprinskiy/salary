import { createStore } from 'vuex'
import { toRaw } from 'vue'
import { saveData, getData, dbHasData, removeData } from '../services/dbRequests/'

export default createStore({
    state () {
      return {
        user: {},
        isRegistered: false
      }
    },

    mutations: {
      async check_user_status(state) {
        state.isRegistered = await dbHasData({target: 'user'})
      },

      async sync_user_data (state, userData) {
        state.user = userData;
        await saveData({
          target: 'user',
          payload: toRaw(userData),
          toLocalStore: true
        })
      },

      async sync_new_values(state, {value, placement, remove = false}){
        if(!remove){
          let toRowPayload = {}
          Object.keys(value).forEach(key =>{
            toRowPayload[key] = toRaw(value[key])
          })
          await saveData({
            target: placement,
            payload: toRowPayload
          })
        } else {
          await removeData({
            target: placement,
            id: value.id
          })
        }
      },

      async get_user_data (state) {
        state.user = await getData({target: 'user', fromLocalStore: true})
      },
    }
})    