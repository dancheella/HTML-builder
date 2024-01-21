const fs = require('fs/promises');
const path = require('path');

const stylesPath = path.join(__dirname, 'styles');
const bundlePath = path.join(__dirname, 'project-dist', 'bundle.css');

async function mergeStyles() {
  const files = await fs.readdir(stylesPath);
  const styles = [];
  for (const file of files) {
    const filePath = path.join(stylesPath, file);
    const stats = await fs.stat(filePath);
    if (stats.isFile() && path.extname(filePath) === '.css') {
      const content = await fs.readFile(filePath);
      styles.push(content);
    }
  }
  await fs.writeFile(bundlePath, styles.join('\n'));
}

mergeStyles().then(() => {
  console.log('Done!');
});
