#!/usr/bin/env pwsh
# ==============================================================================
# bootstrap-k8s.ps1 — One-shot Kubernetes setup script for student-management
#
# Run this ONCE after Docker Desktop Kubernetes reset to:
#   1. Create the namespace and all base manifests
#   2. Inject real secrets (prompts you for values)
#   3. Set up the GitHub Actions self-hosted runner
#   4. Deploy the Cloudflare Tunnel
#
# Usage:
#   cd <repo-root>
#   .\k8s\bootstrap-k8s.ps1
# ==============================================================================

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Write-Step { param($msg) Write-Host "`n==> $msg" -ForegroundColor Cyan }
function Write-Ok   { param($msg) Write-Host "    OK: $msg" -ForegroundColor Green }
function Write-Warn { param($msg) Write-Host "    WARN: $msg" -ForegroundColor Yellow }

Write-Step "Checking prerequisites"
kubectl version --client | Out-Null
kubectl cluster-info | Out-Null
Write-Ok "kubectl connected to cluster"

Write-Step "Creating namespace and base resources"
kubectl apply -f k8s\00-namespace.yaml
kubectl apply -f k8s\02-mysql-configmap.yaml
kubectl apply -f k8s\03-app-configmap.yaml
kubectl apply -f k8s\04-mysql-pvc.yaml

Write-Step "Injecting secrets (you will be prompted for values)"

$mysqlRootPw  = Read-Host "MySQL root password (min 12 chars)" -AsSecureString
$mysqlUser    = Read-Host "MySQL app username (e.g. studentapp)"
$mysqlPw      = Read-Host "MySQL app password (min 12 chars)" -AsSecureString
$ghToken      = Read-Host "GitHub PAT with packages:read scope (for image pull)"
$ghActor      = Read-Host "GitHub username (e.g. BederSaad)"
$cfToken      = Read-Host "Cloudflare Tunnel token (from zero-trust dashboard)" -AsSecureString
$runnerToken  = Read-Host "GitHub Actions runner registration token"

$mysqlRootPwPlain = [System.Net.NetworkCredential]::new('', $mysqlRootPw).Password
$mysqlPwPlain     = [System.Net.NetworkCredential]::new('', $mysqlPw).Password
$cfTokenPlain     = [System.Net.NetworkCredential]::new('', $cfToken).Password

Write-Step "Creating MySQL secret"
kubectl create secret generic mysql-secret `
  "--from-literal=mysql-root-password=$mysqlRootPwPlain" `
  "--from-literal=mysql-database=studentdb" `
  "--from-literal=mysql-username=$mysqlUser" `
  "--from-literal=mysql-password=$mysqlPwPlain" `
  -n student-management `
  --dry-run=client -o yaml | kubectl apply -f -
Write-Ok "mysql-secret created/updated"

Write-Step "Creating GHCR image pull secret"
kubectl create secret docker-registry ghcr-secret `
  "--docker-server=ghcr.io" `
  "--docker-username=$ghActor" `
  "--docker-password=$ghToken" `
  -n student-management `
  --dry-run=client -o yaml | kubectl apply -f -
Write-Ok "ghcr-secret created/updated"

Write-Step "Creating Cloudflare Tunnel secret"
kubectl create secret generic cloudflare-tunnel-secret `
  "--from-literal=tunnel-token=$cfTokenPlain" `
  -n student-management `
  --dry-run=client -o yaml | kubectl apply -f -
Write-Ok "cloudflare-tunnel-secret created/updated"

Write-Step "Creating GitHub runner secret"
kubectl create secret generic github-runner-secret `
  "--from-literal=github-token=$runnerToken" `
  -n student-management `
  --dry-run=client -o yaml | kubectl apply -f -
Write-Ok "github-runner-secret created/updated"

Write-Step "Deploying MySQL StatefulSet and Services"
kubectl apply -f k8s\05-mysql-statefulset.yaml
kubectl apply -f k8s\06-mysql-service.yaml

Write-Step "Waiting for MySQL to be ready (up to 3 minutes)"
kubectl rollout status statefulset/mysql -n student-management --timeout=180s
Write-Ok "MySQL is ready"

Write-Step "Deploying application"
kubectl apply -f k8s\07-app-deployment.yaml
kubectl apply -f k8s\08-app-service.yaml

Write-Step "Deploying Cloudflare Tunnel"
kubectl apply -f k8s\09-cloudflare-tunnel.yaml

Write-Step "Deploying GitHub Actions self-hosted runner"
kubectl apply -f k8s\10-github-runner.yaml

Write-Step "Waiting for application to roll out (up to 5 minutes)"
kubectl rollout status deployment/student-management -n student-management --timeout=300s
Write-Ok "Application is ready"

Write-Step "Deployment summary"
kubectl get pods -n student-management
kubectl get services -n student-management

Write-Host "`n========================================" -ForegroundColor Green
Write-Host "Bootstrap complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:"
Write-Host "  1. Add the self-hosted runner label 'k8s-deploy' in GitHub"
Write-Host "     Repository → Settings → Actions → Runners"
Write-Host "  2. Configure your Cloudflare Tunnel to route to:"
Write-Host "     http://student-management-service.student-management.svc.cluster.local:8089"
Write-Host "  3. Test the public URL from an external device"
Write-Host ""
Write-Host "Quick health check:"
Write-Host "  kubectl port-forward svc/student-management-service 8089:8089 -n student-management"
Write-Host "  Then open: http://localhost:8089/student/students/getAllStudents"
Write-Host "  Swagger:   http://localhost:8089/student/swagger-ui/index.html"
