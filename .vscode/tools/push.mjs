// GitHub: проверяет проект, коммитит все изменения и отправляет их на GitHub.
// Запуск: npm run push -- "Что изменилось" (в VS Code — «GitHub: залить изменения», текст спросит сам).
//
// Порядок: форматирование → astro check → коммит → git push. Если в коммит попало личное
// (профиль, треки, сборки) — ничего не отправляется: в репозитории должна оставаться только основа сайта.
import { spawnSync } from 'node:child_process';
import path from 'node:path';

process.chdir(path.resolve(import.meta.dirname, '../..'));

const message = (process.env.COMMIT_MESSAGE || process.argv.slice(2).join(' ')).trim();
if (!message) {
  console.error('Напишите, что изменилось: npm run push -- "Новый трек"');
  process.exit(1);
}

const run = (cmd, args = [], opts = {}) => {
  const r = spawnSync(cmd, args, { stdio: 'inherit', shell: cmd === 'npm', ...opts });
  if (r.status !== 0) {
    console.error(
      `\nОстановлено: «${[cmd, ...args].join(' ')}» завершилась с ошибкой. Ничего не отправлено.`,
    );
    process.exit(r.status ?? 1);
  }
  return r;
};
const out = (args) => spawnSync('git', args, { encoding: 'utf8' }).stdout.trim();

console.log('\n1/4 Форматирование');
run('npm', ['run', 'format', '--', '--log-level', 'warn']);
console.log('\n2/4 Проверка (astro check)');
run('npm', ['run', 'check']);

console.log('\n3/4 Коммит');
run('git', ['add', '-A']);
const staged = out(['diff', '--cached', '--name-only']).split('\n').filter(Boolean);
if (!staged.length) {
  console.log('Изменений нет — отправлять нечего.');
  process.exit(0);
}
const personal = staged.filter(
  (f) =>
    (/^contents_user\/(profile|traks)\//.test(f) && !f.includes('/.template-content/')) ||
    /^(dist|deploy)\//.test(f),
);
if (personal.length) {
  run('git', ['reset', '-q']);
  console.error(`\nВ коммит попали личные файлы — отправка отменена:\n  ${personal.join('\n  ')}`);
  console.error('Проверьте .gitignore: профиль, треки и сборки в репозиторий не выкладываются.');
  process.exit(1);
}
console.log(out(['status', '--short']));
run('git', ['commit', '-q', '-m', message]);

console.log('\n4/4 Отправка на GitHub');
run('git', ['push']);
console.log(`\nГотово: «${message}» на GitHub (${out(['log', '-1', '--format=%h'])}).`);
