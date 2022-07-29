<template>
  <div class="archive-wrapper archive container">
    <div class="archive-top">
        <div class="archive-top-title title">Архив</div>
        <div class="archive-top-buttons" >
          <app-button
            @click="removeDeletedItemsFromSourceArchive" 
            class="archive-top-submit-button archive-button transition" 
            :class="{'area-disabled': !hasTrash}"
            :active="hasTrash"
            :icon="icons.SaveOutline"
            :flat="true"
            fontSize="35px"
          />
          <app-button
            :class="{'area-disabled': archiveEmpty}"
            @click="showAnalitycisModal = !showAnalitycisModal"
            class="archive-top-analitycs-button archive-button transition" 
            :active="!archiveEmpty"
            :icon="icons.AnalyticsOutline"
            :flat="true"
            fontSize="35px"
          />
        </div>
        
    </div>
    <div class="archive-items">
      <div 
      class="archive-item"
      v-for="(item, index) in archive" 
      :key="item.no"
      >
        <archive-item
          :title="archiveItemName[index]"
        >
          <template v-slot:item-slot>
              <div class="archive-item-buttons">
                <app-button 
                  class="archive-item-button"
                  label="Удалить"
                  :bordered="true"
                  @click="removeItem(item)"
                />
                <app-button
                  class="archive-item-button" 
                  label="Посмотреть"
                  @click="$router.push(`/record/${item.name}&${item.no}`)"
                />
              </div>
          </template>
        </archive-item>
      </div>
      <div class="archive-items-bottom">
        <!-- <app-button
          v-if="archiveHasMoreData"
          label="Показать еще"
          @click="getMore"
        /> -->
      </div>
    </div>
    <n-empty
        class="archive-empty"
        v-if="archiveEmpty" 
        description="Архивированные данные не найдены"
    />   
  </div>
  <modal-window-template
    v-model:show="showAnalitycisModal"
    :closeOnBlur="true"
  >
    <template v-slot:title>
      <div class="analytics-modal-title title">Аналитика</div> 
    </template>
    <template v-slot:body>
      <div class="analytics-modal-body analytics-body">
        <div class="analytics-body-values">
          <total-value-animation
          class="analytics-values"
          title="Средняя сумма продаж в месяц:"
          :totalValue="avarageSales"
          :active="showAnalitycisModal"
          />
          <total-value-animation
          class="analytics-values"
          title="Средняя зарплата:"
          :totalValue="avarageSalary"
          :active="showAnalitycisModal"
          />
        </div>
        <div class="analytics-body-info" v-if="analyticsWarn">
          <n-icon
            class="info-icon"
            :component="icons.InformationCircleOutline"
          />
          <div class="info-title">
            Для более корректной аналитики, требуется больше данных 
          </div>
        </div>
      </div> 
    </template>
  </modal-window-template>
</template>

<script>

import archiveItem from '../components/others/savedDataItems.vue'
import appButton from '../components/btns/appButton.vue'
import modalWindowTemplate from '../components/templates/modalWindowTemplate.vue'
import totalValueAnimation from '../components/calc-results/totalValueAnimation.vue'
import { NEmpty, NIcon } from 'naive-ui'


import { core } from '../core'
import { makeItemTitle } from '../services/helpers'
import { getReverceData } from '../services/dbRequests'
import { useNotification } from 'naive-ui'
import { SaveOutline, AnalyticsOutline, InformationCircleOutline } from '@vicons/ionicons5'

const icons = {
  SaveOutline,
  AnalyticsOutline,
  InformationCircleOutline
}

export default {
  components: { 
    archiveItem, 
    appButton, 
    modalWindowTemplate,
    totalValueAnimation, 
    NEmpty,
    NIcon,
    icons
  },
  setup() {
    return {
      notif: useNotification(),
      icons
    }
  },

  data() {
    return {
      archive: [],
      deletedItems: [],
      showAnalitycisModal: false, 
    }
  },

  computed: {
    // archiveHasMoreData(){
    //   return (this.separatedArchive.length + this.deletedItems.length) < this.$store.state.archive.length
    // },

    archiveItemName(){
      const result = []
      this.archive.forEach(item => {
        result.push(makeItemTitle(item.name, item.no))
      })
      return result
    },

    archiveEmpty(){
      return this.archive.length <= 0
    },

    hasTrash(){
      return this.deletedItems.length > 0
    },

    analyticsWarn(){
      return this.archive.length <= 2
    },

    avarageSales(){
      return core.calcAverageValue({
        valuesArray: this.archive,
        value: 'totalSales' 
      })
    },

    avarageSalary(){
      return core.calcAverageValue({
        valuesArray: this.archive,
        value: 'totalSalary' 
      })
    },
  },

  methods: {
    async getSeparatedArchive(){
      this.archive = await getReverceData({target: 'archive'})
    },

    removeItem(item){
      this.archive = this.archive.filter(data => data !== item)
      this.deletedItems.push(item)
      this.notif.success({
        content: 'Данные в корзине',
        meta:'Сохраните изменения что бы удалить безвозвратно',
        duration: 5000
      })
    },

    async removeDeletedItemsFromSourceArchive(){
      if(this.deletedItems.length > 0){
        this.deletedItems.forEach(item => {
          this.$store.commit('sync_new_values',{
            value: item,
            placement: 'archive', 
            remove: true
          })
        })
        this.deletedItems = []
        this.notif.success({
          content: 'Изменения сохранены',
          meta:'👌',
          duration: 5000
        })
      } else {
        this.notif.warning({
          content: 'Вы ничего не меняли',
          meta:'🤨',
          duration: 5000
        })
      }
    }
  },

  beforeMount(){
    this.getSeparatedArchive()
  }
}
</script>

<style lang="scss" scoped>
    .archive-wrapper {
      padding: 24px 12px;
    }
    .archive-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
      .archive-top-buttons {
        display: flex;
        .archive-button {
          margin: 0px 0px 0px 5px;
        }
      }
    }
    .archive-item {
      margin-bottom: 5px;
      .archive-item-buttons {
        display: flex;
        .archive-item-button {
          margin: 0px 0px 0px 5px;
        }
      }
    }
    .archive-items-bottom {
      width: 100%;
      display: flex;
      justify-content: flex-end;
      margin-top: 10px;
    }
    .archive-empty {
      margin: 25px 0px;
    }

    .analytics-body-values {
      padding: 15px 0px;
      .analytics-values {
        margin: 10px 0px;
      }
    }
    .analytics-body-info {
      display: flex;
      align-items: center;
      text-align: left;
      .info-icon {
        font-size: 30px;
        margin-right: 10px;
        color: $elements;
      }
    }
</style>