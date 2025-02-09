FROM node:22 AS builder

COPY ./ /app
    
WORKDIR /app
    
RUN npm install --force
RUN npm run build --force

FROM busybox:uclibc

COPY --from=builder /app/dist /app

CMD [ "sh", "-c", "trap 'exit 0' SIGTERM; while true; do sleep 1; done" ]
