const fs = require('fs/promises');
const path = require('path');

const folderPath = path.join(__dirname, 'secret-folder');

async function printFilesInfo() {
  const files = await fs.readdir(folderPath, { withFileTypes: true });
  for (const file of files) {
    if (file.isFile()) {
      const filePath = path.join(folderPath, file.name);
      const fileStat = await fs.stat(filePath);
      const extension = path.extname(file.name).slice(1);
      const sizeInKb = fileStat.size / 1024;
      const fileName = path.basename(file.name, path.extname(file.name));
      console.log(`${fileName} - ${extension} - ${sizeInKb.toFixed(3)}kb`);
    }
  }
}

printFilesInfo().then(() => {
  console.log('Done!');
});
