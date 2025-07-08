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
        <div className="container">
            <h1>Категорії товарів</h1>
            <div className="category-grid">
                {categories.map(cat => (
                    <div key={cat.id} className="category-card">
                        <p>{cat.name}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default App;
