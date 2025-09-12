"use client";
import { useParams, useRouter } from "next/navigation";
import { deleteCharacter } from "@/services/charactersAPI";
import { useEffect } from "react";

export default function DeleteCharacter() {
    const {id} = useParams();
    const router = useRouter();

    useEffect(() => {
        async function doDelete() {
            await deleteCharacter(Number(id));
            router.push("admin/characters");
        }
        doDelete();
    }, [id]);
    return <p>Deletting Character</p>
}