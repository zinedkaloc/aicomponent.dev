import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Project } from "@/types";

export const initialIframeContent = `
<link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" rel="stylesheet"> 
<script src="https://cdn.jsdelivr.net/npm/tailwindcss@3.3.3/lib/index.min.js"></script>
<link href="https://cdn.jsdelivr.net/npm/tailwindcss@3.3.3/tailwind.min.css" rel="stylesheet">
<script src="https://cdn.jsdelivr.net/npm/alpinejs@2.8.2/dist/alpine.min.js" defer></script> 
<script src="https://cdn.jsdelivr.net/npm/tailwindcss@3.3.3/lib/index.min.js"></script> 
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
`;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isServer() {
  return typeof window === "undefined";
}

export function isClient() {
  return typeof window !== "undefined";
}

export function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function downloadHTML(content: string) {
  const element = document.createElement("a");
  const file = new Blob([content], { type: "text/html" });
  element.href = URL.createObjectURL(file);
  element.download = "index.html";
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

export async function updateProject(
  data: Omit<Partial<Project>, "id">,
  _id: string,
  type: "project" | "sub-project" = "project",
) {
  return {};
}
export function moneyFormat(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export function stripePrice(amount: number) {
  return amount * 100;
}

export const getSubdomain = (name: string, apexName: string) => {
  if (name === apexName) return null;
  return name.slice(0, name.length - apexName.length - 1);
};

export function capitalize(str: string) {
  if (!str || typeof str !== "string") return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export const truncate = (str: string | null, length: number) => {
  if (!str || str.length <= length) return str;
  return `${str.slice(0, length - 3)}...`;
};

export function toReversed<T>(arr: T[]) {
  const array = [...arr];
  return array.reverse();
}

export function dateFormat(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
