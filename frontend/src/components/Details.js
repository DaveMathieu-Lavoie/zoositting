import React, { useEffect, useState, useRef, useContext } from "react";
import styled from "styled-components";
import { useNavigate, useParams } from 'react-router-dom';
import CONSTANT from "../constants";
import ReservationBox from "./ReservationBox";
import ViewReservationBox from "./ViewReservationBox";
import { UserContext } from "./UserContext";
import { toast } from 'react-toastify';

const Details = ( ) => {

    const [animal, setAnimal] = useState({})
    const [owner, setOwner] = useState({})
    const [animalWidth, setAnimalWidth] = useState(0)
    const animalImgRef = useRef(null);
    const navigate = useNavigate();
    let { _id } = useParams();

    const { state } = useContext(
        UserContext
    );

    
    useEffect( () => {
        // Protect the page, if the user is not logged in, force him to the homepage
        if (!state.isLoggedIn) {
            navigate("/")
            return;
        }
        fetchSingleAnimal();
    }, [])

    useEffect(() => {
        // Fetch the width of the image to set it height with the same value, this will make make an image square dynamically.
        const setWidth = () => {
            if (animalImgRef.current != null) {
                const width = animalImgRef.current.getBoundingClientRect().width;
                if(animalWidth != width) {
                    setAnimalWidth(width)
                }
            }
        }
        setWidth();

        // Add the event listener of a resize to make setWidth dynamic to any screen resize
        window.addEventListener('resize', () => setWidth() )
        return window.removeEventListener('resize', () => setWidth())
    }, [])

    useEffect( () => {
        // If we change animals, and it has a different owner, go fetch the owner.
        if (!!animal.owner){
            fetchOwner(animal.owner)
        }
    }, [animal])


    const fetchSingleAnimal =  async () => {
        // TODO: STRETCH: Loading
        const api_response = await fetch(`/api/animal/${_id}`);
        const api_response_json = await api_response.json();
        const _animal = api_response_json.data;
        setAnimal(_animal)
    }

    const fetchOwner = async (id) => {
        // TODO: STRETCH: Loading
        const api_response = await fetch(`/api/user/${id}`);
        const api_response_json = await api_response.json();
        const _owner = api_response_json.data;
        setOwner(_owner)
    }

    const valueSize = () => {
        if (animal.size == CONSTANT.SIZE.SMALL) {
            return "Small"
        }
        if (animal.size == CONSTANT.SIZE.MEDIUM) {
            return "Medium"
        }
        if (animal.size == CONSTANT.SIZE.LARGE) {
            return "Large"
        }
    }

    const valueTraits = () => {
        if (animal.traits == null) return <></>
        return animal.traits.map( (a,i) => {
        a = a.toLowerCase();
        a = a.charAt(0).toUpperCase() + a.slice(1);
        // if last item, do not print a dot
        if(i == (animal.traits.length-1)) {
            return ` ${a}`
        }
        return ` ${a} ·`
    })}

    const valueCoatLength = () => {
        if (animal.coatLength == CONSTANT.COAT_LENGHT.SHORT) {
            return "Short"
        } 
        if (animal.coatLength == CONSTANT.COAT_LENGHT.LONG){
            return "Long"
        }
    }

    const healthSection = () => {
        if (animal.health == undefined) return;
        if (!animal.health.vaccinated && !animal.health.food_care) return <></>;
        return <>
            <Label>Health</Label>
            <Value>{animal.health.vaccinated ? "Vaccinated": "Non-Vaccinated" } {animal.health.food_care ? "· Need special care with food" : ""}</Value>
        </>
    }

    const descriptionSection = () => {
        if (animal.description == "") return <></>
        else return <> 
            <Label>Description</Label>
            <Value>{animal.description}</Value>
        </>
    }

    const handleRequest = async (r) => {
        const _animal = { ...animal }
        _animal.reservations.forEach( _r => {
            if (_r.start == r.start && _r.end == r.end ){
                _r.available = false;
                _r.sitter = state._id
            }
        })

        try {
            const result = await fetch(`/api/animal/${animal._id}`, {
                method: "PUT",
                body: JSON.stringify(_animal),
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                }
            })
            const result_json = await result.json();
            if(result_json.status == 200) {
                toast.success("Request sent.")
                fetchSingleAnimal()
                return;
            } else {
                if (!!result_json.message){
                    toast.warn(result_json.message);
                } else {
                    toast.warn("Something happened. Try again.")
                }
                return;
            }
        } catch (err){
            console.log(err)
        }

    } 


    return <Wrapper>
        <AnimalBox>
            <StyledImg ref={animalImgRef} src={animal.image} width={animalWidth}/>
            <AnimalName>{animal.name}</AnimalName>
            <AnimalInfo>
                {owner.address} · {animal.breed} · {animal.age} years
            </AnimalInfo>
            <Divider/>
            <AnimalInfo>
                <h3>About</h3>
                <Label>Size</Label>
                <Value>{valueSize()}</Value>
                <Label>Traits</Label>
                <Value>{valueTraits()}</Value>
                <Label>Coat Length</Label>
                <Value>{valueCoatLength()}</Value>
                {healthSection()}
                {descriptionSection()}
            </AnimalInfo>
        </AnimalBox>
        <Side>
        <UserBox>
            <StyledImg src={`http://localhost:3000/profile-pics/${owner.image}.jpg`} />
            <OwnerName>{owner.firstName} {owner.lastName}</OwnerName>
            <AnimalInfo>
                {owner.email}
            </AnimalInfo>
            <AnimalInfo>
                {owner.phonenumber}
            </AnimalInfo>
        </UserBox>
        <InfoBox>
            {state._id == owner._id ? <ReservationBox animal={animal}  refresh={fetchSingleAnimal} /> : <></>}
            <ViewReservationBox handleRequest={handleRequest} mine={state._id == owner._id} reservations={animal.reservations ? state._id == owner._id ? animal.reservations : animal.reservations.filter(r => r.available) : []}/>
        </InfoBox>
        </Side>
    </Wrapper>
}

const Side = styled.div`
    display: flex;
    flex-direction: column;
    width: 30%;
`
const Wrapper = styled.div`
    margin-top: 20px;
    width: 100vw;
    display: flex;
    place-content:center ;
    justify-content: center;
`
const InfoBox = styled.div`
    margin-top: 50px;
    margin-left: 30px;
    margin-right: 30px;
    height: 100%;
    display: flex;
    flex-direction: column;
    border-radius: 0.2cm;
    background-color: white;
    box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
    align-items: center;
`

const AnimalBox = styled.div`
    margin-top: 10px;
    margin-left: 30px;
    margin-right: 30px;
    width: 45%;
    display: flex;
    flex-direction: column;
    border-radius: 0.2cm;
    background-color: var(--color-white);
    box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
`

const UserBox = styled.div`
    margin-top: 10px;
    margin-left: 30px;
    margin-right: 30px;
    height: 100%;
    display: flex;
    flex-direction: column;
    border-radius: 0.2cm;
    background-color: white;
    box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
`

const StyledImg = styled.img`
    width: 100%;
    height: ${props => `${props.width}px`};
    object-fit: cover;
    border-top-left-radius: 0.2cm;
    border-top-right-radius: 0.2cm;
`
const AnimalName = styled.h2`
    color: var(--color-black);
    text-align: left;
    margin-top: 25px;
    font-family: var(--font-body);
    font-size: 42px;
    margin-left: 15px;
    margin-bottom: 10px;
`
const AnimalInfo = styled.div`
    margin-left: 15px;
    margin-bottom: 15px;
    color: var(--color-text);
    h3{
        color: var(--color-black);
        text-align: left;
        font-family: var(--font-body);
        margin-bottom: 8px;
    }

`
const Label = styled.div`
    font-size: 20px;
    margin-top: 6px;
    color: var(--color-black);
    text-transform: UPPERCASE;
`
const Value = styled.div`
    margin-top: 2px;
    margin-right: 15px;
    text-align: justify;
`

const Divider = styled.div`
    margin-top: 15px;
    margin-bottom: 15px;
    width: 100%;
    align-self: center;
    border-bottom: 1px solid lightgray; 
`

const OwnerName = styled.h2`
    color: var(--color-black);
    text-align: left;
    margin-top: 25px;
    font-family: var(--font-body);
    font-size: 32px;
    margin-left: 15px;
    margin-bottom: 10px;
`

export default Details;