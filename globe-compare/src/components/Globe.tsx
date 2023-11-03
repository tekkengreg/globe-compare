import { useState, useRef, useEffect } from "react";
import * as THREE from "three";
import ThreeGlobe from "three-globe";
import bgImg from "../assets/bgmap1.jpg";
import { TrackballControls } from "three/examples/jsm/controls/TrackballControls";
let lat = 50;
let lon = 50;
export const Globe = () => {
  const globeRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number>(0);
  const [globe2Conf, setglobe2Conf] = useState({ lat: 50, lon: 50 });
  const [position, setPosition] = useState({ lat: 50, lon: 50 });

  useEffect(() => {
    const start = async () => {
      if (!globeRef.current) return;

      const globe = new ThreeGlobe();
      //apply image background to globe
      globe
        .globeImageUrl(
          // "https://raw.githubusercontent.com/vasturiano/three-globe/master/example/img/earth-night.jpg"
          bgImg
        )
        // .bumpImageUrl(
        //   bgImg
        //   // "https://raw.githubusercontent.com/vasturiano/three-globe/master/example/img/earth-topology.png"
        // )
        .showAtmosphere(true)
        .atmosphereColor("rgba(100,100,100, 1)")
        .atmosphereAltitude(0.15);

      // globe.showGlobe(false).showAtmosphere(false);
      const countries = await (
        await fetch(
          "https://vasturiano.github.io/three-globe/example/country-polygons/ne_110m_admin_0_countries.geojson"
        )
      ).json();
      globe
        .polygonsData(
          countries.features.filter((d: any) => d.properties.ISO_A3 !== "ATA")
        )
        .polygonCapColor(() => "rgba(62,151,197,1)")
        .polygonSideColor(() => "rgba(0,0,0,1)")
        .polygonStrokeColor(() => "rgb(5,5,5)");
      console.log("yy");

      const globe2 = new ThreeGlobe();
      globe2.showGlobe(false).showAtmosphere(false);
      globe2
        .polygonsData(
          countries.features.filter((d: any) => d.properties.ISO_A3 !== "ATA")
        )
        .polygonCapColor(() => "rgba(0,255,255,0.5)")
        .polygonSideColor(() => "rgba(10,10,10,0)")
        .polygonStrokeColor(() => "rgba(5,5,5,0.8)");

      globe2.scale.set(1.01, 1.01, 1.01);

      const directionalLight = new THREE.DirectionalLight(0xccccccc, 10);
      directionalLight.position.set(1, 1, 1); // change light position to see the specularMap's effect

      // Setup renderer
      const renderer = new THREE.WebGLRenderer();
      renderer.setSize(window.innerWidth, window.innerHeight);
      globeRef.current.appendChild(renderer.domElement);

      // Setup scene
      const scene = new THREE.Scene();
      scene.add(globe);
      scene.add(globe2);
      scene.add(new THREE.AmbientLight(0xccccccc, 10));
      scene.add(directionalLight);

      // Setup camera
      const camera = new THREE.PerspectiveCamera();
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      camera.position.z = 500;

      // Add camera controls
      const tbControls = new TrackballControls(camera, renderer.domElement);
      tbControls.minDistance = 101;
      tbControls.rotateSpeed = 5;
      tbControls.zoomSpeed = 0.8;

      // let frameTime = Date.now() / 1000;
      // Kick-off renderer
      (function animate() {
        // console.log(lat,lon)
        // const now = Date.now() / 1000;
        // const fps = 1 / (now - frameTime);
        // if(fps<50) console.log(fps.toFixed(0))
        // frameTime = now;

        globe2.rotation.x = ((position.lat - 50) / 100) * Math.PI;
        globe2.rotation.y = ((position.lon - 50) / 100) * Math.PI * 2;
        tbControls.update();
        renderer.render(scene, camera);
        frameRef.current = requestAnimationFrame(animate);
      })();

      /* setInterval(() => {
    console.log("oo");
    Globe.rotation.y = Math.random() * Math.PI * 2;

  }, 1000);*/
    };
    start();
    return () => {
      cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return (
    <div>
      <h1>
        Globe {position.lat} {position.lon}
      </h1>
      <div
        style={{
          position: "fixed",
          top: "0",
          left: "0",
          backgroundColor: "white",
        }}
      >
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

      <div ref={globeRef} />
    </div>
  );
};
