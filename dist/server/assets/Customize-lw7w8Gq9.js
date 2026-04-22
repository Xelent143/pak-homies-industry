import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import React__default, { useState, useRef, useEffect, useMemo, Suspense, useCallback } from "react";
import { Link } from "wouter";
import { EffectComposer, Bloom, Vignette, Selection } from "@react-three/postprocessing";
import { KernelSize, BlendFunction } from "postprocessing";
import { create } from "zustand";
import { temporal } from "zundo";
import { useThree, useFrame, Canvas } from "@react-three/fiber";
import { useGLTF, useTexture, PerspectiveCamera, Environment, OrbitControls, ContactShadows, useProgress, Html } from "@react-three/drei";
import * as THREE from "three";
import { DecalGeometry } from "three/examples/jsm/geometries/DecalGeometry.js";
import pkg from "file-saver";
import { Capacitor } from "@capacitor/core";
import { Filesystem, Directory } from "@capacitor/filesystem";
import { HexColorPicker } from "react-colorful";
import { t as trpc } from "../entry-server.js";
import "@trpc/react-query";
import "@tanstack/react-query";
import "@trpc/client";
import "react-dom/server";
import "react-helmet-async";
import "superjson";
import "next-themes";
import "sonner";
import "@radix-ui/react-tooltip";
import "clsx";
import "tailwind-merge";
import "lucide-react";
import "@radix-ui/react-slot";
import "class-variance-authority";
const Effects = () => {
  return /* @__PURE__ */ jsxs(EffectComposer, { "data-loc": "client\\src\\designer\\components\\Effects.tsx:7", enableNormalPass: false, multisampling: 0, children: [
    /* @__PURE__ */ jsx(
      Bloom,
      {
        "data-loc": "client\\src\\designer\\components\\Effects.tsx:8",
        intensity: 0.5,
        luminanceThreshold: 1.1,
        luminanceSmoothing: 0.2,
        kernelSize: KernelSize.MEDIUM
      }
    ),
    /* @__PURE__ */ jsx(
      Vignette,
      {
        "data-loc": "client\\src\\designer\\components\\Effects.tsx:15",
        offset: 0.3,
        darkness: 0.4,
        eskil: false,
        blendFunction: BlendFunction.NORMAL
      }
    )
  ] });
};
const MATERIAL_PRESETS = {
  cotton: { name: "Cotton", roughness: 0.9, metalness: 0, normalScale: 1.5 },
  // Boosted from 0.3
  silk: { name: "Silk", roughness: 0.2, metalness: 0, sheen: 1, normalScale: 1 },
  denim: { name: "Denim", roughness: 0.9, metalness: 0, normalScale: 2 },
  // Heavy weave
  leather: { name: "Leather", roughness: 0.4, metalness: 0, clearcoat: 0.3, normalScale: 0.8 },
  velvet: { name: "Velvet", roughness: 0.8, metalness: 0, sheen: 1, normalScale: 1.2 },
  polyester: { name: "Polyester", roughness: 0.5, metalness: 0.1, normalScale: 1 }
};
const initialState = {
  modelUrl: null,
  isLoading: false,
  loadingProgress: 0,
  primaryColor: "#1e88e5",
  secondaryColor: "#f5f5f5",
  recentColors: [],
  selectedMeshName: null,
  meshColors: {},
  // MeshName -> HexColor
  meshPatterns: {},
  // MeshName -> PatternURL
  meshTextureSettings: {},
  // Per-mesh texture settings
  // Grouping Helpers
  materialByMesh: {},
  meshMaterialGroups: {},
  materialPreset: "cotton",
  textureUrl: null,
  textureScale: 1,
  decals: [],
  selectedDecalId: null,
  gizmoMode: "translate",
  isGizmoDragging: false,
  autoRotate: false,
  isAIStudioOpen: false,
  cameraPosition: [0, 0, 5],
  cameraTarget: [0, 0, 0],
  availableMeshes: [],
  // Text initial state
  texts: [],
  selectedTextId: null,
  pendingText: null,
  isPlacingText: false
};
const useConfiguratorStore = create()(
  temporal(
    (set, get) => ({
      ...initialState,
      setModelUrl: (url) => set({ modelUrl: url, isLoading: !!url }),
      setLoading: (loading) => set({ isLoading: loading }),
      setLoadingProgress: (progress) => set({ loadingProgress: progress }),
      setPrimaryColor: (color) => set({ primaryColor: color }),
      setSecondaryColor: (color) => set({ secondaryColor: color }),
      addRecentColor: (color) => set((state) => {
        const newRecent = [color, ...state.recentColors.filter((c) => c !== color)].slice(0, 15);
        return { recentColors: newRecent };
      }),
      // New Actions
      selectMesh: (name) => set({ selectedMeshName: name }),
      setMeshColor: (name, color) => set((state) => {
        const materialName = state.materialByMesh[name];
        const group = materialName && (materialName.toLowerCase().includes("stitch") || materialName.toLowerCase().includes("seam") || materialName.toLowerCase().includes("thread")) ? state.meshMaterialGroups[materialName] : null;
        const newColors = { ...state.meshColors };
        if (group) {
          group.forEach((meshName) => {
            newColors[meshName] = color;
          });
        } else {
          newColors[name] = color;
        }
        return {
          meshColors: newColors
          // selectedMeshName: null // REMOVED: Keep selected for continuous editing
        };
      }),
      updateMeshColors: (colors) => set((state) => ({
        meshColors: { ...state.meshColors, ...colors }
      })),
      // Pattern / Texture Support per Mesh
      setMeshPattern: (name, url) => set((state) => ({
        meshPatterns: { ...state.meshPatterns, [name]: url || "" }
      })),
      // Per-mesh texture settings
      setMeshTextureSettings: (meshName, settings) => set((state) => {
        const current = state.meshTextureSettings[meshName] || { scale: 1, tiled: true };
        return {
          meshTextureSettings: {
            ...state.meshTextureSettings,
            [meshName]: { ...current, ...settings }
          }
        };
      }),
      setMaterialGroups: (matByMesh, groups) => set({
        materialByMesh: matByMesh,
        meshMaterialGroups: groups
      }),
      setMaterialPreset: (preset) => set({ materialPreset: preset }),
      setTextureUrl: (url) => set({ textureUrl: url }),
      setTextureScale: (scale) => set({ textureScale: scale }),
      addDecal: (decal) => set((state) => ({
        decals: [...state.decals, decal]
      })),
      updateDecal: (id, updates) => set((state) => ({
        decals: state.decals.map(
          (d) => d.id === id ? { ...d, ...updates } : d
        )
      })),
      removeDecal: (id) => set((state) => ({
        decals: state.decals.filter((d) => d.id !== id),
        selectedDecalId: state.selectedDecalId === id ? null : state.selectedDecalId
      })),
      selectDecal: (id) => set({ selectedDecalId: id }),
      setGizmoMode: (mode) => set({ gizmoMode: mode }),
      setIsGizmoDragging: (dragging) => set({ isGizmoDragging: dragging }),
      setAutoRotate: (rotate) => set({ autoRotate: rotate }),
      setAIStudioOpen: (isOpen) => set({ isAIStudioOpen: isOpen }),
      setCameraTarget: (target) => set({ cameraTarget: target }),
      // Snapshot Logic
      snapshotRequest: 0,
      triggerSnapshot: () => set({ snapshotRequest: Date.now() }),
      // Quote Capture Logic
      quoteImageDataUrl: null,
      quoteViews: [],
      quoteViewsReady: false,
      quoteImageRequest: 0,
      triggerQuoteCapture: () => set({ quoteImageRequest: Date.now(), quoteViewsReady: false, quoteViews: [] }),
      setQuoteImageDataUrl: (dataUrl) => set({ quoteImageDataUrl: dataUrl }),
      setQuoteViews: (views) => set({ quoteViews: views, quoteViewsReady: views.length >= 4 }),
      clearQuoteViews: () => set({ quoteViews: [], quoteViewsReady: false }),
      // Click-to-Place Logic
      pendingDecalUrl: null,
      isPlacingDecal: false,
      setPendingDecal: (url) => set({ pendingDecalUrl: url, isPlacingDecal: !!url }),
      // Text Actions
      addText: (text) => set((state) => ({
        texts: [...state.texts, text],
        pendingText: null,
        isPlacingText: false
      })),
      updateText: (id, updates) => set((state) => ({
        texts: state.texts.map(
          (t) => t.id === id ? { ...t, ...updates } : t
        )
      })),
      removeText: (id) => set((state) => ({
        texts: state.texts.filter((t) => t.id !== id),
        selectedTextId: state.selectedTextId === id ? null : state.selectedTextId
      })),
      selectText: (id) => set({ selectedTextId: id, selectedDecalId: null }),
      setPendingText: (pending) => set({
        pendingText: pending,
        isPlacingText: !!pending,
        // Clear decal placement if starting text placement
        pendingDecalUrl: pending ? null : null,
        isPlacingDecal: pending ? false : false
      }),
      resetConfiguration: () => set(initialState),
      exportConfiguration: () => {
        const state = get();
        return {
          primaryColor: state.primaryColor,
          secondaryColor: state.secondaryColor,
          materialPreset: state.materialPreset,
          textureUrl: state.textureUrl,
          textureScale: state.textureScale,
          decals: state.decals,
          texts: state.texts,
          meshColors: state.meshColors,
          recentColors: state.recentColors
        };
      },
      loadConfiguration: (config) => set({
        primaryColor: config.primaryColor || initialState.primaryColor,
        secondaryColor: config.secondaryColor || initialState.secondaryColor,
        recentColors: Array.isArray(config.recentColors) ? config.recentColors : [],
        materialPreset: config.materialPreset || initialState.materialPreset,
        textureUrl: config.textureUrl || null,
        textureScale: config.textureScale || 1,
        decals: config.decals || [],
        texts: config.texts || [],
        meshColors: config.meshColors || {}
      }),
      setAvailableMeshes: (meshes) => set({ availableMeshes: meshes })
    }),
    {
      // Only track state related to the design, ignore view/loading state
      partialize: (state) => {
        const {
          primaryColor,
          secondaryColor,
          materialPreset,
          textureUrl,
          textureScale,
          decals,
          texts,
          meshColors,
          meshPatterns,
          recentColors
        } = state;
        return {
          primaryColor,
          secondaryColor,
          materialPreset,
          textureUrl,
          textureScale,
          decals,
          texts,
          meshColors,
          meshPatterns,
          recentColors
        };
      },
      limit: 50
      // Keep last 50 steps
    }
  )
);
const DecalSmartControls = ({
  object,
  meshes,
  onStart,
  onEnd,
  onUpdate
}) => {
  const { camera, raycaster, gl } = useThree();
  const [mode, setMode] = useState("none");
  const startPoint = useRef(new THREE.Vector2());
  const initialScale = useRef(1);
  const initialRotation = useRef(0);
  const initialHitPoint = useRef(new THREE.Vector3());
  const groupRef = useRef(null);
  const determineAction = (localPoint) => {
    const ext2 = 0.5;
    const cornerThreshold = 0.2;
    const corners = [
      new THREE.Vector2(-ext2, -ext2),
      new THREE.Vector2(ext2, -ext2),
      new THREE.Vector2(ext2, ext2),
      new THREE.Vector2(-ext2, ext2)
    ];
    const clickPos2D = new THREE.Vector2(localPoint.x, localPoint.y);
    for (const corner of corners) {
      if (clickPos2D.distanceTo(corner) < cornerThreshold) {
        return "scale";
      }
    }
    const rotateHandlePos = new THREE.Vector2(0, ext2 + 0.2);
    if (clickPos2D.distanceTo(rotateHandlePos) < 0.2) {
      return "rotate";
    }
    return "translate";
  };
  const onControlPointerDown = (e) => {
    e.stopPropagation();
    const localPoint = e.point.clone();
    if (groupRef.current) {
      groupRef.current.worldToLocal(localPoint);
    }
    const action = determineAction(localPoint);
    setMode(action);
    onStart();
    startPoint.current.set(e.clientX, e.clientY);
    initialScale.current = object.scale.x;
    initialRotation.current = object.rotation.z;
    initialHitPoint.current.copy(object.position);
    e.target?.setPointerCapture?.(e.pointerId);
  };
  useEffect(() => {
    const handlePointerMove = (e) => {
      if (mode === "none") return;
      if (mode === "translate") {
        const rect = gl.domElement.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width * 2 - 1;
        const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        raycaster.setFromCamera(new THREE.Vector2(x, y), camera);
        const intersections = raycaster.intersectObjects(meshes, true);
        if (intersections.length > 0) {
          const hit = intersections[0];
          if (hit.face) {
            const n = hit.face.normal.clone().transformDirection(hit.object.matrixWorld).normalize();
            object.position.copy(hit.point);
            const up = new THREE.Vector3(0, 0, 1);
            const q = new THREE.Quaternion().setFromUnitVectors(up, n);
            const zRot = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), initialRotation.current);
            object.quaternion.copy(q).multiply(zRot);
          }
        }
      } else if (mode === "scale") {
        const dy = startPoint.current.y - e.clientY;
        const scaleFactor = 1 + dy * 0.01;
        const newScale = Math.max(0.1, initialScale.current * scaleFactor);
        object.scale.setScalar(newScale);
      } else if (mode === "rotate") {
        const center = object.position.clone().project(camera);
        const rect = gl.domElement.getBoundingClientRect();
        const centerX = (center.x * 0.5 + 0.5) * rect.width + rect.left;
        const centerY = -(center.y * 0.5 - 0.5) * rect.height + rect.top;
        const dx = e.clientX - centerX;
        const dy = e.clientY - centerY;
        const angle = Math.atan2(dy, dx);
        const startDx = startPoint.current.x - centerX;
        const startDy = startPoint.current.y - centerY;
        const startAngle = Math.atan2(startDy, startDx);
        const deltaRot = angle - startAngle;
        object.rotation.z = initialRotation.current - deltaRot;
      }
      onUpdate();
    };
    const handlePointerUp = () => {
      if (mode !== "none") {
        setMode("none");
        onEnd();
      }
    };
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [mode, camera, gl, meshes, object, onUpdate, onEnd]);
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.position.copy(object.position);
      groupRef.current.quaternion.copy(object.quaternion);
      groupRef.current.scale.copy(object.scale);
    }
  });
  const boxColor = "#3b82f6";
  const handleColor = "#ffffff";
  const handleSize = 0.18;
  const ext = 0.5;
  return /* @__PURE__ */ jsxs("group", { "data-loc": "client\\src\\designer\\components\\DecalSmartControls.tsx:173", ref: groupRef, children: [
    /* @__PURE__ */ jsxs(
      "mesh",
      {
        "data-loc": "client\\src\\designer\\components\\DecalSmartControls.tsx:175",
        position: [0, 0, 0.1],
        onPointerDown: onControlPointerDown,
        onPointerOver: () => document.body.style.cursor = "pointer",
        onPointerOut: () => document.body.style.cursor = "default",
        renderOrder: 20,
        children: [
          /* @__PURE__ */ jsx("planeGeometry", { "data-loc": "client\\src\\designer\\components\\DecalSmartControls.tsx:183", args: [1.2, 1.25] }),
          /* @__PURE__ */ jsx("meshBasicMaterial", { "data-loc": "client\\src\\designer\\components\\DecalSmartControls.tsx:184", transparent: true, opacity: 0, side: THREE.DoubleSide })
        ]
      }
    ),
    /* @__PURE__ */ jsxs("lineSegments", { "data-loc": "client\\src\\designer\\components\\DecalSmartControls.tsx:188", renderOrder: 5, children: [
      /* @__PURE__ */ jsx("edgesGeometry", { "data-loc": "client\\src\\designer\\components\\DecalSmartControls.tsx:189", args: [new THREE.PlaneGeometry(1, 1)] }),
      /* @__PURE__ */ jsx("lineBasicMaterial", { "data-loc": "client\\src\\designer\\components\\DecalSmartControls.tsx:190", color: boxColor, depthTest: false, transparent: true, opacity: 0.8 })
    ] }),
    [[-ext, -ext], [ext, -ext], [ext, ext], [-ext, ext]].map((pos, i) => /* @__PURE__ */ jsxs("mesh", { "data-loc": "client\\src\\designer\\components\\DecalSmartControls.tsx:195", position: [pos[0], pos[1], 0], renderOrder: 6, children: [
      /* @__PURE__ */ jsx("boxGeometry", { "data-loc": "client\\src\\designer\\components\\DecalSmartControls.tsx:196", args: [handleSize, handleSize, 0.01] }),
      /* @__PURE__ */ jsx("meshBasicMaterial", { "data-loc": "client\\src\\designer\\components\\DecalSmartControls.tsx:197", color: handleColor, depthTest: false }),
      /* @__PURE__ */ jsxs("lineSegments", { "data-loc": "client\\src\\designer\\components\\DecalSmartControls.tsx:198", children: [
        /* @__PURE__ */ jsx("edgesGeometry", { "data-loc": "client\\src\\designer\\components\\DecalSmartControls.tsx:199", args: [new THREE.BoxGeometry(handleSize, handleSize, 0.01)] }),
        /* @__PURE__ */ jsx("lineBasicMaterial", { "data-loc": "client\\src\\designer\\components\\DecalSmartControls.tsx:200", color: boxColor, depthTest: false })
      ] })
    ] }, i)),
    /* @__PURE__ */ jsxs("group", { "data-loc": "client\\src\\designer\\components\\DecalSmartControls.tsx:206", position: [0, ext + 0.2, 0], children: [
      /* @__PURE__ */ jsxs("mesh", { "data-loc": "client\\src\\designer\\components\\DecalSmartControls.tsx:207", position: [0, -0.1, 0], renderOrder: 6, children: [
        /* @__PURE__ */ jsx("boxGeometry", { "data-loc": "client\\src\\designer\\components\\DecalSmartControls.tsx:208", args: [0.02, 0.2, 0.01] }),
        /* @__PURE__ */ jsx("meshBasicMaterial", { "data-loc": "client\\src\\designer\\components\\DecalSmartControls.tsx:209", color: boxColor, depthTest: false })
      ] }),
      /* @__PURE__ */ jsxs("mesh", { "data-loc": "client\\src\\designer\\components\\DecalSmartControls.tsx:211", renderOrder: 6, children: [
        /* @__PURE__ */ jsx("circleGeometry", { "data-loc": "client\\src\\designer\\components\\DecalSmartControls.tsx:212", args: [0.1, 16] }),
        /* @__PURE__ */ jsx("meshBasicMaterial", { "data-loc": "client\\src\\designer\\components\\DecalSmartControls.tsx:213", color: handleColor, depthTest: false }),
        /* @__PURE__ */ jsxs("lineSegments", { "data-loc": "client\\src\\designer\\components\\DecalSmartControls.tsx:214", children: [
          /* @__PURE__ */ jsx("edgesGeometry", { "data-loc": "client\\src\\designer\\components\\DecalSmartControls.tsx:215", args: [new THREE.CircleGeometry(0.1, 16)] }),
          /* @__PURE__ */ jsx("lineBasicMaterial", { "data-loc": "client\\src\\designer\\components\\DecalSmartControls.tsx:216", color: boxColor, depthTest: false })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("group", { "data-loc": "client\\src\\designer\\components\\DecalSmartControls.tsx:222", scale: [1, 1, 1], position: [0, 0, 0.02], children: [
      /* @__PURE__ */ jsxs("mesh", { "data-loc": "client\\src\\designer\\components\\DecalSmartControls.tsx:223", renderOrder: 7, children: [
        /* @__PURE__ */ jsx("planeGeometry", { "data-loc": "client\\src\\designer\\components\\DecalSmartControls.tsx:224", args: [0.25, 0.06] }),
        /* @__PURE__ */ jsx("meshBasicMaterial", { "data-loc": "client\\src\\designer\\components\\DecalSmartControls.tsx:225", color: handleColor, depthTest: false })
      ] }),
      /* @__PURE__ */ jsxs("mesh", { "data-loc": "client\\src\\designer\\components\\DecalSmartControls.tsx:227", rotation: [0, 0, Math.PI / 2], renderOrder: 7, children: [
        /* @__PURE__ */ jsx("planeGeometry", { "data-loc": "client\\src\\designer\\components\\DecalSmartControls.tsx:228", args: [0.25, 0.06] }),
        /* @__PURE__ */ jsx("meshBasicMaterial", { "data-loc": "client\\src\\designer\\components\\DecalSmartControls.tsx:229", color: handleColor, depthTest: false })
      ] })
    ] })
  ] });
};
const SurfaceDecalInner = ({ decal, meshes, isSelected, onUpdate, onSelect, controlMode }) => {
  const texture = useTexture(decal.textureUrl);
  const groupRef = useRef(null);
  const decalMeshRef = useRef(null);
  const [hitPoint, setHitPoint] = useState(null);
  const [hitOrientation, setHitOrientation] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [livePreviewPos, setLivePreviewPos] = useState(null);
  const [livePreviewScale, setLivePreviewScale] = useState(decal.scale[0]);
  const [livePreviewRotation, setLivePreviewRotation] = useState(0);
  const [stablePosition, setStablePosition] = useState(decal.position);
  const [stableRotation, setStableRotation] = useState(decal.rotation);
  const [stableScale, setStableScale] = useState(decal.scale);
  useEffect(() => {
    if (texture) {
      texture.colorSpace = THREE.SRGBColorSpace;
    }
  }, [texture]);
  useEffect(() => {
    if (!isDragging) {
      const timer = setTimeout(() => {
        setStablePosition(decal.position);
        setStableRotation(decal.rotation);
        setStableScale(decal.scale);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [decal.position, decal.rotation, decal.scale, isDragging]);
  const decalMesh = useMemo(() => {
    if (!texture || meshes.length === 0) return null;
    const isBackSide = decal.isBackSide === true;
    const rotationY = isBackSide ? Math.PI : 0;
    const projectorRotation = new THREE.Euler(0, rotationY, 0);
    const posScale = 0.5;
    const rayOrigin = new THREE.Vector3(
      stablePosition[0] * posScale,
      stablePosition[1] * posScale,
      2
    );
    rayOrigin.applyEuler(projectorRotation);
    const rayDirection = new THREE.Vector3(0, 0, -1);
    rayDirection.applyEuler(projectorRotation);
    const raycaster = new THREE.Raycaster();
    raycaster.set(rayOrigin, rayDirection);
    const allIntersections = [];
    meshes.forEach((mesh) => {
      const intersections = raycaster.intersectObject(mesh, false);
      allIntersections.push(...intersections);
    });
    allIntersections.sort((a, b) => a.distance - b.distance);
    if (allIntersections.length === 0) {
      return null;
    }
    const hit = allIntersections[0];
    const hitNormal = hit.face?.normal || new THREE.Vector3(0, 0, 1);
    const hitMesh = hit.object;
    const worldNormal = hitNormal.clone();
    worldNormal.transformDirection(hitMesh.matrixWorld);
    const orientation = new THREE.Euler();
    const quaternion = new THREE.Quaternion();
    quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), worldNormal);
    orientation.setFromQuaternion(quaternion);
    orientation.z += stableRotation[2] + (isBackSide ? Math.PI : 0);
    const size = new THREE.Vector3(
      stableScale[0] * 0.5,
      stableScale[0] * 0.5 / (decal.aspectRatio || 1),
      // Height adjusted by aspect ratio
      0.2
    );
    try {
      const decalGeometry = new DecalGeometry(
        hitMesh,
        hit.point,
        orientation,
        size
      );
      const decalMaterial = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        alphaTest: 0.01,
        depthTest: false,
        depthWrite: false,
        polygonOffset: true,
        polygonOffsetFactor: -10,
        polygonOffsetUnits: -10,
        side: THREE.FrontSide
      });
      const mesh = new THREE.Mesh(decalGeometry, decalMaterial);
      mesh.renderOrder = 10;
      mesh.userData = { isDecal: true };
      setHitPoint(hit.point.clone());
      setHitOrientation(orientation.clone());
      return mesh;
    } catch (error) {
      console.warn("Decal creation failed:", error);
      return null;
    }
  }, [texture, meshes, stablePosition, stableRotation, stableScale, decal.isBackSide, decal.aspectRatio]);
  useEffect(() => {
    decalMeshRef.current = decalMesh;
    return () => {
      if (decalMeshRef.current) {
        decalMeshRef.current.geometry?.dispose();
        decalMeshRef.current.material?.dispose();
      }
    };
  }, [decalMesh]);
  const proxyRef = useRef(null);
  const [proxyReady, setProxyReady] = useState(false);
  useEffect(() => {
    if (proxyRef.current) {
      setProxyReady(true);
    }
    return () => setProxyReady(false);
  }, []);
  useEffect(() => {
    if (proxyRef.current && hitPoint && hitOrientation) {
      proxyRef.current.position.copy(hitPoint);
      if (controlMode === "translate") {
        proxyRef.current.rotation.set(0, 0, 0);
      } else {
        proxyRef.current.rotation.copy(hitOrientation);
      }
      proxyRef.current.scale.setScalar(decal.scale[0] * 0.5);
    }
  }, [hitPoint, hitOrientation, decal.scale, controlMode]);
  const handleDecalClick = (e) => {
    e.stopPropagation();
    onSelect();
  };
  useEffect(() => {
    const group = groupRef.current;
    if (!group) return;
    if (decalMesh && !isDragging) {
      group.add(decalMesh);
    }
    return () => {
      if (group && decalMesh) {
        group.remove(decalMesh);
      }
    };
  }, [decalMesh, isDragging]);
  return /* @__PURE__ */ jsxs("group", { "data-loc": "client\\src\\designer\\components\\GarmentModel.tsx:219", ref: groupRef, children: [
    isDragging && livePreviewPos && texture && /* @__PURE__ */ jsxs(
      "mesh",
      {
        "data-loc": "client\\src\\designer\\components\\GarmentModel.tsx:224",
        position: livePreviewPos,
        rotation: [0, 0, livePreviewRotation],
        renderOrder: 5,
        children: [
          /* @__PURE__ */ jsx("planeGeometry", { "data-loc": "client\\src\\designer\\components\\GarmentModel.tsx:229", args: [livePreviewScale * 0.5, livePreviewScale * 0.5 / (decal.aspectRatio || 1)] }),
          /* @__PURE__ */ jsx(
            "meshBasicMaterial",
            {
              "data-loc": "client\\src\\designer\\components\\GarmentModel.tsx:230",
              map: texture,
              transparent: true,
              opacity: 0.85,
              depthTest: false,
              side: THREE.DoubleSide
            }
          )
        ]
      }
    ),
    isSelected && hitPoint && /* @__PURE__ */ jsxs("mesh", { "data-loc": "client\\src\\designer\\components\\GarmentModel.tsx:242", position: hitPoint, renderOrder: 2, children: [
      /* @__PURE__ */ jsx("ringGeometry", { "data-loc": "client\\src\\designer\\components\\GarmentModel.tsx:243", args: [decal.scale[0] * 0.25, decal.scale[0] * 0.28, 32] }),
      /* @__PURE__ */ jsx(
        "meshBasicMaterial",
        {
          "data-loc": "client\\src\\designer\\components\\GarmentModel.tsx:244",
          color: "#6366f1",
          transparent: true,
          opacity: 0.8,
          side: THREE.DoubleSide,
          depthTest: false
        }
      )
    ] }),
    hitPoint && !isSelected && /* @__PURE__ */ jsxs(
      "mesh",
      {
        "data-loc": "client\\src\\designer\\components\\GarmentModel.tsx:256",
        position: hitPoint,
        onDoubleClick: handleDecalClick,
        renderOrder: 3,
        children: [
          /* @__PURE__ */ jsx("sphereGeometry", { "data-loc": "client\\src\\designer\\components\\GarmentModel.tsx:261", args: [decal.scale[0] * 0.3, 8, 8] }),
          /* @__PURE__ */ jsx("meshBasicMaterial", { "data-loc": "client\\src\\designer\\components\\GarmentModel.tsx:262", transparent: true, opacity: 0 })
        ]
      }
    ),
    /* @__PURE__ */ jsxs(
      "mesh",
      {
        "data-loc": "client\\src\\designer\\components\\GarmentModel.tsx:267",
        ref: (node) => {
          proxyRef.current = node;
          if (node && !proxyReady) setProxyReady(true);
        },
        visible: false,
        children: [
          /* @__PURE__ */ jsx("boxGeometry", { "data-loc": "client\\src\\designer\\components\\GarmentModel.tsx:274", args: [0.5, 0.5, 0.1] }),
          /* @__PURE__ */ jsx("meshBasicMaterial", { "data-loc": "client\\src\\designer\\components\\GarmentModel.tsx:275", color: "red", wireframe: true })
        ]
      }
    ),
    isSelected && hitPoint && proxyReady && proxyRef.current && /* @__PURE__ */ jsx(
      DecalSmartControls,
      {
        "data-loc": "client\\src\\designer\\components\\GarmentModel.tsx:280",
        object: proxyRef.current,
        meshes,
        onStart: () => {
          setIsDragging(true);
          useConfiguratorStore.getState().setIsGizmoDragging(true);
          if (proxyRef.current) {
            setLivePreviewPos(proxyRef.current.position.clone());
            setLivePreviewScale(proxyRef.current.scale.x * 2);
            setLivePreviewRotation(proxyRef.current.rotation.z);
          }
        },
        onUpdate: () => {
          if (proxyRef.current) {
            setLivePreviewPos(proxyRef.current.position.clone());
            setLivePreviewScale(proxyRef.current.scale.x * 2);
            setLivePreviewRotation(proxyRef.current.rotation.z);
          }
        },
        onEnd: () => {
          if (proxyRef.current && hitOrientation) {
            const finalUpdates = {};
            const posScale = 0.5;
            finalUpdates.position = [
              proxyRef.current.position.x / posScale,
              proxyRef.current.position.y / posScale,
              decal.position[2]
            ];
            const currentSpin = decal.rotation[2];
            const baseZ = hitOrientation.z - currentSpin;
            const newSpin = proxyRef.current.rotation.z - baseZ;
            finalUpdates.rotation = [0, 0, newSpin];
            finalUpdates.scale = [
              proxyRef.current.scale.x * 2,
              proxyRef.current.scale.x * 2,
              proxyRef.current.scale.x * 2
            ];
            onUpdate(finalUpdates);
          }
          setIsDragging(false);
          useConfiguratorStore.getState().setIsGizmoDragging(false);
          setLivePreviewPos(null);
        }
      }
    )
  ] });
};
const SurfaceDecal = React__default.memo(SurfaceDecalInner, (prevProps, nextProps) => {
  if (prevProps.isSelected !== nextProps.isSelected) return false;
  if (prevProps.controlMode !== nextProps.controlMode) return false;
  if (prevProps.decal.id !== nextProps.decal.id) return false;
  if (prevProps.decal.textureUrl !== nextProps.decal.textureUrl) return false;
  if (prevProps.decal.position !== nextProps.decal.position) return false;
  if (prevProps.decal.rotation !== nextProps.decal.rotation) return false;
  if (prevProps.decal.scale !== nextProps.decal.scale) return false;
  if (prevProps.meshes !== nextProps.meshes) return false;
  return true;
});
const SurfaceTextDecalInner = ({ textConfig, meshes, isSelected, onUpdate, onSelect, controlMode }) => {
  const groupRef = useRef(null);
  const decalMeshRef = useRef(null);
  const [hitPoint, setHitPoint] = useState(null);
  const [hitOrientation, setHitOrientation] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [livePreviewPos, setLivePreviewPos] = useState(null);
  const [livePreviewScale, setLivePreviewScale] = useState(textConfig.scale[0]);
  const [livePreviewRotation, setLivePreviewRotation] = useState(0);
  const [stablePosition, setStablePosition] = useState(textConfig.position);
  const [stableRotation, setStableRotation] = useState(textConfig.rotation);
  const [stableScale, setStableScale] = useState(textConfig.scale);
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    const fontSize = 200;
    const padding = 40;
    ctx.font = `bold ${fontSize}px "${textConfig.fontFamily}", sans-serif`;
    const metrics = ctx.measureText(textConfig.text);
    const textWidth = metrics.width;
    const textHeight = fontSize * 1.2;
    canvas.width = Math.min(2048, Math.pow(2, Math.ceil(Math.log2(textWidth + padding * 2))));
    canvas.height = Math.min(1024, Math.pow(2, Math.ceil(Math.log2(textHeight + padding * 2))));
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = `bold ${fontSize}px "${textConfig.fontFamily}", sans-serif`;
    ctx.fillStyle = textConfig.color;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(textConfig.text, canvas.width / 2, canvas.height / 2);
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.needsUpdate = true;
    return tex;
  }, [textConfig.text, textConfig.fontFamily, textConfig.color]);
  useEffect(() => {
    if (!isDragging) {
      const timer = setTimeout(() => {
        setStablePosition(textConfig.position);
        setStableRotation(textConfig.rotation);
        setStableScale(textConfig.scale);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [textConfig.position, textConfig.rotation, textConfig.scale, isDragging]);
  const decalMesh = useMemo(() => {
    if (!texture || meshes.length === 0) return null;
    const isBackSide = textConfig.isBackSide === true;
    const rotationY = isBackSide ? Math.PI : 0;
    const projectorRotation = new THREE.Euler(0, rotationY, 0);
    const posScale = 0.5;
    const rayOrigin = new THREE.Vector3(
      stablePosition[0] * posScale,
      stablePosition[1] * posScale,
      2
    );
    rayOrigin.applyEuler(projectorRotation);
    const rayDirection = new THREE.Vector3(0, 0, -1);
    rayDirection.applyEuler(projectorRotation);
    const raycaster = new THREE.Raycaster();
    raycaster.set(rayOrigin, rayDirection);
    const allIntersections = [];
    meshes.forEach((mesh) => {
      const intersections = raycaster.intersectObject(mesh, false);
      allIntersections.push(...intersections);
    });
    allIntersections.sort((a, b) => a.distance - b.distance);
    if (allIntersections.length === 0) return null;
    const hit = allIntersections[0];
    const hitNormal = hit.face?.normal || new THREE.Vector3(0, 0, 1);
    const hitMesh = hit.object;
    const worldNormal = hitNormal.clone();
    worldNormal.transformDirection(hitMesh.matrixWorld);
    const orientation = new THREE.Euler();
    const quaternion = new THREE.Quaternion();
    quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), worldNormal);
    orientation.setFromQuaternion(quaternion);
    orientation.z += stableRotation[2] + (isBackSide ? Math.PI : 0);
    const size = new THREE.Vector3(
      stableScale[0] * 0.5,
      stableScale[0] * 0.5 / (textConfig.aspectRatio || 1),
      0.2
    );
    try {
      const decalGeometry = new DecalGeometry(
        hitMesh,
        hit.point,
        orientation,
        size
      );
      const decalMaterial = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        alphaTest: 0.01,
        depthTest: false,
        depthWrite: false,
        polygonOffset: true,
        polygonOffsetFactor: -10,
        polygonOffsetUnits: -10,
        side: THREE.FrontSide
      });
      const mesh = new THREE.Mesh(decalGeometry, decalMaterial);
      mesh.renderOrder = 10;
      mesh.userData = { isTextDecal: true };
      setHitPoint(hit.point.clone());
      setHitOrientation(orientation.clone());
      return mesh;
    } catch (error) {
      console.warn("Text decal creation failed:", error);
      return null;
    }
  }, [texture, meshes, stablePosition, stableRotation, stableScale, textConfig.isBackSide]);
  useEffect(() => {
    decalMeshRef.current = decalMesh;
    return () => {
      if (decalMeshRef.current) {
        decalMeshRef.current.geometry?.dispose();
        decalMeshRef.current.material?.dispose();
      }
    };
  }, [decalMesh]);
  const proxyRef = useRef(null);
  const [proxyReady, setProxyReady] = useState(false);
  useEffect(() => {
    if (proxyRef.current) setProxyReady(true);
    return () => setProxyReady(false);
  }, []);
  useEffect(() => {
    if (proxyRef.current && hitPoint && hitOrientation) {
      proxyRef.current.position.copy(hitPoint);
      if (controlMode === "translate") {
        proxyRef.current.rotation.set(0, 0, 0);
      } else {
        proxyRef.current.rotation.copy(hitOrientation);
      }
      proxyRef.current.scale.setScalar(textConfig.scale[0] * 0.5);
    }
  }, [hitPoint, hitOrientation, textConfig.scale, controlMode]);
  const handleClick = (e) => {
    e.stopPropagation();
    onSelect();
  };
  useEffect(() => {
    const group = groupRef.current;
    if (!group) return;
    if (decalMesh && !isDragging) {
      group.add(decalMesh);
    }
    return () => {
      if (group && decalMesh) {
        group.remove(decalMesh);
      }
    };
  }, [decalMesh, isDragging]);
  return /* @__PURE__ */ jsxs("group", { "data-loc": "client\\src\\designer\\components\\GarmentModel.tsx:572", ref: groupRef, children: [
    isDragging && livePreviewPos && texture && /* @__PURE__ */ jsxs(
      "mesh",
      {
        "data-loc": "client\\src\\designer\\components\\GarmentModel.tsx:576",
        position: livePreviewPos,
        rotation: [0, 0, livePreviewRotation],
        renderOrder: 5,
        children: [
          /* @__PURE__ */ jsx("planeGeometry", { "data-loc": "client\\src\\designer\\components\\GarmentModel.tsx:581", args: [livePreviewScale * 0.5, livePreviewScale * 0.5 / (textConfig.aspectRatio || 1)] }),
          /* @__PURE__ */ jsx(
            "meshBasicMaterial",
            {
              "data-loc": "client\\src\\designer\\components\\GarmentModel.tsx:582",
              map: texture,
              transparent: true,
              opacity: 0.85,
              depthTest: false,
              side: THREE.DoubleSide
            }
          )
        ]
      }
    ),
    isSelected && hitPoint && /* @__PURE__ */ jsxs("mesh", { "data-loc": "client\\src\\designer\\components\\GarmentModel.tsx:594", position: hitPoint, renderOrder: 2, children: [
      /* @__PURE__ */ jsx("ringGeometry", { "data-loc": "client\\src\\designer\\components\\GarmentModel.tsx:595", args: [textConfig.scale[0] * 0.25, textConfig.scale[0] * 0.28, 32] }),
      /* @__PURE__ */ jsx(
        "meshBasicMaterial",
        {
          "data-loc": "client\\src\\designer\\components\\GarmentModel.tsx:596",
          color: "#10b981",
          transparent: true,
          opacity: 0.8,
          side: THREE.DoubleSide,
          depthTest: false
        }
      )
    ] }),
    hitPoint && !isSelected && /* @__PURE__ */ jsxs(
      "mesh",
      {
        "data-loc": "client\\src\\designer\\components\\GarmentModel.tsx:608",
        position: hitPoint,
        onDoubleClick: handleClick,
        renderOrder: 3,
        children: [
          /* @__PURE__ */ jsx("sphereGeometry", { "data-loc": "client\\src\\designer\\components\\GarmentModel.tsx:613", args: [textConfig.scale[0] * 0.3, 8, 8] }),
          /* @__PURE__ */ jsx("meshBasicMaterial", { "data-loc": "client\\src\\designer\\components\\GarmentModel.tsx:614", transparent: true, opacity: 0 })
        ]
      }
    ),
    /* @__PURE__ */ jsxs(
      "mesh",
      {
        "data-loc": "client\\src\\designer\\components\\GarmentModel.tsx:619",
        ref: (node) => {
          proxyRef.current = node;
          if (node && !proxyReady) setProxyReady(true);
        },
        visible: false,
        children: [
          /* @__PURE__ */ jsx("boxGeometry", { "data-loc": "client\\src\\designer\\components\\GarmentModel.tsx:626", args: [0.5, 0.5, 0.1] }),
          /* @__PURE__ */ jsx("meshBasicMaterial", { "data-loc": "client\\src\\designer\\components\\GarmentModel.tsx:627", color: "green", wireframe: true })
        ]
      }
    ),
    isSelected && hitPoint && proxyReady && proxyRef.current && /* @__PURE__ */ jsx(
      DecalSmartControls,
      {
        "data-loc": "client\\src\\designer\\components\\GarmentModel.tsx:632",
        object: proxyRef.current,
        meshes,
        onStart: () => {
          setIsDragging(true);
          useConfiguratorStore.getState().setIsGizmoDragging(true);
          if (proxyRef.current) {
            setLivePreviewPos(proxyRef.current.position.clone());
            setLivePreviewScale(proxyRef.current.scale.x * 2);
            setLivePreviewRotation(proxyRef.current.rotation.z);
          }
        },
        onUpdate: () => {
          if (proxyRef.current) {
            setLivePreviewPos(proxyRef.current.position.clone());
            setLivePreviewScale(proxyRef.current.scale.x * 2);
            setLivePreviewRotation(proxyRef.current.rotation.z);
          }
        },
        onEnd: () => {
          if (proxyRef.current && hitOrientation) {
            const finalUpdates = {};
            const posScale = 0.5;
            finalUpdates.position = [
              proxyRef.current.position.x / posScale,
              proxyRef.current.position.y / posScale,
              textConfig.position[2]
            ];
            const currentSpin = textConfig.rotation[2];
            const baseZ = hitOrientation.z - currentSpin;
            const newSpin = proxyRef.current.rotation.z - baseZ;
            finalUpdates.rotation = [0, 0, newSpin];
            finalUpdates.scale = [
              proxyRef.current.scale.x * 2,
              proxyRef.current.scale.x * 2,
              proxyRef.current.scale.x * 2
            ];
            onUpdate(finalUpdates);
          }
          setIsDragging(false);
          useConfiguratorStore.getState().setIsGizmoDragging(false);
          setLivePreviewPos(null);
        }
      }
    )
  ] });
};
const SurfaceTextDecal = React__default.memo(SurfaceTextDecalInner, (prevProps, nextProps) => {
  if (prevProps.isSelected !== nextProps.isSelected) return false;
  if (prevProps.controlMode !== nextProps.controlMode) return false;
  if (prevProps.textConfig.id !== nextProps.textConfig.id) return false;
  if (prevProps.textConfig.text !== nextProps.textConfig.text) return false;
  if (prevProps.textConfig.fontFamily !== nextProps.textConfig.fontFamily) return false;
  if (prevProps.textConfig.color !== nextProps.textConfig.color) return false;
  if (prevProps.textConfig.position !== nextProps.textConfig.position) return false;
  if (prevProps.textConfig.rotation !== nextProps.textConfig.rotation) return false;
  if (prevProps.textConfig.scale !== nextProps.textConfig.scale) return false;
  if (prevProps.meshes !== nextProps.meshes) return false;
  return true;
});
const GarmentModel = ({ url }) => {
  const { scene } = useGLTF(url);
  const [garmentMeshes, setGarmentMeshes] = useState([]);
  const {
    primaryColor,
    secondaryColor,
    materialPreset,
    textureUrl,
    textureScale,
    decals,
    selectedDecalId,
    selectDecal,
    updateDecal,
    gizmoMode,
    setGizmoMode,
    setLoading,
    // Multi-part
    selectedMeshName,
    selectMesh,
    meshColors,
    updateMeshColors,
    meshPatterns,
    meshTextureSettings,
    // Per-mesh texture settings (scale, tiled)
    // Click-to-Place
    isPlacingDecal,
    pendingDecalUrl,
    addDecal,
    setPendingDecal,
    setAvailableMeshes,
    setMaterialGroups,
    // Text
    texts,
    selectedTextId,
    selectText,
    updateText,
    isPlacingText,
    pendingText,
    addText,
    setPendingText
  } = useConfiguratorStore();
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "g") setGizmoMode("translate");
      if (e.key === "r") setGizmoMode("rotate");
      if (e.key === "s") setGizmoMode("scale");
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);
  const clonedScene = useMemo(() => {
    const clone = scene.clone(true);
    return clone;
  }, [scene]);
  const initializationRef = useRef(false);
  useEffect(() => {
    if (!clonedScene) return;
    const preset = MATERIAL_PRESETS[materialPreset] || MATERIAL_PRESETS.cotton;
    let meshIndex = 0;
    const meshList = [];
    const newColors = {};
    const needsInit = Object.keys(meshColors).length === 0 && !initializationRef.current;
    clonedScene.traverse((child) => {
      if (child.isLine || child.isLineSegments) {
        child.visible = false;
        return;
      }
      if (child.isMesh) {
        const mesh = child;
        mesh.name = mesh.name || `Part_${meshIndex}`;
        meshList.push(mesh);
        const originalMaterial = mesh.material;
        const originalColor = originalMaterial.color ? "#" + originalMaterial.color.getHexString() : "#ffffff";
        if (needsInit) {
          newColors[mesh.name] = originalColor;
        }
        const specificColor = meshColors[mesh.name] || originalColor;
        let targetMaterial = mesh.material;
        if (!mesh.userData.isConfigured) {
          targetMaterial = new THREE.MeshPhysicalMaterial({
            side: THREE.DoubleSide,
            // Preserve Maps
            map: originalMaterial.map,
            normalMap: originalMaterial.normalMap,
            normalScale: originalMaterial.normalScale || new THREE.Vector2(1, 1),
            roughnessMap: originalMaterial.roughnessMap,
            metalnessMap: originalMaterial.metalnessMap,
            aoMap: originalMaterial.aoMap,
            // Defaults
            color: new THREE.Color(specificColor)
          });
          mesh.material = targetMaterial;
          mesh.userData.isConfigured = true;
          mesh.castShadow = true;
          mesh.receiveShadow = true;
        }
        if (targetMaterial) {
          targetMaterial.color.set(specificColor);
          targetMaterial.roughness = preset.roughness;
          targetMaterial.metalness = preset.metalness;
          targetMaterial.sheen = preset.sheen || 0;
          if (preset.sheen) targetMaterial.sheenColor.set(specificColor);
          targetMaterial.clearcoat = preset.clearcoat || 0;
          targetMaterial.needsUpdate = true;
        }
        const patternUrl = meshPatterns[mesh.name] || textureUrl;
        if (patternUrl) {
          const meshSettings = meshTextureSettings[mesh.name] || { scale: textureScale, tiled: true };
          const meshScale = meshSettings.scale;
          const isTiled = meshSettings.tiled;
          const needsReload = mesh.userData.lastPatternUrl !== patternUrl || mesh.userData.lastPatternScale !== meshScale || mesh.userData.lastPatternTiled !== isTiled;
          if (needsReload) {
            const textureLoader = new THREE.TextureLoader();
            textureLoader.load(patternUrl, (loadedTexture) => {
              if (isTiled) {
                loadedTexture.wrapS = THREE.RepeatWrapping;
                loadedTexture.wrapT = THREE.RepeatWrapping;
                const safeScale = Math.max(0.1, meshScale);
                const repeats = 1 / safeScale;
                loadedTexture.repeat.set(repeats, repeats);
              } else {
                loadedTexture.wrapS = THREE.ClampToEdgeWrapping;
                loadedTexture.wrapT = THREE.ClampToEdgeWrapping;
                loadedTexture.repeat.set(1, 1);
              }
              loadedTexture.colorSpace = THREE.SRGBColorSpace;
              targetMaterial.map = loadedTexture;
              targetMaterial.needsUpdate = true;
              mesh.userData.lastPatternUrl = patternUrl;
              mesh.userData.lastPatternScale = meshScale;
              mesh.userData.lastPatternTiled = isTiled;
            });
          }
        } else if (mesh.userData.lastPatternUrl) {
          targetMaterial.map = null;
          targetMaterial.needsUpdate = true;
          mesh.userData.lastPatternUrl = null;
          mesh.userData.lastPatternScale = null;
          mesh.userData.lastPatternTiled = null;
        }
        meshIndex++;
      }
    });
    if (needsInit) {
      const matByMesh = {};
      const materialGroups = {};
      meshList.forEach((mesh) => {
        const matName = mesh.material.name;
        if (matName) {
          matByMesh[mesh.name] = matName;
          if (!materialGroups[matName]) materialGroups[matName] = [];
          materialGroups[matName].push(mesh.name);
        }
      });
      initializationRef.current = true;
      setTimeout(() => {
        console.log("Initializing Mesh Colors:", newColors);
        setMaterialGroups(matByMesh, materialGroups);
        if (Object.keys(newColors).length > 0) {
          updateMeshColors(newColors);
        }
      }, 0);
    }
    setGarmentMeshes(meshList);
    setAvailableMeshes(meshList.map((m) => m.name));
    setLoading(false);
  }, [clonedScene, primaryColor, secondaryColor, materialPreset, textureUrl, textureScale, setLoading, meshColors, meshPatterns, meshTextureSettings]);
  useEffect(() => {
    if (!clonedScene) return;
    clonedScene.position.set(0, 0, 0);
    clonedScene.rotation.set(0, 0, 0);
    clonedScene.scale.set(1, 1, 1);
    clonedScene.updateMatrixWorld(true);
    const box = new THREE.Box3();
    let hasMeshes = false;
    const blocklist = [
      "Internal_Line",
      "Shape",
      "Reference",
      "Avatar",
      "Mannequin",
      "Body",
      "Human",
      "Figure",
      "Genesis",
      "Male",
      "Female",
      "G8",
      "Base",
      "Platform",
      "Ground",
      "Floor",
      "Stage"
    ];
    clonedScene.traverse((child) => {
      if (child.isLine || child.isLineSegments) {
        child.visible = false;
        return;
      }
      if (!child.isMesh) return;
      if (child.visible === false) return;
      const name = child.name.toLowerCase();
      const isBlocked = blocklist.some((term) => name.includes(term.toLowerCase()));
      if (isBlocked) {
        child.visible = false;
        return;
      }
      box.expandByObject(child);
      hasMeshes = true;
    });
    if (!hasMeshes) {
      box.setFromObject(clonedScene);
    }
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    clonedScene.position.x = -center.x;
    clonedScene.position.z = -center.z;
    clonedScene.position.y = -box.min.y - 1.2;
    const maxDim = Math.max(size.x, size.y, size.z);
    const targetScale = 2;
    const scale = maxDim > 0 ? targetScale / maxDim : 1;
    clonedScene.scale.setScalar(scale);
    clonedScene.scale.setScalar(scale);
    clonedScene.updateMatrixWorld(true);
    const scaledBox = new THREE.Box3().setFromObject(clonedScene);
    const scaledCenter = scaledBox.getCenter(new THREE.Vector3());
    clonedScene.position.x = clonedScene.position.x - scaledCenter.x;
    clonedScene.position.z = clonedScene.position.z - scaledCenter.z;
    const currentBottom = scaledBox.min.y;
    const targetBottom = -1.2;
    clonedScene.position.y = clonedScene.position.y + (targetBottom - currentBottom);
    clonedScene.updateMatrixWorld(true);
  }, [clonedScene]);
  const [hoveredMeshName, setHoveredMeshName] = useState(null);
  const meshMap = useRef({});
  useEffect(() => {
    if (!garmentMeshes.length) return;
    meshMap.current = {};
    garmentMeshes.forEach((mesh) => {
      meshMap.current[mesh.name] = mesh;
    });
  }, [garmentMeshes]);
  useEffect(() => {
    Object.values(meshMap.current).forEach((mesh) => {
      const material = mesh.material;
      if (!material) return;
      const isSelected = mesh.name === selectedMeshName;
      const isHovered = mesh.name === hoveredMeshName;
      let targetEmissive = 0;
      let targetIntensity = 0;
      if (isSelected) {
        targetEmissive = 16777215;
        targetIntensity = 0.2;
      } else if (isHovered) {
        targetEmissive = 16777215;
        targetIntensity = 0.1;
      }
      if (material.emissive.getHex() !== targetEmissive) {
        material.emissive.setHex(targetEmissive);
      }
      if (material.emissiveIntensity !== targetIntensity) {
        material.emissiveIntensity = targetIntensity;
      }
    });
  }, [selectedMeshName, hoveredMeshName, meshColors, primaryColor, secondaryColor]);
  useEffect(() => {
    if (isPlacingDecal) {
      document.body.style.cursor = "crosshair";
    } else if (hoveredMeshName) {
      document.body.style.cursor = "pointer";
    } else {
      document.body.style.cursor = "auto";
    }
  }, [hoveredMeshName, isPlacingDecal]);
  return /* @__PURE__ */ jsxs("group", { "data-loc": "client\\src\\designer\\components\\GarmentModel.tsx:1105", children: [
    /* @__PURE__ */ jsx(
      "primitive",
      {
        "data-loc": "client\\src\\designer\\components\\GarmentModel.tsx:1107",
        object: clonedScene,
        onPointerOver: (e) => {
          e.stopPropagation();
          if (e.object?.isMesh) {
            setHoveredMeshName(e.object.name);
          }
        },
        onPointerOut: (e) => {
          e.stopPropagation();
          setHoveredMeshName(null);
        },
        onClick: (e) => {
          e.stopPropagation();
          if (isPlacingDecal && pendingDecalUrl) {
            let isBack = false;
            if (e.face && e.object) {
              const n = e.face.normal.clone().transformDirection(e.object.matrixWorld).normalize();
              if (n.z < -0.1) isBack = true;
            }
            const worldX = e.point.x;
            const worldY = e.point.y;
            const inputX = isBack ? -worldX : worldX;
            const posScale = 0.5;
            const x = inputX / posScale;
            const y = worldY / posScale;
            const img = new Image();
            img.onload = () => {
              const aspectRatio = img.naturalWidth / img.naturalHeight;
              const newDecal = {
                id: `decal-${Date.now()}`,
                textureUrl: pendingDecalUrl,
                position: [x, y, 0.5],
                rotation: [0, 0, 0],
                // Rotation is purely for user spin (Z axis)
                scale: [0.4, 0.4, 0.4],
                isBackSide: isBack,
                // Store placement side separately
                aspectRatio
                // Store image aspect ratio
              };
              addDecal(newDecal);
              selectDecal(newDecal.id);
            };
            img.onerror = () => {
              const newDecal = {
                id: `decal-${Date.now()}`,
                textureUrl: pendingDecalUrl,
                position: [x, y, 0.5],
                rotation: [0, 0, 0],
                scale: [0.4, 0.4, 0.4],
                isBackSide: isBack,
                aspectRatio: 1
              };
              addDecal(newDecal);
              selectDecal(newDecal.id);
            };
            img.src = pendingDecalUrl;
            setPendingDecal(null);
            return;
          }
          if (isPlacingText && pendingText) {
            let isBack = false;
            if (e.face && e.object) {
              const n = e.face.normal.clone().transformDirection(e.object.matrixWorld).normalize();
              if (n.z < -0.1) isBack = true;
            }
            const worldX = e.point.x;
            const worldY = e.point.y;
            const inputX = isBack ? -worldX : worldX;
            const posScale = 0.5;
            const x = inputX / posScale;
            const y = worldY / posScale;
            const measureCanvas = document.createElement("canvas");
            const ctx = measureCanvas.getContext("2d");
            if (ctx) {
              const fontSize = 100;
              ctx.font = `bold ${fontSize}px "${pendingText.fontFamily}", sans-serif`;
              const metrics = ctx.measureText(pendingText.text);
              const textWidth = metrics.width;
              const textHeight = fontSize * 1.2;
              const aspectRatio = textWidth / textHeight;
              const newText = {
                id: `text-${Date.now()}`,
                text: pendingText.text,
                fontFamily: pendingText.fontFamily,
                color: pendingText.color,
                position: [x, y, 0.5],
                rotation: [0, 0, 0],
                scale: [0.6, 0.6, 0.6],
                isBackSide: isBack,
                aspectRatio
              };
              addText(newText);
              selectText(newText.id);
            }
            setPendingText(null);
            return;
          }
          if (e.object.userData.isDecal || e.object.userData.isTextDecal) {
            return;
          }
          selectMesh(null);
          selectDecal(null);
          selectText(null);
        },
        onDoubleClick: (e) => {
          e.stopPropagation();
          if (e.object && e.object.isMesh && !e.object.userData.isDecal && !e.object.userData.isTextDecal) {
            selectMesh(e.object.name);
          }
        }
      }
    ),
    garmentMeshes.length > 0 && decals.map((decal) => /* @__PURE__ */ jsx(Suspense, { "data-loc": "client\\src\\designer\\components\\GarmentModel.tsx:1257", fallback: null, children: /* @__PURE__ */ jsx(
      SurfaceDecal,
      {
        "data-loc": "client\\src\\designer\\components\\GarmentModel.tsx:1258",
        decal,
        meshes: garmentMeshes,
        isSelected: selectedDecalId === decal.id,
        onUpdate: (updates) => updateDecal(decal.id, updates),
        onSelect: () => selectDecal(decal.id),
        controlMode: gizmoMode
      }
    ) }, decal.id)),
    garmentMeshes.length > 0 && texts.map((textConfig) => /* @__PURE__ */ jsx(
      SurfaceTextDecal,
      {
        "data-loc": "client\\src\\designer\\components\\GarmentModel.tsx:1271",
        textConfig,
        meshes: garmentMeshes,
        isSelected: selectedTextId === textConfig.id,
        onUpdate: (updates) => updateText(textConfig.id, updates),
        onSelect: () => selectText(textConfig.id),
        controlMode: gizmoMode
      },
      textConfig.id
    )),
    selectedDecalId && /* @__PURE__ */ jsx("mesh", { "data-loc": "client\\src\\designer\\components\\GarmentModel.tsx:1284", position: [0.8, 0, 0], visible: false })
  ] });
};
useGLTF.preload("/models/sample-garment.glb");
const { saveAs } = pkg;
const SnapshotController = () => {
  const { gl, scene, camera } = useThree();
  const { snapshotRequest } = useConfiguratorStore();
  useEffect(() => {
    if (!snapshotRequest) return;
    const captureAndDownload = async () => {
      console.log("📸 Starting 4K transparent PNG capture...");
      const originalBg = scene.background;
      const currentSize = gl.getSize(new THREE.Vector2());
      const TARGET_4K = 4096;
      const aspectRatio = currentSize.width / currentSize.height;
      const targetWidth = aspectRatio >= 1 ? TARGET_4K : Math.round(TARGET_4K * aspectRatio);
      const targetHeight = aspectRatio >= 1 ? Math.round(TARGET_4K / aspectRatio) : TARGET_4K;
      console.log(`🖼️ Target resolution: ${targetWidth}x${targetHeight}`);
      const captureRenderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        preserveDrawingBuffer: true
      });
      captureRenderer.setSize(targetWidth, targetHeight, false);
      captureRenderer.setPixelRatio(1);
      captureRenderer.setClearColor(0, 0);
      captureRenderer.outputColorSpace = THREE.SRGBColorSpace;
      scene.background = null;
      const hiddenObjects = [];
      scene.traverse((child) => {
        const shouldHide = child instanceof THREE.GridHelper || child instanceof THREE.AxesHelper || child.type === "LineSegments" || child.type.includes("Helper") || child.name.toLowerCase().includes("grid") || child.name.toLowerCase().includes("shadow") || child.name.toLowerCase().includes("contact") || child.name.toLowerCase().includes("floor") || child.isTransformControls;
        if (shouldHide && child.visible) {
          hiddenObjects.push(child);
          child.visible = false;
        }
      });
      scene.children.forEach((child) => {
        if (child instanceof THREE.GridHelper || child.type === "GridHelper") {
          if (child.visible) {
            hiddenObjects.push(child);
            child.visible = false;
          }
        }
      });
      captureRenderer.clear();
      captureRenderer.render(scene, camera);
      const captureCanvas = captureRenderer.domElement;
      captureCanvas.toBlob(async (blob) => {
        if (blob) {
          const now = /* @__PURE__ */ new Date();
          const dateStr = now.toISOString().split("T")[0];
          const timeStr = now.toTimeString().split(" ")[0].replace(/:/g, "-");
          const filename = `3D-Model-4K_${dateStr}_${timeStr}.png`;
          if (Capacitor.isNativePlatform()) {
            try {
              const reader = new FileReader();
              reader.readAsDataURL(blob);
              reader.onloadend = async () => {
                const base64data = reader.result;
                await Filesystem.writeFile({
                  path: filename,
                  data: base64data,
                  directory: Directory.Documents,
                  // Saves to Documents folder
                  recursive: true
                });
                alert(`Snapshot saved to Documents/${filename}`);
                console.log(`✅ Mobile Save: Documents/${filename}`);
              };
            } catch (e) {
              console.error("Mobile Save Failed:", e);
              alert("Failed to save snapshot on device.");
            }
          } else {
            saveAs(blob, filename);
            console.log(`✅ Downloaded: ${filename} (${(blob.size / 1024 / 1024).toFixed(2)} MB)`);
          }
        } else {
          console.error("❌ Failed to create PNG blob");
        }
        scene.background = originalBg;
        hiddenObjects.forEach((obj) => {
          obj.visible = true;
        });
        captureRenderer.dispose();
        gl.render(scene, camera);
      }, "image/png", 1);
    };
    requestAnimationFrame(captureAndDownload);
  }, [snapshotRequest, gl, scene, camera]);
  return null;
};
const QuoteCaptureController = () => {
  const { scene, camera } = useThree();
  const { quoteImageRequest, setQuoteViews } = useConfiguratorStore();
  useEffect(() => {
    if (!quoteImageRequest) return;
    const VIEWS = [
      { label: "Front", azimuth: 0 },
      { label: "Right", azimuth: Math.PI / 2 },
      { label: "Back", azimuth: Math.PI },
      { label: "Left", azimuth: -Math.PI / 2 }
    ];
    const RADIUS = 4.5;
    const ELEVATION = 0.8;
    const target = new THREE.Vector3(0, 0.5, 0);
    const captureRenderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      preserveDrawingBuffer: true
    });
    captureRenderer.setSize(900, 900, false);
    captureRenderer.setPixelRatio(1);
    captureRenderer.setClearColor(856343, 1);
    captureRenderer.outputColorSpace = THREE.SRGBColorSpace;
    const originalBg = scene.background;
    const originalPos = camera.position.clone();
    const hiddenObjects = [];
    scene.traverse((child) => {
      const shouldHide = child.name.toLowerCase().includes("grid") || child.name.toLowerCase().includes("shadow") || child.name.toLowerCase().includes("floor") || child.isTransformControls;
      if (shouldHide && child.visible) {
        hiddenObjects.push(child);
        child.visible = false;
      }
    });
    scene.children.forEach((child) => {
      if (child instanceof THREE.GridHelper || child.type === "GridHelper") {
        if (child.visible) {
          hiddenObjects.push(child);
          child.visible = false;
        }
      }
    });
    const views = [];
    const captureView = (index) => {
      if (index >= VIEWS.length) {
        scene.background = originalBg;
        camera.position.copy(originalPos);
        camera.lookAt(target);
        camera.updateProjectionMatrix();
        hiddenObjects.forEach((obj) => {
          obj.visible = true;
        });
        captureRenderer.dispose();
        setQuoteViews(views);
        return;
      }
      const { label, azimuth } = VIEWS[index];
      camera.position.set(
        Math.sin(azimuth) * RADIUS,
        ELEVATION,
        Math.cos(azimuth) * RADIUS
      );
      camera.lookAt(target);
      camera.updateProjectionMatrix();
      requestAnimationFrame(() => requestAnimationFrame(() => {
        captureRenderer.render(scene, camera);
        const dataUrl = captureRenderer.domElement.toDataURL("image/jpeg", 0.9);
        views.push({ label, dataUrl });
        captureView(index + 1);
      }));
    };
    requestAnimationFrame(() => captureView(0));
  }, [quoteImageRequest, scene, camera, setQuoteViews]);
  return null;
};
function ProgressSync() {
  const { progress, active } = useProgress();
  const setLoading = useConfiguratorStore((state) => state.setLoading);
  const setLoadingProgress = useConfiguratorStore((state) => state.setLoadingProgress);
  useEffect(() => {
    setLoading(active);
    setLoadingProgress(progress);
  }, [progress, active, setLoading, setLoadingProgress]);
  return null;
}
function EmptyState() {
  return /* @__PURE__ */ jsx(Html, { "data-loc": "client\\src\\designer\\components\\Scene.tsx:37", center: true, children: /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\designer\\components\\Scene.tsx:38", className: "notice-board", children: [
    /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\designer\\components\\Scene.tsx:39", className: "notice-glow" }),
    /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\designer\\components\\Scene.tsx:40", className: "notice-content", children: [
      /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\designer\\components\\Scene.tsx:41", className: "notice-icon", children: "👇" }),
      /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\designer\\components\\Scene.tsx:42", className: "notice-text", children: [
        /* @__PURE__ */ jsx("p", { "data-loc": "client\\src\\designer\\components\\Scene.tsx:43", className: "notice-title", children: "Select a Model" }),
        /* @__PURE__ */ jsxs("p", { "data-loc": "client\\src\\designer\\components\\Scene.tsx:44", className: "notice-subtitle", children: [
          "Choose from presets in the ",
          /* @__PURE__ */ jsx("strong", { "data-loc": "client\\src\\designer\\components\\Scene.tsx:44", children: "Model" }),
          " menu below"
        ] })
      ] })
    ] })
  ] }) });
}
class ModelErrorBoundary extends React__default.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error("Model loading error:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return /* @__PURE__ */ jsx(Html, { "data-loc": "client\\src\\designer\\components\\Scene.tsx:73", center: true, children: /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\designer\\components\\Scene.tsx:74", style: {
        background: "rgba(26, 26, 26, 0.95)",
        padding: "2rem",
        borderRadius: "12px",
        color: "#ff6b6b",
        maxWidth: "400px",
        textAlign: "center",
        fontFamily: "system-ui"
      }, children: [
        /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\designer\\components\\Scene.tsx:83", style: { fontSize: "3rem", marginBottom: "1rem" }, children: "⚠️" }),
        /* @__PURE__ */ jsx("h3", { "data-loc": "client\\src\\designer\\components\\Scene.tsx:84", style: { margin: "0 0 1rem 0", color: "white" }, children: "Model Load Failed" }),
        /* @__PURE__ */ jsx("p", { "data-loc": "client\\src\\designer\\components\\Scene.tsx:85", style: { fontSize: "0.9rem", color: "#aaa", marginBottom: "1rem" }, children: "The model file appears to be corrupted or incompatible." }),
        /* @__PURE__ */ jsxs("details", { "data-loc": "client\\src\\designer\\components\\Scene.tsx:88", style: { marginBottom: "1rem", textAlign: "left", fontSize: "0.8rem" }, children: [
          /* @__PURE__ */ jsx("summary", { "data-loc": "client\\src\\designer\\components\\Scene.tsx:89", style: { cursor: "pointer", color: "#888" }, children: "Technical Details" }),
          /* @__PURE__ */ jsx("pre", { "data-loc": "client\\src\\designer\\components\\Scene.tsx:90", style: {
            marginTop: "0.5rem",
            padding: "0.5rem",
            background: "#111",
            borderRadius: "4px",
            overflow: "auto",
            maxHeight: "100px",
            fontSize: "0.7rem"
          }, children: this.state.error?.message || "Unknown error" })
        ] }),
        /* @__PURE__ */ jsx(
          "button",
          {
            "data-loc": "client\\src\\designer\\components\\Scene.tsx:102",
            onClick: () => {
              this.setState({ hasError: false, error: null });
              this.props.onReset();
            },
            style: {
              padding: "0.75rem 1.5rem",
              background: "#3b82f6",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "1rem",
              fontWeight: 600
            },
            children: "Try Another Model"
          }
        )
      ] }) });
    }
    return this.props.children;
  }
}
const Scene = ({ isDrawerOpen }) => {
  const { modelUrl, autoRotate, isGizmoDragging, selectMesh, selectDecal, cameraTarget, setCameraTarget, setModelUrl } = useConfiguratorStore();
  const controlsRef = useRef(null);
  return /* @__PURE__ */ jsxs(
    Canvas,
    {
      "data-loc": "client\\src\\designer\\components\\Scene.tsx:138",
      dpr: [1, 1.5],
      onPointerMissed: (e) => {
        if (e.type === "click") {
          selectMesh(null);
          selectDecal(null);
        }
      },
      gl: {
        antialias: true,
        preserveDrawingBuffer: true,
        alpha: true,
        powerPreference: "high-performance",
        failIfMajorPerformanceCaveat: false
      },
      style: { background: "transparent" },
      children: [
        /* @__PURE__ */ jsx(ProgressSync, { "data-loc": "client\\src\\designer\\components\\Scene.tsx:155" }),
        /* @__PURE__ */ jsx(SnapshotController, { "data-loc": "client\\src\\designer\\components\\Scene.tsx:156" }),
        /* @__PURE__ */ jsx(QuoteCaptureController, { "data-loc": "client\\src\\designer\\components\\Scene.tsx:157" }),
        /* @__PURE__ */ jsx(PerspectiveCamera, { "data-loc": "client\\src\\designer\\components\\Scene.tsx:158", makeDefault: true, position: [0, 0, 3], fov: 50, near: 0.01 }),
        /* @__PURE__ */ jsx("ambientLight", { "data-loc": "client\\src\\designer\\components\\Scene.tsx:161", intensity: 0.6 }),
        " ",
        /* @__PURE__ */ jsx("directionalLight", { "data-loc": "client\\src\\designer\\components\\Scene.tsx:164", position: [5, 10, 5], intensity: 0.3, castShadow: true, "shadow-mapSize": [2048, 2048], "shadow-normalBias": 0.05 }),
        /* @__PURE__ */ jsx("directionalLight", { "data-loc": "client\\src\\designer\\components\\Scene.tsx:167", position: [-5, 5, 5], intensity: 0.2 }),
        /* @__PURE__ */ jsx("directionalLight", { "data-loc": "client\\src\\designer\\components\\Scene.tsx:168", position: [0, 0, 5], intensity: 0.1 }),
        /* @__PURE__ */ jsx("directionalLight", { "data-loc": "client\\src\\designer\\components\\Scene.tsx:169", position: [0, 5, -5], intensity: 0.4 }),
        /* @__PURE__ */ jsx(Environment, { "data-loc": "client\\src\\designer\\components\\Scene.tsx:172", files: "/potsdamer_platz_1k.hdr", blur: 1, background: false, environmentIntensity: 0.2 }),
        /* @__PURE__ */ jsx("primitive", { "data-loc": "client\\src\\designer\\components\\Scene.tsx:175", object: new THREE.GridHelper(10, 20, 2763306, 1710618), position: [0, -1.2, 0] }),
        /* @__PURE__ */ jsx(
          OrbitControls,
          {
            "data-loc": "client\\src\\designer\\components\\Scene.tsx:177",
            ref: controlsRef,
            target: new THREE.Vector3(...cameraTarget),
            autoRotate: autoRotate && !isGizmoDragging,
            enabled: !isGizmoDragging,
            autoRotateSpeed: 1,
            enablePan: !isGizmoDragging,
            enableZoom: !isGizmoDragging,
            enableRotate: !isGizmoDragging,
            minDistance: 0.2,
            maxDistance: 10,
            minPolarAngle: Math.PI / 6,
            maxPolarAngle: Math.PI - Math.PI / 6,
            onEnd: () => {
              if (controlsRef.current) {
                const t = controlsRef.current.target;
                setCameraTarget([t.x, t.y, t.z]);
              }
            }
          }
        ),
        /* @__PURE__ */ jsx(Selection, { "data-loc": "client\\src\\designer\\components\\Scene.tsx:198", children: /* @__PURE__ */ jsx(ModelErrorBoundary, { "data-loc": "client\\src\\designer\\components\\Scene.tsx:199", onReset: () => setModelUrl(null), children: /* @__PURE__ */ jsx(Suspense, { "data-loc": "client\\src\\designer\\components\\Scene.tsx:200", fallback: null, children: modelUrl ? /* @__PURE__ */ jsx(GarmentModel, { "data-loc": "client\\src\\designer\\components\\Scene.tsx:202", url: modelUrl }) : !isDrawerOpen && /* @__PURE__ */ jsx(EmptyState, { "data-loc": "client\\src\\designer\\components\\Scene.tsx:204" }) }) }) }),
        /* @__PURE__ */ jsx(ContactShadows, { "data-loc": "client\\src\\designer\\components\\Scene.tsx:210", position: [0, -1.2, 0], opacity: 0.5, scale: 5, blur: 2.5, far: 4 }),
        /* @__PURE__ */ jsx(Effects, { "data-loc": "client\\src\\designer\\components\\Scene.tsx:212" })
      ]
    }
  );
};
const NavigationControls = () => {
  const { cameraTarget, setCameraTarget } = useConfiguratorStore();
  const STEP = 0.05;
  const move = (dx, dy) => {
    setCameraTarget([
      cameraTarget[0] + dx,
      cameraTarget[1] + dy,
      cameraTarget[2]
    ]);
  };
  const reset = () => setCameraTarget([0, 0, 0]);
  return /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\designer\\components\\NavigationControls.tsx:24", className: "nav-controls-overlay", children: [
    /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\designer\\components\\NavigationControls.tsx:25", className: "nav-dpad", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          "data-loc": "client\\src\\designer\\components\\NavigationControls.tsx:26",
          className: "nav-btn",
          onClick: () => move(0, STEP),
          title: "Pan Up",
          children: /* @__PURE__ */ jsx("svg", { "data-loc": "client\\src\\designer\\components\\NavigationControls.tsx:31", width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ jsx("polyline", { "data-loc": "client\\src\\designer\\components\\NavigationControls.tsx:32", points: "18 15 12 9 6 15" }) })
        }
      ),
      /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\designer\\components\\NavigationControls.tsx:36", className: "nav-row", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            "data-loc": "client\\src\\designer\\components\\NavigationControls.tsx:37",
            className: "nav-btn",
            onClick: () => move(-STEP, 0),
            title: "Pan Left",
            children: /* @__PURE__ */ jsx("svg", { "data-loc": "client\\src\\designer\\components\\NavigationControls.tsx:42", width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ jsx("polyline", { "data-loc": "client\\src\\designer\\components\\NavigationControls.tsx:43", points: "15 18 9 12 15 6" }) })
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            "data-loc": "client\\src\\designer\\components\\NavigationControls.tsx:47",
            className: "nav-btn center",
            onClick: reset,
            title: "Reset View",
            children: /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\designer\\components\\NavigationControls.tsx:52", className: "center-dot" })
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            "data-loc": "client\\src\\designer\\components\\NavigationControls.tsx:55",
            className: "nav-btn",
            onClick: () => move(STEP, 0),
            title: "Pan Right",
            children: /* @__PURE__ */ jsx("svg", { "data-loc": "client\\src\\designer\\components\\NavigationControls.tsx:60", width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ jsx("polyline", { "data-loc": "client\\src\\designer\\components\\NavigationControls.tsx:61", points: "9 18 15 12 9 6" }) })
          }
        )
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          "data-loc": "client\\src\\designer\\components\\NavigationControls.tsx:66",
          className: "nav-btn",
          onClick: () => move(0, -STEP),
          title: "Pan Down",
          children: /* @__PURE__ */ jsx("svg", { "data-loc": "client\\src\\designer\\components\\NavigationControls.tsx:71", width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ jsx("polyline", { "data-loc": "client\\src\\designer\\components\\NavigationControls.tsx:72", points: "6 9 12 15 18 9" }) })
        }
      )
    ] }),
    /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\designer\\components\\NavigationControls.tsx:76", className: "nav-label", children: "DRAG MODEL" })
  ] });
};
const ColorPickerPanel = () => {
  const {
    selectedMeshName,
    meshColors,
    setMeshColor,
    addRecentColor,
    recentColors
  } = useConfiguratorStore();
  const [localColor, setLocalColor] = useState("#ffffff");
  const currentColor = selectedMeshName ? meshColors[selectedMeshName] || "#ffffff" : "#ffffff";
  useEffect(() => {
    setLocalColor(currentColor);
  }, [currentColor, selectedMeshName]);
  const handleColorChange = (color) => {
    setLocalColor(color);
    if (selectedMeshName) {
      setMeshColor(selectedMeshName, color);
    }
  };
  const handleDragEnd = () => {
    if (selectedMeshName) {
      addRecentColor(localColor);
    }
  };
  if (!selectedMeshName) return null;
  return /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\designer\\components\\ColorPickerPanel.tsx:43", className: "compact-color-picker", children: [
    /* @__PURE__ */ jsx(
      "div",
      {
        "data-loc": "client\\src\\designer\\components\\ColorPickerPanel.tsx:45",
        className: "color-wheel-container",
        onMouseUp: handleDragEnd,
        onTouchEnd: handleDragEnd,
        children: /* @__PURE__ */ jsx(
          HexColorPicker,
          {
            "data-loc": "client\\src\\designer\\components\\ColorPickerPanel.tsx:50",
            color: localColor,
            onChange: handleColorChange
          }
        )
      }
    ),
    recentColors.length > 0 && /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\designer\\components\\ColorPickerPanel.tsx:58", className: "recent-row", children: [
      /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\designer\\components\\ColorPickerPanel.tsx:59", className: "recent-label", children: "Recent:" }),
      /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\designer\\components\\ColorPickerPanel.tsx:60", className: "recent-swatches", children: recentColors.slice(0, 8).map((color, index) => /* @__PURE__ */ jsx(
        "button",
        {
          "data-loc": "client\\src\\designer\\components\\ColorPickerPanel.tsx:62",
          className: `mini-swatch ${localColor.toUpperCase() === color.toUpperCase() ? "active" : ""}`,
          style: { backgroundColor: color },
          onClick: () => {
            handleColorChange(color);
            addRecentColor(color);
          },
          title: color
        },
        `${color}-${index}`
      )) })
    ] })
  ] });
};
const PROXY = "/api/models";
const PRESET_MODELS = [
  {
    id: "oversize-hoodie",
    name: "Oversize Hoodie",
    description: "Streetwear oversize fit hoodie",
    file: `${PROXY}/oversize-hoodie.glb`
  },
  {
    id: "sweatshirt",
    name: "Sweatshirt",
    description: "Classic crewneck sweatshirt",
    file: `${PROXY}/sweatshirt.glb`
  },
  {
    id: "tshirt-normal",
    name: "T-Shirt",
    description: "Standard Fit T-Shirt",
    file: `${PROXY}/tshirt-normal.glb`
  },
  {
    id: "raglan-tshirt",
    name: "Raglan T-Shirt",
    description: "T-Shirt with raglan cut sleeves",
    file: `${PROXY}/raglan-tshirt.glb`
  },
  {
    id: "soccer-uniform",
    name: "Soccer Uniform",
    description: "Full soccer kit with jersey and shorts",
    file: `${PROXY}/soccer-uniform.glb`
  },
  {
    id: "basketball-uniform",
    name: "Basketball Uniform",
    description: "Complete basketball jersey and shorts set",
    file: `${PROXY}/basketball-uniform.glb`
  },
  {
    id: "american-football",
    name: "American Football Uniform",
    description: "Full American football jersey and pants set",
    file: `${PROXY}/american-football.glb`
  },
  {
    id: "trouser",
    name: "Fleece Trousers",
    description: "Comfortable fleece trousers",
    file: `${PROXY}/trouser.glb`
  }
];
const ModelUploader = () => {
  const fileInputRef = useRef(null);
  const { isLoading, loadingProgress, setModelUrl } = useConfiguratorStore();
  const handleFileUpload = useCallback((event) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setModelUrl(url);
    }
  }, [setModelUrl]);
  const handleDrop = useCallback((event) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file && file.name.endsWith(".glb")) {
      const url = URL.createObjectURL(file);
      setModelUrl(url);
    }
  }, [setModelUrl]);
  const handleDragOver = useCallback((event) => {
    event.preventDefault();
  }, []);
  return /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\designer\\components\\ModelUploader.tsx:32", style: { display: "flex", flexDirection: "column", gap: "20px" }, children: [
    /* @__PURE__ */ jsx(
      "div",
      {
        "data-loc": "client\\src\\designer\\components\\ModelUploader.tsx:33",
        className: "upload-card modern-upload-btn",
        onClick: () => fileInputRef.current?.click(),
        onDrop: handleDrop,
        onDragOver: handleDragOver,
        children: isLoading ? /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\designer\\components\\ModelUploader.tsx:40", className: "upload-loading", children: [
          /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\designer\\components\\ModelUploader.tsx:41", className: "upload-spinner" }),
          /* @__PURE__ */ jsxs("p", { "data-loc": "client\\src\\designer\\components\\ModelUploader.tsx:42", children: [
            "Loading... ",
            loadingProgress.toFixed(0),
            "%"
          ] })
        ] }) : /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\designer\\components\\ModelUploader.tsx:45", className: "upload-content", children: [
          /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\designer\\components\\ModelUploader.tsx:46", className: "upload-icon-wrapper", children: /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\designer\\components\\ModelUploader.tsx:47", className: "upload-icon", children: "📂" }) }),
          /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\designer\\components\\ModelUploader.tsx:49", className: "upload-text-group", children: [
            /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\designer\\components\\ModelUploader.tsx:50", className: "upload-title", children: "Upload Custom Model" }),
            /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\designer\\components\\ModelUploader.tsx:51", className: "upload-subtitle", children: "Supports .GLB and .GLTF" })
          ] })
        ] })
      }
    ),
    /* @__PURE__ */ jsx(
      "input",
      {
        "data-loc": "client\\src\\designer\\components\\ModelUploader.tsx:57",
        ref: fileInputRef,
        type: "file",
        accept: ".glb,.gltf",
        onChange: handleFileUpload,
        style: { display: "none" }
      }
    )
  ] });
};
const ModelLibrary = ({ onClose, onError }) => {
  const { setModelUrl, isLoading, modelUrl, setLoading, setLoadingProgress } = useConfiguratorStore();
  const handleSelectModel = async (model) => {
    if (isLoading) return;
    if (onClose) onClose();
    try {
      setLoading(true);
      setLoadingProgress(0);
      const { getCachedModelUrl } = await import("./assetCache-D54a_DNI.js");
      const cachedUrl = await getCachedModelUrl(model.file, (progress) => {
        setLoadingProgress(progress);
      });
      setModelUrl(cachedUrl);
    } catch (error) {
      console.error("Failed to load model:", error);
      const errorMessage = error.message || "Unknown error occurred";
      if (onError) {
        onError(errorMessage);
      } else {
        alert(`Failed to load model: ${errorMessage}`);
      }
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\designer\\components\\ModelLibrary.tsx:45", className: "model-library", children: [
    /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\designer\\components\\ModelLibrary.tsx:47", className: "bento-grid", children: PRESET_MODELS.map((model) => {
      const isActive = modelUrl === model.file;
      return /* @__PURE__ */ jsxs(
        "div",
        {
          "data-loc": "client\\src\\designer\\components\\ModelLibrary.tsx:51",
          className: `bento-card ${isActive ? "active" : ""}`,
          onClick: () => handleSelectModel(model),
          children: [
            /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\designer\\components\\ModelLibrary.tsx:56", className: "bento-thumb", children: [
              model.thumbnail ? /* @__PURE__ */ jsx(
                "img",
                {
                  "data-loc": "client\\src\\designer\\components\\ModelLibrary.tsx:58",
                  src: model.thumbnail,
                  alt: model.name,
                  onError: (e) => {
                    e.currentTarget.style.display = "none";
                    const placeholder = e.currentTarget.parentElement?.querySelector(".bento-thumb-placeholder");
                    if (placeholder) placeholder.style.display = "flex";
                  }
                }
              ) : null,
              /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\designer\\components\\ModelLibrary.tsx:68", className: "bento-thumb-placeholder", style: { display: model.thumbnail ? "none" : "flex" }, children: "👕" })
            ] }),
            /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\designer\\components\\ModelLibrary.tsx:72", className: "bento-label", children: model.name })
          ]
        },
        model.id
      );
    }) }),
    /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\designer\\components\\ModelLibrary.tsx:79", className: "section-divider", children: /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\designer\\components\\ModelLibrary.tsx:80", children: "OR UPLOAD" }) }),
    /* @__PURE__ */ jsx(ModelUploader, { "data-loc": "client\\src\\designer\\components\\ModelLibrary.tsx:84" })
  ] });
};
const DecalManager = () => {
  const fileInputRef = useRef(null);
  const {
    decals,
    selectedDecalId,
    updateDecal,
    removeDecal,
    selectDecal,
    isPlacingDecal,
    setPendingDecal
  } = useConfiguratorStore();
  const handleFileUpload = useCallback((event) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      setPendingDecal(url);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [setPendingDecal]);
  const handleDrop = useCallback((event) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      setPendingDecal(url);
    }
  }, [setPendingDecal]);
  const handleDragOver = useCallback((event) => {
    event.preventDefault();
  }, []);
  const selectedDecal = decals.find((d) => d.id === selectedDecalId);
  return /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\designer\\components\\DecalManager.tsx:43", className: "decal-manager", children: [
    isPlacingDecal && /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\designer\\components\\DecalManager.tsx:46", className: "placement-banner animate-fade-in", children: [
      /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\designer\\components\\DecalManager.tsx:47", className: "placement-icon", children: "🎯" }),
      /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\designer\\components\\DecalManager.tsx:48", className: "placement-text", children: [
        /* @__PURE__ */ jsx("strong", { "data-loc": "client\\src\\designer\\components\\DecalManager.tsx:49", children: "Click on the model to place your logo" }),
        /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\designer\\components\\DecalManager.tsx:50", children: "Position it where you want" })
      ] }),
      /* @__PURE__ */ jsx("button", { "data-loc": "client\\src\\designer\\components\\DecalManager.tsx:52", className: "cancel-btn", onClick: () => setPendingDecal(null), children: "Cancel" })
    ] }),
    !isPlacingDecal && /* @__PURE__ */ jsxs(
      "div",
      {
        "data-loc": "client\\src\\designer\\components\\DecalManager.tsx:60",
        className: "upload-zone",
        onClick: () => fileInputRef.current?.click(),
        onDrop: handleDrop,
        onDragOver: handleDragOver,
        children: [
          /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\designer\\components\\DecalManager.tsx:66", className: "upload-icon", children: "➕" }),
          /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\designer\\components\\DecalManager.tsx:67", className: "upload-text", children: "Upload Logo" }),
          /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\designer\\components\\DecalManager.tsx:68", className: "upload-hint", children: "PNG, JPG, SVG • Drag & drop or click" })
        ]
      }
    ),
    /* @__PURE__ */ jsx(
      "input",
      {
        "data-loc": "client\\src\\designer\\components\\DecalManager.tsx:72",
        ref: fileInputRef,
        type: "file",
        accept: "image/*",
        onChange: handleFileUpload,
        style: { display: "none" }
      }
    ),
    decals.length > 0 && /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\designer\\components\\DecalManager.tsx:82", className: "logos-section", children: [
      /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\designer\\components\\DecalManager.tsx:83", className: "section-title", children: [
        "Uploaded Logos (",
        decals.length,
        ")"
      ] }),
      /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\designer\\components\\DecalManager.tsx:84", className: "logo-gallery", children: decals.map((decal) => /* @__PURE__ */ jsxs(
        "div",
        {
          "data-loc": "client\\src\\designer\\components\\DecalManager.tsx:86",
          className: `logo-item ${selectedDecalId === decal.id ? "active" : ""}`,
          onClick: () => selectDecal(decal.id),
          style: { position: "relative" },
          children: [
            /* @__PURE__ */ jsx("img", { "data-loc": "client\\src\\designer\\components\\DecalManager.tsx:92", src: decal.textureUrl, alt: "Logo" }),
            /* @__PURE__ */ jsx(
              "button",
              {
                "data-loc": "client\\src\\designer\\components\\DecalManager.tsx:93",
                className: "logo-item-delete",
                onClick: (e) => {
                  e.stopPropagation();
                  removeDecal(decal.id);
                },
                style: { opacity: 1 },
                children: "×"
              }
            )
          ]
        },
        decal.id
      )) })
    ] }),
    selectedDecal && /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\designer\\components\\DecalManager.tsx:111", className: "logo-controls animate-slide-up", children: [
      /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\designer\\components\\DecalManager.tsx:112", className: "section-title", children: "Adjust Logo" }),
      /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\designer\\components\\DecalManager.tsx:114", className: "slider-control", children: [
        /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\designer\\components\\DecalManager.tsx:115", className: "slider-header", children: [
          /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\designer\\components\\DecalManager.tsx:116", className: "slider-label", children: "Rotation" }),
          /* @__PURE__ */ jsxs("span", { "data-loc": "client\\src\\designer\\components\\DecalManager.tsx:117", className: "slider-value", children: [
            Math.round(selectedDecal.rotation[2] * 180 / Math.PI),
            "°"
          ] })
        ] }),
        /* @__PURE__ */ jsx(
          "input",
          {
            "data-loc": "client\\src\\designer\\components\\DecalManager.tsx:119",
            type: "range",
            className: "slider-track",
            min: "-180",
            max: "180",
            step: "1",
            value: selectedDecal.rotation[2] * 180 / Math.PI,
            onChange: (e) => updateDecal(selectedDecal.id, { rotation: [0, 0, parseFloat(e.target.value) * Math.PI / 180] })
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\designer\\components\\DecalManager.tsx:130", className: "slider-control", children: [
        /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\designer\\components\\DecalManager.tsx:131", className: "slider-header", children: [
          /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\designer\\components\\DecalManager.tsx:132", className: "slider-label", children: "Size" }),
          /* @__PURE__ */ jsxs("span", { "data-loc": "client\\src\\designer\\components\\DecalManager.tsx:133", className: "slider-value", children: [
            selectedDecal.scale[0].toFixed(1),
            "x"
          ] })
        ] }),
        /* @__PURE__ */ jsx(
          "input",
          {
            "data-loc": "client\\src\\designer\\components\\DecalManager.tsx:135",
            type: "range",
            className: "slider-track",
            min: "0.1",
            max: "5",
            step: "0.1",
            value: selectedDecal.scale[0],
            onChange: (e) => {
              const val = parseFloat(e.target.value);
              updateDecal(selectedDecal.id, { scale: [val, val, val] });
            }
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\designer\\components\\DecalManager.tsx:149", className: "effect-selector", children: [
        /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\designer\\components\\DecalManager.tsx:150", className: "section-title", style: { fontSize: "0.9rem", marginBottom: "8px" }, children: "Print Style" }),
        /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\designer\\components\\DecalManager.tsx:151", className: "effect-grid", children: [
          { id: "digital", label: "Digital", icon: "🖨️" },
          { id: "screen", label: "Screen", icon: "🎨" },
          { id: "embroidery", label: "Embroidery", icon: "🧵" },
          { id: "applique", label: "Applique", icon: "✂️" }
        ].map((effect) => /* @__PURE__ */ jsxs(
          "button",
          {
            "data-loc": "client\\src\\designer\\components\\DecalManager.tsx:158",
            className: `effect-btn ${selectedDecal.effect === effect.id || !selectedDecal.effect && effect.id === "digital" ? "active" : ""}`,
            onClick: () => updateDecal(selectedDecal.id, { effect: effect.id }),
            title: `${effect.label} Effect`,
            children: [
              /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\designer\\components\\DecalManager.tsx:164", className: "effect-icon", children: effect.icon }),
              /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\designer\\components\\DecalManager.tsx:165", className: "effect-label", children: effect.label })
            ]
          },
          effect.id
        )) })
      ] }),
      /* @__PURE__ */ jsx("button", { "data-loc": "client\\src\\designer\\components\\DecalManager.tsx:171", className: "remove-btn", onClick: () => removeDecal(selectedDecal.id), children: "🗑️ Remove Logo" })
    ] }),
    decals.length === 0 && !isPlacingDecal && /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\designer\\components\\DecalManager.tsx:179", className: "empty-hint", children: [
      /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\designer\\components\\DecalManager.tsx:180", className: "empty-icon", children: "💡" }),
      /* @__PURE__ */ jsx("p", { "data-loc": "client\\src\\designer\\components\\DecalManager.tsx:181", children: "PNG files with transparency work best for logos" })
    ] }),
    /* @__PURE__ */ jsx("style", { "data-loc": "client\\src\\designer\\components\\DecalManager.tsx:185", children: `
                .decal-manager {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }
                .placement-banner {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 16px;
                    background: linear-gradient(135deg, rgba(124, 58, 237, 0.2), rgba(168, 85, 247, 0.2));
                    border: 1px solid rgba(124, 58, 237, 0.4);
                    border-radius: 16px;
                }
                .placement-icon {
                    font-size: 1.5rem;
                }
                .placement-text {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    gap: 2px;
                }
                .placement-text strong {
                    color: var(--text-primary);
                    font-size: 0.9rem;
                }
                .placement-text span {
                    color: var(--text-muted);
                    font-size: 0.75rem;
                }
                .cancel-btn {
                    padding: 8px 16px;
                    background: rgba(255, 255, 255, 0.1);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    color: var(--text-primary);
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 0.8rem;
                    font-weight: 500;
                    transition: all 0.2s;
                }
                .cancel-btn:hover {
                    background: rgba(255, 255, 255, 0.2);
                }
                .logos-section {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }
                .logo-controls {
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                    padding: 16px;
                    background: var(--glass-bg);
                    border: 1px solid var(--glass-border);
                    border-radius: 16px;
                }
                .empty-hint {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 16px;
                    background: var(--glass-bg);
                    border-radius: 12px;
                    color: var(--text-muted);
                    font-size: 0.8rem;
                }
                .empty-hint .empty-icon {
                    font-size: 1.2rem;
                }
                .effect-selector {
                    margin-top: 8px;
                }
                .effect-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 8px;
                }
                .effect-btn {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 8px 12px;
                    background: var(--glass-bg);
                    border: 1px solid var(--glass-border);
                    border-radius: 8px;
                    color: var(--text-muted);
                    cursor: pointer;
                    transition: all 0.2s;
                    font-size: 0.8rem;
                }
                .effect-btn:hover {
                    background: var(--glass-bg-strong);
                    color: var(--text-primary);
                }
                .effect-btn.active {
                    background: rgba(124, 58, 237, 0.2);
                    border-color: var(--accent-primary);
                    color: var(--text-primary);
                }
                .effect-icon {
                    font-size: 1.1rem;
                }
            ` })
  ] });
};
const GOOGLE_FONTS = [
  { name: "Roboto", label: "Roboto" },
  { name: "Open Sans", label: "Open Sans" },
  { name: "Lato", label: "Lato" },
  { name: "Montserrat", label: "Montserrat" },
  { name: "Oswald", label: "Oswald" },
  { name: "Playfair Display", label: "Playfair Display" },
  { name: "Bebas Neue", label: "Bebas Neue" },
  { name: "Dancing Script", label: "Dancing Script" },
  { name: "Pacifico", label: "Pacifico" },
  { name: "Lobster", label: "Lobster" }
];
const TextManager = () => {
  const {
    texts,
    selectedTextId,
    updateText,
    removeText,
    selectText,
    isPlacingText,
    setPendingText
  } = useConfiguratorStore();
  const [inputText, setInputText] = useState("");
  const [selectedFont, setSelectedFont] = useState("Roboto");
  const [selectedColor, setSelectedColor] = useState("#ffffff");
  const handleAddText = useCallback(() => {
    if (!inputText.trim()) return;
    setPendingText({
      text: inputText.trim(),
      fontFamily: selectedFont,
      color: selectedColor
    });
  }, [inputText, selectedFont, selectedColor, setPendingText]);
  const selectedTextConfig = useMemo(
    () => texts.find((t) => t.id === selectedTextId),
    [texts, selectedTextId]
  );
  return /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\designer\\components\\TextManager.tsx:49", className: "text-manager", children: [
    isPlacingText && /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\designer\\components\\TextManager.tsx:52", className: "placement-banner animate-fade-in", children: [
      /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\designer\\components\\TextManager.tsx:53", className: "placement-icon", children: "🎯" }),
      /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\designer\\components\\TextManager.tsx:54", className: "placement-text", children: [
        /* @__PURE__ */ jsx("strong", { "data-loc": "client\\src\\designer\\components\\TextManager.tsx:55", children: "Click on the model to place your text" }),
        /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\designer\\components\\TextManager.tsx:56", children: "Position it where you want" })
      ] }),
      /* @__PURE__ */ jsx("button", { "data-loc": "client\\src\\designer\\components\\TextManager.tsx:58", className: "cancel-btn", onClick: () => setPendingText(null), children: "Cancel" })
    ] }),
    !isPlacingText && /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\designer\\components\\TextManager.tsx:66", className: "text-input-section", children: [
      /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\designer\\components\\TextManager.tsx:67", className: "section-title", children: "Add Text" }),
      /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\designer\\components\\TextManager.tsx:70", className: "text-input-wrapper", children: /* @__PURE__ */ jsx(
        "input",
        {
          "data-loc": "client\\src\\designer\\components\\TextManager.tsx:71",
          type: "text",
          className: "text-input-field",
          placeholder: "Enter your text...",
          value: inputText,
          onChange: (e) => setInputText(e.target.value),
          maxLength: 50
        }
      ) }),
      /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\designer\\components\\TextManager.tsx:82", className: "font-selector-wrapper", children: [
        /* @__PURE__ */ jsx("label", { "data-loc": "client\\src\\designer\\components\\TextManager.tsx:83", className: "input-label", children: "Font" }),
        /* @__PURE__ */ jsx(
          "select",
          {
            "data-loc": "client\\src\\designer\\components\\TextManager.tsx:84",
            className: "font-selector",
            value: selectedFont,
            onChange: (e) => setSelectedFont(e.target.value),
            style: { fontFamily: selectedFont },
            children: GOOGLE_FONTS.map((font) => /* @__PURE__ */ jsx(
              "option",
              {
                "data-loc": "client\\src\\designer\\components\\TextManager.tsx:91",
                value: font.name,
                style: { fontFamily: font.name },
                children: font.label
              },
              font.name
            ))
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\designer\\components\\TextManager.tsx:103", className: "color-picker-wrapper", children: [
        /* @__PURE__ */ jsx("label", { "data-loc": "client\\src\\designer\\components\\TextManager.tsx:104", className: "input-label", children: "Color" }),
        /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\designer\\components\\TextManager.tsx:105", className: "color-input-row", children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              "data-loc": "client\\src\\designer\\components\\TextManager.tsx:106",
              type: "color",
              className: "color-picker-input",
              value: selectedColor,
              onChange: (e) => setSelectedColor(e.target.value)
            }
          ),
          /* @__PURE__ */ jsx(
            "input",
            {
              "data-loc": "client\\src\\designer\\components\\TextManager.tsx:112",
              type: "text",
              className: "color-hex-input",
              value: selectedColor,
              onChange: (e) => setSelectedColor(e.target.value)
            }
          )
        ] })
      ] }),
      inputText && /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\designer\\components\\TextManager.tsx:123", className: "text-preview-wrapper", children: [
        /* @__PURE__ */ jsx("label", { "data-loc": "client\\src\\designer\\components\\TextManager.tsx:124", className: "input-label", children: "Preview" }),
        /* @__PURE__ */ jsx(
          "div",
          {
            "data-loc": "client\\src\\designer\\components\\TextManager.tsx:125",
            className: "text-preview",
            style: {
              fontFamily: selectedFont,
              color: selectedColor
            },
            children: inputText
          }
        )
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          "data-loc": "client\\src\\designer\\components\\TextManager.tsx:138",
          className: "add-text-btn",
          onClick: handleAddText,
          disabled: !inputText.trim(),
          children: "➕ Add to Model"
        }
      )
    ] }),
    texts.length > 0 && /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\designer\\components\\TextManager.tsx:150", className: "texts-section", children: [
      /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\designer\\components\\TextManager.tsx:151", className: "section-title", children: [
        "Applied Texts (",
        texts.length,
        ")"
      ] }),
      /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\designer\\components\\TextManager.tsx:152", className: "text-gallery", children: texts.map((textConfig) => /* @__PURE__ */ jsxs(
        "div",
        {
          "data-loc": "client\\src\\designer\\components\\TextManager.tsx:154",
          className: `text-item ${selectedTextId === textConfig.id ? "active" : ""}`,
          onClick: () => selectText(textConfig.id),
          children: [
            /* @__PURE__ */ jsx(
              "span",
              {
                "data-loc": "client\\src\\designer\\components\\TextManager.tsx:159",
                className: "text-item-preview",
                style: {
                  fontFamily: textConfig.fontFamily,
                  color: textConfig.color
                },
                children: textConfig.text.length > 10 ? textConfig.text.substring(0, 10) + "..." : textConfig.text
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                "data-loc": "client\\src\\designer\\components\\TextManager.tsx:170",
                className: "text-item-delete",
                onClick: (e) => {
                  e.stopPropagation();
                  removeText(textConfig.id);
                },
                children: "×"
              }
            )
          ]
        },
        textConfig.id
      )) })
    ] }),
    selectedTextConfig && /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\designer\\components\\TextManager.tsx:187", className: "text-controls animate-slide-up", children: [
      /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\designer\\components\\TextManager.tsx:188", className: "section-title", children: "Adjust Text" }),
      /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\designer\\components\\TextManager.tsx:191", className: "slider-control", children: [
        /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\designer\\components\\TextManager.tsx:192", className: "slider-header", children: [
          /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\designer\\components\\TextManager.tsx:193", className: "slider-label", children: "Rotation" }),
          /* @__PURE__ */ jsxs("span", { "data-loc": "client\\src\\designer\\components\\TextManager.tsx:194", className: "slider-value", children: [
            Math.round(selectedTextConfig.rotation[2] * 180 / Math.PI),
            "°"
          ] })
        ] }),
        /* @__PURE__ */ jsx(
          "input",
          {
            "data-loc": "client\\src\\designer\\components\\TextManager.tsx:196",
            type: "range",
            className: "slider-track",
            min: "-180",
            max: "180",
            step: "1",
            value: selectedTextConfig.rotation[2] * 180 / Math.PI,
            onChange: (e) => updateText(selectedTextConfig.id, {
              rotation: [0, 0, parseFloat(e.target.value) * Math.PI / 180]
            })
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\designer\\components\\TextManager.tsx:210", className: "slider-control", children: [
        /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\designer\\components\\TextManager.tsx:211", className: "slider-header", children: [
          /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\designer\\components\\TextManager.tsx:212", className: "slider-label", children: "Size" }),
          /* @__PURE__ */ jsxs("span", { "data-loc": "client\\src\\designer\\components\\TextManager.tsx:213", className: "slider-value", children: [
            selectedTextConfig.scale[0].toFixed(1),
            "x"
          ] })
        ] }),
        /* @__PURE__ */ jsx(
          "input",
          {
            "data-loc": "client\\src\\designer\\components\\TextManager.tsx:215",
            type: "range",
            className: "slider-track",
            min: "0.1",
            max: "5",
            step: "0.1",
            value: selectedTextConfig.scale[0],
            onChange: (e) => {
              const val = parseFloat(e.target.value);
              updateText(selectedTextConfig.id, { scale: [val, val, val] });
            }
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\designer\\components\\TextManager.tsx:230", className: "slider-control", children: [
        /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\designer\\components\\TextManager.tsx:231", className: "slider-header", children: /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\designer\\components\\TextManager.tsx:232", className: "slider-label", children: "Color" }) }),
        /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\designer\\components\\TextManager.tsx:234", className: "color-input-row", children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              "data-loc": "client\\src\\designer\\components\\TextManager.tsx:235",
              type: "color",
              className: "color-picker-input",
              value: selectedTextConfig.color,
              onChange: (e) => updateText(selectedTextConfig.id, { color: e.target.value })
            }
          ),
          /* @__PURE__ */ jsx(
            "input",
            {
              "data-loc": "client\\src\\designer\\components\\TextManager.tsx:241",
              type: "text",
              className: "color-hex-input",
              value: selectedTextConfig.color,
              onChange: (e) => updateText(selectedTextConfig.id, { color: e.target.value })
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\designer\\components\\TextManager.tsx:251", className: "slider-control", children: [
        /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\designer\\components\\TextManager.tsx:252", className: "slider-header", children: /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\designer\\components\\TextManager.tsx:253", className: "slider-label", children: "Font" }) }),
        /* @__PURE__ */ jsx(
          "select",
          {
            "data-loc": "client\\src\\designer\\components\\TextManager.tsx:255",
            className: "font-selector",
            value: selectedTextConfig.fontFamily,
            onChange: (e) => updateText(selectedTextConfig.id, { fontFamily: e.target.value }),
            style: { fontFamily: selectedTextConfig.fontFamily },
            children: GOOGLE_FONTS.map((font) => /* @__PURE__ */ jsx(
              "option",
              {
                "data-loc": "client\\src\\designer\\components\\TextManager.tsx:262",
                value: font.name,
                style: { fontFamily: font.name },
                children: font.label
              },
              font.name
            ))
          }
        )
      ] }),
      /* @__PURE__ */ jsx("button", { "data-loc": "client\\src\\designer\\components\\TextManager.tsx:273", className: "remove-btn", onClick: () => removeText(selectedTextConfig.id), children: "🗑️ Remove Text" })
    ] }),
    texts.length === 0 && !isPlacingText && /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\designer\\components\\TextManager.tsx:281", className: "empty-hint", children: [
      /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\designer\\components\\TextManager.tsx:282", className: "empty-icon", children: "💡" }),
      /* @__PURE__ */ jsx("p", { "data-loc": "client\\src\\designer\\components\\TextManager.tsx:283", children: "Add text with custom fonts and colors to personalize your design" })
    ] }),
    /* @__PURE__ */ jsx("style", { "data-loc": "client\\src\\designer\\components\\TextManager.tsx:287", children: `
                .text-manager {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }
                .text-input-section {
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                }
                .text-input-wrapper {
                    width: 100%;
                }
                .text-input-field {
                    width: 100%;
                    padding: 14px 16px;
                    background: var(--glass-bg);
                    border: 1px solid var(--glass-border);
                    border-radius: 12px;
                    color: var(--text-primary);
                    font-size: 1rem;
                    font-family: var(--font-family);
                    outline: none;
                    transition: all 0.2s;
                }
                .text-input-field:focus {
                    border-color: var(--accent-primary);
                    box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.2);
                }
                .text-input-field::placeholder {
                    color: var(--text-muted);
                }
                .input-label {
                    display: block;
                    font-size: 0.8rem;
                    font-weight: 600;
                    color: var(--text-secondary);
                    margin-bottom: 8px;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }
                .font-selector-wrapper,
                .color-picker-wrapper,
                .text-preview-wrapper {
                    width: 100%;
                }
                .font-selector {
                    width: 100%;
                    padding: 12px 16px;
                    background: var(--glass-bg);
                    border: 1px solid var(--glass-border);
                    border-radius: 12px;
                    color: var(--text-primary);
                    font-size: 0.95rem;
                    cursor: pointer;
                    outline: none;
                    appearance: none;
                    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='white' viewBox='0 0 16 16'%3E%3Cpath d='M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z'/%3E%3C/svg%3E");
                    background-repeat: no-repeat;
                    background-position: right 16px center;
                    padding-right: 40px;
                }
                .font-selector:focus {
                    border-color: var(--accent-primary);
                }
                .font-selector option {
                    background: #1a1a1a;
                    color: white;
                    padding: 12px;
                }
                .color-input-row {
                    display: flex;
                    gap: 12px;
                    align-items: center;
                }
                .color-picker-input {
                    width: 52px;
                    height: 42px;
                    padding: 0;
                    border: 2px solid var(--glass-border);
                    border-radius: 10px;
                    cursor: pointer;
                    background: transparent;
                }
                .color-picker-input::-webkit-color-swatch-wrapper {
                    padding: 2px;
                }
                .color-picker-input::-webkit-color-swatch {
                    border: none;
                    border-radius: 6px;
                }
                .color-hex-input {
                    flex: 1;
                    padding: 12px 14px;
                    background: var(--glass-bg);
                    border: 1px solid var(--glass-border);
                    border-radius: 10px;
                    color: var(--text-primary);
                    font-family: monospace;
                    font-size: 0.9rem;
                    outline: none;
                }
                .color-hex-input:focus {
                    border-color: var(--accent-primary);
                }
                .text-preview {
                    padding: 16px;
                    background: var(--glass-bg);
                    border: 1px solid var(--glass-border);
                    border-radius: 12px;
                    font-size: 1.4rem;
                    text-align: center;
                    min-height: 60px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    word-break: break-word;
                }
                .add-text-btn {
                    width: 100%;
                    padding: 14px 20px;
                    background: var(--accent-gradient);
                    border: none;
                    border-radius: 12px;
                    color: white;
                    font-size: 0.95rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;
                    box-shadow: 0 4px 15px rgba(124, 58, 237, 0.3);
                }
                .add-text-btn:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(124, 58, 237, 0.4);
                }
                .add-text-btn:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }
                .texts-section {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }
                .text-gallery {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
                    gap: 12px;
                }
                .text-item {
                    position: relative;
                    padding: 12px;
                    background: var(--glass-bg);
                    border: 2px solid transparent;
                    border-radius: 12px;
                    cursor: pointer;
                    transition: all 0.2s;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    min-height: 60px;
                }
                .text-item:hover {
                    border-color: var(--accent-primary);
                    background: var(--glass-bg-strong);
                }
                .text-item.active {
                    border-color: var(--accent-primary);
                    background: rgba(124, 58, 237, 0.2);
                    box-shadow: 0 0 20px rgba(124, 58, 237, 0.3);
                }
                .text-item-preview {
                    font-size: 0.85rem;
                    font-weight: 600;
                    text-align: center;
                    word-break: break-word;
                }
                .text-item-delete {
                    position: absolute;
                    top: -8px;
                    right: -8px;
                    width: 24px;
                    height: 24px;
                    background: #ef4444;
                    border: 2px solid var(--bg-app);
                    border-radius: 50%;
                    color: white;
                    font-size: 14px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s;
                }
                .text-item-delete:hover {
                    transform: scale(1.1);
                    background: #ff5f5f;
                }
                .text-controls {
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                    padding: 16px;
                    background: var(--glass-bg);
                    border: 1px solid var(--glass-border);
                    border-radius: 16px;
                }
            ` })
  ] });
};
const TextureUploader = () => {
  const fileInputRef = useRef(null);
  const {
    textureUrl,
    textureScale,
    setTextureUrl,
    setTextureScale,
    selectedMeshName,
    meshPatterns,
    setMeshPattern,
    meshTextureSettings,
    setMeshTextureSettings
  } = useConfiguratorStore();
  const currentSettings = selectedMeshName ? meshTextureSettings[selectedMeshName] || { scale: 1, tiled: true } : { scale: textureScale, tiled: true };
  const activeTextureUrl = selectedMeshName ? meshPatterns[selectedMeshName] || null : textureUrl;
  const handleSetTexture = useCallback((url) => {
    if (selectedMeshName) {
      setMeshPattern(selectedMeshName, url);
      if (url) {
        setMeshTextureSettings(selectedMeshName, { scale: 1, tiled: true });
      }
    } else {
      setTextureUrl(url);
      if (url) {
        setTextureScale(1);
      }
    }
  }, [selectedMeshName, setMeshPattern, setTextureUrl, setTextureScale, setMeshTextureSettings]);
  const handleScaleChange = useCallback((scale) => {
    const clampedScale = Math.max(0.01, scale);
    if (selectedMeshName) {
      setMeshTextureSettings(selectedMeshName, { scale: clampedScale });
    } else {
      setTextureScale(clampedScale);
    }
  }, [selectedMeshName, setMeshTextureSettings, setTextureScale]);
  const handleTiledChange = useCallback((tiled) => {
    if (selectedMeshName) {
      setMeshTextureSettings(selectedMeshName, { tiled });
    }
  }, [selectedMeshName, setMeshTextureSettings]);
  const handleFileUpload = useCallback((event) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      handleSetTexture(url);
    }
  }, [handleSetTexture]);
  const handleDrop = useCallback((event) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      handleSetTexture(url);
    }
  }, [handleSetTexture]);
  const handleDragOver = useCallback((event) => {
    event.preventDefault();
  }, []);
  const incrementScale = () => handleScaleChange(currentSettings.scale + 0.1);
  const decrementScale = () => handleScaleChange(currentSettings.scale - 0.1);
  return /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\designer\\components\\TextureUploader.tsx:79", className: "texture-uploader", children: [
    selectedMeshName ? /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\designer\\components\\TextureUploader.tsx:82", className: "context-badge", children: [
      /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\designer\\components\\TextureUploader.tsx:83", className: "context-icon", children: "🎯" }),
      /* @__PURE__ */ jsxs("span", { "data-loc": "client\\src\\designer\\components\\TextureUploader.tsx:84", children: [
        "Applying to: ",
        /* @__PURE__ */ jsx("strong", { "data-loc": "client\\src\\designer\\components\\TextureUploader.tsx:84", children: selectedMeshName })
      ] })
    ] }) : /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\designer\\components\\TextureUploader.tsx:87", className: "context-badge global", children: [
      /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\designer\\components\\TextureUploader.tsx:88", className: "context-icon", children: "🌐" }),
      /* @__PURE__ */ jsxs("span", { "data-loc": "client\\src\\designer\\components\\TextureUploader.tsx:89", children: [
        "Applying to: ",
        /* @__PURE__ */ jsx("strong", { "data-loc": "client\\src\\designer\\components\\TextureUploader.tsx:89", children: "Whole Garment" })
      ] })
    ] }),
    /* @__PURE__ */ jsx(
      "div",
      {
        "data-loc": "client\\src\\designer\\components\\TextureUploader.tsx:94",
        className: "upload-zone",
        onClick: () => fileInputRef.current?.click(),
        onDrop: handleDrop,
        onDragOver: handleDragOver,
        children: activeTextureUrl ? /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\designer\\components\\TextureUploader.tsx:101", className: "texture-preview-container", children: [
          /* @__PURE__ */ jsx("img", { "data-loc": "client\\src\\designer\\components\\TextureUploader.tsx:102", src: activeTextureUrl, alt: "Texture preview", className: "texture-preview-img" }),
          /* @__PURE__ */ jsx(
            "button",
            {
              "data-loc": "client\\src\\designer\\components\\TextureUploader.tsx:103",
              className: "preview-remove-btn",
              onClick: (e) => {
                e.stopPropagation();
                handleSetTexture(null);
              },
              children: "✕"
            }
          )
        ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\designer\\components\\TextureUploader.tsx:115", className: "upload-icon", children: "🎨" }),
          /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\designer\\components\\TextureUploader.tsx:116", className: "upload-text", children: "Upload Texture" }),
          /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\designer\\components\\TextureUploader.tsx:117", className: "upload-hint", children: "PNG, JPG • Seamless patterns work best" })
        ] })
      }
    ),
    /* @__PURE__ */ jsx(
      "input",
      {
        "data-loc": "client\\src\\designer\\components\\TextureUploader.tsx:122",
        ref: fileInputRef,
        type: "file",
        accept: "image/*",
        onChange: handleFileUpload,
        style: { display: "none" }
      }
    ),
    /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\designer\\components\\TextureUploader.tsx:131", className: "preset-section", children: [
      /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\designer\\components\\TextureUploader.tsx:132", className: "preset-header", children: /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\designer\\components\\TextureUploader.tsx:133", className: "preset-title", children: "🎨 Preset Patterns" }) }),
      /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\designer\\components\\TextureUploader.tsx:135", className: "preset-grid", children: [
        /* @__PURE__ */ jsxs(
          "div",
          {
            "data-loc": "client\\src\\designer\\components\\TextureUploader.tsx:136",
            className: `preset-item ${activeTextureUrl === "https://files.manuscdn.com/user_upload_by_module/session_file/310419663026792105/OJAxgHPWHBkOFaxa.png" ? "active" : ""}`,
            onClick: () => handleSetTexture("https://files.manuscdn.com/user_upload_by_module/session_file/310419663026792105/OJAxgHPWHBkOFaxa.png"),
            children: [
              /* @__PURE__ */ jsx("img", { "data-loc": "client\\src\\designer\\components\\TextureUploader.tsx:140", src: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663026792105/OJAxgHPWHBkOFaxa.png", alt: "Woodland Camo" }),
              /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\designer\\components\\TextureUploader.tsx:141", className: "preset-label", children: "Woodland" })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "div",
          {
            "data-loc": "client\\src\\designer\\components\\TextureUploader.tsx:143",
            className: `preset-item ${activeTextureUrl === "https://files.manuscdn.com/user_upload_by_module/session_file/310419663026792105/vnBMpEZHVeEfEZzE.png" ? "active" : ""}`,
            onClick: () => handleSetTexture("https://files.manuscdn.com/user_upload_by_module/session_file/310419663026792105/vnBMpEZHVeEfEZzE.png"),
            children: [
              /* @__PURE__ */ jsx("img", { "data-loc": "client\\src\\designer\\components\\TextureUploader.tsx:147", src: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663026792105/vnBMpEZHVeEfEZzE.png", alt: "Desert Camo" }),
              /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\designer\\components\\TextureUploader.tsx:148", className: "preset-label", children: "Desert" })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "div",
          {
            "data-loc": "client\\src\\designer\\components\\TextureUploader.tsx:150",
            className: `preset-item ${activeTextureUrl === "https://files.manuscdn.com/user_upload_by_module/session_file/310419663026792105/aVVxfZrGedLvxeUh.png" ? "active" : ""}`,
            onClick: () => handleSetTexture("https://files.manuscdn.com/user_upload_by_module/session_file/310419663026792105/aVVxfZrGedLvxeUh.png"),
            children: [
              /* @__PURE__ */ jsx("img", { "data-loc": "client\\src\\designer\\components\\TextureUploader.tsx:154", src: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663026792105/aVVxfZrGedLvxeUh.png", alt: "Urban Camo" }),
              /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\designer\\components\\TextureUploader.tsx:155", className: "preset-label", children: "Urban" })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "div",
          {
            "data-loc": "client\\src\\designer\\components\\TextureUploader.tsx:157",
            className: `preset-item ${activeTextureUrl === "https://files.manuscdn.com/user_upload_by_module/session_file/310419663026792105/zQgmukgBTEGfYSZd.png" ? "active" : ""}`,
            onClick: () => handleSetTexture("https://files.manuscdn.com/user_upload_by_module/session_file/310419663026792105/zQgmukgBTEGfYSZd.png"),
            children: [
              /* @__PURE__ */ jsx("img", { "data-loc": "client\\src\\designer\\components\\TextureUploader.tsx:161", src: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663026792105/zQgmukgBTEGfYSZd.png", alt: "Arctic Camo" }),
              /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\designer\\components\\TextureUploader.tsx:162", className: "preset-label", children: "Arctic" })
            ]
          }
        )
      ] })
    ] }),
    activeTextureUrl && /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\designer\\components\\TextureUploader.tsx:169", className: "texture-controls animate-slide-up", children: [
      selectedMeshName && /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\designer\\components\\TextureUploader.tsx:172", className: "toggle-group-container", children: [
        /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\designer\\components\\TextureUploader.tsx:173", className: "toggle-label", children: "Pattern Mode" }),
        /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\designer\\components\\TextureUploader.tsx:174", className: "toggle-buttons", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              "data-loc": "client\\src\\designer\\components\\TextureUploader.tsx:175",
              className: `toggle-btn ${currentSettings.tiled ? "active" : ""}`,
              onClick: () => handleTiledChange(true),
              children: "🔁 Tiled"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              "data-loc": "client\\src\\designer\\components\\TextureUploader.tsx:181",
              className: `toggle-btn ${!currentSettings.tiled ? "active" : ""}`,
              onClick: () => handleTiledChange(false),
              children: "📐 Fit"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\designer\\components\\TextureUploader.tsx:192", className: "size-control-section", children: [
        /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\designer\\components\\TextureUploader.tsx:193", className: "size-header", children: /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\designer\\components\\TextureUploader.tsx:194", className: "size-label", children: "Pattern Size" }) }),
        /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\designer\\components\\TextureUploader.tsx:199", className: "size-slider-container", children: [
          /* @__PURE__ */ jsx("button", { "data-loc": "client\\src\\designer\\components\\TextureUploader.tsx:200", className: "size-btn minus", onClick: decrementScale, children: "−" }),
          /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\designer\\components\\TextureUploader.tsx:201", className: "slider-wrapper", children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                "data-loc": "client\\src\\designer\\components\\TextureUploader.tsx:202",
                type: "range",
                className: "size-slider",
                min: "0.01",
                max: "100",
                step: "0.1",
                value: Math.min(currentSettings.scale, 100),
                onChange: (e) => handleScaleChange(parseFloat(e.target.value))
              }
            ),
            /* @__PURE__ */ jsx(
              "div",
              {
                "data-loc": "client\\src\\designer\\components\\TextureUploader.tsx:211",
                className: "slider-fill",
                style: { width: `${Math.min(currentSettings.scale / 100 * 100, 100)}%` }
              }
            )
          ] }),
          /* @__PURE__ */ jsx("button", { "data-loc": "client\\src\\designer\\components\\TextureUploader.tsx:216", className: "size-btn plus", onClick: incrementScale, children: "+" })
        ] }),
        /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\designer\\components\\TextureUploader.tsx:220", className: "size-input-container", children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              "data-loc": "client\\src\\designer\\components\\TextureUploader.tsx:221",
              type: "number",
              className: "size-number-input",
              min: "0.01",
              step: "0.1",
              value: currentSettings.scale,
              onChange: (e) => {
                const val = parseFloat(e.target.value);
                if (!isNaN(val) && val > 0) {
                  handleScaleChange(val);
                }
              }
            }
          ),
          /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\designer\\components\\TextureUploader.tsx:234", className: "size-unit", children: "size" })
        ] }),
        /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\designer\\components\\TextureUploader.tsx:237", className: "size-hint", children: currentSettings.tiled ? "← Denser | Original (1) | Bigger →" : "Adjusts texture stretch" }),
        /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\designer\\components\\TextureUploader.tsx:244", style: { marginTop: "1rem", display: "flex", justifyContent: "center" }, children: /* @__PURE__ */ jsx("button", { "data-loc": "client\\src\\designer\\components\\TextureUploader.tsx:245", className: "remove-btn", onClick: () => handleSetTexture(null), children: "🗑️ Remove Texture" }) })
      ] })
    ] }),
    /* @__PURE__ */ jsx("style", { "data-loc": "client\\src\\designer\\components\\TextureUploader.tsx:253", children: `
                .texture-uploader {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }
                .context-badge {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 12px 16px;
                    background: var(--glass-bg);
                    border: 1px solid var(--glass-border);
                    border-radius: 12px;
                    font-size: 0.8rem;
                    color: var(--text-secondary);
                }
                .context-badge.global {
                    background: rgba(124, 58, 237, 0.1);
                    border-color: rgba(124, 58, 237, 0.3);
                }
                .context-icon {
                    font-size: 1rem;
                }
                .context-badge strong {
                    color: var(--text-primary);
                }
                .texture-preview-container {
                    position: relative;
                    width: 100%;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .texture-preview-img {
                    max-width: 100%;
                    max-height: 80px;
                    object-fit: contain;
                    border-radius: 8px;
                }
                .preview-remove-btn {
                    position: absolute;
                    top: -8px;
                    right: -8px;
                    width: 24px;
                    height: 24px;
                    background: #ef4444;
                    border: 2px solid var(--bg-app);
                    border-radius: 50%;
                    color: white;
                    font-size: 0.8rem;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .texture-controls {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                    padding: 20px;
                    background: var(--glass-bg);
                    border: 1px solid var(--glass-border);
                    border-radius: 16px;
                }
                .toggle-group-container {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }
                .toggle-label {
                    font-size: 0.75rem;
                    font-weight: 600;
                    color: var(--text-muted);
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }
                .toggle-buttons {
                    display: flex;
                    gap: 8px;
                }
                .toggle-btn {
                    flex: 1;
                    padding: 10px;
                    background: var(--glass-bg);
                    border: 1px solid var(--glass-border);
                    border-radius: 10px;
                    color: var(--text-secondary);
                    font-size: 0.8rem;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .toggle-btn:hover {
                    border-color: var(--accent-primary);
                }
                .toggle-btn.active {
                    background: var(--accent-gradient);
                    border-color: transparent;
                    color: white;
                }
                
                /* Size Control Section */
                .size-control-section {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }
                .size-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .size-label {
                    font-size: 0.85rem;
                    font-weight: 600;
                    color: var(--text-primary);
                }
                
                /* Slider Container with Buttons */
                .size-slider-container {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }
                .size-btn {
                    width: 44px;
                    height: 44px;
                    border-radius: 12px;
                    border: 1px solid var(--glass-border);
                    background: var(--glass-bg-strong);
                    color: var(--text-primary);
                    font-size: 1.5rem;
                    font-weight: 300;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s;
                }
                .size-btn:hover {
                    background: var(--accent-primary);
                    border-color: var(--accent-primary);
                }
                .size-btn:active {
                    transform: scale(0.95);
                }
                
                /* Slider Wrapper */
                .slider-wrapper {
                    flex: 1;
                    position: relative;
                    height: 44px;
                    background: var(--glass-bg);
                    border: 1px solid var(--glass-border);
                    border-radius: 12px;
                    overflow: hidden;
                }
                .slider-fill {
                    position: absolute;
                    top: 0;
                    left: 0;
                    height: 100%;
                    background: var(--accent-gradient);
                    opacity: 0.4;
                    pointer-events: none;
                    transition: width 0.1s;
                }
                .size-slider {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    -webkit-appearance: none;
                    appearance: none;
                    background: transparent;
                    cursor: pointer;
                    margin: 0;
                    padding: 0 8px;
                }
                .size-slider::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    width: 28px;
                    height: 28px;
                    background: var(--accent-gradient);
                    border: 3px solid white;
                    border-radius: 50%;
                    cursor: grab;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                }
                .size-slider::-webkit-slider-thumb:active {
                    cursor: grabbing;
                    transform: scale(1.1);
                }
                .size-slider::-moz-range-thumb {
                    width: 28px;
                    height: 28px;
                    background: var(--accent-gradient);
                    border: 3px solid white;
                    border-radius: 50%;
                    cursor: grab;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                }
                
                /* Manual Number Input */
                .size-input-container {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    padding: 12px;
                    background: var(--glass-bg);
                    border: 1px solid var(--glass-border);
                    border-radius: 12px;
                }
                .size-number-input {
                    width: 100px;
                    padding: 10px 12px;
                    background: rgba(255, 255, 255, 0.1);
                    border: 1px solid var(--glass-border);
                    border-radius: 8px;
                    color: var(--text-primary);
                    font-size: 1.1rem;
                    font-weight: 600;
                    font-family: monospace;
                    text-align: center;
                    outline: none;
                }
                .size-number-input:focus {
                    border-color: var(--accent-primary);
                    box-shadow: 0 0 0 3px var(--accent-glow);
                }
                .size-unit {
                    font-size: 0.8rem;
                    color: var(--text-muted);
                    font-weight: 500;
                }
                .size-hint {
                    font-size: 0.75rem;
                    color: var(--text-muted);
                    text-align: center;
                }
                
                /* Preset Textures Section */
                .preset-section {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }
                .preset-header {
                    display: flex;
                    align-items: center;
                }
                .preset-title {
                    font-size: 0.85rem;
                    font-weight: 600;
                    color: var(--text-primary);
                }
                .preset-grid {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 10px;
                }
                .preset-item {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 6px;
                    padding: 8px;
                    background: var(--glass-bg);
                    border: 2px solid transparent;
                    border-radius: 12px;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .preset-item:hover {
                    background: var(--glass-bg-strong);
                    border-color: var(--accent-primary);
                    transform: translateY(-2px);
                }
                .preset-item.active {
                    border-color: var(--accent-primary);
                    box-shadow: 0 0 12px var(--accent-glow);
                }
                .preset-item img {
                    width: 100%;
                    aspect-ratio: 1;
                    object-fit: cover;
                    border-radius: 8px;
                }
                .preset-label {
                    font-size: 0.65rem;
                    font-weight: 600;
                    color: var(--text-secondary);
                    text-transform: uppercase;
                    letter-spacing: 0.03em;
                    text-align: center;
                }
            ` })
  ] });
};
const generateTechPack = async (data) => {
  const { jsPDF } = await import("jspdf");
  const autoTableModule = await import("jspdf-autotable");
  const autoTable = autoTableModule.default;
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  doc.setFontSize(24);
  doc.text(data.projectName, margin, 30);
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Generated: ${data.date}`, margin, 40);
  doc.text(`Version: 1.0`, margin, 45);
  if (data.views.front) {
    const imgWidth = 120;
    const imgHeight = 160;
    const x = (pageWidth - imgWidth) / 2;
    doc.addImage(data.views.front, "PNG", x, 60, imgWidth, imgHeight);
  }
  doc.setFontSize(8);
  doc.setTextColor(150);
  doc.text("Confirm all details with physical samples before bulk production.", pageWidth / 2, pageHeight - 10, { align: "center" });
  doc.addPage();
  doc.setFontSize(16);
  doc.setTextColor(0);
  doc.text("Bill of Materials (BOM)", margin, 20);
  const bomData = [
    ["Component", "Material/Color", "Placement", "Notes"],
    ["Main Fabric", `${data.materialPreset} (${data.primaryColor})`, "Body", "Base Fabric"],
    ["Secondary Fabric", `${data.materialPreset} (${data.secondaryColor})`, "Trim/Accents", "Contrast"]
  ];
  Object.entries(data.meshColors).forEach(([meshName, color]) => {
    if (color !== data.primaryColor && color !== data.secondaryColor) {
      bomData.push(["Panel/Part", `Custom Color (${color})`, meshName, "Specific Panel Color"]);
    }
  });
  autoTable(doc, {
    startY: 30,
    head: [["Component", "Material/Color", "Placement", "Notes"]],
    body: bomData.slice(1),
    // Remove header from data array
    theme: "grid",
    headStyles: { fillColor: [41, 128, 185] }
  });
  if (data.decals.length > 0 || data.texts.length > 0) {
    doc.addPage();
    doc.text("Graphic Placement", margin, 20);
    const graphicsData = [];
    data.decals.forEach((decal, index) => {
      graphicsData.push([
        `Logo #${index + 1}`,
        "Decal",
        decal.isBackSide ? "Back" : "Front",
        `Scale: ${decal.scale[0].toFixed(2)}x`
      ]);
    });
    data.texts.forEach((text, index) => {
      graphicsData.push([
        `Text #${index + 1}: "${text.text}"`,
        `Font: ${text.fontFamily}`,
        text.isBackSide ? "Back" : "Front",
        `Color: ${text.color}`
      ]);
    });
    autoTable(doc, {
      startY: 30,
      head: [["Artwork ID", "Type", "Position", "Details"]],
      body: graphicsData,
      theme: "grid",
      headStyles: { fillColor: [41, 128, 185] }
    });
  }
  doc.addPage();
  doc.text("Technical Views", margin, 20);
  const viewSize = 70;
  const gap = 10;
  const startY = 40;
  doc.setFontSize(10);
  doc.text("Front View", margin, startY - 5);
  if (data.views.front) doc.addImage(data.views.front, "PNG", margin, startY, viewSize, viewSize);
  doc.text("Back View", pageWidth / 2 + gap, startY - 5);
  if (data.views.back) doc.addImage(data.views.back, "PNG", pageWidth / 2 + gap, startY, viewSize, viewSize);
  doc.text("Left Side", margin, startY + viewSize + 20);
  if (data.views.left) doc.addImage(data.views.left, "PNG", margin, startY + viewSize + 25, viewSize, viewSize);
  doc.text("Right Side", pageWidth / 2 + gap, startY + viewSize + 20);
  if (data.views.right) doc.addImage(data.views.right, "PNG", pageWidth / 2 + gap, startY + viewSize + 25, viewSize, viewSize);
  doc.save(`${data.projectName.replace(/\s+/g, "_")}_TechPack.pdf`);
};
const TechPackModal = ({ onClose }) => {
  const store = useConfiguratorStore();
  const [projectName, setProjectName] = useState("My Garment Design");
  const [isGenerating, setIsGenerating] = useState(false);
  const [status, setStatus] = useState("");
  const handleGenerate = async () => {
    setIsGenerating(true);
    setStatus("Capturing 3D Views...");
    const canvas = document.querySelector("canvas");
    if (!canvas) {
      setStatus("Error: Could not find 3D View");
      setIsGenerating(false);
      return;
    }
    const capture = () => canvas.toDataURL("image/png");
    setTimeout(async () => {
      try {
        const frontView = capture();
        setStatus("Generating PDF...");
        const data = {
          projectName,
          date: (/* @__PURE__ */ new Date()).toLocaleDateString(),
          primaryColor: store.primaryColor,
          secondaryColor: store.secondaryColor,
          materialPreset: store.materialPreset,
          meshColors: store.meshColors,
          decals: store.decals,
          texts: store.texts,
          views: {
            front: frontView,
            back: "",
            // TODO: Automate rotation
            left: "",
            right: ""
          }
        };
        await generateTechPack(data);
        setStatus("Done!");
        setTimeout(onClose, 1e3);
      } catch (err) {
        console.error(err);
        setStatus("Failed to generate");
      } finally {
        setIsGenerating(false);
      }
    }, 100);
  };
  return /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\designer\\components\\TechPackModal.tsx:81", className: "tech-pack-overlay", children: [
    /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\designer\\components\\TechPackModal.tsx:82", className: "tech-pack-modal", children: [
      /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\designer\\components\\TechPackModal.tsx:83", className: "modal-header", children: [
        /* @__PURE__ */ jsx("h2", { "data-loc": "client\\src\\designer\\components\\TechPackModal.tsx:84", children: "🏭 Generate Tech Pack" }),
        /* @__PURE__ */ jsx("button", { "data-loc": "client\\src\\designer\\components\\TechPackModal.tsx:85", className: "close-btn", onClick: onClose, children: "×" })
      ] }),
      /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\designer\\components\\TechPackModal.tsx:88", className: "modal-content", children: [
        /* @__PURE__ */ jsxs("p", { "data-loc": "client\\src\\designer\\components\\TechPackModal.tsx:89", className: "description", children: [
          "Create a professional PDF document for manufacturing. Please position your model in the ",
          /* @__PURE__ */ jsx("strong", { "data-loc": "client\\src\\designer\\components\\TechPackModal.tsx:91", children: "Front View" }),
          " before generating."
        ] }),
        /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\designer\\components\\TechPackModal.tsx:94", className: "form-group", children: [
          /* @__PURE__ */ jsx("label", { "data-loc": "client\\src\\designer\\components\\TechPackModal.tsx:95", children: "Project Name" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              "data-loc": "client\\src\\designer\\components\\TechPackModal.tsx:96",
              type: "text",
              value: projectName,
              onChange: (e) => setProjectName(e.target.value),
              className: "input-field"
            }
          )
        ] }),
        /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\designer\\components\\TechPackModal.tsx:104", className: "status-message", children: status && /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\designer\\components\\TechPackModal.tsx:105", children: status }) }),
        /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\designer\\components\\TechPackModal.tsx:108", className: "actions", children: [
          /* @__PURE__ */ jsx("button", { "data-loc": "client\\src\\designer\\components\\TechPackModal.tsx:109", className: "cancel-btn", onClick: onClose, children: "Cancel" }),
          /* @__PURE__ */ jsx(
            "button",
            {
              "data-loc": "client\\src\\designer\\components\\TechPackModal.tsx:110",
              className: "generate-btn",
              onClick: handleGenerate,
              disabled: isGenerating,
              children: isGenerating ? "Processing..." : "Download PDF"
            }
          )
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("style", { "data-loc": "client\\src\\designer\\components\\TechPackModal.tsx:121", children: `
                .tech-pack-overlay {
                    position: fixed;
                    top: 0; left: 0; right: 0; bottom: 0;
                    background: rgba(0, 0, 0, 0.8);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 3000;
                    backdrop-filter: blur(5px);
                }
                .tech-pack-modal {
                    background: #1e1e1e;
                    width: 400px;
                    border-radius: 12px;
                    border: 1px solid #333;
                    box-shadow: 0 20px 40px rgba(0,0,0,0.5);
                    overflow: hidden;
                    color: white;
                    font-family: system-ui, sans-serif;
                }
                .modal-header {
                    padding: 15px 20px;
                    background: #252525;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-bottom: 1px solid #333;
                }
                .modal-header h2 { margin: 0; font-size: 1.1rem; }
                .close-btn { background: none; border: none; color: #aaa; font-size: 1.5rem; cursor: pointer; }
                .close-btn:hover { color: white; }
                
                .modal-content {
                    padding: 20px;
                }
                .description {
                    font-size: 0.9rem;
                    color: #aaa;
                    margin-bottom: 20px;
                    line-height: 1.4;
                }
                .form-group { margin-bottom: 20px; }
                .form-group label { display: block; font-size: 0.8rem; color: #888; margin-bottom: 5px; }
                .input-field {
                    width: 100%;
                    padding: 10px;
                    background: #111;
                    border: 1px solid #333;
                    border-radius: 6px;
                    color: white;
                    font-size: 1rem;
                }
                
                .status-message {
                    height: 20px;
                    font-size: 0.8rem;
                    color: #6366f1;
                    margin-bottom: 15px;
                    text-align: center;
                }
                
                .actions {
                    display: flex;
                    justify-content: flex-end;
                    gap: 10px;
                }
                .cancel-btn {
                    padding: 8px 16px;
                    background: transparent;
                    border: 1px solid #444;
                    color: #ccc;
                    border-radius: 6px;
                    cursor: pointer;
                }
                .generate-btn {
                    padding: 8px 16px;
                    background: #6366f1;
                    border: none;
                    color: white;
                    border-radius: 6px;
                    font-weight: bold;
                    cursor: pointer;
                }
                .generate-btn:disabled { opacity: 0.5; cursor: not-allowed; }
            ` })
  ] });
};
const ExportPanel = () => {
  const { exportConfiguration, loadConfiguration, resetConfiguration } = useConfiguratorStore();
  const [showTechPackModal, setShowTechPackModal] = useState(false);
  const handleScreenshot = useCallback(() => {
    const canvas = document.querySelector("canvas");
    if (canvas) {
      const link = document.createElement("a");
      link.download = "garment-render.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    }
  }, []);
  const handleExportConfig = useCallback(() => {
    const config = exportConfiguration();
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = "garment-config.json";
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  }, [exportConfiguration]);
  const handleImportConfig = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          try {
            const config = JSON.parse(ev.target?.result);
            loadConfiguration(config);
          } catch (error) {
            console.error("Invalid configuration file");
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  }, [loadConfiguration]);
  return /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\designer\\components\\ExportPanel.tsx:53", className: "export-panel", children: [
    /* @__PURE__ */ jsx("h3", { "data-loc": "client\\src\\designer\\components\\ExportPanel.tsx:54", className: "section-title", children: "Export & Save" }),
    /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\designer\\components\\ExportPanel.tsx:56", className: "export-actions", children: [
      /* @__PURE__ */ jsxs("button", { "data-loc": "client\\src\\designer\\components\\ExportPanel.tsx:57", className: "export-button primary", onClick: handleScreenshot, children: [
        /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\designer\\components\\ExportPanel.tsx:58", className: "button-icon", children: "📸" }),
        /* @__PURE__ */ jsxs("span", { "data-loc": "client\\src\\designer\\components\\ExportPanel.tsx:59", className: "button-text", children: [
          /* @__PURE__ */ jsx("strong", { "data-loc": "client\\src\\designer\\components\\ExportPanel.tsx:60", children: "Screenshot" }),
          /* @__PURE__ */ jsx("small", { "data-loc": "client\\src\\designer\\components\\ExportPanel.tsx:61", children: "Download PNG render" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(
        "button",
        {
          "data-loc": "client\\src\\designer\\components\\ExportPanel.tsx:66",
          className: "export-button",
          onClick: () => setShowTechPackModal(true),
          style: { background: "linear-gradient(135deg, #10b981, #059669)", border: "none" },
          children: [
            /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\designer\\components\\ExportPanel.tsx:71", className: "button-icon", children: "🏭" }),
            /* @__PURE__ */ jsxs("span", { "data-loc": "client\\src\\designer\\components\\ExportPanel.tsx:72", className: "button-text", children: [
              /* @__PURE__ */ jsx("strong", { "data-loc": "client\\src\\designer\\components\\ExportPanel.tsx:73", children: "Tech Pack" }),
              /* @__PURE__ */ jsx("small", { "data-loc": "client\\src\\designer\\components\\ExportPanel.tsx:74", children: "PDF for Manufacturing" })
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsxs("button", { "data-loc": "client\\src\\designer\\components\\ExportPanel.tsx:78", className: "export-button", onClick: handleExportConfig, children: [
        /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\designer\\components\\ExportPanel.tsx:79", className: "button-icon", children: "💾" }),
        /* @__PURE__ */ jsxs("span", { "data-loc": "client\\src\\designer\\components\\ExportPanel.tsx:80", className: "button-text", children: [
          /* @__PURE__ */ jsx("strong", { "data-loc": "client\\src\\designer\\components\\ExportPanel.tsx:81", children: "Save Config" }),
          /* @__PURE__ */ jsx("small", { "data-loc": "client\\src\\designer\\components\\ExportPanel.tsx:82", children: "Export as JSON" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("button", { "data-loc": "client\\src\\designer\\components\\ExportPanel.tsx:86", className: "export-button", onClick: handleImportConfig, children: [
        /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\designer\\components\\ExportPanel.tsx:87", className: "button-icon", children: "📂" }),
        /* @__PURE__ */ jsxs("span", { "data-loc": "client\\src\\designer\\components\\ExportPanel.tsx:88", className: "button-text", children: [
          /* @__PURE__ */ jsx("strong", { "data-loc": "client\\src\\designer\\components\\ExportPanel.tsx:89", children: "Load Config" }),
          /* @__PURE__ */ jsx("small", { "data-loc": "client\\src\\designer\\components\\ExportPanel.tsx:90", children: "Import JSON file" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("button", { "data-loc": "client\\src\\designer\\components\\ExportPanel.tsx:94", className: "export-button danger", onClick: resetConfiguration, children: [
        /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\designer\\components\\ExportPanel.tsx:95", className: "button-icon", children: "🔄" }),
        /* @__PURE__ */ jsxs("span", { "data-loc": "client\\src\\designer\\components\\ExportPanel.tsx:96", className: "button-text", children: [
          /* @__PURE__ */ jsx("strong", { "data-loc": "client\\src\\designer\\components\\ExportPanel.tsx:97", children: "Reset" }),
          /* @__PURE__ */ jsx("small", { "data-loc": "client\\src\\designer\\components\\ExportPanel.tsx:98", children: "Clear all changes" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\designer\\components\\ExportPanel.tsx:103", className: "export-info", children: [
      /* @__PURE__ */ jsx("h4", { "data-loc": "client\\src\\designer\\components\\ExportPanel.tsx:104", children: "Export Tips" }),
      /* @__PURE__ */ jsxs("ul", { "data-loc": "client\\src\\designer\\components\\ExportPanel.tsx:105", children: [
        /* @__PURE__ */ jsx("li", { "data-loc": "client\\src\\designer\\components\\ExportPanel.tsx:106", children: "Use Tech Pack for factory orders" }),
        /* @__PURE__ */ jsx("li", { "data-loc": "client\\src\\designer\\components\\ExportPanel.tsx:107", children: "Pause rotation before screenshotting" }),
        /* @__PURE__ */ jsx("li", { "data-loc": "client\\src\\designer\\components\\ExportPanel.tsx:108", children: "Save configs to share designs" })
      ] })
    ] }),
    showTechPackModal && /* @__PURE__ */ jsx(TechPackModal, { "data-loc": "client\\src\\designer\\components\\ExportPanel.tsx:113", onClose: () => setShowTechPackModal(false) })
  ] });
};
const DesignQuoteModal = ({ isOpen, onClose, garmentType }) => {
  const {
    quoteViews,
    quoteViewsReady,
    clearQuoteViews,
    decals,
    texts,
    meshPatterns
  } = useConfiguratorStore();
  const [uploading, setUploading] = useState(false);
  const [uploadedViewUrls, setUploadedViewUrls] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [selectedView, setSelectedView] = useState(null);
  const [form, setForm] = useState({
    companyName: "",
    contactName: "",
    email: "",
    phone: "",
    country: "",
    quantity: "100",
    timeline: "4-6 weeks",
    budgetRange: "",
    description: ""
  });
  const uploadDesignMutation = trpc.rfq.uploadDesignImage.useMutation();
  const submitRfqMutation = trpc.rfq.submitWithDesign.useMutation();
  useEffect(() => {
    if (!quoteViewsReady || !isOpen || quoteViews.length === 0) return;
    setUploading(true);
    setUploadedViewUrls([]);
    let completed = 0;
    const results = [];
    quoteViews.forEach((view) => {
      const base64 = view.dataUrl.replace(/^data:image\/jpeg;base64,/, "");
      uploadDesignMutation.mutate(
        { imageBase64: base64, mimeType: "image/jpeg" },
        {
          onSuccess: (data) => {
            results.push({ label: view.label, url: data.url });
            completed++;
            if (completed === quoteViews.length) {
              const order = ["Front", "Right", "Back", "Left"];
              results.sort((a, b) => order.indexOf(a.label) - order.indexOf(b.label));
              setUploadedViewUrls(results);
              setUploading(false);
            }
          },
          onError: () => {
            completed++;
            if (completed === quoteViews.length) setUploading(false);
          }
        }
      );
    });
  }, [quoteViewsReady, isOpen]);
  const appliedLogos = decals.map((d, i) => ({
    type: "Logo",
    src: d.textureUrl,
    label: `Logo ${i + 1}`
  }));
  const appliedTextures = Object.entries(meshPatterns).filter(([, url]) => !!url).map(([mesh, url]) => ({
    type: "Texture",
    src: url,
    label: mesh
  }));
  const appliedTexts = texts.map((t) => ({
    type: "Text",
    content: t.text,
    color: t.color,
    font: t.fontFamily
  }));
  const handleSubmit = (e) => {
    e.preventDefault();
    const primaryUrl = uploadedViewUrls[0]?.url ?? void 0;
    const viewLinks = uploadedViewUrls.map((v) => `${v.label}: ${v.url}`).join("\n");
    const logoInfo = appliedLogos.length > 0 ? `
Logos applied: ${appliedLogos.length}
${appliedLogos.map((l) => l.src).join("\n")}` : "";
    const textInfo = appliedTexts.length > 0 ? `
Text decals: ${appliedTexts.map((t) => `"${t.content}" (${t.color})`).join(", ")}` : "";
    const textureInfo = appliedTextures.length > 0 ? `
Textures: ${appliedTextures.map((t) => `${t.label}: ${t.src}`).join("\n")}` : "";
    const fullDescription = [
      form.description,
      "--- Design Views ---",
      viewLinks,
      logoInfo,
      textInfo,
      textureInfo
    ].filter(Boolean).join("\n");
    submitRfqMutation.mutate(
      {
        ...form,
        description: fullDescription,
        productType: garmentType || "Custom Garment",
        designImageUrl: primaryUrl,
        garmentType: garmentType || void 0
      },
      { onSuccess: () => setSubmitted(true) }
    );
  };
  const handleClose = () => {
    setSubmitted(false);
    setUploadedViewUrls([]);
    setSelectedView(null);
    clearQuoteViews();
    onClose();
  };
  if (!isOpen) return null;
  const displayViews = uploadedViewUrls.length > 0 ? uploadedViewUrls : quoteViews.map((v) => ({ label: v.label, url: v.dataUrl }));
  return /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\designer\\components\\DesignQuoteModal.tsx:144", className: "dqm-overlay", onClick: (e) => e.target === e.currentTarget && handleClose(), children: /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\designer\\components\\DesignQuoteModal.tsx:145", className: "dqm-modal dqm-modal-wide", children: [
    /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\designer\\components\\DesignQuoteModal.tsx:147", className: "dqm-header", children: [
      /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\designer\\components\\DesignQuoteModal.tsx:148", children: [
        /* @__PURE__ */ jsx("h2", { "data-loc": "client\\src\\designer\\components\\DesignQuoteModal.tsx:149", className: "dqm-title", children: "Send Design with Quote" }),
        /* @__PURE__ */ jsx("p", { "data-loc": "client\\src\\designer\\components\\DesignQuoteModal.tsx:150", className: "dqm-subtitle", children: "All 4 views of your 3D design are attached to this request" })
      ] }),
      /* @__PURE__ */ jsx("button", { "data-loc": "client\\src\\designer\\components\\DesignQuoteModal.tsx:152", className: "dqm-close", onClick: handleClose, children: "✕" })
    ] }),
    submitted ? /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\designer\\components\\DesignQuoteModal.tsx:156", className: "dqm-success", children: [
      /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\designer\\components\\DesignQuoteModal.tsx:157", className: "dqm-success-icon", children: "✅" }),
      /* @__PURE__ */ jsx("h3", { "data-loc": "client\\src\\designer\\components\\DesignQuoteModal.tsx:158", children: "Quote Request Sent!" }),
      /* @__PURE__ */ jsx("p", { "data-loc": "client\\src\\designer\\components\\DesignQuoteModal.tsx:159", children: "We've received your design and all 4 views. Our team will get back to you within 24 hours." }),
      /* @__PURE__ */ jsx("button", { "data-loc": "client\\src\\designer\\components\\DesignQuoteModal.tsx:160", className: "dqm-btn-primary", onClick: handleClose, children: "Done" })
    ] }) : /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\designer\\components\\DesignQuoteModal.tsx:163", className: "dqm-body", children: [
      /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\designer\\components\\DesignQuoteModal.tsx:166", className: "dqm-preview-section", children: [
        /* @__PURE__ */ jsxs("h3", { "data-loc": "client\\src\\designer\\components\\DesignQuoteModal.tsx:167", className: "dqm-section-title", children: [
          "Your Design — 4 Views",
          garmentType && /* @__PURE__ */ jsxs("span", { "data-loc": "client\\src\\designer\\components\\DesignQuoteModal.tsx:169", className: "dqm-garment-badge-inline", children: [
            "🧥 ",
            garmentType
          ] })
        ] }),
        uploading || !quoteViewsReady && displayViews.length === 0 ? /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\designer\\components\\DesignQuoteModal.tsx:173", className: "dqm-views-loading", children: [
          /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\designer\\components\\DesignQuoteModal.tsx:174", className: "dqm-spinner" }),
          /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\designer\\components\\DesignQuoteModal.tsx:175", children: "Capturing all 4 views… please wait" })
        ] }) : /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\designer\\components\\DesignQuoteModal.tsx:178", className: "dqm-views-grid", children: displayViews.map((view) => /* @__PURE__ */ jsxs(
          "div",
          {
            "data-loc": "client\\src\\designer\\components\\DesignQuoteModal.tsx:180",
            className: `dqm-view-card ${selectedView === view.label ? "dqm-view-card-active" : ""}`,
            onClick: () => setSelectedView(selectedView === view.label ? null : view.label),
            children: [
              /* @__PURE__ */ jsx("img", { "data-loc": "client\\src\\designer\\components\\DesignQuoteModal.tsx:185", src: view.url, alt: `${view.label} view`, className: "dqm-view-img" }),
              /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\designer\\components\\DesignQuoteModal.tsx:186", className: "dqm-view-label", children: view.label })
            ]
          },
          view.label
        )) }),
        selectedView && /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\designer\\components\\DesignQuoteModal.tsx:194", className: "dqm-lightbox", onClick: () => setSelectedView(null), children: [
          /* @__PURE__ */ jsx(
            "img",
            {
              "data-loc": "client\\src\\designer\\components\\DesignQuoteModal.tsx:195",
              src: displayViews.find((v) => v.label === selectedView)?.url,
              alt: selectedView,
              className: "dqm-lightbox-img"
            }
          ),
          /* @__PURE__ */ jsxs("span", { "data-loc": "client\\src\\designer\\components\\DesignQuoteModal.tsx:200", className: "dqm-lightbox-label", children: [
            selectedView,
            " View — click to close"
          ] })
        ] }),
        (appliedLogos.length > 0 || appliedTextures.length > 0 || appliedTexts.length > 0) && /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\designer\\components\\DesignQuoteModal.tsx:206", className: "dqm-assets-section", children: [
          /* @__PURE__ */ jsx("h4", { "data-loc": "client\\src\\designer\\components\\DesignQuoteModal.tsx:207", className: "dqm-assets-title", children: "Applied Assets" }),
          /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\designer\\components\\DesignQuoteModal.tsx:208", className: "dqm-assets-row", children: [
            appliedLogos.map((logo, i) => /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\designer\\components\\DesignQuoteModal.tsx:210", className: "dqm-asset-chip", children: [
              /* @__PURE__ */ jsx("img", { "data-loc": "client\\src\\designer\\components\\DesignQuoteModal.tsx:211", src: logo.src, alt: "Logo", className: "dqm-asset-thumb" }),
              /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\designer\\components\\DesignQuoteModal.tsx:212", children: logo.label })
            ] }, i)),
            appliedTextures.map((tex, i) => /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\designer\\components\\DesignQuoteModal.tsx:216", className: "dqm-asset-chip", children: [
              /* @__PURE__ */ jsx("img", { "data-loc": "client\\src\\designer\\components\\DesignQuoteModal.tsx:217", src: tex.src, alt: tex.label, className: "dqm-asset-thumb" }),
              /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\designer\\components\\DesignQuoteModal.tsx:218", children: tex.label })
            ] }, i)),
            appliedTexts.map((t, i) => /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\designer\\components\\DesignQuoteModal.tsx:222", className: "dqm-asset-chip dqm-text-chip", children: [
              /* @__PURE__ */ jsxs("span", { "data-loc": "client\\src\\designer\\components\\DesignQuoteModal.tsx:223", className: "dqm-text-preview", style: { color: t.color, fontFamily: t.font }, children: [
                t.content.substring(0, 8),
                t.content.length > 8 ? "…" : ""
              ] }),
              /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\designer\\components\\DesignQuoteModal.tsx:226", children: "Text" })
            ] }, i))
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("form", { "data-loc": "client\\src\\designer\\components\\DesignQuoteModal.tsx:235", className: "dqm-form", onSubmit: handleSubmit, children: [
        /* @__PURE__ */ jsx("h3", { "data-loc": "client\\src\\designer\\components\\DesignQuoteModal.tsx:236", className: "dqm-section-title", children: "Your Details" }),
        /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\designer\\components\\DesignQuoteModal.tsx:237", className: "dqm-row", children: [
          /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\designer\\components\\DesignQuoteModal.tsx:238", className: "dqm-field", children: [
            /* @__PURE__ */ jsx("label", { "data-loc": "client\\src\\designer\\components\\DesignQuoteModal.tsx:239", children: "Company Name *" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                "data-loc": "client\\src\\designer\\components\\DesignQuoteModal.tsx:240",
                required: true,
                placeholder: "Your brand or company",
                value: form.companyName,
                onChange: (e) => setForm({ ...form, companyName: e.target.value })
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\designer\\components\\DesignQuoteModal.tsx:243", className: "dqm-field", children: [
            /* @__PURE__ */ jsx("label", { "data-loc": "client\\src\\designer\\components\\DesignQuoteModal.tsx:244", children: "Contact Name *" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                "data-loc": "client\\src\\designer\\components\\DesignQuoteModal.tsx:245",
                required: true,
                placeholder: "Your full name",
                value: form.contactName,
                onChange: (e) => setForm({ ...form, contactName: e.target.value })
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\designer\\components\\DesignQuoteModal.tsx:249", className: "dqm-row", children: [
          /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\designer\\components\\DesignQuoteModal.tsx:250", className: "dqm-field", children: [
            /* @__PURE__ */ jsx("label", { "data-loc": "client\\src\\designer\\components\\DesignQuoteModal.tsx:251", children: "Email *" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                "data-loc": "client\\src\\designer\\components\\DesignQuoteModal.tsx:252",
                required: true,
                type: "email",
                placeholder: "you@company.com",
                value: form.email,
                onChange: (e) => setForm({ ...form, email: e.target.value })
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\designer\\components\\DesignQuoteModal.tsx:255", className: "dqm-field", children: [
            /* @__PURE__ */ jsx("label", { "data-loc": "client\\src\\designer\\components\\DesignQuoteModal.tsx:256", children: "Phone / WhatsApp" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                "data-loc": "client\\src\\designer\\components\\DesignQuoteModal.tsx:257",
                placeholder: "+1 234 567 8900",
                value: form.phone,
                onChange: (e) => setForm({ ...form, phone: e.target.value })
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\designer\\components\\DesignQuoteModal.tsx:261", className: "dqm-row", children: [
          /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\designer\\components\\DesignQuoteModal.tsx:262", className: "dqm-field", children: [
            /* @__PURE__ */ jsx("label", { "data-loc": "client\\src\\designer\\components\\DesignQuoteModal.tsx:263", children: "Country" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                "data-loc": "client\\src\\designer\\components\\DesignQuoteModal.tsx:264",
                placeholder: "United States",
                value: form.country,
                onChange: (e) => setForm({ ...form, country: e.target.value })
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\designer\\components\\DesignQuoteModal.tsx:267", className: "dqm-field", children: [
            /* @__PURE__ */ jsx("label", { "data-loc": "client\\src\\designer\\components\\DesignQuoteModal.tsx:268", children: "Quantity (units)" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                "data-loc": "client\\src\\designer\\components\\DesignQuoteModal.tsx:269",
                placeholder: "e.g. 100",
                value: form.quantity,
                onChange: (e) => setForm({ ...form, quantity: e.target.value })
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\designer\\components\\DesignQuoteModal.tsx:273", className: "dqm-row", children: [
          /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\designer\\components\\DesignQuoteModal.tsx:274", className: "dqm-field", children: [
            /* @__PURE__ */ jsx("label", { "data-loc": "client\\src\\designer\\components\\DesignQuoteModal.tsx:275", children: "Timeline" }),
            /* @__PURE__ */ jsxs("select", { "data-loc": "client\\src\\designer\\components\\DesignQuoteModal.tsx:276", value: form.timeline, onChange: (e) => setForm({ ...form, timeline: e.target.value }), children: [
              /* @__PURE__ */ jsx("option", { "data-loc": "client\\src\\designer\\components\\DesignQuoteModal.tsx:277", value: "2-3 weeks", children: "2–3 weeks (Rush)" }),
              /* @__PURE__ */ jsx("option", { "data-loc": "client\\src\\designer\\components\\DesignQuoteModal.tsx:278", value: "4-6 weeks", children: "4–6 weeks (Standard)" }),
              /* @__PURE__ */ jsx("option", { "data-loc": "client\\src\\designer\\components\\DesignQuoteModal.tsx:279", value: "6-8 weeks", children: "6–8 weeks (Relaxed)" }),
              /* @__PURE__ */ jsx("option", { "data-loc": "client\\src\\designer\\components\\DesignQuoteModal.tsx:280", value: "flexible", children: "Flexible" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\designer\\components\\DesignQuoteModal.tsx:283", className: "dqm-field", children: [
            /* @__PURE__ */ jsx("label", { "data-loc": "client\\src\\designer\\components\\DesignQuoteModal.tsx:284", children: "Budget Range (USD)" }),
            /* @__PURE__ */ jsxs("select", { "data-loc": "client\\src\\designer\\components\\DesignQuoteModal.tsx:285", value: form.budgetRange, onChange: (e) => setForm({ ...form, budgetRange: e.target.value }), children: [
              /* @__PURE__ */ jsx("option", { "data-loc": "client\\src\\designer\\components\\DesignQuoteModal.tsx:286", value: "", children: "Select range" }),
              /* @__PURE__ */ jsx("option", { "data-loc": "client\\src\\designer\\components\\DesignQuoteModal.tsx:287", value: "Under $1,000", children: "Under $1,000" }),
              /* @__PURE__ */ jsx("option", { "data-loc": "client\\src\\designer\\components\\DesignQuoteModal.tsx:288", value: "$1,000 – $5,000", children: "$1,000 – $5,000" }),
              /* @__PURE__ */ jsx("option", { "data-loc": "client\\src\\designer\\components\\DesignQuoteModal.tsx:289", value: "$5,000 – $20,000", children: "$5,000 – $20,000" }),
              /* @__PURE__ */ jsx("option", { "data-loc": "client\\src\\designer\\components\\DesignQuoteModal.tsx:290", value: "$20,000+", children: "$20,000+" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\designer\\components\\DesignQuoteModal.tsx:294", className: "dqm-field dqm-field-full", children: [
          /* @__PURE__ */ jsx("label", { "data-loc": "client\\src\\designer\\components\\DesignQuoteModal.tsx:295", children: "Additional Notes" }),
          /* @__PURE__ */ jsx(
            "textarea",
            {
              "data-loc": "client\\src\\designer\\components\\DesignQuoteModal.tsx:296",
              rows: 3,
              placeholder: "Fabric preferences, special requirements, branding details...",
              value: form.description,
              onChange: (e) => setForm({ ...form, description: e.target.value })
            }
          )
        ] }),
        /* @__PURE__ */ jsx(
          "button",
          {
            "data-loc": "client\\src\\designer\\components\\DesignQuoteModal.tsx:301",
            type: "submit",
            className: "dqm-btn-primary dqm-submit",
            disabled: submitRfqMutation.isPending || uploading,
            children: submitRfqMutation.isPending ? "Sending…" : "📩 Send Quote Request with All Views"
          }
        ),
        submitRfqMutation.isError && /* @__PURE__ */ jsx("p", { "data-loc": "client\\src\\designer\\components\\DesignQuoteModal.tsx:309", className: "dqm-error", children: "Failed to send. Please try again." })
      ] })
    ] })
  ] }) });
};
function Customize() {
  const [activeDrawer, setActiveDrawer] = useState(null);
  const [isSelectingTextureTarget, setIsSelectingTextureTarget] = useState(false);
  const [loadError, setLoadError] = useState(null);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const {
    decals,
    selectDecal,
    selectedDecalId,
    updateDecal,
    texts,
    selectText,
    selectedTextId,
    updateText,
    isPlacingText,
    setPendingText,
    selectedMeshName,
    selectMesh,
    triggerSnapshot,
    triggerQuoteCapture,
    quoteViews,
    quoteViewsReady,
    setModelUrl,
    modelUrl,
    meshPatterns,
    meshTextureSettings,
    setMeshTextureSettings,
    loadingProgress
  } = useConfiguratorStore();
  const isLoading = useConfiguratorStore((state) => state.isLoading);
  const selectedMeshHasTexture = selectedMeshName && meshPatterns[selectedMeshName];
  const currentTextureSettings = selectedMeshName ? meshTextureSettings[selectedMeshName] || { scale: 1 } : { scale: 1 };
  useEffect(() => {
    if (isSelectingTextureTarget && selectedMeshName) {
      setActiveDrawer("textures");
      setIsSelectingTextureTarget(false);
    }
  }, [selectedMeshName, isSelectingTextureTarget]);
  const handleNavClick = (tab) => {
    if (tab === "textures") {
      if (!modelUrl) {
        setActiveDrawer("model");
        return;
      }
      if (selectedMeshName) {
        setActiveDrawer("textures");
      } else {
        setIsSelectingTextureTarget(true);
        setActiveDrawer(null);
      }
    } else {
      setIsSelectingTextureTarget(false);
      setActiveDrawer(activeDrawer === tab ? null : tab);
    }
  };
  useEffect(() => {
    if (quoteViewsReady && !isQuoteModalOpen) {
      setIsQuoteModalOpen(true);
    }
  }, [quoteViewsReady]);
  const handleSendDesign = () => {
    if (!modelUrl) {
      alert("Please select a garment model first before sending a quote.");
      return;
    }
    triggerQuoteCapture();
  };
  const handleRefresh = () => {
    setModelUrl(null);
    window.location.reload();
  };
  const handleTextureScaleChange = (scale) => {
    if (selectedMeshName) setMeshTextureSettings(selectedMeshName, { scale: Math.max(0.01, scale) });
  };
  const renderDrawerContent = () => {
    switch (activeDrawer) {
      case "model":
        return /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Customize.tsx:81", className: "drawer-header", children: [
            /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\Customize.tsx:82", className: "drawer-title", children: "Select Model" }),
            /* @__PURE__ */ jsx("button", { "data-loc": "client\\src\\pages\\Customize.tsx:83", className: "drawer-close", onClick: () => setActiveDrawer(null), children: "×" })
          ] }),
          /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Customize.tsx:85", className: "drawer-content animate-slide-up", children: /* @__PURE__ */ jsx(ModelLibrary, { "data-loc": "client\\src\\pages\\Customize.tsx:86", onClose: () => setActiveDrawer(null), onError: (err) => setLoadError(err) }) })
        ] });
      case "logos":
        return /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Customize.tsx:91", className: "drawer-header", children: [
            /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\Customize.tsx:92", className: "drawer-title", children: "Logos" }),
            /* @__PURE__ */ jsx("button", { "data-loc": "client\\src\\pages\\Customize.tsx:93", className: "drawer-close", onClick: () => setActiveDrawer(null), children: "×" })
          ] }),
          /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Customize.tsx:95", className: "drawer-content animate-slide-up", children: /* @__PURE__ */ jsx(DecalManager, { "data-loc": "client\\src\\pages\\Customize.tsx:95" }) })
        ] });
      case "text":
        return /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Customize.tsx:99", className: "drawer-header", children: [
            /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\Customize.tsx:100", className: "drawer-title", children: "Text" }),
            /* @__PURE__ */ jsx("button", { "data-loc": "client\\src\\pages\\Customize.tsx:101", className: "drawer-close", onClick: () => setActiveDrawer(null), children: "×" })
          ] }),
          /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Customize.tsx:103", className: "drawer-content animate-slide-up", children: /* @__PURE__ */ jsx(TextManager, { "data-loc": "client\\src\\pages\\Customize.tsx:103" }) })
        ] });
      case "textures":
        return /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Customize.tsx:107", className: "drawer-header", children: [
            /* @__PURE__ */ jsxs("span", { "data-loc": "client\\src\\pages\\Customize.tsx:108", className: "drawer-title", children: [
              "Textures ",
              selectedMeshName && /* @__PURE__ */ jsxs("span", { "data-loc": "client\\src\\pages\\Customize.tsx:109", style: { opacity: 0.6, fontSize: "0.8em" }, children: [
                "• ",
                selectedMeshName
              ] })
            ] }),
            /* @__PURE__ */ jsx("button", { "data-loc": "client\\src\\pages\\Customize.tsx:111", className: "drawer-close", onClick: () => setActiveDrawer(null), children: "×" })
          ] }),
          /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Customize.tsx:113", className: "drawer-content animate-slide-up", children: /* @__PURE__ */ jsx(TextureUploader, { "data-loc": "client\\src\\pages\\Customize.tsx:113" }) })
        ] });
      default:
        return null;
    }
  };
  const garmentTypeLabel = modelUrl ? modelUrl.split("/").pop()?.replace(".glb", "").replace(/-/g, " ") ?? "Custom Garment" : "Custom Garment";
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Customize.tsx:127", className: "designer-root", style: { position: "fixed", inset: 0, zIndex: 50, background: "#0a0a0a", display: "flex", flexDirection: "column" }, children: [
      /* @__PURE__ */ jsxs("header", { "data-loc": "client\\src\\pages\\Customize.tsx:129", style: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 16px",
        height: "52px",
        background: "rgba(10,10,10,0.95)",
        borderBottom: "1px solid rgba(201,168,76,0.2)",
        flexShrink: 0,
        zIndex: 100
      }, children: [
        /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Customize.tsx:134", style: { display: "flex", alignItems: "center", gap: "12px" }, children: [
          /* @__PURE__ */ jsx(Link, { "data-loc": "client\\src\\pages\\Customize.tsx:135", href: "/", style: { color: "#c9a84c", fontWeight: 700, fontSize: "13px", textDecoration: "none", letterSpacing: "0.05em" }, children: "← Back" }),
          /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\Customize.tsx:138", style: { color: "rgba(255,255,255,0.15)", fontSize: "18px" }, children: "|" }),
          /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\Customize.tsx:139", style: { color: "#fff", fontWeight: 600, fontSize: "13px", letterSpacing: "0.1em", textTransform: "uppercase" }, children: "3D Product Customizer" })
        ] }),
        /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Customize.tsx:143", style: { display: "flex", gap: "8px" }, children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              "data-loc": "client\\src\\pages\\Customize.tsx:144",
              onClick: handleSendDesign,
              title: "Send Design with Quote",
              style: {
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "7px 14px",
                borderRadius: "6px",
                background: "linear-gradient(135deg, #c9a84c, #e8c96a)",
                color: "#000",
                fontWeight: 700,
                fontSize: "12px",
                border: "none",
                cursor: "pointer",
                letterSpacing: "0.05em",
                textTransform: "uppercase"
              },
              children: "📩 Send Design with Quote"
            }
          ),
          /* @__PURE__ */ jsx("button", { "data-loc": "client\\src\\pages\\Customize.tsx:158", className: "icon-btn", onClick: triggerSnapshot, title: "Screenshot", children: "📸" }),
          /* @__PURE__ */ jsx("button", { "data-loc": "client\\src\\pages\\Customize.tsx:159", className: "icon-btn", onClick: () => setActiveDrawer("export"), title: "Export", children: "📥" }),
          /* @__PURE__ */ jsx("button", { "data-loc": "client\\src\\pages\\Customize.tsx:160", className: "icon-btn", onClick: handleRefresh, title: "Reset", children: "🔄" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Customize.tsx:165", className: "viewport", style: { flex: 1, minHeight: 0, paddingBottom: "64px" }, children: [
        /* @__PURE__ */ jsx(Scene, { "data-loc": "client\\src\\pages\\Customize.tsx:166", isDrawerOpen: !!activeDrawer }),
        /* @__PURE__ */ jsx(NavigationControls, { "data-loc": "client\\src\\pages\\Customize.tsx:167" }),
        isSelectingTextureTarget && /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Customize.tsx:170", className: "selection-prompt animate-fade-in", children: /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Customize.tsx:171", className: "prompt-content", style: { flexDirection: "column", textAlign: "center", gap: "20px" }, children: [
          /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Customize.tsx:172", style: { display: "flex", alignItems: "center", gap: "16px" }, children: [
            /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\Customize.tsx:173", className: "prompt-icon", children: "🎯" }),
            /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Customize.tsx:174", className: "prompt-text", children: /* @__PURE__ */ jsx("strong", { "data-loc": "client\\src\\pages\\Customize.tsx:174", children: "Double click to select a part on model" }) })
          ] }),
          /* @__PURE__ */ jsx("button", { "data-loc": "client\\src\\pages\\Customize.tsx:176", className: "prompt-cancel", onClick: () => setIsSelectingTextureTarget(false), style: { width: "100%", maxWidth: "200px" }, children: "Cancel" })
        ] }) }),
        isPlacingText && /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Customize.tsx:182", className: "selection-prompt animate-fade-in", children: /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Customize.tsx:183", className: "prompt-content", children: [
          /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\Customize.tsx:184", className: "prompt-icon", children: "✏️" }),
          /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Customize.tsx:185", className: "prompt-text", children: [
            /* @__PURE__ */ jsx("strong", { "data-loc": "client\\src\\pages\\Customize.tsx:186", children: "Place Your Text" }),
            /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\Customize.tsx:187", children: "Click on the model where you want to add text" })
          ] }),
          /* @__PURE__ */ jsx("button", { "data-loc": "client\\src\\pages\\Customize.tsx:189", className: "prompt-cancel", onClick: () => setPendingText(null), children: "Cancel" })
        ] }) }),
        !isSelectingTextureTarget && !isPlacingText && !selectedMeshHasTexture && /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Customize.tsx:195", className: "viewport-overlay", children: /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Customize.tsx:196", className: "viewport-hint", children: [
          /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Customize.tsx:197", className: "hint-item", children: [
            /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\Customize.tsx:197", className: "hint-icon", children: "👆" }),
            /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\Customize.tsx:197", children: "Drag to Rotate" })
          ] }),
          /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Customize.tsx:198", style: { width: "1px", height: "16px", background: "rgba(255,255,255,0.2)" } }),
          /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Customize.tsx:199", className: "hint-item", children: [
            /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\Customize.tsx:199", className: "hint-icon", children: "🔍" }),
            /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\Customize.tsx:199", children: "Pinch to Zoom" })
          ] }),
          /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Customize.tsx:200", style: { width: "1px", height: "16px", background: "rgba(255,255,255,0.2)" } }),
          /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Customize.tsx:201", className: "hint-item", children: [
            /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\Customize.tsx:201", className: "hint-icon", children: "👆x2" }),
            /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\Customize.tsx:201", children: "Double click to select" })
          ] })
        ] }) }),
        decals.length > 0 && !isSelectingTextureTarget && !isPlacingText && /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Customize.tsx:207", className: "viewport-sidebar", children: decals.map((decal) => /* @__PURE__ */ jsx(
          "div",
          {
            "data-loc": "client\\src\\pages\\Customize.tsx:209",
            className: `sidebar-item ${selectedDecalId === decal.id ? "active" : ""}`,
            onClick: (e) => {
              e.stopPropagation();
              selectDecal(decal.id);
            },
            children: /* @__PURE__ */ jsx("img", { "data-loc": "client\\src\\pages\\Customize.tsx:211", src: decal.textureUrl, alt: "Logo" })
          },
          decal.id
        )) }),
        texts.length > 0 && !isSelectingTextureTarget && !isPlacingText && decals.length === 0 && /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Customize.tsx:218", className: "viewport-sidebar", children: texts.map((tc) => /* @__PURE__ */ jsx(
          "div",
          {
            "data-loc": "client\\src\\pages\\Customize.tsx:220",
            className: `sidebar-item ${selectedTextId === tc.id ? "active" : ""}`,
            onClick: (e) => {
              e.stopPropagation();
              selectText(tc.id);
            },
            children: /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\Customize.tsx:222", style: { fontFamily: tc.fontFamily, color: tc.color, fontSize: "14px" }, children: tc.text.substring(0, 3) })
          },
          tc.id
        )) }),
        selectedTextId && texts.find((t) => t.id === selectedTextId) && !isSelectingTextureTarget && !isPlacingText && (() => {
          const st = texts.find((t) => t.id === selectedTextId);
          return /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Customize.tsx:231", className: "viewport-tools-left animate-scale-in", children: [
            /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Customize.tsx:232", className: "tool-group", children: [
              /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Customize.tsx:233", className: "tool-label", children: "Rotate" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  "data-loc": "client\\src\\pages\\Customize.tsx:234",
                  type: "range",
                  min: "0",
                  max: "360",
                  value: Math.round(st.rotation[2] * 180 / Math.PI),
                  onChange: (e) => updateText(st.id, { rotation: [0, 0, parseFloat(e.target.value) * Math.PI / 180] }),
                  className: "glass-slider"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Customize.tsx:238", className: "tool-group", children: [
              /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Customize.tsx:239", className: "tool-label", children: "Size" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  "data-loc": "client\\src\\pages\\Customize.tsx:240",
                  type: "range",
                  min: "0.1",
                  max: "5",
                  step: "0.1",
                  value: st.scale[0],
                  onChange: (e) => {
                    const v = parseFloat(e.target.value);
                    updateText(st.id, { scale: [v, v, v] });
                  },
                  className: "glass-slider"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Customize.tsx:244", className: "tool-group", children: [
              /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Customize.tsx:245", className: "tool-label", children: "Color" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  "data-loc": "client\\src\\pages\\Customize.tsx:246",
                  type: "color",
                  value: st.color,
                  onChange: (e) => updateText(st.id, { color: e.target.value }),
                  style: { width: "100%", height: "32px", border: "none", borderRadius: "8px", cursor: "pointer" }
                }
              )
            ] }),
            /* @__PURE__ */ jsx("button", { "data-loc": "client\\src\\pages\\Customize.tsx:249", className: "deselect-btn", onClick: () => selectText(null), children: "✕ Deselect" })
          ] });
        })(),
        selectedDecalId && decals.find((d) => d.id === selectedDecalId) && !isSelectingTextureTarget && !isPlacingText && (() => {
          const sd = decals.find((d) => d.id === selectedDecalId);
          return /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Customize.tsx:257", className: "viewport-tools-left animate-scale-in", children: [
            /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Customize.tsx:258", className: "tool-group", children: [
              /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Customize.tsx:259", className: "tool-label", children: "Rotate" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  "data-loc": "client\\src\\pages\\Customize.tsx:260",
                  type: "range",
                  min: "0",
                  max: "360",
                  value: Math.round(sd.rotation[2] * 180 / Math.PI),
                  onChange: (e) => updateDecal(sd.id, { rotation: [0, 0, parseFloat(e.target.value) * Math.PI / 180] }),
                  className: "glass-slider"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Customize.tsx:264", className: "tool-group", children: [
              /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Customize.tsx:265", className: "tool-label", children: "Size" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  "data-loc": "client\\src\\pages\\Customize.tsx:266",
                  type: "range",
                  min: "0.1",
                  max: "5",
                  step: "0.1",
                  value: sd.scale[0],
                  onChange: (e) => {
                    const v = parseFloat(e.target.value);
                    updateDecal(sd.id, { scale: [v, v, v] });
                  },
                  className: "glass-slider"
                }
              )
            ] }),
            /* @__PURE__ */ jsx("button", { "data-loc": "client\\src\\pages\\Customize.tsx:270", className: "deselect-btn", onClick: () => selectDecal(null), children: "✕ Deselect" })
          ] });
        })(),
        selectedMeshHasTexture && !selectedDecalId && !selectedTextId && !isSelectingTextureTarget && !isPlacingText && activeDrawer !== "textures" && /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Customize.tsx:276", className: "viewport-texture-slider animate-scale-in", children: /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Customize.tsx:277", className: "texture-slider-body", children: [
          /* @__PURE__ */ jsx("button", { "data-loc": "client\\src\\pages\\Customize.tsx:278", className: "texture-slider-close-floating", onClick: () => selectMesh(null), children: "✕" }),
          /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Customize.tsx:279", className: "texture-slider-controls", children: [
            /* @__PURE__ */ jsx("button", { "data-loc": "client\\src\\pages\\Customize.tsx:280", className: "texture-size-btn", onClick: () => handleTextureScaleChange(currentTextureSettings.scale - 0.1), children: "−" }),
            /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Customize.tsx:281", className: "texture-slider-track-wrapper", children: [
              /* @__PURE__ */ jsx(
                "input",
                {
                  "data-loc": "client\\src\\pages\\Customize.tsx:282",
                  type: "range",
                  className: "texture-slider-range",
                  min: "0.01",
                  max: "100",
                  step: "0.1",
                  value: Math.min(currentTextureSettings.scale, 100),
                  onChange: (e) => handleTextureScaleChange(parseFloat(e.target.value))
                }
              ),
              /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Customize.tsx:285", className: "texture-slider-fill", style: { width: `${Math.min(currentTextureSettings.scale / 100 * 100, 100)}%` } })
            ] }),
            /* @__PURE__ */ jsx("button", { "data-loc": "client\\src\\pages\\Customize.tsx:287", className: "texture-size-btn", onClick: () => handleTextureScaleChange(currentTextureSettings.scale + 0.1), children: "+" })
          ] })
        ] }) }),
        selectedMeshName && !selectedMeshHasTexture && !selectedDecalId && !selectedTextId && !isSelectingTextureTarget && !isPlacingText && activeDrawer !== "textures" && /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Customize.tsx:294", className: "viewport-tools-left animate-scale-in", children: /* @__PURE__ */ jsx(ColorPickerPanel, { "data-loc": "client\\src\\pages\\Customize.tsx:295" }) })
      ] }),
      isLoading && /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Customize.tsx:302", className: "loading-overlay animate-fade-in", children: [
        /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Customize.tsx:303", className: "loading-backdrop" }),
        /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Customize.tsx:304", className: "loading-content-modern", children: [
          /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Customize.tsx:305", className: "spinner-wrapper", children: [
            /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Customize.tsx:306", className: "spinner-ring" }),
            /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Customize.tsx:307", className: "spinner-ring-glow" })
          ] }),
          /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Customize.tsx:309", className: "loading-text-group", children: [
            /* @__PURE__ */ jsx("h3", { "data-loc": "client\\src\\pages\\Customize.tsx:310", className: "loading-title", children: "LOADING MODEL" }),
            /* @__PURE__ */ jsxs("p", { "data-loc": "client\\src\\pages\\Customize.tsx:311", className: "loading-percentage", children: [
              Math.round(loadingProgress),
              "%"
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Customize.tsx:313", className: "loading-bar-modern-track", children: /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Customize.tsx:314", className: "loading-bar-modern-fill", style: { width: `${loadingProgress}%` } }) }),
          /* @__PURE__ */ jsx("p", { "data-loc": "client\\src\\pages\\Customize.tsx:316", className: "loading-hint-modern", children: "Large models may take up to 1 minute to load…" })
        ] })
      ] }),
      loadError && /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Customize.tsx:323", className: "error-overlay animate-fade-in", onClick: () => setLoadError(null), children: /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Customize.tsx:324", className: "error-modal", onClick: (e) => e.stopPropagation(), children: [
        /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Customize.tsx:325", className: "error-icon", children: "⚠️" }),
        /* @__PURE__ */ jsx("h3", { "data-loc": "client\\src\\pages\\Customize.tsx:326", className: "error-title", children: "Failed to Load Model" }),
        /* @__PURE__ */ jsx("p", { "data-loc": "client\\src\\pages\\Customize.tsx:327", className: "error-message", children: loadError }),
        /* @__PURE__ */ jsx("button", { "data-loc": "client\\src\\pages\\Customize.tsx:328", className: "error-dismiss-btn", onClick: () => setLoadError(null), children: "Try Again" })
      ] }) }),
      /* @__PURE__ */ jsxs("nav", { "data-loc": "client\\src\\pages\\Customize.tsx:334", className: "bottom-nav", children: [
        /* @__PURE__ */ jsxs("button", { "data-loc": "client\\src\\pages\\Customize.tsx:335", className: `nav-item ${activeDrawer === "model" ? "active" : ""}`, onClick: () => handleNavClick("model"), children: [
          /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\Customize.tsx:336", className: "nav-icon", children: "👕" }),
          /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\Customize.tsx:336", className: "nav-label", children: "Model" })
        ] }),
        /* @__PURE__ */ jsxs("button", { "data-loc": "client\\src\\pages\\Customize.tsx:338", className: `nav-item ${activeDrawer === "logos" ? "active" : ""}`, onClick: () => handleNavClick("logos"), children: [
          /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\Customize.tsx:339", className: "nav-icon", children: "🏷️" }),
          /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\Customize.tsx:339", className: "nav-label", children: "Logos" })
        ] }),
        /* @__PURE__ */ jsxs("button", { "data-loc": "client\\src\\pages\\Customize.tsx:341", className: `nav-item ${activeDrawer === "text" || isPlacingText ? "active" : ""}`, onClick: () => handleNavClick("text"), children: [
          /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\Customize.tsx:342", className: "nav-icon", children: "✏️" }),
          /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\Customize.tsx:342", className: "nav-label", children: "Text" })
        ] }),
        /* @__PURE__ */ jsxs("button", { "data-loc": "client\\src\\pages\\Customize.tsx:344", className: `nav-item ${activeDrawer === "textures" || isSelectingTextureTarget ? "active" : ""}`, onClick: () => handleNavClick("textures"), children: [
          /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\Customize.tsx:345", className: "nav-icon", children: "🎨" }),
          /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\Customize.tsx:345", className: "nav-label", children: "Textures" })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Customize.tsx:350", className: `drawer-overlay ${activeDrawer ? "open" : ""}`, onClick: () => setActiveDrawer(null) }),
      /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Customize.tsx:351", className: `drawer ${activeDrawer && activeDrawer !== "export" ? "open" : ""}`, children: [
        /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Customize.tsx:352", className: "drawer-handle" }),
        renderDrawerContent()
      ] }),
      activeDrawer === "export" && /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Customize.tsx:358", className: "export-modal-overlay", onClick: () => setActiveDrawer(null), children: /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Customize.tsx:359", onClick: (e) => e.stopPropagation(), style: { position: "relative" }, children: [
        /* @__PURE__ */ jsx(ExportPanel, { "data-loc": "client\\src\\pages\\Customize.tsx:360" }),
        /* @__PURE__ */ jsx("button", { "data-loc": "client\\src\\pages\\Customize.tsx:361", className: "export-close-btn", onClick: () => setActiveDrawer(null), children: "×" })
      ] }) })
    ] }),
    /* @__PURE__ */ jsx(
      DesignQuoteModal,
      {
        "data-loc": "client\\src\\pages\\Customize.tsx:368",
        isOpen: isQuoteModalOpen,
        onClose: () => setIsQuoteModalOpen(false),
        garmentType: garmentTypeLabel
      }
    )
  ] });
}
export {
  Customize as default
};
