import { useState, useContext } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import styled from "styled-components";
import GlobalStyles from "./GlobalStyles";
import Homefeed from './Homefeed'
import Header from "./Header";
import Menu from "./Menu";
import ConnectionBox from './UserConnection/ConnectionBox';
import Details from './Details';
import Profile from "./Profile"
import AnimalForm from "./AnimalForm"
import How from './How'
import Footer from './Footer';
import About from './About';

const App = () => {

  // In this context, menu is the navbar that appears when clicking the Hamburger Icon
  const [menu, setMenu] = useState(false);

  const showMenu = () => {
    setMenu(true)
  };

  const hideMenu = () => {
    setMenu(false)
  };

  const handleMenuClick = () => {
    menu ? hideMenu() : showMenu();
  }

  return (
    <BrowserRouter>
      <GlobalStyles />
      <Menu
        show={menu}
        hideMenu={hideMenu}
      />
      <Header
        show={menu}
        handleClick={handleMenuClick}
      />
      <Main>
        <Routes>
          <Route path="/" element={<div><Homefeed /></div>} />
          <Route path="/how" element={<div><How /></div>} />
          <Route path="/about" element={<div><About /></div>} />
          <Route path="/dog" element={<div><Homefeed type="dog" /></div>} />
          <Route path="/cat" element={<div><Homefeed type="cat" /></div>} />
          <Route path="/profile" element={<div><Profile /> </div>} />
          <Route path="/animal/createAnimal" element={<div> <AnimalForm /> </div>} />
          <Route path="/animal/:_id" element={<div> <Details /> </div>} />
          <Route path="/login" element={<div><ConnectionBox type="SIGNIN"/></div>} />
          <Route path="/signup" element={<div><ConnectionBox type="SIGNUP"/></div>} />
          <Route path="*" element={<Oops>404: Oops!</Oops>} />
        </Routes>
      </Main>
      <Footer/>
    </BrowserRouter>
  );
};

const Main = styled.div`
  background: var(--color-offwhite);
  color: white;
  display: flex;
  min-height: 100vh;
  place-content: center;
`;

const Oops = styled.div`
  color: black;
  margin-top: 20px;
`

export default App;
