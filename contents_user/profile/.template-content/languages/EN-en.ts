// Sample personal texts. Copy to contents_user/profile/languages/EN-en.ts and replace with your own.
// Keys come from src/i18n.ts: anything missing here falls back to languages/EN-en.ts or the template hint.
// Activity cards and experience items are switched on in contents_user/profile/site.json (about.cards, about.timeline).
import type { ProfileTexts } from '../../../../src/lib/lang';

export default {
  'home.lead': 'Electronic music producer.',
  'home.text': 'All my music in one place: releases, demos and sample packs — each with its terms of use.',
  'home.textShort': 'All my music in one place.',

  'about.lead': 'Hi! I’m {name}, I make electronic music.',
  'about.leadShort': 'Hi! I’m {name}.',
  'about.bio':
    'First paragraph of the biography.\n\nSecond paragraph — paragraphs are separated by an empty line.',
  'about.bioShort': 'Short biography for phones.',

  'about.music': 'Music',
  'about.musicText': 'What music you make.',
  'about.musicShort': 'Short version for phones.',

  'about.experienceText': 'The path in music — from the first track to my own website.',
  'about.exp1': 'First track',
  'about.exp1Text': 'One sentence about the event.',

  'about.contactsText': 'Write about collaborations and licenses:',
} satisfies ProfileTexts;
