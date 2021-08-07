<template>
  <div class="panel__layout">
    <div class="panel__header" />
    <div class="panel__wrapper" />
  </div>
</template>

<script lang="ts">
import '~/assets/stylus/normalize.styl';
import '~/assets/stylus/grid.styl';
import '~/assets/stylus/global.styl';
import '~/assets/stylus/colors.styl';
import { Component, Vue } from 'nuxt-property-decorator';

@Component
export default class DefaultLayout extends Vue {}
</script>

<style lang="stylus">
.panel
  overflow hidden auto

  &__body
    overflow hidden
    min-height 100%
    margin 0 !important

  &__layout
    display flex
    flex-direction column
    min-height 100vh

  &__wrapper
    flex-grow 1
    max-height calc(100% - 70px)

</style>
