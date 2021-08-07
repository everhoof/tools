import { Context } from '@nuxt/types';

export default async (context: Context): Promise<void> => {
  await context.store.dispatch('nuxtClientInit', context);
};
