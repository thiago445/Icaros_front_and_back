import fs from 'fs';
import path from 'path';

const SRC_DIR = path.resolve('src');

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      walkDir(fullPath);
    } else if (fullPath.endsWith('.js')) {
      fixImportsInFile(fullPath);
    }
  }
}

function fixImportsInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Regex para pegar importações: import ... from '...';
  // Também pega import ... from "...";
  // Não pega require, só imports ES6
  const importRegex = /import\s+[^'"]+\s+from\s+['"](.+?)['"]/g;

  let changed = false;

  content = content.replace(importRegex, (match, importPath) => {
    // Se o caminho é relativo (começa com ./ ou ../)
    if (importPath.startsWith('./') || importPath.startsWith('../')) {
      // Se já tem extensão, não faz nada
      if (path.extname(importPath) === '') {
        changed = true;
        return match.replace(importPath, importPath + '.js');
      }
    }
    return match;
  });

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Corrigido imports em: ${filePath}`);
  }
}

walkDir(SRC_DIR);
