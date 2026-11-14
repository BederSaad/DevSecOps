FROM nginx:1.27-alpine

# Set up non-root user permissions for Nginx Alpine
# Nginx Alpine provides 'nginx' user (uid/gid 101)
RUN touch /var/run/nginx.pid && \
    chown -R nginx:nginx /var/run/nginx.pid /var/cache/nginx /var/log/nginx /etc/nginx/conf.d

# Copy custom nginx configuration for reverse proxy and SPA routing
COPY --chown=nginx:nginx nginx.conf /etc/nginx/conf.d/default.conf

# Copy compiled frontend assets
COPY --chown=nginx:nginx dist /usr/share/nginx/html

USER nginx

EXPOSE 80

# Checkov CKV_DOCKER_2: Ensure HEALTHCHECK is added
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:80/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
