'use client';

import { log } from 'console';
import { useState, ChangeEvent, FormEvent } from 'react';

export default function AddCharacter() {
  const [formData, setFormData] = useState({
    character_name: '',
    age: '',
    language: '',
    default_temperature: 0.8,
    chat_context: '',
    gender: '',
    relationship_style: '',
    catchphrases: '',
    occupations: '',
    appearance: '',
    personality_traits: '',
    speaking_style: '',
    behavioral_traits: '',
    likes_control: false,
    world_info: '',
    author_notes: '',
  });

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [voiceSampleFile, setVoiceSampleFile] = useState<File | null>(null);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleVoiceChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVoiceSampleFile(file);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const payload = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      payload.append(key, value as any);
    });

    if (avatarFile) payload.append('avatar_url', avatarFile);
    if (voiceSampleFile) payload.append('voice_sample', voiceSampleFile);

    try {
        const response = await fetch("http://localhost:8000/add-character/", {
            method: "POST",
            body: payload,
        });
        
        if (response.ok) {
            const data = await response.json();
            console.log("character saved", data);
            alert("Character created successfully");
        }
        else {
            console.log("Error submitting character");
        }
    } catch (err) {
        console.error("Submission Error", err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Add New Character</h1>
      <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
        
        {/* Character Name & Age */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold mb-1">Character Name</label>
            <input
              type="text"
              name="character_name"
              value={formData.character_name}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Age</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleInputChange}
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
                name="avatar_url"
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
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
                name="voice_sample"
                type="file"
                accept="audio/*"
                onChange={handleVoiceChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:border file:rounded file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {voiceSampleFile && (
                <p className="mt-1 text-sm text-gray-600">Uploaded: {voiceSampleFile.name}</p>
                )}
            </div>
        </div>


        {/* Remaining Text Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold mb-1">Language</label>
            <input
              type="text"
              name="language"
              value={formData.language}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Default Temperature</label>
            <input
              type="number"
              step="0.01"
              name="default_temperature"
              value={formData.default_temperature}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>
        </div>

        {/* Group Textareas */}
        {[
          'chat_context', 'gender', 'relationship_style', 'catchphrases',
          'occupations', 'appearance', 'personality_traits',
          'speaking_style', 'behavioral_traits', 'world_info', 'author_notes',
        ].map(field => (
          <div key={field}>
            <label className="block font-semibold mb-1 capitalize">
              {field.replaceAll('_', ' ')}
            </label>
            <textarea
              name={field}
              value={(formData as any)[field]}
              onChange={handleInputChange}
              rows={2}
              className="w-full border rounded px-3 py-2"
            />
          </div>
        ))}

        {/* Boolean Checkbox */}
        <div className="flex items-center">
          <input
            type="checkbox"
            name="likes_control"
            checked={formData.likes_control}
            onChange={handleInputChange}
            className="mr-2"
          />
          <label className="font-medium">Likes Control</label>
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
