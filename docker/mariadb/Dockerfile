FROM mariadb:10.11

# Checkov CKV_DOCKER_3 & CKV_DOCKER_8: MariaDB base image uses 'mysql' user (uid 999)
# Bake WSL2-compatible config into the image.
COPY --chown=mysql:mysql wsl2.cnf /etc/mysql/mariadb.conf.d/99-wsl2.cnf

USER mysql

# Checkov CKV_DOCKER_2: Ensure HEALTHCHECK is added
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD mariadb-admin ping -h localhost || exit 1
