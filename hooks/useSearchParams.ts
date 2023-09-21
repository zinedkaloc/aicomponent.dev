"use client";
import {
  usePathname,
  useRouter,
  useSearchParams as useNextSearchParams,
} from "next/navigation";
import { useCallback } from "react";

export default function useSearchParams() {
  const searchParams = useNextSearchParams();
  const router = useRouter();
  const path = usePathname();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams);
      params.set(name, value);

      return params.toString();
    },
    [searchParams],
  );

  const appendQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams);
      params.append(name, value);

      return params.toString();
    },
    [searchParams],
  );

  function getURL() {
    return new URL(path, window.location.origin);
  }

  function get(key: string) {
    return searchParams.get(key);
  }

  function set(key: string, value: string) {
    router.push(path + "?" + createQueryString(key, value));
  }

  function append(key: string, value: string) {
    router.push(path + "?" + appendQueryString(key, value));
  }

  function deleteByKey(key: string) {
    const params = getURL();
    params.searchParams.delete(key);
    router.push(params.toString());
  }

  function has(key: string) {
    return searchParams.has(key);
  }

  return {
    set,
    append,
    has,
    get,
    deleteByKey,
  };
}
