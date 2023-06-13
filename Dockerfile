FROM nginx:alpine
WORKDIR /etc/nginx
COPY nginx.conf ./
EXPOSE 443
