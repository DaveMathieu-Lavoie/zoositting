import { createContext, useReducer, useEffect } from "react";

export const UserContext = createContext(null);

const LOG_IN = "LOG_IN";
const LOG_OUT = "LOG_OUT";

const initialState = {
    isLoggedIn: false,
    firstName: "",
    lastName: "",
    address: "",
    email: "",
    phonenumber: "",
    experience:0,
    petOwned: []
};

const reducer = (state, action) => {
    console.warn("ACTION RECEIVED", action)
    switch (action.type) {
        case LOG_IN:
          return {
            isLoggedIn: true,
            _id: action._id,
            firstName: action.firstName,
            lastName: action.lastName,
            address: action.address,
            email: action.email,
            phonenumber: action.phonenumber,
            experience: action.experience,
            petOwned: action.petOwned
          };
        case LOG_OUT: 
          return initialState;
        default:
            console.error("RECEIVED AN UNDEFINED ACTION")

    }
}

export const UserProvider = ({ children }) => {

    const [state, dispatch] = useReducer(reducer, initialState);
    
    // This useEffect is used when we want to be automatically log in as a user.
    // Make sure to update the user with an existing user that exists!!!

    // useEffect(()=> {
    //   const user = {"_id":"f0575319-e8d7-487c-8ae2-e38dfdbf9eae","firstName":"Matilda","lastName":"Heidenreich","address":"871 Bogan Crescent","email":"Matilda.Hammes@hotmail.com","phonenumber":"514-518-634","experience":2,"password":"$2b$10$WoGEIE69fCfa0Zr42ingh.lHpQdj97ORaKUpoQ4sM6js7EJDSE8Fm","image":5,"petOwned":["f2354928-3b29-4faf-8759-71dcb72642ac"]}
    //   logIn(user)
    // }, [])

    const logIn = (data) => {
        dispatch({
            type:LOG_IN,
            ...data
        })
    }

    const logOut = () => {
        dispatch({
            type:LOG_OUT,
        })
    }

    return (
      <UserContext.Provider
        value={{
            state,
            actions: {
                logIn,
                logOut
            }
        }}
      >
        {children}
      </UserContext.Provider>
    );
  };