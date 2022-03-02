<template>
  <transition name="fade">
    <div class="d-flex flex-column justify-center align-center" style="height: 100vh">
      <v-card to="/preview" color="#242424">
        <v-img
          :src="require('~/assets/images/preview/youtube.png')"
          class="white--text align-end"
          gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
          height="60px"
          width="350px"
        >
          <v-card-title>Превью</v-card-title>
        </v-img>
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
