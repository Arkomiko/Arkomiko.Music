// Deploy: собирает сайт для хостинга и упаковывает его в deploy/<домен>.zip.
// Запуск: npm run deploy (в VS Code — «Deploy: архив для хостинга» в панели «Запуск и отладка»).
//
// В сборку попадают: контент из contents_user/ (кроме релизов с draft: true), личный профиль
// contents_user/profile/ и только те языки, что опубликованы в git. Заготовки остальных языков остаются локальными.
// Архив распаковывается в корень сайта на хостинге (public_html) — порядок действий скрипт печатает в конце.
import { execSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

const root = path.resolve(import.meta.dirname, '../..');
process.chdir(root);

// Языки из git; если папка скачана без git — все языки.
let langFiles = [];
try {
  langFiles = execSync('git ls-files languages', { encoding: 'utf8' })
    .split('\n')
    .filter((f) => f.endsWith('.ts'))
    .map((f) => path.basename(f));
} catch {
  console.warn('git не найден — в сборку попадут все языки из languages/.');
}

const profilePath = 'contents_user/profile/site.json';
const profile = fs.existsSync(profilePath) ? JSON.parse(fs.readFileSync(profilePath, 'utf8')) : {};
if (!profile.url) console.warn(`Нет ${profilePath} с полем url — сайт соберётся с доменом example.com.`);
const domain = profile.url ? new URL(profile.url).host : 'site';

console.log(`\nСборка для ${domain}. Языки: ${langFiles.join(', ') || 'все'}\n`);
const build = spawnSync('npx astro build', {
  stdio: 'inherit',
  shell: true,
  env: { ...process.env, ...(langFiles.length && { SITE_LANG_FILES: langFiles.join(',') }) },
});
if (build.status !== 0) {
  console.error('\nСборка не удалась — архив не создан. Ошибка выше.');
  process.exit(build.status ?? 1);
}

fs.mkdirSync('deploy', { recursive: true });
const out = path.join('deploy', `${domain}.zip`);
const count = zipDir('dist', out);
const mb = (fs.statSync(out).size / 1024 / 1024).toFixed(1);

console.log(`
Готово: ${out} — ${count} файлов, ${mb} МБ.

Как выложить (SpaceWeb и похожие хостинги):
  1. Панель хостинга → «Файловый менеджер» → папка public_html.
  2. Удалите из неё старые файлы сайта.
  3. «Загрузить» → ${path.basename(out)} → выделить архив → «Распаковать» → «Сюда».
  4. Удалите сам архив. index.html, .htaccess и _astro должны лежать прямо в public_html.
`);

/** ZIP без внешних библиотек: файлы сжимаются deflate, пути — через «/», имена в UTF-8. */
function zipDir(dir, file) {
  const crcTable = Array.from({ length: 256 }, (_, n) => {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    return c >>> 0;
  });
  const crc32 = (buf) => {
    let c = 0xffffffff;
    for (const b of buf) c = crcTable[(c ^ b) & 0xff] ^ (c >>> 8);
    return (c ^ 0xffffffff) >>> 0;
  };
  const now = new Date();
  const time = (now.getHours() << 11) | (now.getMinutes() << 5) | (now.getSeconds() >> 1);
  const date = ((now.getFullYear() - 1980) << 9) | ((now.getMonth() + 1) << 5) | now.getDate();

  const files = fs
    .readdirSync(dir, { recursive: true, withFileTypes: true })
    .filter((d) => d.isFile())
    .map((d) => path.join(d.parentPath, d.name));
  const parts = [];
  const central = [];
  let offset = 0;
  for (const f of files) {
    const name = Buffer.from(path.relative(dir, f).split(path.sep).join('/'), 'utf8');
    const data = fs.readFileSync(f);
    const packed = zlib.deflateRawSync(data, { level: 9 });
    const deflate = packed.length < data.length;
    const body = deflate ? packed : data;
    const crc = crc32(data);

    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50, 0);
    local.writeUInt16LE(20, 4);
    local.writeUInt16LE(0x0800, 6); // имена в UTF-8
    local.writeUInt16LE(deflate ? 8 : 0, 8);
    local.writeUInt16LE(time, 10);
    local.writeUInt16LE(date, 12);
    local.writeUInt32LE(crc, 14);
    local.writeUInt32LE(body.length, 18);
    local.writeUInt32LE(data.length, 22);
    local.writeUInt16LE(name.length, 26);
    parts.push(local, name, body);

    const entry = Buffer.alloc(46);
    entry.writeUInt32LE(0x02014b50, 0);
    entry.writeUInt16LE(20, 4);
    entry.writeUInt16LE(20, 6);
    entry.writeUInt16LE(0x0800, 8);
    entry.writeUInt16LE(deflate ? 8 : 0, 10);
    entry.writeUInt16LE(time, 12);
    entry.writeUInt16LE(date, 14);
    entry.writeUInt32LE(crc, 16);
    entry.writeUInt32LE(body.length, 20);
    entry.writeUInt32LE(data.length, 24);
    entry.writeUInt16LE(name.length, 28);
    entry.writeUInt32LE(offset, 42);
    central.push(entry, name);
    offset += local.length + name.length + body.length;
  }
  const cdSize = central.reduce((s, b) => s + b.length, 0);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0);
  end.writeUInt16LE(files.length, 8);
  end.writeUInt16LE(files.length, 10);
  end.writeUInt32LE(cdSize, 12);
  end.writeUInt32LE(offset, 16);
  fs.writeFileSync(file, Buffer.concat([...parts, ...central, end]));
  return files.length;
}
