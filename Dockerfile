# ─── Stage 1 : on part directement du JAR déjà buildé par Maven ─────────────
# (le build Maven est fait par le runner GitHub Actions, pas dans Docker)
FROM eclipse-temurin:21-jre-alpine

# ── Sécurité : mise à jour des paquets Alpine (fix CVE-2026-4738 zlib, etc.) ─
RUN apk update && apk upgrade --no-cache

# ── Sécurité : user non-root (exigé par Checkov CKV_DOCKER_3) ───────────────
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

# ── Copie du JAR produit par Maven ───────────────────────────────────────────
COPY target/*.jar app.jar

# ── Propriété du fichier pour l'utilisateur non-root ─────────────────────────
RUN chown appuser:appgroup app.jar

USER appuser

# ── Port applicatif ───────────────────────────────────────────────────────────
EXPOSE 8089

# ── Health check → indicateur vert dans Docker Desktop ───────────────────────
HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=3 \
  CMD wget -qO- http://localhost:8089/student/students/getAllStudents \
      || exit 1

# ── Point d'entrée ────────────────────────────────────────────────────────────
ENTRYPOINT ["java", "-jar", "app.jar"]