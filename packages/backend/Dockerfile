FROM node:22-alpine AS build

WORKDIR /source

COPY ./packages/frontend .

RUN yarn --frozen-lockfile && \
    yarn build

FROM node:22-alpine AS run

WORKDIR /app/frontend/dist

COPY --from=build /source/dist .

WORKDIR /app/backend

COPY ./packages/backend .

RUN yarn

CMD [ "yarn", "start" ]

