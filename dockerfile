FROM node

# set a directory for the app
WORKDIR /usr/src/app

# copy all the files to the container
COPY . .

# install node dependencies
RUN npm install

EXPOSE 3000
CMD ["node", "server"]