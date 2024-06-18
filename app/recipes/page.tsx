'use client';

import { useSession } from "next-auth/react";
import React, { useState, useEffect } from 'react';
import { FileText, Edit, Trash2 } from 'lucide-react';
import FullSidebar from "../components/FullSidebar";
import { ClipLoader } from "react-spinners";
import AddRecipeModal from '../components/AddRecipeModal';
import EditRecipeModal from "../components/EditRecipeModal";
import dotenv from 'dotenv';

dotenv.config();

type Recipe = {
    name: string;
    date: string;
    file: string;
};

export default function Recipes() {
    const { data: session, status } = useSession();
    const [recipes, setRecipes] = useState<Array<Recipe>>([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [currentRecipe, setCurrentRecipe] = useState<Recipe | null>(null);

    useEffect(() => {
        if (status === "unauthenticated") {
            window.location.href = "/login";
        }
    }, [session, status]);

    //gets recipes from backend
    useEffect(() =>{
        console.log(`session: ${session}`)
        if (!session) return;
        console.log("making request for recipes")
        const fetchRecipes = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/recipes/${session.user.id}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: session.user.email,
                    }),
                })
                console.log(`response: ${response}`)
    
                if (response.status === 200) {
                    const response_json = await response.json();
                    console.log(`recipes: ${JSON.stringify(response_json)}`);
                    const recipes = response_json.recipes;
                    if (recipes) {
                        setRecipes(recipes);
                    }
                    
                }
                else {
                    throw new Error("Failed to fetch recipes");
                }
            } catch (error) {
                console.error(error);
            }
        }

        fetchRecipes();
    }, [session])

    const handleAddRecipe = (newRecipe: Recipe) => {
        setRecipes([...recipes, newRecipe]);
    };

    const handleEditRecipe = (updatedRecipe: Recipe) => {
        setRecipes(recipes.map(recipe => recipe.name === updatedRecipe.name ? updatedRecipe : recipe));
    };

    const handleEditClick = (recipe: Recipe) => {
        setCurrentRecipe(recipe);
        setIsEditModalOpen(true);
    };

    if (status === "loading" || status === "unauthenticated") {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-green-50">
                <ClipLoader />
            </div>
        );
    }

    return (
        <>
            <FullSidebar />
            <div className="recipes w-full h-screen flex flex-col justify-center p-5 overflow-hidden">
                <div className="header p-3 flex-shrink-0">
                    <h1 className="text-3xl font-medium text-gray-800">My Recipes</h1>
                </div>
                <hr className="border-t-1 border-black w-full" />
                <div className="content flex flex-col items-center justify-between flex-grow mt-5 space-y-5 overflow-auto w-full">
    <div className="recipe-list bg-white bg-opacity-50 rounded-lg p-5 flex-grow overflow-y-auto w-full">
        <div className="table-container w-full">
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
                            <td className="border-b p-2 text-gray-700">{recipe.date}</td>
                            <td className="border-b p-2">
                                <div className="flex justify-center space-x-2">
                                    <button className="bg-gradient-to-tr from-green-300 to-green-200 text-green-800 hover:from-green-400 hover:to-green-300 font-medium rounded-lg text-sm px-2 py-1 flex items-center">
                                        <FileText />
                                    </button>
                                    <button 
                                        className="bg-purple-200 hover:bg-purple-300 text-gray-800 font-medium rounded-lg text-sm px-2 py-1 flex items-center"
                                        onClick={() => handleEditClick(recipe)}
                                    >
                                        <Edit />
                                    </button>
                                    <button className="bg-red-300 hover:bg-red-400 text-red-800 font-medium rounded-lg text-sm px-2 py-1 flex items-center">
                                        <Trash2 />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        <div className="mt-5 flex justify-center w-full">
            <button
                type="button"
                onClick={() => setIsAddModalOpen(true)}
                className="bg-gradient-to-tr from-green-300 to-green-200 hover:from-green-400 hover:to-green-300 text-green-800 font-medium rounded-lg text-sm px-5 py-2.5"
            >
                Add Recipe
            </button>
        </div>
    </div>
</div>

            </div>
            <AddRecipeModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onAddRecipe={handleAddRecipe}
            />
            {currentRecipe && (
                <EditRecipeModal
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    onEditRecipe={handleEditRecipe}
                    recipe={currentRecipe}
                />
            )}
        </>
    );
}
