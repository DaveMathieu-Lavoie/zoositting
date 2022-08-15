import React, { useEffect, useState, useContext} from "react";
import styled from "styled-components";
import { UserContext } from "./UserContext";
import CONSTANT from "../constants";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const AnimalForm = () => {
    
    const [animal, setAnimal] = useState({});
    let navigate = useNavigate();
    const { state } = useContext(
        UserContext
    );

    const handleChange = (e, type) => {
        
        const currentAnimal =  { ...animal }
        if (type == "name") {
            currentAnimal.name = e.target.value
        } else if (type == "breed") {
            currentAnimal.breed = e.target.value
        } else if (type == "type") {
            currentAnimal.type = e.target.value
        } else if (type == "age"){
            if (e.target.value <= 0) return;
            currentAnimal.age = e.target.value
        } else if (type == "size"){
            currentAnimal.size = e.target.value
        } else if (type == "traits"){
            
            if(currentAnimal.traits == null) {
                currentAnimal.traits = [];
            }

            // Handles when checking or unchecking the boxes
            if (currentAnimal.traits.includes(e.target.value)) {
                currentAnimal.traits = currentAnimal.traits.filter(_t => _t != e.target.value  )
            } else {
                currentAnimal.traits.push(e.target.value)
            }

        } else if (type == "coat_length"){
            if (e.target.value < 0) e.target.value = 0;
            currentAnimal.coatLength = e.target.value
        } else if (type == "health"){
            if (e.target.value == "Vaccinated") e.target.value = "vaccinated";
            if (e.target.value == "Need special care with food") e.target.value = "food_care"

            if (currentAnimal.health == null ) currentAnimal.health = {vaccinated:  false, food_care: false};
            currentAnimal.health[e.target.value] = !currentAnimal.health[e.target.value]
        } else if (type == "description"){
            currentAnimal.description = e.target.value
        }
        
        setAnimal(currentAnimal)
    } 

    const renderAnimalType = () => {
        let possibleValue = ["dog", "cat"]
        possibleValue = possibleValue.map((t) => {
            //  Pascal case the value for the frontend
            let pretty = t.charAt(0).toUpperCase() + t.slice(1).toLocaleLowerCase();
            return {value: t, pretty};

        })
        return possibleValue.map(t => <Type key={t.value}>
            <LabelItem key={t}>
            <StyledRadioInput  type="radio" name="type" value={t.value} onChange={(e) => handleChange(e, "type")} />
                {t.pretty}
            </LabelItem>
        </Type>
        )
    }

    const renderAllTraits = () => {
        let possibleTraitsArray = Object.keys(CONSTANT.TRAITS);
        possibleTraitsArray = possibleTraitsArray.map((t) => {
            //  Pascal case the value for the frontend
            
            let pretty = t.charAt(0).toUpperCase() + t.slice(1).toLocaleLowerCase();
            return {value: t, pretty};

        })
        return possibleTraitsArray.map((t,i) => <LabelItem key={i}>
            <StyledRadioInput type="checkbox" name="Traits" value={t.value} onChange={(e) => handleChange(e, "traits")} />
            {t.pretty}
        </LabelItem>
        )
    }

    const renderAllHealthOptions = () => {
        const possibleHealthValue = ["Vaccinated", "Need special care with food"]
        return possibleHealthValue.map(t => <LabelItem key={t}>
            <StyledRadioInput type="checkbox" name="Health" value={t} onChange={(e) => handleChange(e, "health")} />
            {t}
        </LabelItem>
        )
    }

    const handleSave = async () => {
        const _animal = { ...animal }
        _animal.owner = state._id

        let image = "";
        // TODO: STRETCH: Instead of randomizing a picture for the animal, we could ask them to provide it.
        if (_animal.type == "cat") {
            const answer = await fetch('https://api.thecatapi.com/v1/images/search')
            const answer_json = await answer.json();
            image = answer_json[0].url; 
        } else if (_animal.type == "dog") {
            const answer = await fetch('https://dog.ceo/api/breeds/image/random')
            const answer_json = await answer.json();
            image = answer_json.message;
        } else {
            // illegal type
        }
        
        _animal.image = image;
        if(_animal.image == null || _animal.image == ""){
            // this should never happen since we fetch a random image
            toast.warn("Could not fetch a picture of the animal. Contact the developer.")
            return;
        }
        if(_animal.name == null) {
            toast.warn("Please input the name of your animal")
            return;
        } else if (_animal.breed == null) {
            toast.warn("Please input the breed of your animal")
            return;
        } else if (_animal.type == null) {
            toast.warn("Please select dog or cat")
            return;
        } else if (_animal.age == null) {
            toast.warn("Please input the age of your animal")
            return;
        } else if (_animal.size == null) {
            toast.warn("Please input the size of your animal")
            return;
        } else if (_animal.traits == null) {
            _animal.traits = [];
        } else if (_animal.coatLength == null) {
            toast.warn("Please input the coat length of your animal")
            return;
        } else if (_animal.health == null) {
            _animal.health = {
                vaccinated: false,
                food_care: false
            }
        } else if (_animal.description == null) {
            _animal.description = ""
        } else if (_animal.owner == null) {
            toast.warn("Something wrong happened, try again")
            return;
        }
        
        
        try {
            const result = await fetch(`/api/animal`, {
                method: "POST",
                body: JSON.stringify(_animal),
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                }
            })
            const result_json = await result.json();
            if(result_json.status == 201) {
                // Sucess
                toast.success("Animal created. Returning you to your profile...")
                setTimeout( () => {
                    navigate("/profile")
                } , 2000)
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
        <Label>Provide your animal's informations</Label>
        <StyledInput className="in" type="text" placeholder="Name" value={animal.name} onChange={(e) => handleChange(e, "name")} />
        <StyledInput className="in" type="text" placeholder="Breed" value={animal.breed} onChange={(e) => handleChange(e, "breed")} />
        <StyledInput className="in" type="number" placeholder="Age" value={animal.age} onChange={(e) => handleChange(e, "age")}/>
        <Label>Animal</Label>
        {renderAnimalType()}
        <Label>Size</Label>
        <Group>
        <LabelItem>
            <StyledRadioInput type="radio"  name="Size" value="S" checked={animal.size == "S"} onChange={(e) => handleChange(e, "size")} />
            Small
        </LabelItem> 
        <LabelItem>
            <StyledRadioInput type="radio"  name="Size" value="M" checked={animal.size == "M"} onChange={(e) => handleChange(e, "size")}/>
            Medium
        </LabelItem>
        <LabelItem>
            <StyledRadioInput type="radio"  name="Size" value="L" checked={animal.size == "L"} onChange={(e) => handleChange(e, "size")}/>
            Large
        </LabelItem>
        </Group>
        <Label>Traits</Label>
        <Group>
            {renderAllTraits()}
        </Group>
        <Label>Coat Length</Label>
        <Group>
        <LabelItem>
            <StyledRadioInput type="radio"  name="coatLength" value="S" checked={animal.coatLength == "S"} onChange={(e) => handleChange(e, "coat_length")} />
            Short
        </LabelItem> 
        <LabelItem>
            <StyledRadioInput type="radio"  name="coatLength" value="L" checked={animal.coatLength == "L"} onChange={(e) => handleChange(e, "coat_length")}/>
            Long
        </LabelItem>
        </Group>

        <Label>Health</Label>
        <Group>
            {renderAllHealthOptions()}
        </Group>
        <Label>Description</Label>
        <Textarea type="textarea" name="Description"  onChange={(e) => handleChange(e, "description")}/>
        <StyledButton className="cbtn" onClick={handleSave} >Save</StyledButton>
        <ToastContainer
            position="bottom-left"
            hideProgressBar={true}
        />
    </Wrapper>

}

const StyledButton = styled.button`
    margin-top: 20px;
    width: 200px;
    height: 40px;
`

const Textarea = styled.textarea`
    height: 200px;
`

const Wrapper = styled.div`
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    margin-left: 20px;

`
const Label = styled.label`
    color: var(--color-black);
    font-family: var(--font-body);
    margin-top: 40px;
    text-align: left;
    font-weight: bold;
`

const LabelItem = styled.label`
    color: var(--color-black);
    font-family: var(--font-body);
    margin-top: 10px;
    margin-right: 30px;
    display: flex;
    align-items: center;

`
const StyledRadioInput = styled.input`
    width: 40px;
    height: 40px;
    margin-right: 15px;
    margin-left:20px;
`
const Type = styled.div`
    margin-top: 20px;
`
const StyledInput = styled.input`   
    font-size: 24px;
    margin-top: 20px;
    width: 100%;

`
const Group = styled.div`
    display: flex;
    justify-content: space-between; 
    flex-wrap: wrap;
    justify-content: flex-start; 

`
export default AnimalForm;