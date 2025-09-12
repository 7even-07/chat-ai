"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getCharacters } from "@/services/charactersAPI";
import { Character } from "@/types/characters";
import {
    PencilSquareIcon,
    TrashIcon,
    HandThumbUpIcon,
    HandThumbDownIcon

} from "@heroicons/react/24/solid"

export default function CharacterListPage() {
    const [characters, setCharacters] = useState<Character[]>([]);

    const fetchCharacters = async () => {
        const data = await getCharacters();
        setCharacters(data);
    };

    useEffect(() => {
        fetchCharacters();
    }, []);

    return (
        <div className="max-w-5xl mx-auto p-6">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Character List</h1>
                <Link
                    href="/admin/characters/add"
                    className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                    + Add Character
                </Link>
            </div>

            {characters.length === 0 ? (
                <p className="text-gray-500">No characters found.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="table-auto w-full border-collapse border border-gray-200">
                        <thead>
                            <tr className="bg-gray-100 text-left">
                                <th className="px-4 py-2 border">SR No.</th>
                                <th className="px-4 py-2 border">Character Avatar</th>
                                <th className="px-4 py-2 border">Character Name</th>
                                <th className="px-4 py-2 border">Status</th>
                                <th className="px-4 py-2 border">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {characters.map((char, index) => (
                                <tr key={char.id} className="border-t">
                                    <td className="px-4 py-2 border">{index + 1}</td>
                                    <td className="px-4 py-2 border">
                                        {char.character_avatar_url ? (
                                            <img
                                                src={`http://localhost:8000/uploads/characters/avatar-img/${char.character_avatar_url}`}
                                                alt={char.character_name}
                                                className="w-12 h-12 object-cover rounded"
                                            />
                                        ) : (
                                            <span className="text-gray-400 italic">No Avatar</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-2 border font-medium">{char.character_name}</td>
                                    <td className="px-4 py-2 border capitalize">
                                        {char.is_active ? "Active" : "Deactive`"}
                                    </td>
                                    <td className="px-4 py-2 border">
                                        <div className="flex items-center space-x-2">
                                            <Link
                                                href={`/admin/characters/${char.id}/edit`}
                                                className="text-blue-600 hover:underline"
                                            >
                                                <PencilSquareIcon className="w-5 h-5" />
                                            </Link>
                                            <Link
                                                href={`/admin/characters/${char.id}/delete`}
                                                className="text-red-600 hover:underline"
                                            >
                                                <TrashIcon className="w-5 h-5" />
                                            </Link>
                                            {
                                                char.is_active ? (
                                                    <Link
                                                        href={`/admin/characters/${char.id}/active`}
                                                        className="text-red-600 hover:underline"
                                                    >
                                                        <HandThumbDownIcon className="w-5 h-5" />
                                                    </Link>
                                                ) :
                                                (
                                                    <Link
                                                        href={`/admin/characters/${char.id}/active`}
                                                        className="text-green-600 hover:underline"
                                                    >
                                                        <HandThumbUpIcon className="w-5 h-5" />
                                                    </Link>
                                                )
                                            }

                                            
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
