import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Layout, RouteError } from "../components";

// Lazy loaded pages
const GridEditorPage = lazy(() => import("../pages/GridEditorPage"));

// Loading fallback
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

export function AppRoutes() {
  return <RouterProvider router={router} />;
}
