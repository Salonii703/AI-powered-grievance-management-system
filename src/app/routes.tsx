import React from 'react';
import { createBrowserRouter } from "react-router-dom";
import { AppLayout } from "./components/Layout";
import { LandingPage } from "./pages/LandingPage";
import { Dashboard } from "./pages/Dashboard";
import { AuthPage } from "./pages/AuthPage";
import LodgeGrievance from "./pages/LodgeGrievance";
import AdminAllGrievances from "./pages/AdminAllGrievances";
import MyGrievances from "./pages/MyGrievances";

const NotFound = () => (
  <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] p-6 text-center">
    <div>
      <h1 className="text-6xl font-bold text-[#1E40AF] mb-4">404</h1>
      <p className="text-xl text-gray-600 mb-8">Oops! The page you're looking for doesn't exist.</p>
      <a href="/" className="bg-[#1E40AF] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#1e3a8a] transition-all">
        Go Home
      </a>
    </div>
  </div>
);

export const router = createBrowserRouter([
  {
    path: "/",
    Component: LandingPage,
  },
  {
    path: "/login",
    Component: AuthPage,
  },
  {
    path: "/signup",
    Component: AuthPage,
  },
  {
    path: "/terms",
    Component: AuthPage,
  },
  {
    path: "/privacy",
    Component: AuthPage,
  },
  {
    path: "/dashboard",
    Component: AppLayout,
    children: [
      {
        index: true,
        Component: Dashboard,
      },
      {
        path: "lodging",
        Component: LodgeGrievance, 
      },
      {
        path: "status",
        Component: () => <div className="p-8">View Status Placeholder</div>,
      },
      {
        path: "all",
        Component: AdminAllGrievances,
      },
      {
        path: "my-grievances",
        Component: MyGrievances,
      }
    ],
  },
  {
    path: "*",
    Component: NotFound,
  }
]);
