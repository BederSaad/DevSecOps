FROM mariadb:10.11

# Bake WSL2-compatible config into the image.
# This applies during BOTH mariadb-install-db (init) AND the main server startup.
# Using COPY ensures the file is owned by root with 644 permissions —
# avoiding the "world-writable config file ignored" issue from Windows bind mounts.
COPY wsl2.cnf /etc/mysql/mariadb.conf.d/99-wsl2.cnf
