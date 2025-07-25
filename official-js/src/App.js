import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './Components/Navbar/Navbar';
import Main from './Components/header/main';
import LogInpage from './Components/LogInPage/Loginpage';
import Signup from './Components/SignUp/SignUp';
import { CardContext, CardProvider } from './Components/Context/AuthContext';
import SearchProducts from './Components/SearchProduct/SearchProducts';
import Cardshow from './Components/Card/Cards';
import Dashboardcard from './Components/Dashboard/DashboardCardDesign';
import MainDashboard from './Components/Dashboard/mainDashBoard';
import Cartdetails from './Components/CartSection/cartDetails';
import Cartdesign from './Components/CartSection/Cartdesign';

function App() {
  return (
    <>
    <CardProvider>
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Main/>}/>
      <Route path='Navbar' element={ <Navbar/>}/>
      <Route path='/Login' element={<LogInpage/> }/>
      <Route path='/signup' element={ <Signup/>} />
      <Route path='/search' element={ <SearchProducts/>} />
      <Route path='/card' element={ <Cardshow/>} />
      <Route path='/Dashcard' element={ <Dashboardcard/>} />
      <Route path='/Dashboard' element={ <MainDashboard/>} />
      <Route path='/cartsection' element={ <Cartdetails/>} />
      <Route path='/cardshow' element={ <Cartdesign/>} />
    </Routes>

    </BrowserRouter>
    </CardProvider>
    </>
    
  );
}

export default App;
