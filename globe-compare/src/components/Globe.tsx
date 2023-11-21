import { useState, useRef, useEffect } from "react";
import * as THREE from "three";
import ThreeGlobe from "three-globe";
import cottonTexture from "../assets/cotton.jpg";
import oceanTexture from "../assets/oceanTexture.png";
import { TrackballControls } from "three/examples/jsm/controls/TrackballControls.js";
let lat = 50;
let lon = 50;
export const Globe = () => {
  const globeRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number>(0);
  const [position, setPosition] = useState({ lat: 50, lon: 50 });

  useEffect(() => {
    const start = async () => {
      if (!globeRef.current) return;

      const GRID_SIZE = [60, 20];

      const tLoader = new THREE.TextureLoader();
      const oceansMap = tLoader.load(oceanTexture);
      const tileWidth = 360 / GRID_SIZE[0];
      const tileHeight = 180 / GRID_SIZE[1];
      const tilesData: object[] = [];
      [...Array(GRID_SIZE[0]).keys()].forEach((lngIdx) =>
        [...Array(GRID_SIZE[1]).keys()].forEach((latIdx) =>
          tilesData.push({
            lng: -180 + lngIdx * tileWidth,
            lat: -90 + latIdx * tileHeight,
            material: new THREE.MeshStandardMaterial({
              map: oceansMap,
              roughnessMap: oceansMap,
              color: "rgb(62,151,197)",
              metalness: 0.9,
              roughness: 0.2,
            }),
          })
        )
      );

      const globe = new ThreeGlobe();
      globe
        .tilesData(tilesData)
        .tileWidth(tileWidth)
        .tileHeight(tileHeight)
        .tileAltitude(0.01)
        .tileMaterial("material");
      // .showAtmosphere(true)
      // .atmosphereColor("rgba(22,41,53, 1)")
      // .atmosphereAltitude(0.15);

      // Load country data
      const countries = await (
        await fetch(
          "https://vasturiano.github.io/three-globe/example/country-polygons/ne_110m_admin_0_countries.geojson"
        )
      ).json();

      const loader = new THREE.TextureLoader();
      const roughnessMap = loader.load(cottonTexture);
      const material = new THREE.MeshStandardMaterial({
        color: "rgb(62,151,197)",
        metalness: 0.9,
        roughnessMap: roughnessMap,
      });

      globe
        .polygonsData(
          countries.features.filter((d: any) => d.properties.ISO_A3 !== "ATA")
        )
        .polygonCapColor(() => "rgba(62,151,197,1)")
        .polygonSideColor(() => "rgba(0,0,0,1)")
        .polygonStrokeColor(() => "rgb(5,5,5)")
        .polygonCapMaterial(material)
        .polygonAltitude(0.02);

      const globe2 = new ThreeGlobe();
      globe2.showGlobe(false).showAtmosphere(false);
      globe2
        .polygonsData(
          countries.features.filter((d: any) => d.properties.ISO_A3 !== "ATA")
        )
        .polygonCapColor(() => "rgba(197,62,151,0.2)")
        .polygonSideColor(() => "rgba(10,10,10,0)")
        .polygonStrokeColor(() => "rgba(5,5,5,1)")
        .polygonAltitude(0.03);

      const directionalLight = new THREE.DirectionalLight(0xccccccc, 10);
      directionalLight.position.set(1, 1, 1);

      // Setup renderer
      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
      });
      renderer.setClearColor(0x000000, 0);

      const containerSize = globeRef.current.getBoundingClientRect();
      renderer.setSize(
        Math.trunc(containerSize.width),
        Math.trunc(containerSize.height)
      );
      console.log("je passe ici", containerSize);
      globeRef.current.appendChild(renderer.domElement);

      // Setup scene
      const scene = new THREE.Scene();
      scene.add(globe);
      scene.add(globe2);
      scene.add(new THREE.AmbientLight(0xccccccc, 10));
      scene.add(directionalLight);

      // Setup camera
      const camera = new THREE.PerspectiveCamera();
      camera.aspect = containerSize.width / containerSize.height;
      camera.updateProjectionMatrix();
      camera.position.z = 500;

      // Add camera controls
      const tbControls = new TrackballControls(camera, renderer.domElement);
      tbControls.minDistance = 101;
      tbControls.rotateSpeed = 5;
      tbControls.zoomSpeed = 0.8;

      (function animate() {
        globe2.rotation.x = ((lat - 50) / 100) * Math.PI;
        globe2.rotation.y = ((lon - 50) / 100) * Math.PI * 2;
        tbControls.update();
        renderer.render(scene, camera);
        frameRef.current = requestAnimationFrame(animate);
      })();
    };
    start();
    return () => {
      cancelAnimationFrame(frameRef.current);
    };
  }, []);

  useEffect(() => {
    console.log("useeffect");
    lat = position.lat;
    lon = position.lon;
  });

  return (
    <div
      style={{
        maxHeight: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div className="panel" style={{ display: "none" }}>
        <h1>
          Globe {position.lat} {position.lon}
        </h1>
        <div>
          <div>
            <input
              type="range"
              min="0"
              max="100"
              value={position.lat}
              id="lat"
              name="lat"
              onChange={(e: any) =>
                setPosition({ ...position, lat: e.target.value })
              }
            />
            <label htmlFor="lat">lat</label>
          </div>
          <div>
            <input
              type="range"
              min="0"
              max="100"
              value={position.lon}
              id="lon"
              name="lon"
              onChange={(e: any) =>
                setPosition({ ...position, lon: e.target.value })
              }
            />
            <label htmlFor="lon">lon</label>
          </div>
        </div>
      </div>

      <div ref={globeRef} style={{ flex: "1" }} />
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          background: "lightgrey",
          padding: "1rem",
        }}
      >
        <div
          style={{
            background: "white",
            padding: "0.4rem",
            borderRadius: "0.6rem",
            display: "flex",
            margin: "0 1rem",
          }}
        >
          <label htmlFor="lat">lat</label>
          <input
            type="range"
            min="0"
            max="100"
            value={position.lat}
            id="lat"
            name="lat"
            onChange={(e: any) =>
              setPosition({ ...position, lat: e.target.value })
            }
          />
        </div>
        <div
          style={{
            background: "white",
            padding: "0.4rem",
            borderRadius: "0.6rem",
            display: "flex",
            margin: "0 1rem",
          }}
        >
          <label htmlFor="lon">lon</label>
          <input
            type="range"
            min="0"
            max="100"
            value={position.lon}
            id="lon"
            name="lon"
            onChange={(e: any) =>
              setPosition({ ...position, lon: e.target.value })
            }
          />
        </div>
      </div>
    </div>
  );
};
