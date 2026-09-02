import React from "react";
import ProjectChatClient from "./ProjectChatClient";

export async function generateStaticParams() {
  return [
    { id: "demo-velocloud" },
    { id: "demo-nexusflow" },
    { id: "default" },
  ];
}

export default function ProjectChatPage() {
  return <ProjectChatClient />;
}
