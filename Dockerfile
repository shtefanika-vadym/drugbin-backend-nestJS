FROM node:18

WORKDIR /usr/src/app

COPY package.json ./

# Install production dependencies.
RUN npm install --only=production

# Copy the rest of the application code.
COPY . .

RUN npm run build

CMD ["npm", "run", "start:prod"]
