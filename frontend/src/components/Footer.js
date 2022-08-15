import React from 'react';
import styled from "styled-components";

const Footer = ( ) => {


  return (
    <StyledFooter>
      <Name>ZOOSITTING</Name>
      <Copyright>© All rights reserved 2022</Copyright>
    </StyledFooter>
  );

}


const StyledFooter = styled.header`
    background-color: var(--color-offwhite);
    color: var(--color-off);
    border-bottom: 1px solid var(--color-green-flu);
    box-shadow:0px 3px 5px rgba(176, 184, 158, 0.49);
    display: flex;
    flex-direction: column;
    align-items: center;

`

const Name = styled.div`
  margin-top: 30px;
  margin-bottom: 10px;
`
const Copyright = styled.div`
  margin-bottom: 30px;
`

export default Footer;