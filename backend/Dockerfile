# Вибираємо Node.js 22
FROM node:22

# Працюємо в папці /app
WORKDIR /app

# Копіюємо package.json та package-lock.json
COPY package*.json ./

# Встановлюємо залежності
RUN npm install

# Копіюємо весь бекенд
COPY . .

# Генеруємо Prisma клієнт
RUN npx prisma generate


# Будуємо проект (якщо Nest.js)
RUN npm run build

# Виставляємо порт
EXPOSE 3000

# Команда для запуску продакшн-сервера
CMD ["npm", "run", "start"]
