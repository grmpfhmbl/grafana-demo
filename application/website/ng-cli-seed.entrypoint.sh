#!/usr/bin/env sh
cd ${APPDIR_ABS}
ng new \
    --interactive true \
    --commit false \
    --skip-git true \
    --name ${APPNAME} \
    --directory=.
