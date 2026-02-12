'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';
import { loadYmaps3React } from '@/app/lib/ymaps';
import type { LngLat, SearchResponse } from 'ymaps3';
import { YMapSearchControl } from '@yandex/ymaps3-default-ui-theme';

const DEFAULT_CENTER: LngLat = [37.588144, 55.733842];

type ReactifyApi = Awaited<ReturnType<typeof loadYmaps3React>>;

export default function YandexMap() {
  const [scriptReady, setScriptReady] = useState(false);
  const [center, setCenter] = useState<LngLat | null>(null);
  const [zoom, setZoom] = useState(10);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [reactifyApi, setReactifyApi] = useState<ReactifyApi | null>(null);
  const apiKey = process.env.NEXT_PUBLIC_YANDEX_MAPS_API_KEY;

  useEffect(() => {
    let cancelled = false;

    async function initReactify() {
      if (!scriptReady) {
        return;
      }
      const api = await loadYmaps3React();
      if (!cancelled) {
        setReactifyApi(api);
      }
    }

    initReactify();

    return () => {
      cancelled = true;
    };
  }, [scriptReady]);

  useEffect(() => {
    if (!navigator.geolocation) {
      setGeoError('Geolocation is not supported in this browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCenter([position.coords.longitude, position.coords.latitude]);
        setZoom(15);
      },
      () => {
        setGeoError('Location access denied. Showing default location.');
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 30000,
      },
    );
  }, []);

  if (!apiKey) {
    return (
      <div className="rounded-lg bg-amber-50 p-4 text-sm text-amber-700">
        Missing `NEXT_PUBLIC_YANDEX_MAPS_API_KEY`. Add it to `.env.local` to load the map.
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      <Script
        src={`https://api-maps.yandex.ru/v3/?apikey=${apiKey}&lang=ru_RU`}
        strategy="afterInteractive"
        onLoad={() => setScriptReady(true)}
      />
      {!reactifyApi ? (
        <div className="rounded-lg bg-gray-50 p-4 text-sm text-gray-600">
          Loading Yandex Maps...
        </div>
      ) : null}
      {geoError ? (
        <div className="rounded-lg bg-amber-50 px-4 py-2 text-xs text-amber-700">
          {geoError}
        </div>
      ) : null}
      {reactifyApi ? (
        <div className="h-[420px] w-full overflow-hidden rounded-xl border border-gray-200 bg-gray-100">
          <YMapShell
            api={reactifyApi}
            center={center ?? DEFAULT_CENTER}
            zoom={zoom}
          />
        </div>
      ) : null}
    </div>
  );
}

function YMapShell({
  api,
  center,
  zoom,
}: {
  api: ReactifyApi;
  center: LngLat;
  zoom: number;
}) {
  const { reactify, YMap, YMapDefaultSchemeLayer, YMapDefaultFeaturesLayer, YMapMarker, YMapSearchControl } =
    api;
  const location = { center, zoom };

  return (
    <YMap className="h-full w-full" location={reactify.useDefault(location, [location])}>
      <YMapDefaultSchemeLayer />
      <YMapDefaultFeaturesLayer />
      <YMapSearchControl searchResult={function (result: SearchResponse) {
        console.log(result, 'RESULT FOR SEARCH CONTROL')
      }} />
      {center ? (
        <YMapMarker coordinates={reactify.useDefault(center, [center])}>
          <span
            style={{
              position: 'relative',
              width: 28,
              height: 28,
              transform: 'translate(-50%, -50%)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span
              style={{
                width: 20,
                height: 20,
                borderRadius: '9999px',
                background: '#2563eb',
                border: '2px solid #ffffff',
                boxShadow: '0 0 0 6px rgba(37, 99, 235, 0.25)',
              }}
            />
          </span>
        </YMapMarker>
      ) : null}
    </YMap>
  );
}
