import React, {useContext} from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { UserContext } from "./UserContext";
import { HiOutlinePlus } from "react-icons/hi"

const AnimalFeed = ({animal}) => {
    
    const { state } = useContext(
        UserContext
    );
    
    // If the user is not logged in, redirect him to the login page when clicking an animal
    const path = state.isLoggedIn ? `/animal/${animal._id}` : `/login`
    
    return <Wrapper to={path}>
        {animal._id == "createAnimal" ? <StyledIcon size={80}/> : <AnimalImg src={animal.image} />}
    </Wrapper>
}

const Wrapper = styled(Link)`
    margin: 5px;
    cursor: pointer;
`
const AnimalImg = styled.img`
    width: 250px;
    height: 250px;
    margin: 4px;
    object-fit: cover;
    border-radius: 0.2cm;
    // box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    transition: all 0.2s ease-in;
    &:hover{
        transform: scale(1.05);
    }
`

const StyledIcon = styled(HiOutlinePlus)`
width: 250px;
    height: 250px;
    margin: 4px;
    object-fit: cover;
    border-radius: 0.2cm;
    // box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    transition: all 0.2s ease-in;
    &:hover{
        transform: scale(1.05);
    }
`


export default AnimalFeed;
