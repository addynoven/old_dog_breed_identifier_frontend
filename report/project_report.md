# Dog Breed Identifier - Frontend Project Report

## 1. Introduction
The **Dog Breed Identifier** is a modern web application designed to help users identify dog breeds from images. Leveraging the power of machine learning (via a backend API) and a responsive frontend interface, users can upload photos or use their device's camera to get instant breed predictions. The application also provides detailed information about each breed, including their country of origin displayed on an interactive map.

## 2. Technologies Used
The frontend is built using a robust modern tech stack to ensure performance, scalability, and a premium user experience:

*   **Framework**: [Next.js 15.5.2](https://nextjs.org/) (React Framework for Production)
*   **Language**: [TypeScript](https://www.typescriptlang.org/) (Static typing for better code quality)
*   **Styling**: [Tailwind CSS 4](https://tailwindcss.com/) (Utility-first CSS framework)
*   **State Management**: [Zustand](https://github.com/pmndrs/zustand) (Lightweight state management)
*   **Maps**: [Leaflet](https://leafletjs.com/) & [React-Leaflet](https://react-leaflet.js.org/) (Interactive maps)
*   **HTTP Client**: [Axios](https://axios-http.com/) & Native Fetch
*   **Icons**: [React Icons](https://react-icons.github.io/react-icons/)
*   **Cloud Storage**: AWS SDK (compatible with Tebi for S3-like storage)

## 3. Project Structure
The project follows the standard Next.js App Router structure:

*   **`src/app`**: Contains the application routes and pages.
    *   `page.tsx`: The main entry point (Home page).
    *   `layout.tsx`: Defines the global layout (fonts, metadata).
    *   `api/`: Backend proxy routes for prediction and upload handling.
*   **`src/components`**: Reusable UI components.
    *   `BreedSearchBar.tsx`: Search input with autocomplete and voice support.
    *   `BreedMap.tsx`: Interactive map component.
    *   `CameraModal.tsx`: Modal for camera capture and file upload.
    *   `MainContent.tsx`: Orchestrates the main view logic.
*   **`src/lib`**: Core logic and helper functions.
    *   `upload.ts`: Handles file hashing and S3 uploads.
    *   `prediction-store.ts`: Zustand store for caching predictions.
    *   `breed-utils.ts`: Helpers for fetching breed information.

## 4. Key Features

### 🔍 AI-Powered Breed Identification
Users can upload an image or take a photo to identify the dog breed. The system calculates a unique file hash to check for cached results before sending the image to the backend for analysis.

### 🎙️ Voice & Text Search
A powerful search bar allows users to find breeds by name. It features:
*   **Autocomplete**: Real-time suggestions based on available breeds.
*   **Voice Search**: Integrated microphone support for hands-free searching (Chrome-supported).

### 🗺️ Interactive Origin Map
When a breed is identified or selected, an interactive map highlights its country of origin. This feature uses GeoJSON data to render countries and dynamically zooms to the relevant location.

### 📱 Responsive & Premium Design
The UI is designed with a "mobile-first" approach, ensuring it looks great on all devices. It features glassmorphism effects, smooth transitions, and a clean, modern aesthetic.

## 5. Component Overview

### `BreedSearchBar`
This component is the central hub for user interaction. It manages the search state, handles voice input using the Web Speech API, and integrates the file drop zone for drag-and-drop uploads.

### `BreedMap`
Built with `react-leaflet`, this component visualizes the geographical origin of the dog breeds. It dynamically updates the map view to center on the origin country and applies custom styling to highlight it.

### `MainContent`
This parent component manages the flow of data between the search bar, the prediction results, and the map. It handles the loading states and error management for a seamless user experience.

## 6. Technical Implementation Details

### Efficient File Uploads
To optimize performance and security, the application uses a **Presigned URL** pattern.
1.  The client calculates a SHA-256 hash of the file.
2.  It requests a secure upload URL from the backend.
3.  The file is uploaded directly to the object storage (Tebi/S3), bypassing the application server to reduce load.

### State Management & Caching
**Zustand** is used to manage global state and cache prediction results. This means if a user uploads the same image twice, the result is retrieved instantly from the client-side cache without a network request.

## 7. Future Enhancements
*   **PWA Support**: Turn the website into a Progressive Web App for offline capabilities.
*   **Community Features**: Allow users to save their favorite breeds or share results on social media.
*   **Multi-Language Support**: Localize the interface for a global audience.
*   **Compare Breeds**: A feature to compare two dog breeds side-by-side.
