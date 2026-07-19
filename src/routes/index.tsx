import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Layout, RouteError } from "../components";

// Lazy loaded pages
const GridEditorPage = lazy(() => import("../pages/GridEditorPage"));

/*
 * Shows a lightweight loading state while a page lazy-loads.
 * Displays a centered spinner placeholder for route transitions.
 */
function PageLoader() {
  return (
    <div className="page-loader">
      <div className="page-loader__spinner" />
    </div>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <RouteError />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<PageLoader />}>
            <GridEditorPage />
          </Suspense>
        ),
      },
    ],
  },
]);

/*
 * Creates and provides the application router.
 * Wires the layout and page tree for the main editor experience.
 */
export function AppRoutes() {
  return <RouterProvider router={router} />;
}
