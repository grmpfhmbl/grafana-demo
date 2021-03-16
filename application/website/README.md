# Usage

Generate app:

```bash
. ../.env
docker build \
    --build-arg NG_CLI_VERSION=${NG_CLI_VERSION} \
    --build-arg APPNAME=${APPNAME} \
    --target ng-cli-seed \
    -t grmpfhmbl/ng-cli-seed:${NG_CLI_VERSION} \
    .

docker run \
    -v ${PWD}/app:/home/node/app \
    --name ng-cli-seed \
    -it \
    grmpfhmbl/ng-cli-seed:${NG_CLI_VERSION}

docker-compose up -d --build

```
