import { createContext, useContext, useEffect, useState, } from "react";
import casteList from "../utils/Caste";


 export const CasteContext = createContext();

export const CasteProvider = ({ children }) => {
  const [caste, setCaste] = useState([]);
  const [resCaste, setResCaste] = useState('');
  const [searchCaste, setSearchCaste] = useState('');


     // handling Search
    useEffect( () => {
        // const searchCaste = e.target.value.toLowerCase().trim();
       
          const updatedSearchResults = casteList.filter(c => (c).toLowerCase().includes(searchCaste));

        searchCaste === '' ? setCaste([]) : setCaste(updatedSearchResults);
       searchCaste?setResCaste(''):setResCaste(resCaste);
       
    },[searchCaste]);

  return (
    <CasteContext.Provider value={{ caste, setCaste, resCaste, setResCaste, searchCaste, setSearchCaste }}>
      {children}
    </CasteContext.Provider>
  );
};

export const useCaste = () => {
  const context = useContext(CasteContext);
//   if (!context) {
//     throw new Error("useTheme must be used within ThemeProvider");
//   }
  return context;
};