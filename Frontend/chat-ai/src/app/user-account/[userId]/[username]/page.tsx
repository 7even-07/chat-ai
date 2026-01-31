"use client"

import { Navbar } from "@/components";
import { useParams } from "next/navigation"
import config from "@/includes/config";
import { useState, useEffect } from "react";
import Sidebar from "./sidebar";


export default function Account() {
    const params = useParams();
    const [memberId, setMemeberId] = useState(0);
    const [username, setUsername] = useState("");

    useEffect(() => {
    const fetchMe = async () => {
        try {
        const res = await fetch(`${config.BACKENDSITEURL}/auth/me`, {
            method: "GET",
            credentials: "include",
            headers: { "Accept": "application/json" },
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        
        setMemeberId(data.response_data?.id);
        setUsername(data.response_data?.username);
        } catch (err) {
        console.error(err);
        alert("Something went wrong, please try again later.");
        }
    };

    fetchMe();
    }, []);

    

    return(
        <>
        <Sidebar memberId={memberId}/>
        </>
    )
}