'use client';

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
//import { getServerSession } from "next-auth";
//import { redirect } from "next/navigation";
import { FileText, Trash2 } from 'lucide-react';
import dynamic from 'next/dynamic';
import React, { useState } from 'react';

const MapComponent = dynamic(() => import('../components/MapComponent'), { ssr: false });

export default function Dashboard() {
    const [supermarkets, setSupermarkets] = useState<Array<{ name: string, lat: number, lon: number, address: string, distance: number }>>([]);
    const [recipes, setRecipes] = useState<Array<{ name: string, dateAdded: string, description: string }>>([]);
    const [showModal, setShowModal] = useState(false);
    const [newRecipe, setNewRecipe] = useState({ name: '', description: '', dateAdded: '' });

    const handleAddRecipe = () => {
        setRecipes([...recipes, newRecipe]);
        setShowModal(false);
    };

    return (
        <div className="dashboard w-full h-screen flex flex-col p-5 overflow-hidden">
            <div className="header p-3 flex-shrink-0">
                <h1 className="text-3xl font-medium text-gray-800">Dashboard</h1>
            </div>
            <div className="content flex flex-col lg:flex-row justify-between flex-grow mt-5 space-y-5 lg:space-y-0 lg:space-x-5 overflow-auto">
                <div className="left-content flex flex-col w-full lg:w-3/5 space-y-5">
                    <div className="cook-now bg-white bg-opacity-50 rounded-lg p-5 flex-grow">
                        <h1 className="text-5xl font-semibold text-gray-800">Nutriverse: Fueling Your Journey to Health.</h1>
                        <h3 className="text-lg font-medium text-gray-600 mt-5">Cooking made easier with fresh & customized meal preparation just for you</h3>
                        <div className="nutribot-button text-center mt-5">
                            <button
                                type="button"
                                className="bg-gradient-to-tr from-green-300 to-green-200 text-green-800 font-medium rounded-lg text-sm px-5 py-2.5 w-full"
                            >
                                Try NutriBot
                            </button>
                        </div>
                    </div>
                    <div className="map bg-white bg-opacity-50 rounded-lg p-5 flex-grow">
                        <h3 className="text-2xl font-semibold text-gray-800">Supermarkets Near You</h3>
                        <div className="flex flex-col lg:flex-row mt-10">
                            <div className="w-full lg:w-1/2 h-auto lg:max-h-full lg:mr-5 mb-5 lg:mb-0">
                                <MapComponent setSupermarkets={setSupermarkets} supermarkets={supermarkets} />
                            </div>
                            <table className="border-collapse text-center w-full lg:w-1/2">
                                <thead>
                                    <tr>
                                        <th className="border-b p-2 text-gray-600">Store Name</th>
                                        <th className="border-b p-2 text-gray-600">Address</th>
                                        <th className="border-b p-2 text-gray-600">Distance (km)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {supermarkets.slice(0, 3).map((supermarket, index) => (
                                        <tr key={index}>
                                            <td className="border-b p-2 text-gray-700">{supermarket.name}</td>
                                            <td className="border-b p-2 text-gray-700">{supermarket.address}</td>
                                            <td className="border-b p-2 text-gray-700">{supermarket.distance.toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div className="right-content flex flex-col w-full lg:w-2/5 space-y-5">
                    <div className="my-recipes bg-white bg-opacity-50 rounded-lg p-5 flex-grow overflow-y-auto">
                        <h3 className="text-2xl font-semibold mb-5 text-gray-800">My Recipes</h3>
                        <table className="w-full border-collapse text-center">
                            <thead>
                                <tr>
                                    <th className="border-b p-2 text-gray-600">Name</th>
                                    <th className="border-b p-2 text-gray-600">PDF</th>
                                    <th className="border-b p-2 text-gray-600">Date Added</th>
                                    <th className="border-b p-2 text-gray-600">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recipes.map((recipe, index) => (
                                    <tr key={index}>
                                        <td className="border-b p-2 text-gray-700">{recipe.name}</td>
                                        <td className="border-b p-2"><button className=""><FileText className="text-gray-700" /></button></td>
                                        <td className="border-b p-2 text-gray-700">{recipe.dateAdded}</td>
                                        <td className="border-b p-2"><button className=""><Trash2 /></button></td>
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
