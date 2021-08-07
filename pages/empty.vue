<template>
  <transition name="fade">
    <router-view />
  </transition>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';

@Component({
  name: 'empty',
})
export default class Empty extends Vue {};
</script>
