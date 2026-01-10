# use the official Bun image for building
# see all versions at https://hub.docker.com/r/oven/bun/tags
FROM oven/bun:1 AS base
WORKDIR /usr/src/app

# install dependencies into temp directory
# this will cache them and speed up future builds
FROM base AS install
RUN mkdir -p /temp/dev
COPY package.json bun.lock /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile

# copy node_modules from temp directory
# then copy all (non-ignored) project files into the image
FROM base AS build
COPY --from=install /temp/dev/node_modules node_modules
COPY . .

# generate static files
ENV NODE_ENV=production
RUN bun run generate

# use nginx to serve static files
FROM nginx:alpine AS release

# copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# copy generated static files from build stage
COPY --from=build /usr/src/app/.output/public /usr/share/nginx/html

# expose port 80
EXPOSE 80

# nginx runs as non-root by default in alpine
CMD ["nginx", "-g", "daemon off;"]