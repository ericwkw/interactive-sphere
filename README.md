# Interactive 3D Sphere

This is a simple, interactive 3D web application built with Three.js. It displays a sphere with several controls that allow the user to modify its appearance and behavior in real-time. The scene includes realistic lighting, shadows, and physically-based materials.

## Features

- **Real-time Color Change:** Instantly modify the sphere's color using a color picker.
- **Dynamic Textures:** Switch between different surface textures, including:
  - **None:** A plain, colored surface.
  - **Rock:** A diffuse rock texture.
  - **Wood:** A diffuse wood texture.
  - **Glass:** A physically-based glass material with realistic reflections and refraction.
- **Rotation Speed Control:** Adjust the speed of the sphere's rotation with a slider.
- **3D Orbit Controls:** Use your mouse to orbit the camera around the sphere, zoom in and out, and pan the scene.
- **Realistic Lighting & Shadows:** The scene is lit by a directional light that casts a real-time shadow onto a ground plane, creating a sense of depth.
- **Environment Reflections:** The "Glass" material uses an environment map to create convincing reflections of the surroundings.

## How to Run Locally

To run this project on your local machine, follow these steps:

1.  Clone or download the repository.
2.  Navigate to the project directory in your terminal.
3.  Start a simple local web server. If you have Python installed, you can use the following command:

    ```bash
    python3 -m http.server
    ```

4.  Open your web browser and go to `http://localhost:8000`.

## Controls

- **Orbit:** Click and drag the left mouse button.
- **Zoom:** Use the mouse scroll wheel.
- **Pan:** Click and drag the right mouse button.

## Technologies Used

- [Three.js](https://threejs.org/): A cross-browser JavaScript library/API used to create and display animated 3D computer graphics in a web browser.
- [lil-gui](https://lil-gui.georgealways.com/): A lightweight and simple graphical user interface for web-based projects.
