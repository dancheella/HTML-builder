const fs = require('fs/promises');
const path = require('path');

const folderPath = path.join(__dirname, 'files-copy');

async function copyDir() {
  try {
    await fs.access(folderPath);
  } catch (error) {
    await fs.mkdir(folderPath, { recursive: true });
  }
  const existingFiles = await fs.readdir(folderPath);
  const files = await fs.readdir(path.join(__dirname, 'files'), {
    withFileTypes: true,
  });
  for (const existingFile of existingFiles) {
    if (!files.some((file) => file.name === existingFile)) {
      const filePathToRemove = path.join(folderPath, existingFile);
      await fs.unlink(filePathToRemove);
    }
  }
  for (const file of files) {
    if (file.isFile()) {
      const filePath = path.join(__dirname, 'files', file.name);
      const newFilePath = path.join(folderPath, file.name);
      await fs.copyFile(filePath, newFilePath);
    }
  }
}

copyDir().then(() => {
  console.log('Done!');
});
