FROM node:12.18

# Bundle app source
COPY . .

# Install & build
RUN yarn install
RUN yarn build

# Expose
EXPOSE 5000

# Run
CMD ["yarn", "start"]
