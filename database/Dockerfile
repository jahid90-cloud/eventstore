ARG POSTGRES_VERSION
FROM registry.jahiduls.mint/bitnami/postgresql:${POSTGRES_VERSION}

USER root
ARG MESSAGE_DB_VERSION
WORKDIR /usr/src
ADD https://github.com/message-db/message-db/archive/v${MESSAGE_DB_VERSION}.tar.gz message-db.tar.gz
RUN tar -xzf message-db.tar.gz \
    && mv message-db-${MESSAGE_DB_VERSION} message-db \
    && rm message-db.tar.gz

WORKDIR /
COPY docker-entrypoint-initdb.d /docker-entrypoint-initdb.d

USER 1001
