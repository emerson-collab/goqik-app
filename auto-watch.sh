#!/bin/bash
set -euo pipefail

REPO="emerson-collab/goqik-app"

while true; do
  run=$(gh run list -R "$REPO" --limit 1 --json id,status,conclusion,url | jq -r '.[0] | "\(.id) \(.status) \(.conclusion) \(.url)"')
  id=$(echo $run | awk '{print $1}')
  status=$(echo $run | awk '{print $2}')
  conclusion=$(echo $run | awk '{print $3}')
  url=$(echo $run | awk '{print $4}')

  echo "⏱ 状态: $status / 结果: $conclusion / 日志: $url"

  if [ "$status" = "completed" ]; then
    if [ "$conclusion" = "success" ]; then
      echo "✅ CI/CD 成功，退出监控。"
      break
    else
      echo "❌ CI/CD 失败，自动重跑..."
      gh run rerun $id -R "$REPO"
    fi
  fi

  sleep 30
done
