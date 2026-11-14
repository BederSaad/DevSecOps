FROM nginx:alpine

# Copy custom nginx configuration for reverse proxy and SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy compiled frontend assets
COPY dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
