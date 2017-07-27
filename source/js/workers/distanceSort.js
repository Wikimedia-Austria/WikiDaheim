import geolib from 'geolib';
import { fromJS } from 'immutable';

self.addEventListener('message', e => {
  const currentMapPosition = fromJS(e.data.currentMapPosition);
  const items = fromJS(e.data.items);

  const itemsWithDistance = items.map((item) => {
    try {
      return item.merge({ distance: geolib.getDistanceSimple(
        {
          latitude: currentMapPosition.get(1),
          longitude: currentMapPosition.get(0),
        },
        {
          latitude: item.get('latitude'),
          longitude: item.get('longitude'),
        }
      ) });
    } catch (err) {
      return item.merge({ distance: 100000 });
    }
  });

  const sortedItems = itemsWithDistance.sort((a, b) => {
    if (a.get('distance') < b.get('distance')) { return -1; }
    if (a.get('distance') > b.get('distance')) { return 1; }
    return 0;
  });

  self.postMessage(sortedItems.toJS());
});
