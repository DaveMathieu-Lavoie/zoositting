import React, { useEffect, useState, useContext} from "react";
import styled from "styled-components";
import AnimalFeed from "./AnimalFeed";
import { UserContext } from "./UserContext";

const Homefeed = ({type, mine}) => {
    
    const [animals, setAnimals] = useState([])

    const { state } = useContext(
        UserContext
    );

    useEffect(() => {
        fetchAllAnimals()
    }, [type])

    const fetchAllAnimals =  async () => {
        // TODO: STRETCH: Loading

        // variable query decide if we render only cats/dogs or all the animals
        let query = !!type ? `/${type}` : "" 

        // variable params decide if we render only OUR animals or everything
        let params = "";
        if (mine) {
            params = `owner=${state._id}&`
        }
        const api_response = await  fetch(`/api/animal${query}?${params}limit=100`)
        const api_response_json = await api_response.json();
        const _animals = api_response_json.data;
        
        // Shuffle the array so we don't have always the same page on a refresh
        shuffleArray(_animals)
        setAnimals(_animals)
    }

    const shuffleArray = (arr) => {
        arr.sort(() => Math.random() - 0.5);
    }

    return <Wrapper>
        {animals.map(a => <AnimalFeed key={a._id} animal={a}/>)}
    </Wrapper>
}

const Wrapper = styled.div`
    margin-top: 20px;
    display: flex;
    flex-wrap: wrap;
    place-content:center ;
`

export default Homefeed;