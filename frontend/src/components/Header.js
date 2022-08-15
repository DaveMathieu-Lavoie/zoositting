import React, { useContext } from 'react';
import styled, { keyframes } from "styled-components";
import { UserContext } from './UserContext';
import { IoIosHeart } from "react-icons/io"
import { Link } from 'react-router-dom';

const Header = ( { show, handleClick } ) => {

  const style = show ? " visible" : ""

  const { state } = useContext(
    UserContext
  );

  return (
    <StyledHeader>
      <Hamburger className={style} onClick={handleClick}>&#9776;</Hamburger>
        <ApplicationName >Zoositting <Link to="/"><StyledHeart /></Link></ApplicationName>
      {state.isLoggedIn 
        ? <Greeting className={style}>{`Hello ${state.firstName}!`}</Greeting> 
        : <div></div>
      }
    </StyledHeader>
  );

}


const rotate = keyframes`
  0% {
    transform: scale(1.0);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1.0);
  }

`
const StyledHeart = styled(IoIosHeart)`
  color: red;
  animation: ${rotate} 2s ease-out  infinite;
`

const StyledHeader = styled.header`
    background-color: var(--color-white);
    color: var(--color-off);
    border-bottom: 1px solid var(--color-green-flu);
    box-shadow:0px 3px 5px rgba(176, 184, 158, 0.49);

`

const Hamburger = styled.a`
    font-size: 36px;
    top: 8px;
    margin-left: 10px;
    transition: margin-left ease 250ms;
    position: absolute;
    &.visible{
      margin-left:260px;
    }
`
const ApplicationName = styled.h1`
    transition: color 250ms ease;
    color: var(--color-black);
    padding:0.3em;
    &.visible {
      color: var(--color-white);
    }
  }
`
const Greeting = styled.div`
  font-size: 20px;
  align-self: center;
  margin-right: 12px;
  transition: color 250ms ease;
  font-family: var(--font-body);
  &.visible {
    color: var(--color-white);
  }
  position: absolute;
  top: 15px;
  right: 0px;

`
export default Header;