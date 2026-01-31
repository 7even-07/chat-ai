import { getCharactersAccordingUser, deleteCharacter } from "@/services/charactersAPI";
import { Character } from "@/types/characters";
import { useEffect, useState } from "react";
import Link from "next/link";
import config from "@/includes/config";
import { useParams } from "next/navigation";

function CharacterList({ memberId }) {
    const [characters, setCharacters] = useState<Character[]>([]);
    const params = useParams();
    const [username, setUsername] = useState("");

    useEffect(() => {
        const fetchMe = async () => {
            try {
                const res = await fetch(`${config.BACKENDSITEURL}/auth/me`, {
                    method: "GET",
                    credentials: "include",
                    headers: { Accept: "application/json" },
                });
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const data = await res.json();
                setUsername(data.response_data?.username);
            } catch (err) {
                console.error(err);
                alert("Something went wrong, please try again later.");
            }
        };

        fetchMe();
    }, []);

    const fetchCharacters = async () => {
        const data = await getCharactersAccordingUser(memberId);
        setCharacters(data || []);
    };

    useEffect(() => {
        if (memberId) fetchCharacters();
    }, [memberId]);

    // DELETE Handler
    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this character?")) return;

        try {
            await deleteCharacter(id);
            fetchCharacters(); // refresh list
        } catch (err) {
            console.error(err);
            alert("Failed to delete character.");
        }
    };

    return (
        <div className="p-6 w-full">
            {/* Add Character Button */}
            <div className="flex justify-end mb-4">
                <Link
                    href={`/user-account/${memberId}/${username}/add-character`}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                    + Add Character
                </Link>
            </div>

            {/* Character Cards */}
            <div className="grid gap-4">
                {characters.map((char) => (
                    <div
                        key={char.id}
                        className="flex items-center gap-4 p-4 border rounded-lg shadow-sm bg-white"
                    >
                        <img
                            src={`${config.BACKEND_SITE_ASSETS_PATH}/characters/avatar-img/${char.character_avatar_url}`}
                            alt={char.character_name}
                            className="w-20 h-20 rounded-md object-cover border"
                        />

                        <div className="flex-1">
                            <h2 className="text-lg font-semibold">{char.character_name}</h2>
                        </div>

                        {/* ACTION BUTTONS */}
                        <div className="flex gap-2">
                            {/* Edit Button */}
                            <Link
                                href={`/user-account/${memberId}/${username}/edit-character/${char.id}`}
                                className="px-3 py-1 text-sm bg-yellow-500 text-white rounded hover:bg-yellow-600"
                            >
                                Edit
                            </Link>

                            {/* Delete Button */}
                            <button
                                onClick={() => handleDelete(char.id)}
                                className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}

                {characters.length === 0 && (
                    <p className="text-center text-gray-500">No characters found.</p>
                )}
            </div>
        </div>
    );
}

export default CharacterList;
