"use client";
import { useParams, useRouter } from "next/navigation";
import { deleteCharacter } from "@/services/charactersAPI";
import { useEffect } from "react";
import config from "@/includes/config";

export default function DeleteCharacter() {
    const {userId} = useParams();
    const {username} = useParams();
    const {characterId} = useParams();
    const router = useRouter();

    useEffect(() => {
        async function doDelete() {
            await deleteCharacter(Number(characterId));
            router.push(config.SITE_URL + `/user-account/${userId}/${username}`);
        }
        doDelete();
    }, [characterId]);
    return <p>Deletting Character</p>
}