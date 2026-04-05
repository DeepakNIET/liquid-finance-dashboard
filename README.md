# Liquid Intelligence - Premium Finance Dashboard

A high-fidelity, interactive, and responsive finance dashboard built specifically for evaluating frontend development proficiency. This project emphasizes clarity, completeness, uncompromised visual polish, and advanced state management without artificial complexity.

## Features & Implementation Overview

### 1. Robust State Management & Local Storage Persistence
- **Context API Structure**: Built with `React.Context` to manage Global Scope attributes like `transactions`, `role`, and `theme`.
- **Data Persistence**: Leveraging `localStorage` dynamically tracks user preferences. If you change your visual mode or change your Role, refreshing the browser guarantees your state is immediately restored.
- **Simulated Latency Network (Mock API)**: True to actual architectural requirements, a `MockAPI` wrapper has been implemented. When the application loads, it throws an artificial 600ms latency to demonstrate how the UI handles skeleton-loading transitions gracefully. 

### 2. High-Performance Theming & Styling Constraints
- **Absolute Vanity-Free CSS**: To demonstrate mastery of CSS, NO utility libraries like Tailwind were utilized. Instead, highly scalable standard `CSS Modules` were structured. 
- **Dark Mode Architecture**: By mutating CSS custom variables `--var` applied through a `:global(.dark)` modifier injected structurally onto the document body, the application performs lightning-fast theme swaps. 
- **Glassmorphism Context Elements**: Every chart, table, and data container card runs through an incredibly tight `-webkit-backdrop-filter: blur(20px)` stacked against `rgba` variables resulting in the ethereal aesthetic. 

### 3. Role-Based Access Control (RBAC) Simulation
- Toggle between **Administrator** and **Strategic Viewer** through the Settings tab.
- This toggle is immediately consumed globally: the Navigation Bar detects and projects the "Admin Mode" badge, and the Transaction page immediately un-hides "Edit/Action" logic inside the data table structure. 

### 4. Advanced Data Interaction
- **Search & Filters**: Stacked conditional array loops ensure O(n) filter passes for string searching ("Amazon", "Payroll"), strict Category enums, Type parsing, and directional Sorting logic (High-to-Low Amount, Oldest Dates vs Newest Series). 
- **Graceful Empty State Tracking**: If search mechanics yield a 0-count array size, an empty block-view automatically mounts to prevent UI collapsing.
- **Data Export**: The Insights Page allows direct Blob mounting and DOM-injection CSV conversions representing current active mock transactions.

## Local Installation & Setup

1. **Prerequisites**
   Ensure you have Node.js (v16.14.0+) installed globally.
   
2. **Setup Instructions**
   Clone or navigate into the core project registry folder where `package.json` resides.

   ```bash
   # Install essential dependencies
   npm install

   # Boot up Vite development server
   npm run dev
   ```

3. **Production Compilation**
   If validating strict TypeScript typings or packaging for distribution platforms (e.g. Vercel/Netlify):
   
   ```bash
   npm run build
   ```

*Designed strictly with passion and precision across fluid components.*
