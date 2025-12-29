const fs = require('fs');
const path = require('path');

const baseDir = 'C:\\Users\\tony\\Development\\metaplex\\developer-hub\\src\\pages\\ja';

// Patterns to replace
const replacements = [
  { from: /\(\/ja\/cli\//g, to: '(/ja/dev-tools/cli/' },
  { from: /\(\/ja\/core-candy-machine/g, to: '(/ja/smart-contracts/core-candy-machine' },
  { from: /\(\/ja\/core\//g, to: '(/ja/smart-contracts/core/' },
];

function getAllMdFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);

  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat && stat.isDirectory()) {
      results = results.concat(getAllMdFiles(filePath));
    } else if (file.endsWith('.md')) {
      results.push(filePath);
    }
  });

  return results;
}

const mdFiles = getAllMdFiles(baseDir);
let fixedCount = 0;

mdFiles.forEach(file => {
  try {
    let content = fs.readFileSync(file, 'utf8');
    const originalContent = content;

    // Apply all replacements
    replacements.forEach(({ from, to }) => {
      content = content.replace(from, to);
    });

    // Write back if changed
    if (content !== originalContent) {
      fs.writeFileSync(file, content, 'utf8');
      console.log(`Fixed: ${file}`);
      fixedCount++;
    }
  } catch (error) {
    console.error(`Error processing ${file}:`, error.message);
  }
});

console.log(`\nDone! Fixed ${fixedCount} files out of ${mdFiles.length} total files.`);
