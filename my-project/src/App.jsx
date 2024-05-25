import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';

const CsvData = () => {
    const [data, setData] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const response = await fetch('/data4.csv');
                const csvData = await response.text();
                const parsedData = Papa.parse(csvData, {
                    header: true,
                    delimiter: ";",
                });
                setData(parsedData.data);
            } catch (error) {
                console.error("Veri alınırken bir hata oluştu:", error);
            }
            setIsLoading(false);
        };
        fetchData();
    }, []);

    const filteredData = data.filter((val) => {
        if (searchTerm === "") {
            return val.Fransızca && val.Türkçe; // Boşsa hariç tut
        } else {
            const lowerSearchTerm = searchTerm.toLowerCase();
            return (
                val &&
                val.Fransızca &&
                val.Türkçe &&
                (val.Fransızca.toLowerCase().includes(lowerSearchTerm) ||
                    val.Türkçe.toLowerCase().includes(lowerSearchTerm))
            );
        }
    }).sort((a, b) => a.Fransızca.localeCompare(b.Fransızca));

    function toTitleCase(str) {
        return str.replace(/\w\S*/g, function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    }

    return (
        <div className="flex flex-col min-h-screen text-center">
            <header className="bg-gray-900 text-white py-6 px-6">
                <div className="container mx-auto flex items-center justify-between">
                    <h1 className="text-2xl font-bold me-2">Sociologie Glossaire</h1>
                    <div className="relative w-full max-w-md">
                    <input
    className={`bg-gray-800 text-white px-4 py-3 rounded-md pr-10 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent w-full ${
        searchTerm && filteredData.length > 0 ? "ring-green-500" : searchTerm && filteredData.length === 0 ? "ring-rose-500" : ""
    }`}
    placeholder="Kelimeleri arayın..."
    type="text"
    onChange={(event) => setSearchTerm(event.target.value)}
/>


                        <i className="fas fa-search absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    </div>
                </div>
            </header>

            <div className="container mx-auto grid gap-8 sm:grid-cols-2 lg:grid-cols-3 mt-5">
                {isLoading ? (
                    <p className="text-center mt-5 mb-5 ms-3 me-4">Yükleniyor...</p>
                ) : filteredData.length > 0 ? (
                    filteredData.map((val, key) => (
                        <div key={key} className="bg-white shadow-md rounded-lg p-6 flex flex-col justify-between">
                            <div className="">
                                <h2 className="text-xl font-bold mb-2">{val.Fransızca}</h2>
                                <p className="text-gray-600 text-lg">{val.Türkçe}</p>
                                <div className="mt-4 border-t pt-4">Deyim</div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="bg-white shadow-md rounded-lg p-6 flex flex-col justify-between">
                        <p className="text-center">Hiçbir sonuç bulunamadı!</p>
                    </div>
                )}
            </div>

            <p className="text-center mt-5 mb-5">{filteredData.length} sonuç bulundu!</p>
            <footer className="bg-gray-900 text-white py-4 px-6 fixed bottom-0 min-w-full">
                <div className="container mx-auto flex items-center justify-center">
                    <p className="text-sm">
                        Gülsu <i>Canlı</i> - Sociologie Glossaire
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default CsvData;

