# Plan: Sphere Realism Enhancement

This document outlines the steps to enhance the realism of the 3D sphere.

### 1. Advanced Materials
- [x] Replace `MeshStandardMaterial` with `MeshPhysicalMaterial`.
- [x] Add GUI controls for `metalness`, `roughness`, and `clearcoat` to allow for fine-tuning the sphere's surface properties.

### 2. Improved Lighting
- [x] Implement a more sophisticated lighting setup with multiple lights (e.g., key, fill, and back lights) to create more natural highlights and shadows.

### 3. High-Quality Shadows
- [x] Enhance shadow quality by increasing the shadow map resolution and enabling soft shadows for a more realistic appearance.

### 4. Code Cleanup
- [x] Remove the `RGBELoader` and the HDR environment map.
- [x] The "Glass" material option will be simplified to work without the environment map.