import { Context } from '@nuxt/types';

export default function ({
  app, route, store, redirect,
}: Context): void {
  const blockedForLoggedIn: string[] = [];
  const blockedForLoggedOut: string[] = [];

  if (blockedForLoggedIn.includes(route.name || '') && store.state.logged && app.router) {
    redirect(302, '/');
  } else if (blockedForLoggedOut.includes(route.name || '') && !store.state.logged && app.router) {
    redirect(302, '/login');
  }
}
