Docker simple Demo
==================

Small Demo that ties together a PostGIS, QGISserver and Webserver with Webmap.

`docker-compose up -d` creates all containers and starts DB.

`docker-compose exec gdal /bin/bash` opens a terminal inside the GDAL container.

Inside this terminal run the following to import SHP into DB:
```bash
ogr2ogr -nlt PROMOTE_TO_MULTI -lco precision=NO \
        -f "PostgreSQL" PG:"service=demofoo" \
        /var/host_data/ST_Gemeindegrenzen_2014/Gemeindegrenzen.shp
```

- QGis default GetCapability URLs 
  - http://localhost:8081/ows?service=WMS&request=GetCapabilities
  - http://localhost:8081/ows?service=WFS&request=GetCapabilities

Simple Openlayersmap: http://localhost:8080

If you want to persist the DB, you have to uncomment the volume in `docker-compose.yml` for the `postgis` service.

Add the `demofoo` service to your local `pg_service.conf` and open the QGS project from the `qgisserver` directory in
your local QGIS. Change the Layerstyle and reload the webpage. The WMS layer should have a new default style.

docker run --rm -ti -e DISPLAY=unix${DISPLAY} -v /tmp/.X11-unix:/tmp/.X11-unix -v ${HOME}:${HOME} camptocamp/qgis-server:latest /usr/local/bin/start-client
