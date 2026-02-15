import { execSync } from 'child_process';
import { copyFileSync, cpSync, rmSync } from 'fs';
import metadata from '../commons/metadata.json' with { type: 'json' };

rmSync('out', { recursive: true, force: true });

cpSync('public', 'out', { recursive: true });
copyFileSync(`pages/404.html`, `out/404.html`);

for (const [page, path] of Object.entries(metadata.paths)) {
  execSync(`cd pages/${page} && tsc -b && vite build`, { stdio: 'inherit' });
  cpSync(`pages/${page}/out/assets`, `out/${path}assets`, { recursive: true });
  copyFileSync(`pages/${page}/out/index.html`, `out/${path}index.html`);
  rmSync(`pages/${page}/out`, { recursive: true, force: true });
}

console.log('\nBuild completed successfully.\n');
