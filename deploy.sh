#!/bin/bash

# 显示当前目录
echo "Current directory: $(pwd)"

# Git 操作
echo "Performing git operations..."
git add .
git commit -m "Update backend implementation with authentication system"
git push origin main

# 检查部署状态
echo "Checking deployment status..."
curl -s https://express-t27b-142595-4-1344851180.sh.run.tcloudbase.com/health

echo "Deployment script completed." 