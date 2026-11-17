import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const site = path.join(root, 'Portfolio', 'wwwroot');
const pages = ['index.html', 'es/index.html', 'en/index.html', 'fr/index.html'];
const errors = [];
const warnings = [];

const decode = (value) => {
  try { return decodeURIComponent(value.replaceAll('&amp;', '&')); }
  catch { return value; }
};

function localTarget(sourceFile, rawTarget) {
  const target = decode(rawTarget.trim());
  if (!target || target.startsWith('#') || /^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(target)) return null;
  const [withoutQuery] = target.split('?', 1);
  const [pathname, fragment = ''] = withoutQuery.split('#', 2);
  const file = pathname ? path.resolve(path.dirname(sourceFile), pathname) : sourceFile;
  if (!file.startsWith(site + path.sep) && file !== site) return null;
  return { file, fragment };
}

function checkFile(sourceFile, rawTarget, label) {
  const target = localTarget(sourceFile, rawTarget);
  if (!target) return;
  if (!fs.existsSync(target.file) || !fs.statSync(target.file).isFile()) {
    errors.push(`${path.relative(root, sourceFile)}: ${label} aponta para arquivo ausente: ${rawTarget}`);
    return;
  }
  if (target.fragment && target.file.endsWith('.html')) {
    const html = fs.readFileSync(target.file, 'utf8').replace(/<!--[\s\S]*?-->/g, '');
    const ids = new Set([...html.matchAll(/\bid\s*=\s*(["'])(.*?)\1/gi)].map((match) => decode(match[2])));
    if (!ids.has(decode(target.fragment))) {
      errors.push(`${path.relative(root, sourceFile)}: âncora #${target.fragment} não existe em ${path.relative(root, target.file)}`);
    }
  }
}

const pageIds = new Map();
for (const relativePage of pages) {
  const page = path.join(site, relativePage);
  const raw = fs.readFileSync(page, 'utf8');
  const html = raw.replace(/<!--[\s\S]*?-->/g, '');
  const ids = [...html.matchAll(/\bid\s*=\s*(["'])(.*?)\1/gi)].map((match) => decode(match[2]));
  const seen = new Set();
  for (const id of ids) {
    if (seen.has(id)) errors.push(`${relativePage}: ID duplicado "${id}"`);
    seen.add(id);
  }
  pageIds.set(relativePage, seen);

  if (!/<html\b[^>]*\blang\s*=\s*["'][^"']+["']/i.test(html)) errors.push(`${relativePage}: atributo lang ausente no HTML`);
  if (!/<title>\s*[^<]+\s*<\/title>/i.test(html)) errors.push(`${relativePage}: título da página ausente`);
  for (const match of html.matchAll(/\b(?:href|src|poster)\s*=\s*(["'])(.*?)\1/gi)) checkFile(page, match[2], match[0].split('=')[0].trim());
  for (const match of html.matchAll(/\bsrcset\s*=\s*(["'])(.*?)\1/gi)) {
    for (const candidate of match[2].split(',')) checkFile(page, candidate.trim().split(/\s+/)[0], 'srcset');
  }
  for (const match of html.matchAll(/<img\b([^>]*)>/gi)) {
    if (!/\balt\s*=\s*["']/i.test(match[1])) warnings.push(`${relativePage}: imagem sem atributo alt`);
  }
}

const referencePage = pageIds.get('index.html');
for (const relativePage of pages.slice(1)) {
  const ids = pageIds.get(relativePage);
  for (const id of referencePage) if (!ids.has(id)) errors.push(`${relativePage}: falta ID compartilhado "${id}"`);
  for (const id of ids) if (!referencePage.has(id)) errors.push(`${relativePage}: ID não encontrado na versão PT "${id}"`);
}

const cssFile = path.join(site, 'css', 'style.css');
const css = fs.readFileSync(cssFile, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
for (const match of css.matchAll(/url\(\s*(["']?)(.*?)\1\s*\)/gi)) {
  const url = decode(match[2]);
  if (/^(?:data:|[a-z][a-z\d+.-]*:|\/\/|#)/i.test(url)) continue;
  checkFile(cssFile, url, 'CSS url()');
}

for (const relativeScript of ['js/app.js', 'js/audio.js', 'js/fractal.js', 'js/projects.js', 'js/shader.js']) {
  const source = fs.readFileSync(path.join(site, relativeScript), 'utf8');
  if (!source.trim()) errors.push(`${relativeScript}: arquivo JavaScript vazio`);
}

for (const message of warnings) console.warn(`AVISO  ${message}`);
for (const message of errors) console.error(`ERRO   ${message}`);
if (errors.length) {
  console.error(`\nFalha: ${errors.length} erro(s), ${warnings.length} aviso(s).`);
  process.exitCode = 1;
} else {
  console.log(`OK: ${pages.length} idiomas, IDs alinhados, links locais e imagens com alt verificados.`);
  console.log(`Avisos: ${warnings.length}. Nenhum arquivo é removido por este verificador.`);
}
