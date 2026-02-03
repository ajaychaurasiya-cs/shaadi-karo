import { useCaste } from "../context/CasteContext";

const CasteList = () => {
  const { caste, setResCaste, setSearchCaste} =
    useCaste();
  return (
    <span className=" bg-opacity-70 rounded-lg absolute top-0 bg-pink-100 px-5 backdrop-blur-xl w-full h-44 overflow-scroll no-scrollbar ">
      {caste.slice(0, 10).map((c, i) => {
        return (
          <option
            className="m-1 px-2 bg-white bg-opacity-50 "
            key={i}
            onClick={(e) => {
              setResCaste(e.target.value)
              ,setSearchCaste("")
            }}
            value={c}
          >
            {c}
          </option>
        );
      })}
      {/* <input type="text" value={searchCaste || resCaste} onChange={(e)=> setSearchCaste(e.target.value)} /> */}
    </span>
  );
};
export default CasteList;
