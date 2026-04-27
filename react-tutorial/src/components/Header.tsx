import logo from "../logo.svg";

export default function Header() {
    return (
      <>
      <header className="flex justify-center items-center" > 
                <img className='react-logo' src={logo} alt="logo" />
                <h1>Chef Claude</h1>
            </header>
    </>  
    )
}