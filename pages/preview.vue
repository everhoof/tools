<template>
  <div ref="preview" :class="['preview', { 'preview_style_borders': settings.borders }]">
    <div class="preview__image">
      <img :src="template.image" alt="YouTube Preview">
    </div>
    <div
      :class="[
        'preview__perspective-wrapper',
        'preview__perspective-wrapper_style_overlay',
        {'preview__perspective-wrapper_type_tabun': /^tabun/.test(settings.template)}
      ]"
    >
      <div class="preview__perspective">
        <span
          class="preview__text"
          :style="{
            lineHeight: settings.lineHeight,
            textAlign: settings.textAlign,
            fontSize: settings.fontSize + 'px',
            marginTop: settings.verticalAlignment + 'px',
            marginLeft: settings.horizontalAlignment + 'px',
          }"
          v-html="textWithBreaks"
        />
        <span class="preview__date">
          {{ settings.date }}
        </span>
      </div>
    </div>
    <div
      :class="['preview__perspective-wrapper', {
        'preview__perspective-wrapper_type_tabun': /^tabun/.test(settings.template)
      }]"
    >
      <div class="preview__perspective">
        <span
          class="preview__text"
          :style="{
            lineHeight: settings.lineHeight,
            textAlign: settings.textAlign,
            fontSize: settings.fontSize + 'px',
            opacity: settings.textOpacity / 100,
            marginTop: settings.verticalAlignment + 'px',
            marginLeft: settings.horizontalAlignment + 'px',
          }"
          v-html="textWithBreaks"
        />
        <span
          class="preview__date"
          :style="{
            opacity: settings.dateOpacity / 100,
          }"
        >
          {{ settings.date }}
        </span>
      </div>
    </div>
    <div v-if="settings.controls" class="preview__aside">
      <div class="v-responsive overflow-y-auto pa-3">
        <v-container>
          <v-select
            v-model="settings.template"
            class="mb-10"
            :items="options.template"
            item-text="name"
            item-value="key"
            label="Шаблон"
          />
          <v-text-field
            v-model="settings.date"
            label="Дата"
          />
          <v-textarea
            v-model="settings.text"
            label="Текст"
            rows="3"
          />
          <v-select
            v-model="settings.textAlign"
            class="mb-10"
            :items="options.textAlign"
            item-text="name"
            item-value="key"
            label="Выравнивание теста"
          />
          <v-slider
            v-model="settings.fontSize"
            :min="20"
            :max="200"
            :step="1"
            label="Размер текста"
            thumb-label="always"
          />
          <v-slider
            v-model="settings.fontSizeSmall"
            :min="20"
            :max="200"
            :step="1"
            label="Размер мал. текста"
            thumb-label="always"
          />
          <v-slider
            v-model="settings.lineHeight"
            :min="0"
            :max="2"
            :step="0.05"
            label="Высота строки"
            thumb-label="always"
          />
          <v-slider
            v-model="settings.textOpacity"
            label="Прозрачность текста"
            thumb-label="always"
          />
          <v-slider
            v-model="settings.dateOpacity"
            label="Прозрачность даты"
            thumb-label="always"
          />
          <v-slider
            v-model="settings.verticalAlignment"
            :min="-200"
            :max="200"
            label="Вер. отступ"
            thumb-label="always"
          />
          <v-slider
            v-model="settings.horizontalAlignment"
            :min="-400"
            :max="400"
            label="Гор. отступ"
            thumb-label="always"
          />
          <div class="d-flex">
            <v-btn
              class="mr-4 flex-grow-1"
              :loading="downloading"
              color="primary"
              @click="screenshot(false)"
            >
              PNG
              <v-icon
                right
                dark
              >
                mdi-cloud-download
              </v-icon>
            </v-btn>
            <v-btn
              class="mr-4 flex-grow-1"
              :loading="downloading"
              color="primary"
              @click="screenshot(true)"
            >
              JPG
              <v-icon
                right
                dark
              >
                mdi-cloud-download
              </v-icon>
            </v-btn>
            <v-btn @click="reset">
              Сброс
              <v-icon
                right
                dark
              >
                mdi-refresh
              </v-icon>
            </v-btn>
          </div>
          <v-snackbar
            v-model="error"
            :timeout="3"
            absolute
            bottom
            color="primary"
            right
            text
          >
            Произошла неизвестная ошибка
          </v-snackbar>
        </v-container>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  Component, Ref, Vue, Watch,
} from 'nuxt-property-decorator';
import { DateTime } from 'luxon';
import { PreviewSettings } from '~/types/preview';

@Component
export default class PreviewPage extends Vue {
  @Ref() preview!: HTMLDivElement;

  options = {
    textAlign: [
      { key: 'left', name: 'Слева' },
      { key: 'center', name: 'По центру' },
      { key: 'right', name: 'Справа' },
    ],
    template: [
      {
        key: 'youtube',
        name: 'YouTube',
        image: require('~/assets/images/preview/youtube.png'),
        size: '1280x720',
      },
      {
        key: 'tabun',
        name: 'Табун',
        image: require('~/assets/images/preview/tabun.png'),
        size: '1950x720',
      },
      {
        key: 'youtube_rc',
        name: 'YouTube КЧ',
        image: require('~/assets/images/preview/youtube_rc.png'),
        size: '1280x720',
      },
      {
        key: 'tabun_rc',
        name: 'Табун КЧ',
        image: require('~/assets/images/preview/tabun_rc.png'),
        size: '1950x720',
      },
    ],
  };

  defaultSettings: PreviewSettings = {
    template: 'youtube',
    date: '01/01/1970',
    text: 'Guest\n<small>Small text</small>',
    lineHeight: 1.2,
    textAlign: 'center',
    fontSize: 80,
    fontSizeSmall: 40,
    textOpacity: 55,
    dateOpacity: 55,
    horizontalAlignment: 0,
    verticalAlignment: 0,
    borders: false,
    controls: true,
  };

  settings: PreviewSettings = { ...this.defaultSettings };

  downloading: boolean = false;

  error: boolean = false;

  debounceTimeoutId: number | null = null;

  @Watch('settings', { deep: true })
  onSettingsChanged(): void {
    if (process.client) {
      if (this.debounceTimeoutId) { window.clearTimeout(this.debounceTimeoutId); }
      this.debounceTimeoutId = window.setTimeout(() => {
        const query = this.generateSettingsQuery();
        this.$router.replace({ path: 'preview', query }).catch(() => {});
      }, 500);
    }
  }

  get textWithBreaks(): string {
    return this.settings.text
      .replace(/\n/g, '<br>')
      .replace(/<small>(.*?)<\/small>/, `<small style="font-size: ${this.settings.fontSizeSmall}px">$1</small>`);
  }

  get template(): Record<string, unknown> {
    return this.options.template.find((t) => t.key === this.settings.template)!;
  }

  created(): void {
    this.settings.date = DateTime.local().toFormat('dd/MM/yyyy');

    this.setSettingsFromQuery();
  }

  setSettingsFromQuery(): void {
    const query = this.$route.query;
    if (query.template) { this.settings.template = query.template.toString(); }
    if (query.date) { this.settings.date = query.date.toString(); }
    if (query.text) { this.settings.text = query.text.toString(); }
    if (query.textAlign) { this.settings.textAlign = query.textAlign.toString(); }
    if (query.lineHeight) { this.settings.lineHeight = parseFloat(query.lineHeight.toString()) || this.settings.lineHeight; }
    if (query.fontSize) { this.settings.fontSize = parseInt(query.fontSize.toString()) || this.settings.fontSize; }
    if (query.fontSizeSmall) { this.settings.fontSizeSmall = parseInt(query.fontSizeSmall.toString()) || this.settings.fontSizeSmall; }
    if (query.textOpacity) { this.settings.textOpacity = parseFloat(query.textOpacity.toString()) || this.settings.textOpacity; }
    if (query.dateOpacity) { this.settings.dateOpacity = parseFloat(query.dateOpacity.toString()) || this.settings.dateOpacity; }
    if (query.verticalAlignment) { this.settings.verticalAlignment = parseInt(query.verticalAlignment.toString()) || this.settings.verticalAlignment; }
    if (query.horizontalAlignment) { this.settings.horizontalAlignment = parseInt(query.horizontalAlignment.toString()) || this.settings.horizontalAlignment; }
    if (query.borders) { this.settings.borders = query.borders !== 'no'; }
    if (query.controls) { this.settings.controls = query.controls !== 'no'; }
  }

  generateSettingsQuery(override: Record<string, string> = {}): Record<string, string> {
    let settings: Record<string, string> = {
      template: this.settings.template,
      date: this.settings.date,
      text: this.settings.text,
      textAlign: this.settings.textAlign,
    };
    settings.lineHeight = this.settings.lineHeight.toString();
    settings.fontSize = this.settings.fontSize.toString();
    settings.fontSizeSmall = this.settings.fontSizeSmall.toString();
    settings.textOpacity = this.settings.textOpacity.toString();
    settings.dateOpacity = this.settings.dateOpacity.toString();
    settings.verticalAlignment = this.settings.verticalAlignment.toString();
    settings.horizontalAlignment = this.settings.horizontalAlignment.toString();
    settings.borders = this.booleanToString(this.settings.borders);
    settings.controls = this.booleanToString(this.settings.controls);

    settings = { ...settings, ...override };
    return settings;
  }

  booleanToString(value: boolean): string {
    return value ? 'yes' : 'no';
  }

  async screenshot(compress = false): Promise<void> {
    if (this.downloading) { return; }

    this.downloading = true;

    const page = window.location.href.replace(/controls=\w+/, 'controls=no');
    const body = {
      page,
      size: this.template.size,
      compress,
    };

    try {
      const response = await fetch('/api/preview/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify(body),
      });
      const json = await response.json();

      const a = document.createElement('a');
      a.href = json.image;
      a.download = '';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      this.downloading = false;
    } catch (e) {
      this.downloading = false;
      this.error = true;
      console.error(e);
    }
  }

  reset(): void {
    const { template, text, date } = this.settings;
    this.settings = {
      ...this.defaultSettings,
      template,
      text,
      date,
    };
  }
}
</script>

<style lang="stylus">
.preview
  position relative
  display block
  padding 0 400px 0 0
  color #fff

  &__perspective-wrapper
    position absolute
    top 27px
    left 141px
    width 600px
    height 447px
    perspective 850px
    perspective-origin 100% 90%

    &_style
      &_overlay
        mix-blend-mode overlay

  &__perspective
    position relative
    width 100%
    height 100%
    transform rotateY(30deg)

  &__text
    position absolute
    top 60px
    right 0
    left 0
    bottom 100px
    display flex
    justify-content center
    align-items center
    flex-wrap wrap
    flex-direction column
    font-family 'CoalhandLuke Pro', sans-serif
    font-size 80px
    text-align center
    opacity .8

    & small
      padding 20px 0 10px

  &__date
    position absolute
    right 100px
    bottom 30px
    font-family 'CoalhandLuke Pro', sans-serif
    font-size 50px
    font-weight 400

  &__aside
    position fixed
    top 0
    right 0
    bottom 0
    overflow hidden auto
    width 400px
    background #242424

  &_style
    &_borders
      & ^[0]__text,
      & ^[0]__perspective
        border 2px solid red

</style>
