# Егор Перец Макасович

## Установка

1. `git clone https://github.com/l-iterator/pepper.git`
2. `npm install`
3. Создать `config.json` из `config-template.json` и заполнить своими данными
4. Можно запускать `node index.js`

## Бэкапы

Просто бэкапить `db.json` регулярно.

## Разработка

1. В папке `commands` можно добавлять новые команды, но не забывать делать соответствующие изменения в `commands/index.js`
2. `utils/embed.js` содержит функцию для генерации эмбеда со своим стилем, чтобы не переобозначивать его заново при создании каждого эмбеда
3. `db-defaults.json` - стоит редачить, если понадобилась схема. Скорее всего, можно обойтись таблицей `userData`, которая каждому id сопоставляет данные о пользователе (например, количество валюты)

## Если возникли вопросы с кодом

Нужно запушить весь код в ветку `nightly` и задать вопрос в дискорде.

https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/about-branches
