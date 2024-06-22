'use client';
import React, { useState, ChangeEvent, FormEvent, DragEvent, useEffect } from 'react';
import { useSession } from 'next-auth/react';

type EditRecipeModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onEditRecipe: (updatedRecipe: Recipe) => void;
    recipe: Recipe;
};

type Recipe = {
    _id: string;
    name: string;
    date: string;
    file: string;
};

const EditRecipeModal: React.FC<EditRecipeModalProps> = ({ isOpen, onClose, onEditRecipe, recipe }) => {
    const { data: session } = useSession();
    const [recipeName, setRecipeName] = useState<string>(recipe.name);
    const [file, setFile] = useState<File | null>(null);
    const [dragActive, setDragActive] = useState<boolean>(false);

    useEffect(() => {
        if (isOpen) {
            setRecipeName(recipe.name);
            setFile(null);
        }
    }, [isOpen, recipe]);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleDrag = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0]);
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (recipeName && session) {
            try {
                const formData = new FormData();
                formData.append('name', recipeName);
                formData.append('file', file || '');
                formData.append('user_id', session.user.id);
                formData.append('_id', recipe._id);
                formData.append('date', recipe.date);

                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/recipes/update/${recipe._id}`, {
                    method: 'POST',
                    body: formData,
                });

                if (response.status === 200) {
                    const response_json = await response.json();
                    let updatedRecipe = response_json.object;
                    onEditRecipe(updatedRecipe);
                    onClose();
                }
            } catch (error) {
                console.error(error);
            }
        }
    };

    const handleRemoveFile = () => {
        setFile(null);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg p-5 shadow-lg w-96">
                <h2 className="text-2xl font-semibold mb-4">Edit Recipe</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700">Recipe Name</label>
                        <input
                            type="text"
                            value={recipeName}
                            onChange={(e) => setRecipeName(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg"
                            required
                        />
                    </div>
                    <div
                        className={`mb-4 border-2 border-dashed rounded-lg p-5 text-center cursor-pointer ${dragActive ? 'border-green-300 bg-green-50' : 'border-gray-300'}`}
                        onDragEnter={handleDrag}
                        onDragOver={handleDrag}
                        onDragLeave={handleDrag}
                        onDrop={handleDrop}
                        onClick={() => document.getElementById('fileInput')?.click()}
                    >
                        <input
                            type="file"
                            id="fileInput"
                            onChange={handleFileChange}
                            className="hidden"
                        />
                        <p className="text-gray-700">
                            {file ? file.name : 'Drag & Drop your file here or click to upload'}
                        </p>
                        {file && (
                            <button
                                type="button"
                                onClick={handleRemoveFile}
                                className="mt-2 px-4 py-2 bg-red-300 text-red-800 rounded-lg hover:bg-red-400"
                            >
                                Remove File
                            </button>
                        )}
                    </div>
                    <div className="flex justify-end space-x-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-green-300 rounded-lg hover:bg-green-400"
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditRecipeModal;