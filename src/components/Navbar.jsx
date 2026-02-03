import { Link } from "react-router-dom";
import SubT from "../layout/SubT";
import { FaBell, FaHouse, FaMessage, FaUser } from "react-icons/fa6";
import { useTheme } from "../context/Theme";
import Text from "../layout/Text";
import { useEffect, useState } from "react";
import { FaSun } from "react-icons/fa";
import { useNotify } from "../context/notify";


const Navbar = () => {
  const [dropMenu, setDropMenu] = useState(false);

  const { theme, setTheme } = useTheme();
  const {chatNoti, viewerNoti} = useNotify(); 

  useEffect(() => {
    localStorage.setItem("theme", theme);
    theme && setDropMenu(false);
  }, [theme]);

  const popMenu = () => {
    return dropMenu ? setDropMenu(false) : setDropMenu(true);
  };

 const [scrollY, setScrollY] = useState(0); 

  // 🔥 SCROLL LISTENER
  useEffect(() => {
    const handleScroll = () => {
      dropMenu&&setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [dropMenu]);

  // 🔥 TIMEOUT BASED ON SCROLL
  useEffect(() => {
    setDropMenu(false); 
  }, [scrollY]);


  const loacalTheme = localStorage.getItem("theme");

  // os theme detection
  const getOSTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
  useEffect(() => {
    if (loacalTheme) {
      setTheme(loacalTheme);
      return;
    }

    if (theme === "ui-light") {
      if (getOSTheme === "dark") {
        setTheme("ui-dark");
      } else {
        setTheme("ui-light");
      }
    }
  }, []);

  const DropDown = () => {
    return (
      <nav className=" shadow-white shadow-sm absolute bg-gradient-to-l from-green-900 via-indigo-900 to-rose-900 z-40 right-1.5 top-12 p-1 rounded-lg">
        <span className="flex gap-1">
        <Text>
          <p
            className="hover:cursor-pointer text-center bg-gradient-to-bl from-pink-400 p-1 rounded-lg"
            onClick={() => setTheme("ui-light")}
          >
            light
          </p>
        </Text>
        <Text>
          <p
            className="hover:cursor-pointer text-center bg-gradient-to-bl from-black p-1 rounded-lg"
            onClick={() => setTheme("ui-dark")}
          >
            dark
          </p>
        </Text>
        <Text>
          <p
            className="hover:cursor-pointer text-center bg-gradient-to-bl from-gray-400 p-1 rounded-lg"
            onClick={() => setTheme("ui-gray")}
          >
            gray
          </p>
        </Text>
        <Text>
          <p
            className="hover:cursor-pointer text-center bg-gradient-to-bl from-green-500 p-1 rounded-lg"
            onClick={() => setTheme("ui-green")}
          >
            green
          </p>
        </Text>
        </span>
      </nav>
    );
  };



  return (
    <div className="flex justify-center gap-10 mb-20" >
      <div className="fixed z-40 ">
        <div className="flex justify-center ">
          <nav className="shadow-white shadow-sm flex gap-3 bg-gradient-to-l from-indigo-500 via-purple-500 to-pink-500 p-2 m-2 rounded-lg">
            <Link to="/">
              {/* Feed */}
              <SubT>
                <FaHouse />
              </SubT>
            </Link>
            
            <Link to="/chatlist">
              {/* Chats */}
             {chatNoti && <span className="bg-red-600 rounded-full left-14 top-3 absolute w-3 h-3 " />}
                
              <SubT>
                <FaMessage />
              </SubT>
            </Link>

            <Link to="/viewers">
              {/* Viewers */}
              {viewerNoti?.hasNew && <span className="bg-red-600 rounded-full left-[88px] top-3 absolute w-3 h-3 " />}
              <SubT>
                <FaBell />
              </SubT>
            </Link>
            
            

            {dropMenu ? <DropDown /> : null}
          </nav>
          <nav className=" flex gap-2 shadow-white shadow-sm z-40 bg-gradient-to-l from-indigo-500 via-purple-500 to-pink-500 p-2 m-2 rounded-lg">
            <Link to="/me">
              {/* My Profile */}
              <SubT>
                <FaUser />
              </SubT>
            </Link>
         
              <span onClick={popMenu} className="hover:cursor-pointer ">
              <SubT>
                <FaSun className="hover:animate-spin " />
              </SubT>
            </span>
              
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
