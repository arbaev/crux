// Мастер-схема локализации (по ней типизируются остальные локали).
const enUS = {
  appTitle: 'Crux',
  nav: {
    builder: 'Builder',
    routes: 'Routes',
    view: 'View',
    about: 'About',
  },
  pages: {
    builder: {
      title: 'Route builder',
      placeholder: 'The interactive 3D board will live here — coming in M1.',
    },
    routes: {
      title: 'Saved routes',
      placeholder: 'Your locally saved routes will be listed here — coming in M2.',
    },
    view: {
      title: 'Shared route',
      placeholder: 'A shared route opens here in read-only mode — coming in M3.',
    },
    about: {
      title: 'About Crux',
      placeholder: 'Crux — a climbing route builder. TypeScript · Quasar · Three.js.',
    },
  },
  notFound: {
    code: '404',
    message: 'Oops. Nothing here…',
    goHome: 'Go home',
  },
};

export type Messages = typeof enUS;

export default enUS;
