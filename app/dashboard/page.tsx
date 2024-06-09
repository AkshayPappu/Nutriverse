import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import map from "../assets/map_ex.png";
import { FileText, Trash2 } from 'lucide-react';

export default async function dashboard() {
    // const session = await getServerSession(authOptions);
    // if (!session) {
    //     redirect("/login");
    // }

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
                            <img src={map.src} className="w-full lg:w-1/2 h-auto lg:max-h-full lg:mr-5 mb-5 lg:mb-0" />
                            <table className="border-collapse text-center w-full lg:w-1/2">
                                <thead>
                                    <tr>
                                        <th className="border-b p-2 text-gray-600">Store Name</th>
                                        <th className="border-b p-2 text-gray-600">Address</th>
                                        <th className="border-b p-2 text-gray-600">Distance</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="border-b p-2 text-gray-700">Kroger</td>
                                        <td className="border-b p-2 text-gray-700">123 Main St, Springfield</td>
                                        <td className="border-b p-2 text-gray-700">1.2 miles</td>
                                    </tr>
                                    <tr>
                                        <td className="border-b p-2 text-gray-700">Whole Foods</td>
                                        <td className="border-b p-2 text-gray-700">456 Elm St, Springfield</td>
                                        <td className="border-b p-2 text-gray-700">0.8 miles</td>
                                    </tr>
                                    <tr>
                                        <td className="border-b p-2 text-gray-700">Publix</td>
                                        <td className="border-b p-2 text-gray-700">789 Oak St, Springfield</td>
                                        <td className="border-b p-2 text-gray-700">2.3 miles</td>
                                    </tr>
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
                                <tr>
                                    <td className="border-b p-2 text-gray-700">Recipe 1</td>
                                    <td className="border-b p-2"><button className=""><FileText className="text-gray-700" /></button></td>
                                    <td className="border-b p-2 text-gray-700">2024-06-01</td>
                                    <td className="border-b p-2"><button className=""><Trash2 /></button></td>
                                </tr>
                                <tr>
                                    <td className="border-b p-2 text-gray-700">Recipe 2</td>
                                    <td className="border-b p-2"><button className=""><FileText className="text-gray-700" /></button></td>
                                    <td className="border-b p-2 text-gray-700">2024-06-02</td>
                                    <td className="border-b p-2"><button className=""><Trash2 /></button></td>
                                </tr>
                                <tr>
                                    <td className="border-b p-2 text-gray-700">Recipe 3</td>
                                    <td className="border-b p-2"><button className=""><FileText className="text-gray-700" /></button></td>
                                    <td className="border-b p-2 text-gray-700">2024-06-03</td>
                                    <td className="border-b p-2"><button className=""><Trash2 /></button></td>
                                </tr>
                            </tbody>
                        </table>
                        <div className="mt-5 text-center">
                            <button
                                type="button"
                                className="bg-gradient-to-tr from-green-300 to-green-200 text-green-800 font-medium rounded-lg text-sm px-5 py-2.5"
                            >
                                Add Recipe
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
