"use client"

import { Navbar } from "@/components";
import { useParams } from "next/navigation"
import Sidebar from "./sidebar";

export default function Account() {
    const params = useParams();
    const {userId, username} = params;

    return(
        <>
        <Navbar/>
        <Sidebar/>
        </>
    )
}