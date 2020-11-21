# Dockerfile
# 1st Stage
FROM node:12.18 as build-stage
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
ENV PATH /usr/src/app/node_modules/.bin:$PATH
COPY . .
RUN npm install
RUN npm run build

# 2nd Stage
FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /usr/src/app/build /usr/share/nginx/html
COPY ./nginx/default.conf /etc/nginx/conf.d/
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]