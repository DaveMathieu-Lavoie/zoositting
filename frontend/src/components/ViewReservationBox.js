import React from 'react';
import styled from "styled-components";
import moment from 'moment';

const ViewReservationBox = ( {reservations, mine, handleRequest} ) => {

    return <Wrapper>
        <Label>Reservations</Label>
        {reservations.map( (r,i) => {
            const start = moment(r.start).format("Do MMM")
            const end = moment(r.end).format("Do MMM")
            return <ReservationWrapper key={i}>
                <Info>{`${r.days} days @ ${r.price}$ per days`}</Info>
                <Info>{`${start} - ${end}`}</Info>
                <Price>{`You will earn ${r.total}$`}</Price>
                <Info>{mine 
                    ? r.available 
                        ? "Still waiting for a animal sitter" 
                        : "Someone will contact you shortly"
                    : <StyledButton className='cbtn' onClick={ () => handleRequest(r)}>Reserve</StyledButton>
                }
                </Info>
            </ReservationWrapper>
        })}
    </Wrapper>

}

const Wrapper = styled.div`
    margin-bottom: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
`

const Label = styled.div`
    font-size: 20px;
    margin-top: 6px;
    color: var(--color-black);
    text-transform: UPPERCASE;
`

const Info = styled.div`
    color: var(--color-text);
`

const Price = styled(Info)`
    color: green;
    font-weight: bold;
    
`
const StyledButton = styled.button`
    height: 35px;
    padding-right: 15px;
    padding-left: 15px;
    background-color: var(--color-success) !important;
`

const ReservationWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items:center;
    margin: 10px;
` 
export default ViewReservationBox;
