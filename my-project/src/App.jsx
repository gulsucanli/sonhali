'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Papa from 'papaparse';

const CsvData = () => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeButton, setActiveButton] = useState(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [searchClicked, setSearchClicked] = useState(false);
  const searchRef = useRef();

  useEffect(() => {
    const updateScrollPosition = () => {
      setScrollPosition(window.pageYOffset || document.documentElement.scrollTop);
    }
    window.addEventListener('scroll', updateScrollPosition);
    return () => window.removeEventListener('scroll', updateScrollPosition);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/datason2605.csv');
        const csvData = await response.text();
        const parsedData = Papa.parse(csvData, {
          header: true,
          delimiter: ";",
        });
        setData(parsedData.data);
      } catch (error) {
        console.error("Une erreur s'est produite lors de la récupération des données :", error);
        setError(error);
      }
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  const filteredData = useMemo(() => {
    if (!Array.isArray(data)) {
      console.error("Invalid data: data should be an array");
      return [];
    }
  
    let filtered = data.filter((val) => {
      if (typeof val !== 'object' || val === null) {
        console.error("Invalid item in data: item should be an object", val);
        return false;
      }
  
      if (!val.Fransızca || !val.Türkçe) {
        console.error("Invalid item in data: item should have both Fransızca and Türkçe properties", val);
        return false;
      }
  
      if (searchTerm === "") {
        return val.Fransızca; // Boşsa hariç tut
      } else {
        const lowerSearchTerm = searchTerm.toLowerCase();
        return (
          val.Fransızca &&
          val.Fransızca.toLowerCase().startsWith(lowerSearchTerm)
        );
      }
    }).sort((a, b) => a.Fransızca.localeCompare(b.Fransızca));
  
    // Remove duplicates based on both French and Turkish words
    const keyFunc = item => item['Fransızca'].toLowerCase() + ";" + item['Türkçe'].toLowerCase();
    const seen = new Set();
    filtered = filtered.filter(item => {
      const key = keyFunc(item);
      if (seen.has(key)) {
        return false;
      } else {
        seen.add(key);
        return true;
      }
    });
  
    return filtered;
  }, [data, searchTerm]);

  const handleButtonClick = (letter) => {
    setActiveButton(letter);
    setSearchTerm(letter);
  }

  const resetSearch = () => {
    setActiveButton(null);
    setSearchTerm("");
  }

  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchClicked(false);
      }
    }

    // Escape key handler
    function handleEscapeKey(event) {
      if (event.key === 'Escape') {
        setSearchClicked(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen text-center antialiased">
         <header className="bg-gray-900 text-white py-6 px-6">
      <div className="container mx-auto flex items-center justify-between mb-1">
        <div className={`flex items-center me-7 transition-all duration-700 ${searchClicked ? 'hidden' : 'flex'} sm:flex`}>
          <h1 className="text-3xl font-normal me-2 antialiased tracking-widest bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-violet-500">Sociologie Glossaire</h1>
        </div>
        <div className={`relative w-full max-w-md transition-all duration-500 ${searchClicked ? 'sm:w-full' : ''}`}>
          <input
            ref={searchRef}
            className={`bg-gray-800 text-white px-4 py-3 rounded-md pr-10 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent w-full ${
              searchTerm && filteredData.length > 0 ? "ring-green-500" : searchTerm && filteredData.length === 0 ? "ring-rose-500 " : ""
            }`}
            placeholder="Cherchez les mots..."
            type="text"
            onClick={() => setSearchClicked(true)}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
          <i className="fas fa-search absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        </div>
      </div>
    </header>


      <div className="flex flex-wrap justify-center gap-2 mt-5">
        {Array.from({ length: 26 }, (_, i) => String.fromCharCode('A'.charCodeAt(0) + i)).map((letter) => (
          <button
            key={letter}
            className={`px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${activeButton === letter ? "ring-2 ring-green-500 bg-green-100" : ""}`}
            onClick={() => handleButtonClick(letter)}
          >
            {letter}
          </button>
        ))}
        <button
          className="px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ml-2"
          onClick={resetSearch}
        >
Tout Afficher
        </button>
      </div>
      
      <div className="container mx-auto grid gap-8 sm:grid-cols-2 lg:grid-cols-4 mt-5">
        {isLoading ? (
          <p className="text-center mt-5 mb-5 ms-3 me-4">Le chargement...</p>
        ) : error ? (
          <p className="text-center mt-5 mb-5 ms-3 me-4">Une erreur s'est produite : {error.message}</p>
        ) : filteredData.length > 0 ? (
          filteredData.map((val, key) => (
            <div key={key} className="bg-white shadow-md rounded-lg p-6 flex flex-col justify-between ring-1 ring-gray-100">
              <div className="">
                <h2 className="text-xl font-bold mb-2">{val.Fransızca ? val.Fransızca.split(' ').map(capitalizeFirstLetter).join(' ') : ""}</h2>
                <p className="text-gray-600 text-lg">{val.Türkçe ? val.Türkçe.split(' ').map(capitalizeFirstLetter).join(' ') : ""}</p>              </div>
            </div>
          ))
        ) : (
          <div className="bg-white shadow-md rounded-lg p-6">
            <p className="text-center">Aucun résultat n'a été trouvé !</p>
          </div>
        )}
      </div>
      {scrollPosition > 100 && (
  <button
    className="fixed bottom-20 right-4 bg-gradient-to-r from-purple-500 to-red-500 text-white p-2 rounded-full shadow-md hover:shadow-lg transform hover:scale-110 transition-all duration-200 ease-in-out"
    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
  >
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6 mx-auto">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
    </svg>
  </button>
)}
      <p className="text-center mt-5 mb-5">{filteredData.length} résultats trouvés !</p>
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