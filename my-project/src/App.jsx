import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';


const CsvData = () => {
    const [data, setData] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(false);


    useEffect(() => {
      setIsLoading(true);
      Papa.parse('/data.csv', {
          download: true,
          header: true,
          delimiter: ";",
          complete: (googleData) => {
              setData(googleData.data);
              setIsLoading(false);
          }
      });
  }, []);

    const filteredData = data.filter((val) => {
      if (searchTerm === "") {
          return val.Fransızca && val.Türkçe; // Exclude if either is empty
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
  }).sort((a, b) => a.Fransızca.localeCompare(b.Fransızca));
  
  function toTitleCase(str) {
    return str.replace(/\w\S*/g, function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

    return (
        
        <div className="flex flex-col h-screen text-center">
          
      <header className="bg-gray-900 text-white py-6 px-6">
        <div className="container mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold me-2">Turkish-French Dictionary</h1>
          <div className="relative w-full max-w-md">
            
            <input
              className="bg-gray-800 text-white px-4 py-3 rounded-md pr-10 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent w-full"
              placeholder="Search words..."
              type="text"
              onChange={(event) => {
                setIsLoading(true);
                setSearchTerm(event.target.value);
                setIsLoading(false);
            }}
            />
                        <i className="fas fa-search absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          </div>
        </div>
      </header>

      <div className='container mx-auto grid gap-8 sm:grid-cols-2 lg:grid-cols-3 mt-5'>
    {isLoading ? (
        <p className='text-center mt-5 mb-5 ms-3 me-4'>
        </p>
    ) : (
        filteredData.length > 0 ? (
            filteredData.map((val, key) => (
                <div key={key} className="bg-white shadow-md rounded-lg p-6 flex flex-col justify-between">
                    <div className="">
                    <h2 className="text-xl font-bold mb-2">{toTitleCase(val.Fransızca)}</h2>
                    <p className="text-gray-600 text-lg">{toTitleCase(val.Türkçe)}</p>


                    </div>
                </div>
                
            ))
        ) : (
          <div className='bg-white shadow-md rounded-lg p-6 flex flex-col justify-between'>
            <p className='text-center'>None Found!</p>
            </div>
        )
    )}

</div>



<p className="text-center mt-5">{filteredData.length} results found!</p>

        </div>
        

    );
};

export default CsvData;