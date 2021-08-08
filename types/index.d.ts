/* eslint-disable import/no-duplicates */
declare module '*.vue' {
  import Vue from 'vue';
  export default Vue;
}

declare module 'screenshot-stream' {
  // eslint-disable-next-line import/order
  import { Stream } from 'stream';

  export default function screenshot(url: string, size: string, options?: unknown): Stream;
}
