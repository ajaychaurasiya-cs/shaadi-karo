

const Card = ({children}) => {   
     
    return ( 
        <div className={` bg-gradient-to-tr from-[rgba(225,0,255,0.71)]  to-[rgba(0,17,255,0.1)] p-2 m-2 shadow-2xl  rounded-lg shadow-black backdrop-blur-md backdrop-contrast-50  backdrop-saturate-200 `}>
        {children}
        </div>
     );
}
 
export default Card;