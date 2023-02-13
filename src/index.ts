export function echo<T extends unknown>(value: T) {
  return value;
}

import { MarkerClusteringWrapper } from './MarkerClusteringWrapper';

export { MarkerClusteringWrapper };

export type MarkerClustering = MarkerClusteringWrapper['markerClustering'];
