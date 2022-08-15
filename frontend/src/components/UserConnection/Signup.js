import React, { useContext, useState } from "react";
import styled from "styled-components";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { UserContext } from "../UserContext";

const Signup = ({handleChangeView}) => {

    const { actions } = useContext(
        UserContext
    );
    
    const [user, setUser] = useState({
        firstName: "",
        lastName: "",
        email: "", 
        address: "",
        experience: "",
        password: "",
        passwordConfirmation: "",
        phonenumber: ""
    });

    const handleChange = (e, type) => {
        const currentUser =  { ...user }
        if (type == "firstname") {
            currentUser.firstName = e.target.value
        } else if (type == "lastname") {
            currentUser.lastName = e.target.value
        } else if (type == "phonenumber"){
            currentUser.phonenumber = e.target.value
        } else if (type == "email"){
            currentUser.email = e.target.value
        } else if (type == "address"){
            currentUser.address = e.target.value
        } else if (type == "experience"){
            if (e.target.value < 0) e.target.value = 0;
            currentUser.experience = e.target.value
        } else if (type == "password"){
            currentUser.password = e.target.value
        } else if (type == "passwordConfirmation"){
            currentUser.passwordConfirmation = e.target.value
        }
        
        setUser(currentUser)
    } 

    const isEmailCorrect = (email) => {
        // Regex taken from https://grabthiscode.com/javascript/javascript-regex-email
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test( email.toLowerCase());
    };

    const isPhoneCorrect = (phone) => {
        // Regex taken from https://www.w3resource.com/javascript/form/phone-no-validation.php
        return /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(phone)
    }
    
    const randomize = (top) => {
        return Math.floor(Math.random() * top);
    }

    const create = async () => {

        if (user.firstName <= 1) {
            toast.warn("Your name has to be longer than one character.")
            return;
        }

        if (user.lastName <= 1) {
            toast.warn("Your name has to be longer than one character.")
            return;
        }

        if(!isPhoneCorrect(user.phonenumber)) {
            toast.warn("Your phone number is not valid.")
            return;
        }

        if (!isEmailCorrect(user.email)) {
            toast.warn("Your e-mail is not valid.")
            return;
        }

        if (user.address.length < 6) {
            // TODO: STRETCH: validate the address 
            toast.warn("Your address is too short.")
            return;
        }

        if (user.experience == "") {
            toast.warn("Enter your years of experience with animals.")
            return;
        }

        if (user.password.length < 8 ){
            toast.warn("The password is too short. (at least 8 characters)")
            return;
        }

        if (user.password != user.passwordConfirmation) {
            toast.warn("The passwords don't match.")
            return;
        }

        const body_user =  {...user }
        // TODO: STRETCH: Instead of randomizing a picture for the user, we could ask them to provide it.
        body_user.image = randomize(22);

        // Delete the password double so we don't send useless information to the backend
        delete body_user.passwordConfirmation;

        const body = JSON.stringify(
            {...body_user,
            petOwned: []}
        )

        try {
            const result = await fetch("api/user", {
                method: "POST",
                body,
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                }
            })
            const result_json = await result.json();
            if(result_json.status == 201) {
                actions.logIn(result_json.data)
                return;
            } else {
                if (!!result_json.message){
                    toast.warn(result_json.message);
                } else {
                    // The backend always sends back an object with the message property, this section should never happens normally. 
                    toast.warn("Something happened. Try again.")
                }
                return;
            }
        } catch (err){
            console.log(err)
        }

    }

    return <>
            <WhiteSpace/>
            <StyledInput className={"in"} placeholder="First Name" type="text" value={user.firstName} onChange={e => handleChange(e, "firstname")} />
            <StyledInput className={"in"} placeholder="Last Name" type="text" value={user.lastName} onChange={e => handleChange(e, "lastname")} />
            <StyledInput className={"in"} placeholder="Phone Number" type="text" value={user.phonenumber} onChange={e => handleChange(e, "phonenumber")} />
            <StyledInput className={"in"} placeholder="E-mail" type="email" value={user.email} onChange={e => handleChange(e, "email")} />
            <StyledInput className={"in"} placeholder="Address" type="address" value={user.address} onChange={e => handleChange(e, "address")} />
            <StyledInput className={"in"} placeholder="Years of experience with animals" type="number" value={user.experience} onChange={e => handleChange(e, "experience")} />
            <StyledInput className={"in"} placeholder="Password" type="password" value={user.password} onChange={e => handleChange(e, "password")} />
            <StyledInput className={"in"} placeholder="Password Confirmation" type="password" value={user.passwordConfirmation} onChange={e => handleChange(e, "passwordConfirmation")} />
            <LoginButton className="cbtn" onClick={create}>
                Create the account
            </LoginButton>
            <Divider/>
            <SignupButton className="cbtn" onClick={handleChangeView} >
                Sign In
            </SignupButton>
        </>
}

const WhiteSpace = styled.div`
    margin-top: 20px;
    margin-bottom: 20px;
    width: 60%;
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

export default Signup;