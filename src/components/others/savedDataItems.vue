<template>
  <div class="saved-data-item">
      <div class="saved-data-item-title">
          {{title}}
      </div>
      <slot name="item-slot"/>
  </div>
</template>

<script>
export default {
    props: {
        title: {
            type: String,
            default: ''
        }
    },
}
</script>

<style lang="scss">
    .saved-data-item {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 10px;
        border: 1px solid $default;
        border-radius: 3px;
        color: $default;
        cursor: pointer;
        .saved-data-item-title {
            text-transform: capitalize;
            font-size: 15px;
            font-weight: 500;
        }
        &:hover {
            color: $elements;
            border-color: $elements;
        }
    } 
</style>