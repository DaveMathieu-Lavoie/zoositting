import React, { useContext, useState } from 'react';
import styled from "styled-components";
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css';
import moment from 'moment';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';

const ReservationBox = ( {animal, refresh} ) => {

    const [dateRange, setDateRange] = useState(new Date());
    const [price, setPrice] = useState("");

    const computeReservation = () => {
        // Only show the price when we have a date range and price given
        if (dateRange.length == 2) {
            const first = moment(dateRange[1])
            const second = moment(dateRange[0])
            const days = first.diff(second, 'days') + 1;
            return {price, days, total: price*days};
        } 
        return {price:0, days:0, total:0}
    }

    const renderPrice = () => {
        if (dateRange.length != 2) {
            return <Info>{`Please input two dates in the calender`}</Info>
        }
        if (price == 0) {
            return <Info>{`Please provide your price`}</Info>
        }
        return <Info>{`You will pay ${computeReservation().total}$ with this reservation of ${computeReservation().days} days.`}</Info>
    }

    const handleSubmit = async() => {
        const _animal = { ...animal };
        const reservation = {
            start: moment(dateRange[0]).toString(),
            end: moment(dateRange[1]).toString(),
            available: true,
            ...computeReservation()
        }
        _animal.reservations.push(reservation);

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
                // Sucess
                toast.success("Reservation created.")
                // Refresh the states
                setDateRange(new Date())
                setPrice("")
                refresh();
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

    return <>
        <Spacer20>
            <Label>Add Reservation</Label>
        </Spacer20>
        <Spacer10>
            <Calendar onChange={setDateRange} value={dateRange} selectRange />
        </Spacer10>
        <StyledInput className="in" value={price} onChange={e => setPrice(e.target.value)} placeholder="Price per day" />
        {renderPrice()}
        <SignupButton onClick={handleSubmit} className={`cbtn ${computeReservation().total == 0 ? "disabled ": ""}`} disabled={computeReservation().total ==0}>
            Submit
        </SignupButton>
        
    </>

}


const Spacer20 = styled.div`
    margin-top: 20px;
`
const Spacer10 = styled.div`
    margin-top: 10px;
`

const Label = styled.div`
    font-size: 20px;
    margin-top: 6px;
    color: var(--color-black);
    text-transform: UPPERCASE;
`
const StyledInput = styled.input`
    margin-top: 20px;  
`
const Info = styled.div`
    margin-left: 15px;
    margin-bottom: 15px;
    margin-top: 20px;
    color: var(--color-text);
`
const SignupButton = styled.button`
    width: 60%;
    height: 35px;
    background-color: var(--color-success) !important; 
    margin-bottom: 40px;
    transition: all 0.2s ease-in;
    &.disabled {
        filter: grayscale(0.9);
    }
`
export default ReservationBox;
