# marker-tools.js

NAVER Maps JavaScript API v3를 이용한 유틸성 마커 예제입니다.

## 설치

```shell
npm install https://github.com/fastfive-dev/marker-tools.js
```

```shell
yarn add https://github.com/fastfive-dev/marker-tools.js
```

## 사용 방법

[예제 문서](https://navermaps.github.io/maps.js.ncp/docs/tutorial-marker-cluster.example.html)에는 다음과 같은 형태로 안내되어 있는데,

```javascript
var markerClustering = new MarkerClustering({
  minClusterSize: 2,
  maxZoom: 8,
  map: map,
  markers: markers,
  disableClickZoom: false,
  gridSize: 120,
  icons: [htmlMarker1, htmlMarker2, htmlMarker3, htmlMarker4, htmlMarker5],
  indexGenerator: [10, 100, 200, 500, 1000],
  stylingFunction: function (clusterMarker, count) {
    $(clusterMarker.getElement()).find('div:first-child').text(count);
  },
});
```

모듈 방식으로는 다음과 같은 형태로 사용할 수 있습니다.

```typescript
import { MarkerClusteringWrapper } from 'marker-tools.js';

const markerClustering = new MarkerClusteringWrapper(naver, {
  minClusterSize: 2,
  maxZoom: 8,
  map: map,
  markers: markers,
  disableClickZoom: false,
  gridSize: 120,
  icons: [htmlMarker1, htmlMarker2, htmlMarker3, htmlMarker4, htmlMarker5],
  indexGenerator: [10, 100, 200, 500, 1000],
  averageCenter: true,
  stylingFunction(clusterMarker, count) {
    ...
  },
}).markerClustering;
```
