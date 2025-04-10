FROM node:20-alpine
WORKDIR /bloggingwebsite-backend
COPY . .
RUN yarn install --production
EXPOSE 3001

