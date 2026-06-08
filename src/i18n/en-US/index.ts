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
  brush: {
    start: 'Start',
    hand: 'Hand',
    foot: 'Foot',
    finish: 'Top',
    erase: 'Erase',
  },
  builder: {
    reset: 'Reset',
    count: 'Holds: {n}',
  },
  toolbar: {
    name: 'Name',
    namePlaceholder: 'Route name',
    save: 'Save',
    new: 'New',
    saved: 'Route saved',
  },
  grade: {
    system: 'System',
    value: 'Grade',
    systemHint:
      'Route difficulty scale. Font / V-scale are for bouldering (V-scale is the most intuitive: V0 easy → higher = harder), French is for roped climbing, Color / Custom is a free label.',
    systems: {
      font: 'Font',
      v: 'V-scale',
      french: 'French',
      color: 'Color',
      custom: 'Custom',
    },
  },
  routes: {
    untitled: 'Untitled',
    holds: '{n} holds',
    open: 'Open',
    duplicate: 'Duplicate',
    delete: 'Delete',
    share: 'Share',
    empty: 'No saved routes yet. Build one and hit Save.',
    confirmDelete: 'Delete route “{name}”?',
    deleted: 'Route deleted',
    duplicated: 'Route duplicated',
  },
  share: {
    title: 'Share',
    link: 'Link',
    copy: 'Copy link',
    copied: 'Link copied',
  },
  view: {
    readonly: 'View only',
    open: 'Open in builder',
    save: 'Save to my routes',
    saved: 'Saved to your routes',
    invalid: 'Invalid or broken link.',
    wrongBoard: 'This route was built on a different board size.',
  },
  notFound: {
    code: '404',
    message: 'Oops. Nothing here…',
    goHome: 'Go home',
  },
};

export type Messages = typeof enUS;

export default enUS;
