#!/bin/bash

# Проверьте, передан ли путь к файлу
if [ "$#" -lt 1 ]; then
  echo "Использование: $0 <путь_к_json_файлу>"
  exit 1
fi

JSON_FILE="$1"

# Проверьте, существует ли файл
if [ ! -f "$JSON_FILE" ]; then
  echo "Файл $JSON_FILE не найден"
  exit 1
fi

# Создаем резервную копию исходного файла
BACKUP_FILE="${JSON_FILE}.backup.json"
cp "$JSON_FILE" "$BACKUP_FILE"

# Используем `jq` для обработки JSON и выводим результат в консоль
echo "Результат преобразований:"
jq '(.items[] | .url) |= (. | sub("head_[0-9a-zA-Z]{8}\\.(?<num>\\d{3})\\.glb"; "Head." + .num + ".glb"))
   | (.items[] | .thumbnail) |= (. | sub("head\\d{3}_[0-9a-zA-Z]{8}\\.png"; "head.jpg"))' "$JSON_FILE"


# Используем `jq` для обработки JSON
jq '(.items[] | .url) |= (. | sub("head_[0-9a-zA-Z]{8}\\.(?<num>\\d{3})\\.glb"; "Head." + .num + ".glb"))
   | (.items[] | .thumbnail) |= (. | sub("head\\d{3}_[0-9a-zA-Z]{8}\\.png"; "head.jpg"))' "$JSON_FILE" > tmp.json

# Перезаписываем исходный файл
mv tmp.json "$JSON_FILE"

echo "Файл обработан. Оригинал сохранен как $BACKUP_FILE"
