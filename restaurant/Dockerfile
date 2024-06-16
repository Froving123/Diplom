FROM node:latest

# Установка Firebase CLI
RUN npm install -g firebase-tools

# Копирование скрипта в контейнер
COPY deploy.sh /app/deploy.sh

# Сделать скрипт исполняемым
RUN chmod +x /app/deploy.sh

# Запуск скрипта при запуске контейнера
CMD ["/app/deploy.sh"]