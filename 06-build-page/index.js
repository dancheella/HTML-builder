const fs = require('fs/promises');
const path = require('path');

// функция для замены тегов шаблона на содержимое компонентов
async function replaceTags(template, components) {
  for (const tag in components) {
    const filePath = components[tag]; // получаю путь к файлу компонента
    const ext = path.extname(filePath); // получаю расширение файла компонента
    if (ext !== '.html') {
      throw new Error(
        `Invalid file extension: ${ext}. Only .html files are allowed.`,
      );
    }
    const content = await fs.readFile(filePath, 'utf-8'); // получаю содержимое файла компонента
    const regex = new RegExp(`{{${tag}}}`, 'g'); // создаю регулярное выражение для поиска тегов компонента в шаблоне

    template = template.replace(regex, content); // заменяю все теги компонента на его содержимое в шаблоне
  }
  return template;
}

// функция для сборки проекта
async function buildPage() {
  const sourceDir = __dirname; // получаю путь к директории проекта

  // создаю директорию для результатов сборки проекта
  const distDir = path.join(__dirname, 'project-dist');
  await fs.mkdir(distDir, { recursive: true });

  // читаю и заменяю теги шаблона на содержимое компонентов
  const template = await fs.readFile(
    path.join(sourceDir, 'template.html'),
    'utf-8',
  );
  const componentsDir = path.join(sourceDir, 'components');
  const components = {};
  const componentFiles = await fs.readdir(componentsDir);
  // для каждого файла компонента в директории components
  for (const file of componentFiles) {
    const filePath = path.join(componentsDir, file);
    const stat = await fs.stat(filePath); // получаю информацию о файле
    if (stat.isFile()) {
      const componentName = path.basename(filePath, path.extname(filePath)); // получаю имя компонента по имени файла
      components[componentName] = filePath; // сохраняю путь к файлу компонента по его имени
    }
  }
  const indexHtml = await replaceTags(template, components); // заменяю теги в шаблоне на содержимое компонентов
  await fs.writeFile(path.join(distDir, 'index.html'), indexHtml); // записываю обновленный шаблон

  // объединяю все файлы стилей в один
  const stylesDir = path.join(sourceDir, 'styles'); // получаю путь к директории стилей
  const styles = []; // создаю пустой массив для хранения содержимого всех файлов стилей
  const styleFiles = await fs.readdir(stylesDir); // читаю содержимое директории стилей
  // перебираю все файлы в директории стилей
  for (const file of styleFiles) {
    const filePath = path.join(stylesDir, file); // получаю путь к файлу стиля
    const stat = await fs.stat(filePath); // получаю информацию о файле стиля
    if (stat.isFile() && path.extname(filePath) === '.css') {
      const content = await fs.readFile(filePath, 'utf-8'); // читаю содержимое файла стиля
      styles.push(content); // добавляю содержимое файла стиля в массив содержимого всех файлов стилей
    }
  }
  const styleCss = styles.join('\n'); // объединяю содержимое всех файлов стилей
  await fs.writeFile(path.join(distDir, 'style.css'), styleCss); // записываю объединенный файл стилей в папку с результатами сборки проекта

  // копируем все файлы ресурсов
  const assetsDir = path.join(sourceDir, 'assets'); // получаю путь к директории ресурсов
  const assetsDistDir = path.join(distDir, 'assets'); // создаю папку для копирования ресурсов
  // создаю асинхронную функцию для копирования файлов и директорий
  const copy = async (src, dest) => {
    const srcStat = await fs.stat(src); // получаю информацию о файле для копирования
    if (srcStat.isDirectory()) {
      await fs.mkdir(dest, { recursive: true }); // создаю папку в папке с результатами сборки проекта
      const files = await fs.readdir(src); // получаю список файлов для копирования
      // перебираю все файлы для копирования
      for (const file of files) {
        await copy(path.join(src, file), path.join(dest, file)); // рекурсивно вызываю функцию для копирования каждого файла
      }
    } else if (srcStat.isFile()) {
      await fs.copyFile(src, dest);
    }
  };
  await copy(assetsDir, assetsDistDir); // вызываю функцию для копирования всех файлов
}

buildPage().then(() => {
  console.log('Done!');
});
