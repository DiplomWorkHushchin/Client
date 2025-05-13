# 1. Встановлюємо офіційний Node образ
FROM node:18-alpine

# 2. Встановлюємо робочу директорію
WORKDIR /app

# 3. Копіюємо файли package.json та lock-файл
COPY package*.json ./

# 4. Встановлюємо залежності
RUN npm install

# 5. Копіюємо всі інші файли
COPY . .

# 6. Будуємо Next.js проект
RUN npm run build

# 7. Виставляємо змінну оточення для production
ENV NODE_ENV=production

# 8. Вказуємо порт
EXPOSE 3000

# 9. Стартуємо Next.js
CMD ["npm", "start"]
