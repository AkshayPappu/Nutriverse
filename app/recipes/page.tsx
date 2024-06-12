'use client';

import React, { useState } from 'react';
import { FileText, Edit, Trash2 } from 'lucide-react';

export default function Recipes() {
    const [recipes, setRecipes] = useState<Array<{ name: string, dateAdded: string, description: string }>>([
        { name: 'Chicken Biryani', dateAdded: '2024-05-21', description: 'A delicious chicken and rice dish.' },
        { name: 'Vegetable Stir Fry', dateAdded: '2024-05-22', description: 'A healthy mix of vegetables stir-fried.' },
        { name: 'Spaghetti Carbonara', dateAdded: '2024-05-23', description: 'A classic Italian pasta dish.' }
    ]);
    const [showModal, setShowModal] = useState(false);
    const [newRecipe, setNewRecipe] = useState({ name: '', description: '', dateAdded: '' });

    const handleAddRecipe = () => {
        setRecipes([...recipes, newRecipe]);
        setShowModal(false);
    };

    return (
        <div className="recipes w-full h-screen flex flex-col p-5 overflow-hidden">
            <div className="header p-3 flex-shrink-0">
                <h1 className="text-3xl font-medium text-gray-800">My Recipes</h1>
            </div>
            <div className="content flex flex-col justify-between flex-grow mt-5 space-y-5 overflow-auto">
                <div className="recipe-list bg-white bg-opacity-50 rounded-lg p-5 flex-grow overflow-y-auto">
                    <table className="w-full border-collapse text-center">
                        <thead>
                            <tr>
                                <th className="border-b p-2 text-gray-600">Name</th>
                                <th className="border-b p-2 text-gray-600">Date Added</th>
                                <th className="border-b p-2 text-gray-600">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recipes.map((recipe, index) => (
                                <tr key={index}>
                                    <td className="border-b p-2 text-gray-700">{recipe.name}</td>
                                    <td className="border-b p-2 text-gray-700">{recipe.dateAdded}</td>
                                    <td className="border-b p-2">
                                        <div className="flex justify-center space-x-2">
                                            <button className="bg-gradient-to-tr from-green-300 to-green-200 text-green-800 font-medium rounded-lg text-sm px-2 py-1 flex items-center">
                                                <FileText className="mr-2" />
                                            </button>
                                            <button className="bg-gray-300 text-gray-800 font-medium rounded-lg text-sm px-2 py-1 flex items-center">
                                                <Edit className="mr-2" />
                                            </button>
                                            <button className="bg-red-300 text-red-800 font-medium rounded-lg text-sm px-2 py-1 flex items-center">
                                                <Trash2 className="mr-2" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="mt-5 text-center">
                        <button
                            type="button"
                            className="bg-gradient-to-tr from-green-300 to-green-200 text-green-800 font-medium rounded-lg text-sm px-5 py-2.5"
                            onClick={() => setShowModal(true)}
                        >
                            Add Recipe
                        </button>
                    </div>
                </div>
            </div>

            {showModal && (
                <div className="modal fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
                    <div className="bg-white rounded-lg p-5">
                        <h2 className="text-2xl font-semibold mb-4">Add New Recipe</h2>
                        <form onSubmit={(e) => { e.preventDefault(); handleAddRecipe(); }}>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                                    Name
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    value={newRecipe.name}
                                    onChange={(e) => setNewRecipe({ ...newRecipe, name: e.target.value })}
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                                    Description
                                </label>
                                <textarea
                                    id="description"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    value={newRecipe.description}
                                    onChange={(e) => setNewRecipe({ ...newRecipe, description: e.target.value })}
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="dateAdded">
                                    Date Added
                                </label>
                                <input
                                    id="dateAdded"
                                    type="date"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    value={newRecipe.dateAdded}
                                    onChange={(e) => setNewRecipe({ ...newRecipe, dateAdded: e.target.value })}
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <button
                                    type="submit"
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                >
                                    Add Recipe
                                </button>
                                <button
                                    type="button"
                                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                    onClick={() => setShowModal(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
