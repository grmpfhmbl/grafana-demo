import {AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Map, View} from 'ol';
import TileLayer from 'ol/layer/Tile';
import {TileWMS} from 'ol/source';
import {fromLonLat} from 'ol/proj';
import {Coordinate} from 'ol/coordinate';
import VectorSource from 'ol/source/Vector';
import {GeoJSON} from 'ol/format';
import {bbox as bboxStrategy} from 'ol/loadingstrategy';
import VectorLayer from 'ol/layer/Vector';
import {Stroke, Style} from 'ol/style';

@Component({
  selector: 'app-ol-map',
  templateUrl: './ol-map.component.html',
  styleUrls: ['./ol-map.component.scss']
})
export class OlMapComponent implements OnInit, AfterViewInit, OnChanges {
  // tslint:disable:no-console

  constructor() {
  }
  map: Map | undefined = undefined;

  @Input() center: Coordinate = fromLonLat([15, 47.2]);
  @Input() zoom = 15;

  private static createWMSLayer(layerName: string): TileLayer {
    const tileLayer = new TileLayer({
      source: new TileWMS({
        url: 'http://10.0.0.3:8081/ows',
        params: {LAYERS: layerName, TILED: true},
      })
    });
    return tileLayer;
  }

  ngOnInit(): void {
    console.debug('ngOnInit()');
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.debug('ngOnChanges()', changes);

    // TODO extract method..
    if (this.map !== undefined) {
      const zoom = changes.zoom !== undefined ? changes.zoom.currentValue : this.zoom;
      const center = changes.center !== undefined ? changes.center.currentValue : this.center;
      this.map.getView().animate({zoom, center});
    }
  }

  ngAfterViewInit(): void {
    console.debug('ngAfterViewInit()');
    if (!this.map) {
      this.map = this.initMap();
    }
  }

  initMap(): Map {
    console.debug('initMap()');
    console.debug('map = ', this.map);
    const map = new Map({
      target: 'map',
      layers: [
/*
        new TileLayer({
          source: new OSM()
        }),
*/
        OlMapComponent.createWMSLayer('gemeindegrenzen'),
        this.createWFSLayer('gemeindegrenzen')
      ],
      view: new View({
        center: this.center,
        zoom: 9
      })
    });
    return map;
  }

  private createWFSLayer(featureName: string): VectorLayer {
    const vectorSource = new VectorSource({
      format: new GeoJSON(),
      url(extent): string {
        const url = 'http://10.0.0.3:8081/ows?service=WFS&version=1.1.0&request=GetFeature' +
          `&typename=${featureName}&outputFormat=application/json&srsname=EPSG:4326&bbox=${extent.join(',')},EPSG:3857`;
        return url;
      },
      strategy: bboxStrategy,
    });

    const vectorLayer =  new VectorLayer({
          source: vectorSource,
          style: new Style({
            stroke: new Stroke({
              color: 'rgba(0, 0, 255, 1.0)',
              width: 2,
            }),
          }),
        });
    return vectorLayer;
  }
}
