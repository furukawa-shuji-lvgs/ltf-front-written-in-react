# syntax=docker/dockerfile:1.7

ARG NODE_VERSION="24.18.0"
ARG CUSTOM_ENV="development"
ARG BASE_IMAGE="public.ecr.aws/docker/library/node:${NODE_VERSION}-alpine"

FROM ${BASE_IMAGE} AS base

ENV APP_ROOT=/app
ENV HOST=0.0.0.0
ENV NEXT_TELEMETRY_DISABLED=1
ENV PNPM_HOME=/pnpm
ENV PATH=${PNPM_HOME}:${PATH}

WORKDIR ${APP_ROOT}

RUN corepack enable && corepack prepare pnpm@10.23.0 --activate


FROM base AS deps

RUN apk add --no-cache libc6-compat

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./

RUN --mount=type=cache,id=ltf-react-pnpm-store,target=/pnpm/store \
    --mount=type=secret,id=node_auth_token \
    if [ -f /run/secrets/node_auth_token ]; then export NODE_AUTH_TOKEN="$(cat /run/secrets/node_auth_token)"; fi; \
    pnpm install --frozen-lockfile


FROM deps AS builder

ARG CUSTOM_ENV
ENV CUSTOM_ENV=${CUSTOM_ENV}

COPY . .

RUN pnpm build


FROM base AS server

ARG CUSTOM_ENV

ENV CUSTOM_ENV=${CUSTOM_ENV}
ENV NODE_ENV=production

COPY --chown=node:node --from=builder ${APP_ROOT}/.next/standalone ./
COPY --chown=node:node --from=builder ${APP_ROOT}/.next/static ./.next/static
COPY --chown=node:node --from=builder ${APP_ROOT}/public ./public

USER node

EXPOSE 3000

CMD ["node", "server.js"]
