import { json } from "stream/consumers"
import { openLoadingModal, closeLoadingModal, showResponseMessage } from "../app/lib/alert";
import config from "@/includes/config"
export const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? config.BACKENDSITEURL

export const apiPost = async (path: string, data: any) => {
    openLoadingModal();
    const res = await fetch(`${API_BASE}${path}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
    });

    const result = await res.json();
    closeLoadingModal();

    await showResponseMessage(result.response_code, result.response_message);
    return result;
}

export const apiGet = async (path: string) => {
    openLoadingModal();
    const res = await fetch(`${API_BASE}${path}`, {
        method: "GET",
        credentials: "include"
    })
    
    const result = await res.json();
    closeLoadingModal();

    await showResponseMessage(result.response_code, result.response_message);
    return result;
}

export const verifyOTP = async (path: string, data: any) => {
  openLoadingModal();
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = await res.json();
  closeLoadingModal();

  await showResponseMessage(result.response_code, result.response_message);
  return result;
};


export const logoutAPI = async () => {
  const res = await fetch(`${API_BASE}/auth/logout`, {
    method: "POST",
    credentials: "include",
  });

  return await res.json();
};