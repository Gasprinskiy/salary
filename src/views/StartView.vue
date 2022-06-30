<template>
  <div class="start-page-wrapper start-page">
    <div class="start-page-app-title">
      <span class="hello-title">Добро пожаловать в </span>
      <span class="app-name">Retailer Salary Сounter 👋</span>
      <span class="subtitle">Приложение для удобного подсчета зарплаты розничного продаца</span>
    </div>
    <div class="start-page-bottom">
      <app-button
        label="Продолжить"
        :bordered="true"
        @click="$router.push('/register')"
      />
    </div>
  </div>
</template>

<script>

import appButton from '../components/btns/appButton.vue'

export default {
  components: {appButton},
}
</script>

<style lang="scss">
  .start-page-wrapper {
    width: 100%;
    height: 100%;
    background-color: $primary;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: $backgroung;
    .start-page-app-title {
      font-size: 25px;
      // font-weight: 400;
      line-height: 35px;
      display: flex;
      flex-direction: column;
      .app-name {
        font-weight: 500;
      }
      .subtitle {
        font-size: 18px;
        max-width: 400px;
        line-height: 25px;
        margin-top: 20px;
      }
    }
    .start-page-bottom {
      margin-top: 35px;
    }

  }
</style>