// @ts-nocheck
/* eslint-disable max-classes-per-file, no-underscore-dangle, @typescript-eslint/naming-convention */

import { Cluster } from './Cluster';

type MarkerStylingFunction = (clusterMarker: naver.maps.Marker | null, count: number) => void;

type MarkerClusteringOptions = {
  map?: naver.maps.Map | null;
  markers?: Array<naver.maps.Marker>;
  disableClickZoom?: boolean;
  minClusterSize?: number;
  maxZoom?: number;
  gridSize?: number;
  icons?: Array<naver.maps.ImageIcon | naver.maps.SymbolIcon | naver.maps.HtmlIcon>;
  indexGenerator?: number[] | ((count: number) => number);
  averageCenter?: boolean;
  stylingFunction?: MarkerStylingFunction;
};

export class MarkerClusteringWrapper {
  public markerClustering;

  /**
   * 마커 클러스터링을 정의합니다.
   * @param $naver NAVER 지도 API 전역 변수
   * @param options 마커 클러스터링 옵션
   */
  constructor($naver: typeof naver, options: MarkerClusteringOptions) {
    class MarkerClustering extends $naver.maps.OverlayView {
      public $naver: typeof naver;

      public DEFAULT_OPTIONS: MarkerClusteringOptions;

      private _clusters: Cluster[];

      private _mapRelations: naver.maps.MapEventListener | null;

      private _markerRelations: Array<naver.maps.MapEventListener>;

      /**
       * 마커 클러스터링을 정의합니다.
       * @param $nvr NAVER 지도 API 전역 변수
       * @param opts 마커 클러스터링 옵션
       */
      constructor($nvr: typeof naver, opts: MarkerClusteringOptions) {
        super();

        this.$naver = $nvr;

        // 기본 값입니다.
        this.DEFAULT_OPTIONS = {
          // 클러스터 마커를 올릴 지도입니다.
          map: null,
          // 클러스터 마커를 구성할 마커입니다.
          markers: [],
          // 클러스터 마커 클릭 시 줌 동작 여부입니다.
          disableClickZoom: true,
          // 클러스터를 구성할 최소 마커 수입니다.
          minClusterSize: 2,
          // 클러스터 마커로 표현할 최대 줌 레벨입니다. 해당 줌 레벨보다 높으면, 클러스터를 구성하고 있는 마커를 노출합니다.
          maxZoom: 13,
          // 클러스터를 구성할 그리드 크기입니다. 단위는 픽셀입니다.
          gridSize: 100,
          // 클러스터 마커의 아이콘입니다. NAVER Maps JavaScript API v3에서 제공하는 아이콘, 심볼, HTML 마커 유형을 모두 사용할 수 있습니다.
          icons: [],
          // 클러스터 마커의 아이콘 배열에서 어떤 아이콘을 선택할 것인지 인덱스를 결정합니다.
          indexGenerator: [10, 100, 200, 500, 1000],
          // 클러스터 마커의 위치를 클러스터를 구성하고 있는 마커의 평균 좌표로 할 것인지 여부입니다.
          averageCenter: false,
          // 클러스터 마커를 갱신할 때 호출하는 콜백함수입니다. 이 함수를 통해 클러스터 마커에 개수를 표현하는 등의 엘리먼트를 조작할 수 있습니다.
          stylingFunction() {},
        };

        this._clusters = [];

        this._mapRelations = null;
        this._markerRelations = [];

        this.setOptions({ ...this.DEFAULT_OPTIONS, ...opts }, true);
        this.setMap(opts.map || null);
      }

      public onAdd(): void {
        const map = this.getMap();

        this._mapRelations = this.$naver.maps.Event.addListener(map, 'idle', () => {
          this._onIdle();
        });

        if (this.getMarkers().length > 0) {
          this._createClusters();
          this._updateClusters();
        }
      }

      // eslint-disable-next-line class-methods-use-this
      public draw(): void {
        // noop
      }

      public onRemove(): void {
        this.$naver.maps.Event.removeListener(this._mapRelation);

        this._clearClusters();

        this._geoTree = null;
        this._mapRelation = null;
      }

      /**
       * 마커 클러스터링 옵션을 설정합니다. 설정한 옵션만 반영됩니다.
       * @param newOptions 옵션 이름
       * @param arg 옵션 값
       */
      public setOptions(newOptions: string, arg: unknown): void;
      /**
       * 마커 클러스터링 옵션을 설정합니다. 설정한 옵션만 반영됩니다.
       * @param newOptions 옵션
       * @param arg 최초 설정인지 여부
       */
      public setOptions(newOptions: MarkerClusteringOptions, arg: boolean): void;
      public setOptions(newOptions: string | MarkerClusteringOptions, arg: unknown): void {
        const _this: MarkerClustering = this;

        if (typeof newOptions === 'string') {
          const key = newOptions;
          const value = arg;

          _this.set(key, value);
        } else {
          const isFirst = arg;

          Object.entries(newOptions).forEach(([key, value]) => {
            if (key !== 'map') {
              _this.set(key, value);
            }
          });

          if (newOptions.map && !isFirst) {
            _this.setMap(newOptions.map);
          }
        }
      }

      /**
       * 마커 클러스터링 옵션을 반환합니다. 특정 옵션 이름을 지정하지 않으면, 모든 옵션을 반환합니다.
       * @param key 반환받을 옵션 이름
       * @return 옵션
       */
      public getOptions(key: string): any {
        const _this: MarkerClustering = this;
        const options: MarkerClusteringOptions = {};

        if (key !== undefined) {
          return _this.get(key);
        }

        Object.entries(_this.DEFAULT_OPTIONS).forEach(([k, v]) => {
          options[k] = _this.get(k);
        });

        return options;
      }

      /**
       * 클러스터를 구성하는 최소 마커 수를 반환합니다.
       * @return 클러스터를 구성하는 최소 마커 수
       */
      public getMinClusterSize(): number {
        return this.getOptions('minClusterSize');
      }

      /**
       * 클러스터를 구성하는 최소 마커 수를 설정합니다.
       * @param size 클러스터를 구성하는 최소 마커 수
       */
      public setMinClusterSize(size: number): void {
        this.setOptions('minClusterSize', size);
      }

      /**
       * 클러스터 마커를 노출할 최대 줌 레벨을 반환합니다.
       * @return 클러스터 마커를 노출할 최대 줌 레벨
       */
      public getMaxZoom(): number {
        return this.getOptions('maxZoom');
      }

      /**
       * 클러스터 마커를 노출할 최대 줌 레벨을 설정합니다.
       * @param zoom 클러스터 마커를 노출할 최대 줌 레벨
       */
      public setMaxZoom(zoom: number): void {
        this.setOptions('maxZoom', zoom);
      }

      /**
       * 클러스터를 구성할 그리드 크기를 반환합니다. 단위는 픽셀입니다.
       * @return 클러스터를 구성할 그리드 크기
       */
      public getGridSize(): number {
        return this.getOptions('gridSize');
      }

      /**
       * 클러스터를 구성할 그리드 크기를 설정합니다. 단위는 픽셀입니다.
       * @param size 클러스터를 구성할 그리드 크기
       */
      public setGridSize(size: number): void {
        this.setOptions('gridSize', size);
      }

      /**
       * 클러스터 마커의 아이콘을 결정하는 인덱스 생성기를 반환합니다.
       * @return 인덱스 생성기
       */
      public getIndexGenerator(): number[] | ((count: number) => number) {
        return this.getOptions('indexGenerator');
      }

      /**
       * 클러스터 마커의 아이콘을 결정하는 인덱스 생성기를 설정합니다.
       * @param indexGenerator 인덱스 생성기
       */
      public setIndexGenerator(indexGenerator: number[] | ((count: number) => number)): void {
        this.setOptions('indexGenerator', indexGenerator);
      }

      /**
       * 클러스터로 구성할 마커를 반환합니다.
       * @return 클러스터로 구성할 마커
       */
      public getMarkers(): Array<naver.maps.Marker> {
        return this.getOptions('markers');
      }

      /**
       * 클러스터로 구성할 마커를 설정합니다.
       * @param markers 클러스터로 구성할 마커
       */
      public setMarkers(markers: Array<naver.maps.Marker>): void {
        this.setOptions('markers', markers);
      }

      /**
       * 클러스터 마커 아이콘을 반환합니다.
       * @return 클러스터 마커 아이콘
       */
      public getIcons(): Array<naver.maps.ImageIcon | naver.maps.SymbolIcon | naver.maps.HtmlIcon> {
        return this.getOptions('icons');
      }

      /**
       * 클러스터 마커 아이콘을 설정합니다.
       * @param icons 클러스터 마커 아이콘
       */
      public setIcons(
        icons: Array<naver.maps.ImageIcon | naver.maps.SymbolIcon | naver.maps.HtmlIcon>,
      ): void {
        this.setOptions('icons', icons);
      }

      /**
       * 클러스터 마커의 엘리먼트를 조작할 수 있는 스타일링 함수를 반환합니다.
       * @return 콜백함수
       */
      public getStylingFunction(): MarkerStylingFunction {
        return this.getOptions('stylingFunction');
      }

      /**
       * 클러스터 마커의 엘리먼트를 조작할 수 있는 스타일링 함수를 설정합니다.
       * @param func 콜백함수
       */
      public setStylingFunction(func: MarkerStylingFunction): void {
        this.setOptions('stylingFunction', func);
      }

      /**
       * 클러스터 마커를 클릭했을 때 줌 동작 수행 여부를 반환합니다.
       * @return 줌 동작 수행 여부
       */
      public getDisableClickZoom(): boolean {
        return this.getOptions('disableClickZoom');
      }

      /**
       * 클러스터 마커를 클릭했을 때 줌 동작 수행 여부를 설정합니다.
       * @param flag 줌 동작 수행 여부
       */
      public setDisableClickZoom(flag: boolean): void {
        this.setOptions('disableClickZoom', flag);
      }

      /**
       * 클러스터 마커의 위치를 클러스터를 구성하고 있는 마커의 평균 좌표로 할 것인지 여부를 반환합니다.
       * @return 평균 좌표로 클러스터링 여부
       */
      public getAverageCenter(): boolean {
        return this.getOptions('averageCenter');
      }

      /**
       * 클러스터 마커의 위치를 클러스터를 구성하고 있는 마커의 평균 좌표로 할 것인지 여부를 설정합니다.
       * @param averageCenter 평균 좌표로 클러스터링 여부
       */
      public setAverageCenter(averageCenter: boolean): void {
        this.setOptions('averageCenter', averageCenter);
      }

      // KVO 이벤트 핸들러
      public changed(key, value): void {
        if (!this.getMap()) return;

        switch (key) {
          case 'marker':
          case 'minClusterSize':
          case 'gridSize':
          case 'averageCenter':
            this._redraw();
            break;
          case 'indexGenerator':
          case 'icons':
            this._clusters.forEach((cluster) => {
              cluster.updateIcon();
            });
            break;
          case 'maxZoom':
            this._clusters.forEach((cluster) => {
              if (cluster.getCount() > 1) {
                cluster.checkByZoomAndMinClusterSize();
              }
            });
            break;
          case 'stylingFunction':
            this._clusters.forEach((cluster) => {
              cluster.updateCount();
            });
            break;
          case 'disableClickZoom':
            this._clusters.forEach((cluster) => {
              cluster[value ? 'disableClickZoom' : 'enableClickZoom']();
            });
            break;
          default:
            break;
        }
      }

      /**
       * 현재 지도 경계 영역 내의 마커에 대해 클러스터를 생성합니다.
       * @private
       */
      private _createClusters(): void {
        const map = this.getMap();

        if (!map) return;

        const bounds = map.getBounds();
        const markers = this.getMarkers();

        for (let i = 0, ii = markers.length; i < ii; i += 1) {
          const marker = markers[i];
          const position = marker.getPosition();

          if (bounds.hasLatLng(position)) {
            const closestCluster = this._getClosestCluster(position);

            closestCluster.addMarker(marker);

            this._markerRelations.push(
              this.$naver.maps.Event.addListener(marker, 'dragend', () => {
                this._onDragEnd();
              }),
            );
          }
        }
      }

      /**
       * 클러스터의 아이콘, 텍스트를 갱신합니다.
       * @private
       */
      private _updateClusters(): void {
        const clusters = this._clusters;

        for (let i = 0, ii = clusters.length; i < ii; i += 1) {
          clusters[i].updateCluster();
        }
      }

      /**
       * 클러스터를 모두 제거합니다.
       * @private
       */
      private _clearClusters(): void {
        const clusters = this._clusters;

        for (let i = 0, ii = clusters.length; i < ii; i += 1) {
          clusters[i].destroy();
        }

        this.$naver.maps.Event.removeListener(this._markerRelations);

        this._markerRelations = [];
        this._clusters = [];
      }

      /**
       * 생성된 클러스터를 모두 제거하고, 다시 생성합니다.
       * @private
       */
      private _redraw(): void {
        this._clearClusters();
        this._createClusters();
        this._updateClusters();
      }

      /**
       * 전달된 위/경도에서 가장 가까운 클러스터를 반환합니다. 없으면 새로 클러스터를 생성해 반환합니다.
       * @param position 위/경도
       * @return 클러스터
       */
      private _getClosestCluster(position: naver.maps.LatLng): Cluster {
        const proj = this.getProjection();
        const clusters = this._clusters;
        let closestCluster: Cluster | null = null;
        let distance = Infinity;

        for (let i = 0, ii = clusters.length; i < ii; i += 1) {
          const cluster = clusters[i];
          const center = cluster.getCenter();

          if (cluster.isInBounds(position)) {
            const delta = proj.getDistance(center, position);

            if (delta < distance) {
              distance = delta;
              closestCluster = cluster;
            }
          }
        }

        if (!closestCluster) {
          closestCluster = new Cluster(this);
          this._clusters.push(closestCluster);
        }

        return closestCluster;
      }

      /**
       * 지도의 Idle 상태 이벤트 핸들러입니다.
       */
      private _onIdle(): void {
        this._redraw();
      }

      /**
       * 각 마커의 드래그 종료 이벤트 핸들러입니다.
       */
      private _onDragEnd(): void {
        this._redraw();
      }
    }

    this.markerClustering = new MarkerClustering($naver, options);
  }
}
