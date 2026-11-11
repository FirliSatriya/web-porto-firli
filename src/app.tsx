import * as React from "react";
import { BrowserRouter, Route, Routes } from "react-router";

import { SiteLayout } from "@/components/site-layout";
import { HomePage } from "@/pages/home";

// The landing page is the entry point, so it stays in the main chunk. The two
// secondary routes pull in their own artwork and dialog code only when visited.
const GalleryPage = React.lazy(() =>
  import("@/pages/gallery").then((module) => ({ default: module.GalleryPage })),
);
const ResumePage = React.lazy(() =>
  import("@/pages/resume").then((module) => ({ default: module.ResumePage })),
);

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<SiteLayout />}>
          <Route index element={<HomePage />} />
          <Route
            path="gallery"
            element={
              <React.Suspense fallback={null}>
                <GalleryPage />
              </React.Suspense>
            }
          />
          <Route
            path="resume"
            element={
              <React.Suspense fallback={null}>
                <ResumePage />
              </React.Suspense>
            }
          />
          {/* Anything else lands back on the portfolio rather than a blank page. */}
          <Route path="*" element={<HomePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
