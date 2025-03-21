const fs = require('fs');

// Проверка аргумента на путь к файлу
if (process.argv.length < 3) {
    console.log('Использование: node script.js <путь_к_json_файлу>');
    process.exit(1);
}

const jsonFilePath = process.argv[2];

// Проверка, существует ли файл
if (!fs.existsSync(jsonFilePath)) {
    console.log(`Файл ${jsonFilePath} не найден`);
    process.exit(1);
}

// Чтение JSON файла
const fileContent = fs.readFileSync(jsonFilePath, 'utf8');
let jsonData;

try {
    jsonData = JSON.parse(fileContent);
} catch (error) {
    console.log('Ошибка при парсинге JSON:', error.message);
    process.exit(1);
}

// Создание резервной копии файла
const backupFilePath = `${jsonFilePath}.backup.json`;
fs.copyFileSync(jsonFilePath, backupFilePath);

function firstLetterToUpperCase(str) {
    if (str && str.length > 0) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    return str; // Если строка пуста или не задана, возвращаем её как есть
}
// Преобразование данных
jsonData.items.forEach(item => {
    if (item.url) {
        item.url = item.url.replace(/([a-zA-Z]+)_[0-9a-zA-Z]*\.(\d{3})\.glb/, (match, name, num) => {
            return `${firstLetterToUpperCase(name)}.${num}.glb`
        });
        const parts = item.url.split('_');
        if (parts.length === 2) {
            item.url = firstLetterToUpperCase(parts[0]) + parts[1]
        }
    }

    if (item.thumbnail) {
        item.thumbnail = item.thumbnail.replace(/([a-zA-Z]+)\d{3}_[0-9a-zA-Z]*\.png/, (match, name) => {
            return `${name}.jpg`
        });
    }
});

// Запись обработанных данных обратно в файл
fs.writeFileSync(jsonFilePath, JSON.stringify(jsonData, null, 2));

console.log(`Файл обработан. Оригинал сохранен как ${backupFilePath}`);
