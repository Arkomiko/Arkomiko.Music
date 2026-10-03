// Линейные иконки из макета (stroke 1.8–2.4) и залитые иконки плеера. Используются в Icon.astro и Icon.vue.

type IconDef = { body: string; fill?: boolean; stroke?: number };

export const icons = {
  globe: {
    stroke: 1.8,
    body: '<circle cx="12" cy="12" r="9"/><path d="M3 12 H21 M12 3 C8.5 6.5 8 9.5 8 12 C8 14.5 8.5 17.5 12 21 C15.5 17.5 16 14.5 16 12 C16 9.5 15.5 6.5 12 3"/>',
  },
  chevronDown: { stroke: 2.4, body: '<path d="M6 9 L12 15 L18 9"/>' },
  chevronRight: { stroke: 2, body: '<path d="M9 6 L15 12 L9 18"/>' },
  sun: {
    stroke: 2,
    body: '<circle cx="12" cy="12" r="4"/><path d="M12 2 V4 M12 20 V22 M2 12 H4 M20 12 H22 M4.9 4.9 L6.3 6.3 M17.7 17.7 L19.1 19.1 M4.9 19.1 L6.3 17.7 M17.7 6.3 L19.1 4.9"/>',
  },
  moon: { stroke: 2, body: '<path d="M20 14.5 A8 8 0 1 1 9.5 4 A6.5 6.5 0 0 0 20 14.5 Z"/>' },
  search: { stroke: 2, body: '<circle cx="11" cy="11" r="7"/><path d="M20 20 L16 16"/>' },
  menu: { stroke: 2, body: '<path d="M4 7 H20 M4 12 H20 M4 17 H20"/>' },
  close: { stroke: 2, body: '<path d="M6 6 L18 18 M18 6 L6 18"/>' },
  download: { stroke: 1.8, body: '<path d="M12 4 V15 M7.5 10.5 L12 15 L16.5 10.5 M5 19.5 H19"/>' },
  check: { stroke: 2.4, body: '<path d="M5 12.5 L10 17 L19 7"/>' },
  volume: {
    stroke: 2,
    body: '<path d="M4 9 H8 L13 5 V19 L8 15 H4 Z"/><path d="M17 9 C18.5 10.5 18.5 13.5 17 15"/>',
  },
  shuffle: {
    stroke: 2,
    body: '<path d="M4 7 H8 L16 17 H20"/><path d="M4 17 H8 L16 7 H20"/><path d="M18 5 L20 7 L18 9"/><path d="M18 15 L20 17 L18 19"/>',
  },
  repeat: {
    stroke: 2,
    body: '<path d="M4 11 V9 A2 2 0 0 1 6 7 H19"/><path d="M16 4 L19 7 L16 10"/><path d="M20 13 V15 A2 2 0 0 1 18 17 H5"/><path d="M8 20 L5 17 L8 14"/>',
  },
  play: { fill: true, body: '<path d="M8 5 L19 12 L8 19 Z"/>' },
  playWide: { fill: true, body: '<path d="M7 5 L19 12 L7 19 Z"/>' },
  pause: {
    fill: true,
    body: '<rect x="6.5" y="5" width="4" height="14"/><rect x="13.5" y="5" width="4" height="14"/>',
  },
  prev: { fill: true, body: '<rect x="5" y="6" width="2.5" height="12"/><path d="M19 6 L9 12 L19 18 Z"/>' },
  next: { fill: true, body: '<path d="M5 6 L15 12 L5 18 Z"/><rect x="16.5" y="6" width="2.5" height="12"/>' },
} satisfies Record<string, IconDef>;

export type IconName = keyof typeof icons;

/** Атрибуты <svg> для иконки. */
export function iconAttrs(name: IconName): Record<string, string> {
  const i: IconDef = icons[name];
  return i.fill
    ? { fill: 'currentColor' }
    : {
        fill: 'none',
        stroke: 'currentColor',
        'stroke-width': String(i.stroke ?? 2),
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
      };
}
