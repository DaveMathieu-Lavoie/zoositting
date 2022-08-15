import React from 'react';
import styled from "styled-components";
import { useContext } from 'react';
import { UserContext } from './UserContext';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Menu = ({  show, hideMenu }) => {

    let navigate = useNavigate();

    const { state, actions } = useContext(
        UserContext
    );
    
    const handleClick = (context) => {
        if (context == "Home") {
            navigate("/")
        } else if (context == "Sign In") {
            navigate("/login");
        } else if (context == "Sign Up"){
            navigate('/signup')
        } else if (context == "How It Works") {
            navigate("/how")
        } else if (context == "About") {
            navigate("/about")
        } else if (context == "Dog") {
            navigate("/dog")
        } else if (context == "Cat") {
            navigate("/cat")
        } else if (context == "My Animals") {
            navigate("/profile/animal")
        } else if (context == "Profile") {
            navigate("profile")
        } else if (context == "Sign Out") {
            actions.logOut();
            toast.info("Logged out.")
            navigate("/")
        }
        hideMenu()
    }

    const visible = show ? " visible" : ""
    let menuList = [];
    if (state.isLoggedIn) {
        menuList = ["Home", "About", "How It Works", "Dog", "Cat", "Profile", "Sign Out"]
    } else {
        menuList = ["Home", "About", "How It Works", "Sign In", "Sign Up"]
    }

    const renderMenu = menuList.map((menuElement, index) => {
        // TODO: Put a visual feedback if element is active or not
        return (<MenuElement
            key={index}
            onClick={() => handleClick(menuElement)}
        >
            {menuElement}
        </MenuElement>)
    })

    return (
        <MenuWrapper className={visible}>
            <MenuList >
                {renderMenu}
            </MenuList>
            <ToastContainer
                position="bottom-left"
                hideProgressBar={true}
            />
        </MenuWrapper>
    )

}
const MenuElement = styled.a`
    &.active{
        color: var(--color-active);
    }
    cursor: pointer;
    margin-top:20px;
    margin-left:20px;
    font-size:24px;
    color: black;
    text-decoration: none;
    font-family: var(--font-body);
    &:hover{
        color:var(--color-active);
    }
`
const MenuWrapper = styled.aside`
    &.visible{
        left: 0;
    }

    background-color: var(--color-white);
    width: 250px;
    height: 100vh;
    position: absolute;
    z-index: 2;
    transition: left ease 250ms;
    top:0;
    left: -250px;
`

const MenuList = styled.div`
    padding:30px;
    display:flex;
    flex-direction: column;
`



export default Menu;