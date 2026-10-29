// Образец личных текстов. Скопируйте в contents_user/profile/languages/RU-ru.ts и замените на свои.
// Ключи — из src/i18n.ts: чего здесь нет, берётся из languages/RU-ru.ts или подсказка шаблона.
// Карточки «Чем занимаюсь» и пункты «Опыта» включаются в contents_user/profile/site.json (about.cards, about.timeline).
import type { ProfileTexts } from '../../../../src/lib/lang';

export default {
  'home.lead': 'Музыкант и автор электронной музыки.',
  'home.text':
    'Здесь собрана вся моя музыка: релизы, демки и сэмпл-паки — с условиями использования у каждого релиза.',
  'home.textShort': 'Вся моя музыка в одном месте.',

  'about.lead': 'Привет! Я {name}, пишу электронную музыку.',
  'about.leadShort': 'Привет! Я {name}.',
  'about.bio': 'Первый абзац биографии.\n\nВторой абзац — абзацы разделяются пустой строкой.',
  'about.bioShort': 'Короткая биография для телефона.',

  'about.music': 'Музыка',
  'about.musicText': 'Какую музыку вы пишете.',
  'about.musicShort': 'Коротко для телефона.',

  'about.experienceText': 'Путь в музыке — от первого трека до своего сайта.',
  'about.exp1': 'Первый трек',
  'about.exp1Text': 'Одно предложение о событии.',

  'about.contactsText': 'Пишите по сотрудничеству и лицензиям:',
} satisfies ProfileTexts;
