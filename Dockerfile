FROM node:18

WORKDIR /usr/src/app

COPY package.json ./

RUN npm install

# Install dependencies.
RUN npm install

# Copy the rest of the application code.
COPY . .

RUN npm run build

# Prune dev dependencies to make the image smaller
RUN npm prune --omit=dev

CMD ["npm", "run", "start:prod"]
