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
        <p className='text-center mt-5 mb-5 ms-3 me-4'><svg aria-hidden="true" class="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600 text-center" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
    </svg>
        </p>
    ) : (
        filteredData.length > 0 ? (
            filteredData.map((val, key) => (
                <div key={key} className="bg-white shadow-md rounded-lg p-6 flex flex-col justify-between">
                    <div className="">
                        <h2 className="text-xl font-bold mb-2">{val.Fransızca}</h2>
                        <p className="text-gray-600 text-lg">{val.Türkçe}</p>
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




        </div>

    );
};

export default CsvData;