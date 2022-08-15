import React, { useContext, useState } from "react";
import styled from "styled-components";
import { MdAccountCircle } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { UserContext } from "../UserContext";

const Login = ({handleChangeView}) => {

    const { actions } = useContext(
        UserContext
    );

    let navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("")

    const login = async () => {
        
        const body = JSON.stringify({
            email,
            password
        })

        const result = await fetch("api/user/login", {
            method: "POST",
            body,
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
        const result_json = await result.json();
        if(result_json.status == 200) {
            actions.logIn(result_json.data)
            // Return the home page after logged in.
            navigate("/")
        } else {
            toast.warn("E-mail and password do not match.");
        }

    }

    return <>
            <MiniLogo size={100}/>
            <StyledInput className="in" placeholder="E-mail" type="email" value={email} onChange={e => setEmail(e.target.value)} />
            <StyledInput className="in" placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
            <LoginButton className="cbtn" onClick={login}>
                Sign in
            </LoginButton>
            <Divider/>
            <SignupButton className="cbtn" onClick={handleChangeView} >
                Create an account
            </SignupButton>
        </>
}

const MiniLogo = styled(MdAccountCircle)`
    margin: 40px;
`

const StyledInput = styled.input`
  margin: 5px;
`

const LoginButton = styled.button`
    width: 60%;
    height: 35px;
    margin-top: 10px;
`
const Divider = styled.div`
    margin-top: 20px;
    margin-bottom: 20px;
    width: 60%;
    border-bottom: 1px solid lightgray; 
`
const SignupButton = styled.button`
    width: 60%;
    height: 35px;
    background-color: var(--color-success) !important;
    margin-bottom: 40px;
`

export default Login;
