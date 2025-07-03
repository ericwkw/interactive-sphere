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

---
### **Phase 2: Interactive Scene**
- [x] Implement object picking using `THREE.Raycaster` to detect mouse clicks on objects.
- [x] Add visual feedback for the selected object (e.g., changing its color or adding an outline).
---

---
### **Phase 3: UX Improvement**
- [x] Implement hover detection using `mousemove` to know when the cursor is over the sphere.
- [x] Change the mouse cursor to a pointer when hovering over the sphere.
- [x] Add a post-processing outline effect to the sphere on hover using `EffectComposer` and `OutlinePass`.
- [x] Change the click action to cycle through a predefined list of colors instead of a random one.
---

---
### **Phase 4: Interactive Contour Deformation**
- [x] Remove the "click to change color" functionality.
- [x] Implement a system to procedurally generate a displacement map using a `CanvasTexture`. When the sphere is clicked, a new random pattern will be drawn on a hidden canvas, which will then be used as the displacement map.
- [x] Add a `displacementScale` control to the GUI, allowing you to adjust the intensity of the contour deformation.
---

---
### **Phase 5: Reset and Dynamic Gradient Color**
- [x] **Reset Functionality:**
    - [x] Add a "Reset" button to the GUI.
    - [x] Implement a function to reset all GUI parameters (`color`, `metalness`, `roughness`, `clearcoat`, `displacementScale`, `texture`) to their initial values.
    - [x] Reset the sphere's material properties and geometry (if displacement was applied) to match these initial values.
    - [x] Clear the displacement map to a flat state.
- [x] **Dynamic Gradient Color:**
    - [x] Create a new `CanvasTexture` to generate a dynamic gradient.
    - [x] Apply this `CanvasTexture` as the `map` (base color texture) of the `MeshPhysicalMaterial`.
    - [x] Implement an animation loop within the `generateGradientTexture` function to create a "slowly moving" gradient effect. This will involve redrawing the canvas with a slightly shifted gradient in each animation frame.
    - [x] Remove the existing `color` parameter from the GUI, as the gradient will now control the base color.
---

---
### **Phase 6: Reset Fix and Enhanced Color Control**
- [x] **Fix Reset Functionality:**
    - [x] Ensure `resetSphere` correctly flattens the displacement map by explicitly setting `material.displacementScale` to 0 and redrawing a completely black displacement map.
    - [x] Verify all other parameters reset correctly.
- [x] **Enhanced Gradient Color Control:**
    - [x] Reintroduce GUI controls for the gradient's starting hue.
    - [x] Add GUI controls for saturation and lightness to allow for more customization of the gradient's appearance.
    - [x] Ensure the gradient continues to animate based on these new controls.
---

---
### **Phase 7: GUI Clarity and Intuitiveness**
- [x] **Rename GUI Parameters:** Change technical parameter names to more user-friendly labels (e.g., `metalness` to "Metallic Finish", `roughness` to "Surface Roughness", `clearcoat` to "Clear Coat Shine", `displacementScale` to "Shape Intensity", `gradientHue` to "Color Hue Offset", `gradientSaturation` to "Color Saturation", `gradientLightness` to "Color Brightness", `rotationSpeed` to "Rotation Speed").
- [x] **Add Tooltips/Descriptions:** For each GUI control, add a descriptive tooltip that explains its function in simple terms. This will appear when the user hovers over the control.
- [x] **Organize GUI into Folders:** Group related controls into logical folders (e.g., "Appearance", "Shape", "Animation", "Interaction"). This will make the GUI less overwhelming and easier to navigate.
- [x] **Enhanced Color Choice:**
    - [x] Reintroduce a single "Base Color" control (using a color picker) that sets the primary color for the gradient.
    - [x] Adjust the `gradientHue`, `gradientSaturation`, and `gradientLightness` controls to act as offsets or fine-tuners relative to this "Base Color," making the overall color selection more intuitive.
---