import React from "react";
import styled from "styled-components";

const About = () => {
    return <Wrapper>
        <Text>Zoositting is an app where passionate pet sitters and pet owners connect with each other.</Text>
        <Step>Love is in the hair</Step>
    </Wrapper>
}

const Text = styled.div`
    display: flex;
    margin-top: 25px;
    align-items: center;
`

const Wrapper = styled.div`
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    place-content:center;
    align-items: center;
    color: black;
`
const Step = styled.h3`
    color:black;
    margin-top: 40px;
    margin-bottom: 30px;
`

export default About;