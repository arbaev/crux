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
  notFound: {
    code: '404',
    message: 'Упс. Здесь ничего нет…',
    goHome: 'На главную',
  },
};

export default messages;
