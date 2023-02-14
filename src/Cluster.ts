// @ts-nocheck
/* eslint-disable no-underscore-dangle, @typescript-eslint/naming-convention */

import type { MarkerClusteringWrapper } from './MarkerClusteringWrapper';

export class Cluster {
  $naver: typeof naver;

  #clusterCenter: naver.maps.LatLng | null;

  #clusterBounds: naver.maps.LatLngBounds | null;

  #clusterMarker: naver.maps.Marker | null;

  #relation: naver.maps.MapEventListener | null;

  #clusterMember: Array<naver.maps.Marker>;

  #markerClusterer: MarkerClusteringWrapper['markerClustering'];

  /**
   * 마커를 가지고 있는 클러스터를 정의합니다.
   * @param markerClusterer
   */
  constructor(markerClusterer: MarkerClusteringWrapper['markerClustering']) {
    this.$naver = markerClusterer.$naver;

    this.#clusterCenter = null;
    this.#clusterBounds = null;
    this.#clusterMarker = null;
    this.#relation = null;

    this.#clusterMember = [];

    this.#markerClusterer = markerClusterer;
  }

  /**
   * 클러스터에 마커를 추가합니다.
   * @param marker 클러스터에 추가할 마커
   */
  addMarker(marker: naver.maps.Marker) {
    if (this.#isMember(marker)) return;

    if (!this.#clusterCenter) {
      const position = marker.getPosition();

      this.#clusterCenter = position;
      this.#clusterBounds = this.#calcBounds(position);
    }

    this.#clusterMember.push(marker);
  }

  /**
   * 클러스터를 제거합니다.
   */
  destroy() {
    this.$naver.maps.Event.removeListener(this.#relation);

    const members = this.#clusterMember;

    for (let i = 0, ii = members.length; i < ii; i += 1) {
      members[i].setMap(null);
    }

    this.#clusterMarker.setMap(null);

    this.#clusterMarker = null;
    this.#clusterCenter = null;
    this.#clusterBounds = null;
    this.#relation = null;

    this.#clusterMember = [];
  }

  /**
   * 클러스터 중심점을 반환합니다.
   * @return 클러스터 중심점
   */
  getCenter(): naver.maps.LatLng {
    return this.#clusterCenter;
  }

  /**
   * 클러스터 경계 영역을 반환합니다.
   * @return 클러스터 경계 영역
   */
  getBounds(): naver.maps.LatLngBounds {
    return this.#clusterBounds;
  }

  /**
   * 클러스터를 구성하는 마커 수를 반환합니다.
   * @return 클러스터를 구성하는 마커 수
   */
  getCount(): number {
    return this.#clusterMember.length;
  }

  /**
   * 현재의 클러스터 멤버 마커 객체를 반환합니다.
   * @return 클러스터를 구성하는 마커 객체 집합
   */
  getClusterMember(): Array<naver.maps.Marker> {
    return this.#clusterMember;
  }

  /**
   * 전달된 위/경도가 클러스터 경계 영역 내에 있는지 여부를 반환합니다.
   * @param latlng 위/경도
   * @return 클러스터 경계 영역 내의 위치 여부
   */
  isInBounds(latlng: naver.maps.LatLng): boolean {
    return this.#clusterBounds && this.#clusterBounds.hasLatLng(latlng);
  }

  /**
   * 클러스터 마커 클릭 시 줌 동작을 수행하도록 합니다.
   */
  enableClickZoom(): void {
    if (this.#relation) return;

    const map = this.#markerClusterer.getMap();

    this.#relation = this.$naver.maps.Event.addListener(this.#clusterMarker, 'click', (e) => {
      map.morph(e.coord, map.getZoom() + 1);
    });
  }

  /**
   * 클러스터 마커 클릭 시 줌 동작을 수행하지 않도록 합니다.
   */
  disableClickZoom(): void {
    if (!this.#relation) return;

    this.$naver.maps.Event.removeListener(this.#relation);
    this.#relation = null;
  }

  /**
   * 클러스터 마커가 없으면 클러스터 마커를 생성하고, 클러스터 마커를 갱신합니다.
   * - 클러스터 마커 아이콘
   * - 마커 개수
   * - 클러스터 마커 노출 여부
   */
  updateCluster(): void {
    if (!this.#clusterMarker) {
      let position: naver.maps.Coord | naver.maps.CoordLiteral;

      if (this.#markerClusterer.getAverageCenter()) {
        position = this.#calcAverageCenter(this.#clusterMember);
      } else {
        position = this.#clusterCenter;
      }

      this.#clusterMarker = new this.$naver.maps.Marker({
        position,
        map: this.#markerClusterer.getMap(),
      });

      if (!this.#markerClusterer.getDisableClickZoom()) {
        this.enableClickZoom();
      }
    }

    this.updateIcon();
    this.updateCount();

    this.checkByZoomAndMinClusterSize();
  }

  /**
   * 조건에 따라 클러스터 마커를 노출하거나, 노출하지 않습니다.
   */
  checkByZoomAndMinClusterSize(): void {
    const clusterer = this.#markerClusterer;
    const minClusterSize = clusterer.getMinClusterSize();
    const maxZoom = clusterer.getMaxZoom();
    const currentZoom = clusterer.getMap().getZoom();

    if (this.getCount() < minClusterSize) {
      this.#showMember();
    } else {
      this.#hideMember();

      if (maxZoom <= currentZoom) {
        this.#showMember();
      }
    }
  }

  /**
   * 클러스터를 구성하는 마커 수를 갱신합니다.
   */
  updateCount(): void {
    const stylingFunction = this.#markerClusterer.getStylingFunction();

    if (stylingFunction) {
      stylingFunction(this.#clusterMarker, this.getCount());
    }
  }

  /**
   * 클러스터 마커 아이콘을 갱신합니다.
   */
  updateIcon(): void {
    const count = this.getCount();
    let index = this.#getIndex(count);
    const icons = this.#markerClusterer.getIcons();

    index = Math.max(index, 0);
    index = Math.min(index, icons.length - 1);

    this.#clusterMarker.setIcon(icons[index]);
  }

  /**
   * 클러스터를 구성하는 마커를 노출합니다. 이때에는 클러스터 마커를 노출하지 않습니다.
   * @private
   */
  #showMember(): void {
    const map = this.#markerClusterer.getMap();
    const marker = this.#clusterMarker;
    const members = this.#clusterMember;

    for (let i = 0, ii = members.length; i < ii; i += 1) {
      members[i].setMap(map);
    }

    if (marker) {
      marker.setMap(null);
    }
  }

  /**
   * 클러스터를 구성하는 마커를 노출하지 않습니다. 이때에는 클러스터 마커를 노출합니다.
   * @private
   */
  #hideMember(): void {
    const map = this.#markerClusterer.getMap();
    const marker = this.#clusterMarker;
    const members = this.#clusterMember;

    for (let i = 0, ii = members.length; i < ii; i += 1) {
      members[i].setMap(null);
    }

    if (marker && !marker.getMap()) {
      marker.setMap(map);
    }
  }

  /**
   * 전달된 위/경도를 중심으로 그리드 크기만큼 확장한 클러스터 경계 영역을 반환합니다.
   * @param position 위/경도
   * @return 클러스터 경계 영역
   * @private
   */
  #calcBounds(position: naver.maps.LatLng): naver.maps.LatLngBounds {
    const map = this.#markerClusterer.getMap();
    const bounds = new this.$naver.maps.LatLngBounds(position.clone(), position.clone());
    const mapBounds = map.getBounds();
    const proj = map.getProjection();
    const map_max_px = proj.fromCoordToOffset(mapBounds.getNE());
    const map_min_px = proj.fromCoordToOffset(mapBounds.getSW());
    const max_px = proj.fromCoordToOffset(bounds.getNE());
    const min_px = proj.fromCoordToOffset(bounds.getSW());
    const gridSize = this.#markerClusterer.getGridSize() / 2;

    max_px.add(gridSize, -gridSize);
    min_px.add(-gridSize, gridSize);

    const max_px_x = Math.min(map_max_px.x, max_px.x);
    const max_px_y = Math.max(map_max_px.y, max_px.y);
    const min_px_x = Math.max(map_min_px.x, min_px.x);
    const min_px_y = Math.min(map_min_px.y, min_px.y);
    const newMax = proj.fromOffsetToCoord(new this.$naver.maps.Point(max_px_x, max_px_y));
    const newMin = proj.fromOffsetToCoord(new this.$naver.maps.Point(min_px_x, min_px_y));

    return new this.$naver.maps.LatLngBounds(newMin, newMax);
  }

  /**
   * 클러스터를 구성하는 마커 수에 따라 노출할 아이콘을 결정하기 위한 인덱스를 반환합니다.
   * @param count 클러스터를 구성하는 마커 수
   * @return 인덱스
   * @private
   */
  #getIndex(count: number): number {
    const indexGenerator = this.#markerClusterer.getIndexGenerator();

    if (Array.isArray(indexGenerator)) {
      let index = 0;

      for (let i = index, ii = indexGenerator.length; i < ii; i += 1) {
        const factor = indexGenerator[i];

        if (count < factor) break;

        index += 1;
      }

      return index;
    }

    return indexGenerator(count);
  }

  /**
   * 전달된 마커가 이미 클러스터에 속해 있는지 여부를 반환합니다.
   * @param marker 마커
   * @return 클러스터에 속해 있는지 여부
   * @private
   */
  #isMember(marker: naver.maps.Marker): boolean {
    return this.#clusterMember.indexOf(marker) !== -1;
  }

  /**
   * 전달된 마커들의 중심 좌표를 반환합니다.
   * @param markers 마커 배열
   * @return 마커들의 중심 좌표
   * @private
   */
  // eslint-disable-next-line class-methods-use-this
  #calcAverageCenter(markers: Array<naver.maps.Marker>): naver.maps.Point {
    const numberOfMarkers = markers.length;
    const averageCenter: [number, number] = [0, 0];

    for (let i = 0; i < numberOfMarkers; i += 1) {
      averageCenter[0] += markers[i].position.x;
      averageCenter[1] += markers[i].position.y;
    }

    averageCenter[0] /= numberOfMarkers;
    averageCenter[1] /= numberOfMarkers;

    return new this.$naver.maps.Point(averageCenter[0], averageCenter[1]);
  }
}
