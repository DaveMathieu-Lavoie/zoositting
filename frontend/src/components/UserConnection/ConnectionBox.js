import React, { useContext, useState, useEffect } from "react";
import styled from "styled-components";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from "./Login";
import Signup from "./Signup";
import { UserContext } from "../UserContext";
import { useNavigate } from "react-router-dom";


const ConnectionBox = ({type}) => {

    // State that decide if we show the Sign Up or Sign in page
    const [activeView, setActiveView] = useState("SIGNIN")

    const { state } = useContext(
        UserContext
    );
    
    useEffect(()=> {
        setActiveView(type)
    }, [type])

    let navigate = useNavigate();

    if(state.isLoggedIn) {
        navigate("/")
    }

    return <Wrapper>
        <Box>
            {activeView == "SIGNIN" 
            ? <Login
                handleChangeView = {() => setActiveView("SIGNUP")}
                /> 
            : <Signup
                handleChangeView = {() => setActiveView("SIGNIN")}
                />
            }
        </Box>
        <ToastContainer
            position="bottom-left"
            hideProgressBar={true}
        />
    </Wrapper>
}

const Wrapper = styled.div`
    color: black;
    display: flex;
`

const Box = styled.div`
    margin-top: 40px;
    border: 1px solid lightgrey;
    background-color: var(--color-white);
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 400px;
`

export default ConnectionBox;
