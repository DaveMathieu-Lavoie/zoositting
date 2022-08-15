import React  from "react";
import styled from "styled-components";
import { BsSearch } from "react-icons/bs"
import { BiHappyBeaming } from "react-icons/bi"
import { GiTakeMyMoney } from "react-icons/gi"

const How = ({ }) => {
    return <Wrapper>
        <Step>Step 1.</Step>
        <Text><BsSearch size={40}/>Find a pet</Text>
        <Step>Step 2.</Step>
        <Text><BiHappyBeaming size={50}/>Take care and have fun with an animal</Text>
        <Step>Step 3.</Step>
        <Text><GiTakeMyMoney size={50}/>Be rewarded by earning money</Text>
    </Wrapper>
}

const Text = styled.div`
    display: flex;
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

export default How;