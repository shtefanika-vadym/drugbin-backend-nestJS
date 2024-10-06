FROM node:18

WORKDIR /usr/src/app

COPY package.json ./

# Install the NestJS CLI globally
RUN npm install -g @nestjs/cli

# Install production dependencies.
RUN npm install --omit=dev

# Copy the rest of the application code.
COPY . .

RUN npm run build

CMD ["npm", "run", "start:prod"]
