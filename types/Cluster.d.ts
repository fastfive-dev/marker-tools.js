/// <reference types="navermaps" />
import type { MarkerClusteringWrapper } from './MarkerClusteringWrapper';
export declare class Cluster {
    $naver: typeof naver;
    _clusterCenter: naver.maps.LatLng | null;
    _clusterBounds: naver.maps.LatLngBounds | null;
    _clusterMarker: naver.maps.Marker | null;
    _relation: naver.maps.MapEventListener | null;
    _clusterMember: Array<naver.maps.Marker>;
    _markerClusterer: MarkerClusteringWrapper['markerClustering'];
    /**
     * 마커를 가지고 있는 클러스터를 정의합니다.
     * @param markerClusterer
     */
    constructor(markerClusterer: MarkerClusteringWrapper['markerClustering']);
    /**
     * 클러스터에 마커를 추가합니다.
     * @param marker 클러스터에 추가할 마커
     */
    addMarker(marker: naver.maps.Marker): void;
    /**
     * 클러스터를 제거합니다.
     */
    destroy(): void;
    /**
     * 클러스터 중심점을 반환합니다.
     * @return 클러스터 중심점
     */
    getCenter(): naver.maps.LatLng;
    /**
     * 클러스터 경계 영역을 반환합니다.
     * @return 클러스터 경계 영역
     */
    getBounds(): naver.maps.LatLngBounds;
    /**
     * 클러스터를 구성하는 마커 수를 반환합니다.
     * @return 클러스터를 구성하는 마커 수
     */
    getCount(): number;
    /**
     * 현재의 클러스터 멤버 마커 객체를 반환합니다.
     * @return 클러스터를 구성하는 마커 객체 집합
     */
    getClusterMember(): Array<naver.maps.Marker>;
    /**
     * 전달된 위/경도가 클러스터 경계 영역 내에 있는지 여부를 반환합니다.
     * @param latlng 위/경도
     * @return 클러스터 경계 영역 내의 위치 여부
     */
    isInBounds(latlng: naver.maps.LatLng): boolean;
    /**
     * 클러스터 마커 클릭 시 줌 동작을 수행하도록 합니다.
     */
    enableClickZoom(): void;
    /**
     * 클러스터 마커 클릭 시 줌 동작을 수행하지 않도록 합니다.
     */
    disableClickZoom(): void;
    /**
     * 클러스터 마커가 없으면 클러스터 마커를 생성하고, 클러스터 마커를 갱신합니다.
     * - 클러스터 마커 아이콘
     * - 마커 개수
     * - 클러스터 마커 노출 여부
     */
    updateCluster(): void;
    /**
     * 조건에 따라 클러스터 마커를 노출하거나, 노출하지 않습니다.
     */
    checkByZoomAndMinClusterSize(): void;
    /**
     * 클러스터를 구성하는 마커 수를 갱신합니다.
     */
    updateCount(): void;
    /**
     * 클러스터 마커 아이콘을 갱신합니다.
     */
    updateIcon(): void;
    /**
     * 클러스터를 구성하는 마커를 노출합니다. 이때에는 클러스터 마커를 노출하지 않습니다.
     * @private
     */
    _showMember(): void;
    /**
     * 클러스터를 구성하는 마커를 노출하지 않습니다. 이때에는 클러스터 마커를 노출합니다.
     * @private
     */
    _hideMember(): void;
    /**
     * 전달된 위/경도를 중심으로 그리드 크기만큼 확장한 클러스터 경계 영역을 반환합니다.
     * @param position 위/경도
     * @return 클러스터 경계 영역
     * @private
     */
    _calcBounds(position: naver.maps.LatLng): naver.maps.LatLngBounds;
    /**
     * 클러스터를 구성하는 마커 수에 따라 노출할 아이콘을 결정하기 위한 인덱스를 반환합니다.
     * @param count 클러스터를 구성하는 마커 수
     * @return 인덱스
     * @private
     */
    _getIndex(count: number): number;
    /**
     * 전달된 마커가 이미 클러스터에 속해 있는지 여부를 반환합니다.
     * @param marker 마커
     * @return 클러스터에 속해 있는지 여부
     * @private
     */
    _isMember(marker: naver.maps.Marker): boolean;
    /**
     * 전달된 마커들의 중심 좌표를 반환합니다.
     * @param markers 마커 배열
     * @return 마커들의 중심 좌표
     * @private
     */
    _calcAverageCenter(markers: Array<naver.maps.Marker>): naver.maps.Point;
}
