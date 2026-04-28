FROM node:20-alpine AS frontend-build
WORKDIR /app
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci
COPY frontend/ .
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
RUN npm run build

FROM nginx:alpine
COPY --from=frontend-build /app/out /usr/share/nginx/html
COPY nginx/hooktray.conf.template /etc/nginx/templates/default.conf.template
