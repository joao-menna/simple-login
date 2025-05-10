FROM node:22-alpine AS build

WORKDIR /source

COPY ./packages/frontendvuln .

RUN yarn --frozen-lockfile && \
    yarn build

FROM node:22-alpine AS run

WORKDIR /app/frontendvuln/dist

COPY --from=build /source/dist .

WORKDIR /app/backendvuln

COPY ./packages/backendvuln .

RUN yarn

CMD [ "yarn", "start" ]

