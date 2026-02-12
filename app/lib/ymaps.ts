import React from 'react';
import ReactDom from 'react-dom';
import type { Reactify } from 'ymaps3/reactify';
import defaultUiTheme from '@yandex/ymaps3-default-ui-theme';

type YMaps3ReactifyModule = typeof import('ymaps3/reactify');

export async function loadYmaps3React() {
  if (typeof ymaps3 === 'undefined') {
    throw new Error('Yandex Maps API is not available on window.');
  }

  const [ymaps3React] = await Promise.all([
    ymaps3.import('@yandex/ymaps3-reactify'),
    ymaps3.ready,
  ]);


  const typedReactifyModule = ymaps3React as YMaps3ReactifyModule;
  const reactify = typedReactifyModule.reactify.bindTo(React, ReactDom) as Reactify;
  const { YMapDefaultMarker, YMapSearchControl } = reactify.module(
    defaultUiTheme
  );
  const { YMap, YMapDefaultSchemeLayer, YMapDefaultFeaturesLayer, YMapMarker } =
    reactify.module(ymaps3);

  return {
    reactify,
    YMap,
    YMapDefaultSchemeLayer,
    YMapDefaultFeaturesLayer,
    YMapMarker,
    YMapSearchControl
  };
}
