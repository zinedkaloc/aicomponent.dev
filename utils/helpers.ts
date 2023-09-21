import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Project } from "@/types";
import { customAlphabet } from "nanoid";

export const initialIframeContent = `
<link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" rel="stylesheet"> 
<script src="https://cdn.jsdelivr.net/npm/tailwindcss@3.3.3/lib/index.min.js"></script>
<link href="https://cdn.jsdelivr.net/npm/tailwindcss@3.3.3/tailwind.min.css" rel="stylesheet">
<script src="https://cdn.jsdelivr.net/npm/alpinejs@2.8.2/dist/alpine.min.js" defer></script> 
<script src="https://cdn.jsdelivr.net/npm/tailwindcss@3.3.3/lib/index.min.js"></script> 
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
`;

export const nanoid = customAlphabet(
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
  7,
); // 7-character random string

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function stripePrice(price: number) {
  return price / 100;
}

export function moneyFormat(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
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

export async function updateProject(
  data: Omit<Partial<Project>, "_id">,
  _id: string,
  type: "project" | "sub-project" = "project",
) {
  const body = JSON.stringify({
    ...data,
    _id,
    type,
  });

  const res = await fetch(`/api/message`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "PUT",
    body,
  });

  return res.json();
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
