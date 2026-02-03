import { useTheme } from "./context/Theme";
import AppRouter from "./AppRouter";
import bg from "./assets/bg.jpg";

function App() {
  const { theme } = useTheme();
  
  

  return (
    <div>
      <img
        className={` ${theme} fixed -z-30 h-screen w-screen`}
        src={bg}
        alt="bg"
      />
      <AppRouter />
    </div>
  );
}

export default App;
