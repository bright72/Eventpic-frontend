# # build stage
# FROM node:lts-alpine as build-stage
# WORKDIR /app
# COPY ./package*.json .
# RUN npm install
# COPY . .
# RUN yarn build

# # production stage
# FROM nginx:stable-alpine as production-stage
# COPY --from=build-stage /app/public /usr/share/nginx/html
# COPY ./nginx/default.conf /etc/nginx/conf.d/
# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]

# base image
FROM node:9.11

# set working directory
RUN mkdir /usr/src/app
WORKDIR /usr/src/app

# add `/usr/src/app/node_modules/.bin` to $PATH
ENV PATH /usr/src/app/node_modules/.bin:$PATH

# install and cache app dependencies
COPY package.json /usr/src/app/package.json
RUN npm install
RUN npm install react-scripts -g

# start app
CMD ["npm", "start"]