import { createBrowserRouter } from "react-router";
import { HomePage } from "./pages/HomePage";
import { AnalyzerPage } from "./pages/AnalyzerPage";
import { Layout } from "./components/Layout";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "analyzer",
        element: <AnalyzerPage />,
      },
    ],
  },
]);