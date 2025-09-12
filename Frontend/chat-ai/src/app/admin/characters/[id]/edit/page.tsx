"use client";
import { useParams, useRouter } from "next/navigation";
import React, {useState, useEffect} from "react";
import { getCharacterById, updateCharacter } from "@/services/charactersAPI";
import { openLoadingModal } from "@/app/lib/alert";
import config from "@/includes/config";

export default function EditCharacterPage() {
    const {id} = useParams();
    const router = useRouter();
    const [hasMounted, setHasMounted] = useState(false);

    const [memberId, setMemberId] = useState(1);
    const [characterName, setCharacterName] = useState("");
    const [age, setAge] = useState("");
    const [language, setLanguage] = useState("");
    const [defaultTemperature, setDefaultTemperature] = useState(0.8);
    const [chatContext, setChatContext] = useState("");
    const [gender, setGender] = useState("");
    const [relationshipStyle, setRelationshipStyle] = useState("");
    const [catchphrases, setCatchphrases] = useState("");
    const [occupations, setOccupations] = useState("");
    const [appearance, setAppearance] = useState("");
    const [personalityTraits, setPersonalityTraits] = useState("");
    const [speakingStyle, setSpeakingStyle] = useState("");
    const [behavioralTraits, setBehavioralTraits] = useState("");
    const [likesControl, setLikesControl] = useState("");
    const [worldInfo, setWorldInfo] = useState("");
    const [authorNotes, setAuthorNotes] = useState("");

    const [characterAvatar, setCharacterAvatar] = useState<File | null>(null);
    const [characterVoice, setCharacterVoice] = useState<File | null >(null);

    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [voicePreview, setVoicePreview] = useState<string | null>(null);

    // Ensure the component is mounted before rendering
    useEffect(() => {
        setHasMounted(true);
    })

    useEffect(() => {
        if (!id) return;
        async function load() {
            const data = await getCharacterById(Number(id));
            setMemberId(data.member_id ?? 1);
            setCharacterName(data.character_name);
            setAge(data.age);
            setLanguage(data.language);
            setDefaultTemperature(data.default_temperature);
            setChatContext(data.chat_context);
            setGender(data.gender);
            setRelationshipStyle(data.relationship_style);
            setCatchphrases(data.catchphrases);
            setOccupations(data.occupations);
            setAppearance(data.appearance);
            setPersonalityTraits(data.personality_traits);
            setSpeakingStyle(data.speaking_style);
            setBehavioralTraits(data.behavioral_traits);
            setWorldInfo(data.world_info);
            setAuthorNotes(data.author_notes);
            setAvatarPreview(`${config.BACKENDSITEURL}/uploads/characters/avatar-img/`+data.character_avatar_url);
            setVoicePreview(`${config.BACKENDSITEURL}/uploads/characters/voice/`+data.character_voice_url);

        }
        load();
    }, [id]);

    const handleAvtarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0];
        setCharacterAvatar(selected || null);

        if (selected) {
        const reader = new FileReader();
        reader.onloadend = () => setAvatarPreview(reader.result as string);
        reader.readAsDataURL(selected);
        }
    }

    const handleVoiceFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0];

        setCharacterVoice(selected || null);

        if (selected) {
        const voiceURL = URL.createObjectURL(selected);
        setVoicePreview(voiceURL);
        }
    }

    const handleSubmit = async(e: React.FormEvent) => {
        e.preventDefault();
        openLoadingModal();
        const formData = new FormData();
        formData.append("member_id", memberId.toString());
        formData.append("character_name", characterName);
        formData.append("age", age);
        formData.append("language", language);
        formData.append("default_temperature", defaultTemperature.toString());
        formData.append("chat_context", chatContext);
        formData.append("gender", gender);
        formData.append("relationship_style", relationshipStyle);
        formData.append("catchphrases", catchphrases);
        formData.append("occupations", occupations);
        formData.append("appearance", appearance);
        formData.append("personality_traits", personalityTraits);
        formData.append("speaking_style", speakingStyle);
        formData.append("behavioral_traits", behavioralTraits);
        formData.append("world_info", worldInfo);
        formData.append("author_notes", authorNotes);
        
        if (characterAvatar) formData.append("character_avatar_url", characterAvatar);
        if (characterVoice) formData.append("character_voice_url", characterVoice);

        const result = await updateCharacter(Number(id), formData);
        
        if (result?.response_code) {
          setTimeout(() => {
            router.push(`/admin/${result.redirect_url}`);
          }, 3000);
        }
    }

    // prevent hyderation mismatch by waiting for client-side mount
    if (!hasMounted) return null;
    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Add New Character</h1>
      <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
        <input type="hidden" name="member_id" value={memberId} />
        
        {/* Character Name & Age */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold mb-1">Character Name</label>
            <input
              type="text"
              name="character_name"
              value={characterName}
              onChange={(e) => setCharacterName(e.target.value)}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Age</label>
            <input
              type="number"
              name="age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Avatar Upload */}
            <div>
                <label className="block font-semibold mb-1">Avatar Image</label>
                <input
                name="character_avatar_url"
                type="file"
                accept="image/*"
                onChange={handleAvtarFileChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:border file:rounded file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {avatarPreview && (
                <img
                    src={avatarPreview}
                    alt="Avatar Preview"
                    className="mt-2 w-32 h-32 object-cover rounded"
                />
                )}
            </div>

            {/* Voice Upload */}
            <div>
                <label className="block font-semibold mb-1">Voice Sample (Audio)</label>
                <input
                name="character_voice_url"
                type="file"
                accept="audio/*"
                onChange={handleVoiceFileChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:border file:rounded file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {voicePreview && 
                <audio
                  src={voicePreview}
                  className="mt-2 w-32 h-32 object-cover rounded">
                </audio>
                }
            </div>
        </div>


        {/* Remaining Text Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold mb-1">Language</label>
            <select name="language" id="language" value={language} onChange={(e) => setLanguage(e.target.value)} className="w-full border rounded px-3 py-2">
              <option value="">Select Language</option>
              <option value="1">en</option>
              <option value="2">hi</option>
            </select>
          </div>
          <div>
            <label className="block font-semibold mb-1">Default Temperature</label>
            <input
              type="number"
              step="0.01"
              name="default_temperature"
              value={defaultTemperature}
              onChange={(e) => setDefaultTemperature(e.target.valueAsNumber)}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Gender</label>
            <select name="gender" id="gender" value={gender} onChange={(e) => setGender(e.target.value)} className="w-full border rounded px-3 py-2">
              <option value="">Select Gender</option>
              <option value="1">Male</option>
              <option value="2">Female</option>
            </select>
          </div>

        </div>

        <div>
          <label className="block font-semibold mb-1 capitalize">Chat Context</label>
          <textarea
            name="chat_context"
            value={chatContext}
            onChange={(e) => setChatContext(e.target.value)}
            rows={2}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1 capitalize">Relationship Style</label>
          <textarea
            name="relationship_style"
            value={relationshipStyle}
            onChange={(e) => setRelationshipStyle(e.target.value)}
            rows={2}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1 capitalize">Catchphrases</label>
          <textarea
            name="catchphrases"
            value={catchphrases}
            onChange={(e) => setCatchphrases(e.target.value)}
            rows={2}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1 capitalize">Occupation</label>
          <textarea
            name="occupations"
            value={occupations}
            onChange={(e) => setOccupations(e.target.value)}
            rows={2}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1 capitalize">Appearance</label>
          <textarea
            name="appearance"
            value={appearance}
            onChange={(e) => setAppearance(e.target.value)}
            rows={2}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1 capitalize">Personality Traits</label>
          <textarea
            name="personality_traits"
            value={personalityTraits}
            onChange={(e) => setPersonalityTraits(e.target.value)}
            rows={2}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1 capitalize">Speaking Style</label>
          <textarea
            name="speaking_style"
            value={speakingStyle}
            onChange={(e) => setSpeakingStyle(e.target.value)}
            rows={2}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1 capitalize">Behavioral Traits</label>
          <textarea
            name="behavioral_traits"
            value={behavioralTraits}
            onChange={(e) => setBehavioralTraits(e.target.value)}
            rows={2}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1 capitalize">World Info</label>
          <textarea
            name="world_info"
            value={worldInfo}
            onChange={(e) => setWorldInfo(e.target.value)}
            rows={2}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1 capitalize">Author Notes</label>
          <textarea
            name="author_notes"
            value={authorNotes}
            onChange={(e) => setAuthorNotes(e.target.value)}
            rows={2}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
        >
          Submit Character
        </button>
      </form>
    </div>
    );
}