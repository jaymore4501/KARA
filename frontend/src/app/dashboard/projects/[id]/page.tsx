import React from "react";
import ProjectDetailClient from "./ProjectDetailClient";

export async function generateStaticParams() {
  return [
    { id: "demo-velocloud" },
    { id: "demo-nexusflow" },
    { id: "default" },
  ];
}

export default function ProjectWorkspacePage() {
  return <ProjectDetailClient />;
}
