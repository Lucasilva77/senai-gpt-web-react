import "./chat.css";

function chat() {
    import "./chat.css"
    import "../../assets/styles/global.css"
    import { useEffect, useState } from "react";
    
    
    
    function Chat() {
    
          const [chats, setChats] = useState ([]);
    
        useEffect(() => {
            //Exeecuta toda vez que a tela abre.
          
    
            getChats();
    
    
    
    
        }, []);
    
        const getChats = async () => {
            //Arrow Function
            let response = await fetch("https://senai-gpt-api.azurewebsites.net/chats", {
                headers: {
                    "Authorization" : "Bearer " + localStorage.getItem("meuToken")
                }
    
            });
    
            console.log(response);
    
            if (response.ok == true){ 
    
                let json = await response.json(); // Pegue as informacoes dos chats.
                
                setChats(json);
    
    
                //
            } else {
    
                if (response.status == 401) {
    
                    alert("Token Invalido. Faca login novamente.");
                    window.location.href = "/login";
                }
            }
    
    
    
        }

    const OnLogoutClick = () => {

        localStorage.clear ();
        window.location.href = "/login"
    }
    return (

<> 

 <div className="container">
        
        <header className="left-panel">
    
            <div className="top">
    
                <button className="btn-new-chat">+ New chat</button>
    
                <button className="btn-chat">
                    <img src="../chat/assets/img/ChatText.svg" alt=""/>
                    AI Chat Tool Ethics
                </button>
                <button className="btn-chat">
                    <img src="assets/img/ChatText.svg" alt=""/>
                    AI Chat Tool Impact Writing
                </button>
                <button className="btn-chat">
                    <img src="assets/img/ChatText.svg" alt=""/>
                    New chat
                </button>


            </div>
    
            <div className="bottom">
    
                <button className="btn-chat">
                    <img className="chat" src="../chat/assets/img/" alt=""/>
                    Clear conversations
                </button>
                <button className="btn-chat">Light mode</button>
                <button className="btn-chat">My account</button>
                <button className="btn-chat">Updates & FAQ</button>
                <button className="btn-chat" onClick={() => OnLogOutClick ()}>Log out</button>
          
                
            </div>
    
        </header>
        
        <main className="central-panel">
    
            <div className="logo">
                <img className="chat" src="../assets/imgs/Chat.png" alt="Logo do SenaiGPT."/>
            </div>
    
            <div className="dicas-container">

                <div className="dicas-item">

                    <h2>
                       <img className="chat" src="assets/img/Chats.svg" alt=""/> 
                        Examples
                    </h2>

                    <p>"Explain quantum computing insimple terms".</p>
                    <p>"Got any creative ideas for a 10year old's birthday?".</p>
                    <p>"How do I make an HTTP requestin Javascript?".</p>

                </div>

                <div className="dicas-item">

                    <h2>
                        <img className="chat" src="../chat/assets/img/Star.svg" alt=""/>
                        Capabilities
                    </h2>

                    <p>Remembers what user saidearlier in the conversation..</p>
                    <p>Allows user to provide follow-up corrections..</p>
                    <p>Trained to decline inappropriate requests..</p>

                </div>

                <div className="dicas-item">

                    <h2>
                       <img className="Chat" src="../chat/assets/img/ShieldWarning.svg" alt=""/> 
                        Limitations
                    </h2>

                    <p>May occasionally generate incorrect information..</p>
                    <p>May occasionally produce harmful instructions or biased content..</p>
                    <p>Limited knowledge of world andevents after 2021..</p>

                </div>

            </div>

            <div className="input-container">
                <input placeholder="Type a message." type="text"/>
            </div>

        </main>

    </div>

</>


    )

}

export default chat;