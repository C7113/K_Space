# 1. 使用轻量级 Nginx 镜像（基于 Alpine Linux）
FROM nginx:alpine

# 2. 删除 Nginx 默认的欢迎页面
RUN rm -rf /usr/share/nginx/html/*

# 3. 将本地所有文件复制到容器的 Web 目录
COPY . /usr/share/nginx/html

# 4. 声明服务运行在 80 端口
EXPOSE 80

# 5. 启动 Nginx（前台运行，保持容器不退出）
CMD ["nginx", "-g", "daemon off;"]