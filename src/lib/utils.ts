import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Project } from "@/types";

export function numberFormat(number: number) {
  return new Intl.NumberFormat("en-US").format(number);
}

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
  id: number,
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
