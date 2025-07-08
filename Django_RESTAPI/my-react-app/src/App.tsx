import {useEffect, useState} from 'react';
import './App.css';

type Category = {
    id: number;
    name: string;
};

function App() {
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        fetch('http://localhost:4097/api/categories')
            .then(res => res.json())
            .then(data => {
                console.log("GET DATA SERVER", data);
                setCategories(data);
            });
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 py-10 px-4">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-10">Категорії товарів</h1>

                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                    {categories.map((cat) => (
                        <div
                            key={cat.id}
                            className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6 text-center border border-gray-200"
                        >
                            <div className="text-xl font-semibold text-gray-800">{cat.name}</div>
                        </div>
                    ))}
                </div>

                {categories.length === 0 && (
                    <div className="mt-10 text-center text-gray-500">Немає доступних категорій</div>
                )}
            </div>
        </div>


    );
}

export default App;
