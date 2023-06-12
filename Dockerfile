FROM nginx:alpine
WORKDIR /data/hugobde.dev
COPY index.html robots.txt ./
COPY images ./images
COPY public ./public
WORKDIR /etc/nginx
COPY nginx.conf ./
WORKDIR /etc/ssl
COPY hugobde.dev.crt hugobde.dev.key ./
