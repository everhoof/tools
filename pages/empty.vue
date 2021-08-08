<template>
  <transition name="fade">
    <div class="d-flex flex-column justify-center align-center" style="height: 100vh">
      <v-card max-width="350">
        <v-img
          :src="require('~/assets/images/preview/youtube.png')"
          class="white--text align-end"
          gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
          height="150px"
        >
          <v-card-title>Превью для YouTube и Tabun</v-card-title>
        </v-img>

        <v-card-actions>
          <v-btn block dark to="/preview">
            Открыть
          </v-btn>
        </v-card-actions>
      </v-card>
    </div>
  </transition>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';

@Component({
  name: 'empty',
})
export default class Empty extends Vue {};
</script>
