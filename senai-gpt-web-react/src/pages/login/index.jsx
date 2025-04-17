import "./login.css";

import logo from "../../assets/imgs/Chat.png";

import { useState } from "react";

function Login() {

  const [email, setEmail] = useState ();
  const [password, setPassword] = useState();

  const onLoginClick = async () => {

let response = await fetch ("https://senai-gpt-api.azurewebsites.net/login",)



  }

  return (
    <>
      <header></header>

    <main className="page-container">


        <div className="robo-image">

        </div>

        <div className="login-container">

          <img className="Logo" src={logo} alt="Logo do SenaiGPT." />

          <h1
            id="meutitulo"
            className="titulo"
          >Login</h1>



          <input className="input"value={email} onChange={Event => setEmail(Event.target.value)} type="email"placeholder="Insira o email" />
          <input className="input"value={password} onChange={Event => setPassword(Event.target.value)} type="password" placeholder="Insira sua senha" />

          <button class="btn" onClick={() => onLoginClick()}>Entrar</button>




        </div>



      </main>

      <footer></footer>

    </>
  )
}

export default Login;