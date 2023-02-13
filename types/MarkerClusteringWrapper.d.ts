/// <reference types="navermaps" />
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
export declare class MarkerClusteringWrapper {
    markerClustering: {
        $naver: typeof naver;
        DEFAULT_OPTIONS: MarkerClusteringOptions;
        _clusters: Cluster[];
        _mapRelations: naver.maps.MapEventListener | null;
        _markerRelations: Array<naver.maps.MapEventListener>;
        onAdd(): void;
        draw(): void;
        onRemove(): void;
        /**
         * 마커 클러스터링 옵션을 설정합니다. 설정한 옵션만 반영됩니다.
         * @param newOptions 옵션 이름
         * @param arg 옵션 값
         */
        setOptions(newOptions: string, arg: unknown): void;
        /**
         * 마커 클러스터링 옵션을 설정합니다. 설정한 옵션만 반영됩니다.
         * @param newOptions 옵션 이름
         * @param arg 옵션 값
         */
        setOptions(newOptions: MarkerClusteringOptions, arg: boolean): void;
        /**
         * 마커 클러스터링 옵션을 반환합니다. 특정 옵션 이름을 지정하지 않으면, 모든 옵션을 반환합니다.
         * @param key 반환받을 옵션 이름
         * @return 옵션
         */
        getOptions(key: string): any;
        /**
         * 클러스터를 구성하는 최소 마커 수를 반환합니다.
         * @return 클러스터를 구성하는 최소 마커 수
         */
        getMinClusterSize(): number;
        /**
         * 클러스터를 구성하는 최소 마커 수를 설정합니다.
         * @param size 클러스터를 구성하는 최소 마커 수
         */
        setMinClusterSize(size: number): void;
        /**
         * 클러스터 마커를 노출할 최대 줌 레벨을 반환합니다.
         * @return 클러스터 마커를 노출할 최대 줌 레벨
         */
        getMaxZoom(): number;
        /**
         * 클러스터 마커를 노출할 최대 줌 레벨을 설정합니다.
         * @param zoom 클러스터 마커를 노출할 최대 줌 레벨
         */
        setMaxZoom(zoom: number): void;
        /**
         * 클러스터를 구성할 그리드 크기를 반환합니다. 단위는 픽셀입니다.
         * @return 클러스터를 구성할 그리드 크기
         */
        getGridSize(): number;
        /**
         * 클러스터를 구성할 그리드 크기를 설정합니다. 단위는 픽셀입니다.
         * @param size 클러스터를 구성할 그리드 크기
         */
        setGridSize(size: number): void;
        /**
         * 클러스터 마커의 아이콘을 결정하는 인덱스 생성기를 반환합니다.
         * @return 인덱스 생성기
         */
        getIndexGenerator(): number[] | ((count: number) => number);
        /**
         * 클러스터 마커의 아이콘을 결정하는 인덱스 생성기를 설정합니다.
         * @param indexGenerator 인덱스 생성기
         */
        setIndexGenerator(indexGenerator: number[] | ((count: number) => number)): void;
        /**
         * 클러스터로 구성할 마커를 반환합니다.
         * @return 클러스터로 구성할 마커
         */
        getMarkers(): Array<naver.maps.Marker>;
        /**
         * 클러스터로 구성할 마커를 설정합니다.
         * @param markers 클러스터로 구성할 마커
         */
        setMarkers(markers: Array<naver.maps.Marker>): void;
        /**
         * 클러스터 마커 아이콘을 반환합니다.
         * @return 클러스터 마커 아이콘
         */
        getIcons(): Array<naver.maps.ImageIcon | naver.maps.SymbolIcon | naver.maps.HtmlIcon>;
        /**
         * 클러스터 마커 아이콘을 설정합니다.
         * @param icons 클러스터 마커 아이콘
         */
        setIcons(icons: Array<naver.maps.ImageIcon | naver.maps.SymbolIcon | naver.maps.HtmlIcon>): void;
        /**
         * 클러스터 마커의 엘리먼트를 조작할 수 있는 스타일링 함수를 반환합니다.
         * @return 콜백함수
         */
        getStylingFunction(): MarkerStylingFunction;
        /**
         * 클러스터 마커의 엘리먼트를 조작할 수 있는 스타일링 함수를 설정합니다.
         * @param func 콜백함수
         */
        setStylingFunction(func: MarkerStylingFunction): void;
        /**
         * 클러스터 마커를 클릭했을 때 줌 동작 수행 여부를 반환합니다.
         * @return 줌 동작 수행 여부
         */
        getDisableClickZoom(): boolean;
        /**
         * 클러스터 마커를 클릭했을 때 줌 동작 수행 여부를 설정합니다.
         * @param flag 줌 동작 수행 여부
         */
        setDisableClickZoom(flag: boolean): void;
        /**
         * 클러스터 마커의 위치를 클러스터를 구성하고 있는 마커의 평균 좌표로 할 것인지 여부를 반환합니다.
         * @return 평균 좌표로 클러스터링 여부
         */
        getAverageCenter(): boolean;
        /**
         * 클러스터 마커의 위치를 클러스터를 구성하고 있는 마커의 평균 좌표로 할 것인지 여부를 설정합니다.
         * @param averageCenter 평균 좌표로 클러스터링 여부
         */
        setAverageCenter(averageCenter: boolean): void;
        changed(key: any, value: any): void;
        /**
         * 현재 지도 경계 영역 내의 마커에 대해 클러스터를 생성합니다.
         * @private
         */
        _createClusters(): void;
        /**
         * 클러스터의 아이콘, 텍스트를 갱신합니다.
         * @private
         */
        _updateClusters(): void;
        /**
         * 클러스터를 모두 제거합니다.
         * @private
         */
        _clearClusters(): void;
        /**
         * 생성된 클러스터를 모두 제거하고, 다시 생성합니다.
         * @private
         */
        _redraw(): void;
        /**
         * 전달된 위/경도에서 가장 가까운 클러스터를 반환합니다. 없으면 새로 클러스터를 생성해 반환합니다.
         * @param position 위/경도
         * @return 클러스터
         */
        _getClosestCluster(position: naver.maps.LatLng): Cluster;
        /**
         * 지도의 Idle 상태 이벤트 핸들러입니다.
         */
        _onIdle(): void;
        /**
         * 각 마커의 드래그 종료 이벤트 핸들러입니다.
         */
        _onDragEnd(): void;
        getContainerTopLeft(): naver.maps.Point;
        getMap(): naver.maps.Map | null;
        getPanes(): naver.maps.MapPanes;
        getProjection(): naver.maps.MapSystemProjection;
        setMap(map: naver.maps.Map | null): void;
        set(key: string, value: any, silently?: boolean | undefined): void;
        get(key: string): any;
        bindTo(key: string | string[], target: naver.maps.KVO, targetKey?: string | undefined): void;
        unbind(key: string): void;
        unbindAll(): void;
        setValues(properties: {
            [key: string]: any;
        }): void;
        addListener(eventName: string, listener: () => any): naver.maps.MapEventListener;
        addListenerOnce(eventName: string, listener: () => any): naver.maps.MapEventListener;
        hasListener(eventName: string): boolean;
        removeListener(listeners: naver.maps.MapEventListener | naver.maps.MapEventListener[]): void;
        clearListeners(eventName: string): void;
        trigger(eventName: string, eventObject?: any): void;
    };
    /**
     * 마커 클러스터링을 정의합니다.
     * @param $naver NAVER 지도 API 전역 변수
     * @param options 마커 클러스터링 옵션
     */
    constructor($naver: typeof naver, options: MarkerClusteringOptions);
}
export {};
