#!/usr/bin/env bash
# ==============================================================================
# setup-runner.sh — Install and register GitHub Actions self-hosted runner
#                   on WSL2 Ubuntu for Docker Compose deployments.
#
# Run this ONCE inside WSL2:
#   bash setup-runner.sh
#
# Prerequisites:
#   - WSL2 Ubuntu running
#   - Docker Desktop with "Use WSL2 based engine" enabled
#   - GitHub repo admin access to get the runner token
# ==============================================================================

set -euo pipefail

REPO_URL="https://github.com/BederSaad/DevSecOps"
RUNNER_VERSION="2.329.0"
RUNNER_DIR="${HOME}/actions-runner"
RUNNER_NAME="wsl2-compose-runner"
RUNNER_LABELS="self-hosted,linux,compose-deploy"

echo "=============================================="
echo " GitHub Actions Self-Hosted Runner Setup"
echo "=============================================="
echo ""

# ── Check Docker is accessible ──────────────────────────────────────────────
if ! docker info &>/dev/null; then
  echo "❌ Docker is not accessible from WSL2."
  echo "   Enable: Docker Desktop → Settings → Resources → WSL Integration → Ubuntu-24.04"
  exit 1
fi
echo "✅ Docker accessible from WSL2"

# ── Create runner directory ──────────────────────────────────────────────────
mkdir -p "$RUNNER_DIR"
cd "$RUNNER_DIR"

# ── Download runner ──────────────────────────────────────────────────────────
if [ ! -f "run.sh" ]; then
  echo "Downloading GitHub Actions runner v${RUNNER_VERSION}..."
  curl -sLO "https://github.com/actions/runner/releases/download/v${RUNNER_VERSION}/actions-runner-linux-x64-${RUNNER_VERSION}.tar.gz"
  tar xzf "actions-runner-linux-x64-${RUNNER_VERSION}.tar.gz"
  rm "actions-runner-linux-x64-${RUNNER_VERSION}.tar.gz"
  echo "✅ Runner downloaded and extracted"
else
  echo "✅ Runner already downloaded"
fi

# ── Install dependencies ─────────────────────────────────────────────────────
echo "Installing runner dependencies..."
sudo ./bin/installdependencies.sh 2>/dev/null || true

# ── Install cosign ──────────────────────────────────────────────────────────
if ! command -v cosign &>/dev/null; then
  echo "Installing Cosign..."
  COSIGN_VERSION=$(curl -s https://api.github.com/repos/sigstore/cosign/releases/latest \
    | grep '"tag_name"' | cut -d'"' -f4)
  curl -sLO "https://github.com/sigstore/cosign/releases/download/${COSIGN_VERSION}/cosign-linux-amd64"
  chmod +x cosign-linux-amd64
  sudo mv cosign-linux-amd64 /usr/local/bin/cosign
  echo "✅ Cosign installed: $(cosign version 2>&1 | head -1)"
fi

# ── Get runner registration token from user ──────────────────────────────────
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Get a runner token from GitHub:"
echo "  ${REPO_URL}/settings/actions/runners/new"
echo "  Select: Linux / x64"
echo "  Copy the token from the './config.sh' command shown"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
read -rsp "Paste your runner registration token: " RUNNER_TOKEN
echo ""

# ── Configure runner ─────────────────────────────────────────────────────────
echo "Configuring runner..."
./config.sh \
  --url "$REPO_URL" \
  --token "$RUNNER_TOKEN" \
  --name "$RUNNER_NAME" \
  --labels "$RUNNER_LABELS" \
  --work "_work" \
  --unattended \
  --replace

echo "✅ Runner configured with labels: $RUNNER_LABELS"

# ── Install as systemd service (auto-start with WSL2) ───────────────────────
echo ""
echo "Installing runner as a background service..."
sudo ./svc.sh install
sudo ./svc.sh start
sudo ./svc.sh status

echo ""
echo "=============================================="
echo "✅ Runner setup complete!"
echo "=============================================="
echo ""
echo "Runner name:   $RUNNER_NAME"
echo "Runner labels: $RUNNER_LABELS"
echo ""
echo "Check it appears at:"
echo "  ${REPO_URL}/settings/actions/runners"
echo ""
echo "To stop runner:"
echo "  cd ~/actions-runner && sudo ./svc.sh stop"
echo ""
echo "To view runner logs:"
echo "  journalctl -u actions.runner.* -f"
