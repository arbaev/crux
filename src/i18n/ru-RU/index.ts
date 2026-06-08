// Русская локаль. Тип берём из en-US — компилятор проверит полноту ключей.
import type { Messages } from '../en-US';

const messages: Messages = {
  appTitle: 'Crux',
  nav: {
    builder: 'Конструктор',
    routes: 'Трассы',
    view: 'Просмотр',
    about: 'О проекте',
  },
  pages: {
    builder: {
      title: 'Конструктор трасс',
      placeholder: 'Здесь будет интерактивная 3D-доска — появится в M1.',
    },
    routes: {
      title: 'Сохранённые трассы',
      placeholder: 'Здесь будет список локально сохранённых трасс — появится в M2.',
    },
    view: {
      title: 'Расшаренная трасса',
      placeholder: 'Здесь трасса откроется по ссылке в режиме просмотра — появится в M3.',
    },
    about: {
      title: 'О проекте Crux',
      placeholder: 'Crux — конструктор скалолазных трасс. TypeScript · Quasar · Three.js.',
    },
  },
  brush: {
    start: 'Старт',
    hand: 'Рука',
    foot: 'Нога',
    finish: 'Топ',
    erase: 'Стереть',
  },
  builder: {
    reset: 'Сбросить',
    count: 'Зацепов: {n}',
  },
  toolbar: {
    name: 'Название',
    namePlaceholder: 'Имя трассы',
    save: 'Сохранить',
    new: 'Новая',
    saved: 'Трасса сохранена',
  },
  grade: {
    system: 'Система',
    value: 'Категория',
    systemHint:
      'Шкала сложности трассы. Font / V-scale — для боулдеринга (V-scale нагляднее: V0 легко → дальше сложнее), French — для лазания с верёвкой, Цвет / Своя — свободная пометка.',
    systems: {
      font: 'Font',
      v: 'V-scale',
      french: 'French',
      color: 'Цвет',
      custom: 'Своя',
    },
  },
  routes: {
    untitled: 'Без названия',
    holds: 'Зацепов: {n}',
    open: 'Открыть',
    duplicate: 'Дублировать',
    delete: 'Удалить',
    empty: 'Сохранённых трасс пока нет. Соберите трассу и нажмите «Сохранить».',
    confirmDelete: 'Удалить трассу «{name}»?',
    deleted: 'Трасса удалена',
    duplicated: 'Трасса продублирована',
  },
  notFound: {
    code: '404',
    message: 'Упс. Здесь ничего нет…',
    goHome: 'На главную',
  },
};

export default messages;
