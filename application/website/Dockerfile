ARG USERHOME="/home/node"
# ng new --directory can't handle absloute paths https://github.com/angular/angular-cli/issues/19496
ARG APPDIR="app"
ARG APPDIR_ABS="${USERHOME}/${APPDIR}"
ARG APPNAME="SeedApp"
ARG NG_CLI_VERSION=11.2.1

FROM node:14-alpine AS ng-cli-seed
# some of this is inspired by this https://github.com/trion-development/docker-ng-cli/blob/master/Dockerfile
ARG USERHOME
ARG APPDIR_ABS
ARG APPNAME
ARG USERID=1000
ARG GROUPID=1000
ARG NG_CLI_VERSION

WORKDIR ${APPDIR_ABS}
EXPOSE 4200

ENV HOME ${USERHOME}
ENV APPDIR ${APPDIR}
ENV APPDIR_ABS ${APPDIR_ABS}
ENV APPNAME ${APPNAME}

# see https://github.com/nodejs/docker-node/blob/master/docs/BestPractices.md#global-npm-dependencies
ENV NPM_CONFIG_PREFIX=${USERHOME}/.npm-global
ENV PATH=$PATH:${USERHOME}/.npm-global/bin

RUN set -xe \
    && mkdir -p "${USERHOME}" \
    && chown ${USERID}:${GROUPID} "${USERHOME}" \
    && chmod a+rw "${USERHOME}" \
    && mkdir -p "${APPDIR_ABS}" \
    && chown ${USERID}:${GROUPID} "${APPDIR_ABS}" \
    && (cd "${USERHOME}"; su node -c "npm install -g @angular/cli@${NG_CLI_VERSION}; npm cache clean --force")

COPY ./ng-cli-seed.entrypoint.sh /ng-cli-seed.entrypoint.sh
RUN chmod +x /ng-cli-seed.entrypoint.sh
ENTRYPOINT ["/ng-cli-seed.entrypoint.sh"]

# ======================================================================================================================
FROM ng-cli-seed AS ng-cli-dev

COPY  ./app/package*.json ${APPDIR_ABS}/
RUN set -xe \
    && cd ${APPDIR_ABS} \
    && npm install

COPY ./app ${APPDIR_ABS}

ENTRYPOINT ["ng", "serve", "--host=0.0.0.0", "--disable-host-check"]

USER ${USERID}

# ======================================================================================================================
FROM ng-cli-dev AS ng-cli-build

USER ${USERID}

RUN set -xe \
   && rm -rf ${APPDIR_ABS}/dist \
   && npm ci \
   && ng lint && ng build --prod

# ======================================================================================================================
FROM nginx:alpine
ARG APPDIR_ABS
ARG APPNAME
COPY --from=ng-cli-build ${APPDIR_ABS}/dist/${APPNAME} /usr/share/nginx/html

