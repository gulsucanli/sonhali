import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';


const CsvData = () => {
    const [data, setData] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        Papa.parse('/data.csv', {
            download: true,
            header: true,
            delimiter: ";",
            complete: (googleData) => {
                setData(googleData.data);
            }
        });
    }, []);

    return (
        
        <div className="flex flex-col h-screen text-center">
      <header className="bg-gray-900 text-white py-6 px-6">
        <div className="container mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold">Turkish-French Dictionary</h1>
          <div className="relative w-full max-w-md">
            <input
              className="bg-gray-800 text-white px-4 py-3 rounded-md pr-10 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent w-full"
              placeholder="Search words..."
              type="text"
              onChange={(event) => {
                setSearchTerm(event.target.value);
            }}
            />
          </div>
        </div>
      </header>

        <div className='text-center '>
                    <div className="container mx-auto flex items-center justify-between"></div>
          
           {data.filter((val) => {
    if (searchTerm === "") {
        return val;
    } else if (
        val &&
        val.Fransızca &&
        val.Türkçe &&
        (val.Fransızca.toLowerCase().includes(searchTerm.toLowerCase()) ||
        val.Türkçe.toLowerCase().includes(searchTerm.toLowerCase()))
    ) {
        return val;
    }
    return null;
}).map((val, key) => {
    return (
        <div key={key} className="">
            <p>{val.Fransızca} - {val.Türkçe}</p>
        </div>
    );
})}
        </div>

        <div className="container mx-auto grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div className="bg-white shadow-md rounded-lg p-6 flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-bold mb-2">Güneş</h2>
              <p className="text-gray-600 text-lg">Sun</p>
            </div>
            <div>
              <h2 className="text-xl font-bold mb-2">Soleil</h2>
              <p className="text-gray-600 text-lg">Sun</p>
            </div>
          </div>
          </div>
        </div>

    );
};

export default CsvData;