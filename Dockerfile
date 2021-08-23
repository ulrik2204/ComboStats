FROM node:latest
ENV NODE_ENV=development
WORKDIR /app
COPY package.json ./ 
RUN yarn install
COPY . .
EXPOSE 3000
RUN yarn prisma generate
ENTRYPOINT []

