import React, { useEffect, useState, useContext} from "react";
import styled from "styled-components";
import AnimalFeed from "./AnimalFeed";
import { UserContext } from "./UserContext";

const Profile = () => {
    
    const [animals, setAnimals] = useState([])

    const { state } = useContext(
        UserContext
    );

    useEffect(() => {
        // Do not fetch the animal on a profile we are not logged in. 
        if (!state.isLoggedIn) return;
        fetchAllAnimals()
    }, [state])

    const fetchAllAnimals =  async () => {
        // TODO: STRETCH: Loading
        const api_response = await  fetch(`/api/animal?owner=${state._id}&limit=100`)
        const api_response_json = await api_response.json();
        const _animals = api_response_json.data;

        shuffleArray(_animals)
        setAnimals(_animals)
    }

    const shuffleArray = (arr) => {
        arr.sort(() => Math.random() - 0.5);
    }

    const addAnimalContainer = {
        _id: "createAnimal"
    }

    return <Wrapper>
        <StyledHeader>My animals</StyledHeader>
        <AnimalFeedWrapper>
            {animals.map(a => <AnimalFeed key={a._id} animal={a}/>)}
            <AnimalFeed animal={addAnimalContainer}/>
        </AnimalFeedWrapper>
    </Wrapper>

}

const Wrapper = styled.div`
    margin-top: 20px;
    display: flex;
    flex-direction: column;
`
const AnimalFeedWrapper = styled.div`
    display:flex;
    flex-wrap: wrap;
    flex-direction: row;
`

const StyledHeader = styled.h3`
    color: black;
    font-family: var(--font-body);
    margin-top: 20px;
    margin-bottom: 15px;
`

export default Profile;