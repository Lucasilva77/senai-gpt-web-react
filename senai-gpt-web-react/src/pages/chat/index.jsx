
import "./chat.css";
import logo from "../../assets/imgs/Chat.png";
import example from "../../assets/imgs/example.svg";
import chatIcon from "../../assets/imgs/chat.svg";
import sendIcon from "../../assets/imgs/send.svg";
import micIcon from "../../assets/imgs/mic.svg";
import imageIcon from "../../assets/imgs/img.svg";
import { useEffect, useState } from "react";

function Chat() {

    const [chats, setChats] = useState([]);
    const [chatSelecionado, setChatSelecionado] = useState(null);
    const [userMessage, setUserMessage] = useState("");

    const [isLeftpanelOpen, setIsLeftpanelOpen] = useState(false);

    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        // Executada toda vez que a tela abre.
        getChats();

        let modoEscuro = localStorage.getItem("darkMode");
        if (modoEscuro === "true") {
            setDarkMode(true);
            document.body.classList.add("dark-mode");
        }
    }, []);


    const getChats = async () => {
        let response = await fetch("https://senai-gpt-api.azurewebsites.net/chats", {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("meuToken")
            }
        });

        if (response.ok) {
            let json = await response.json(); // Pegue as informações dos chats.
            setChats(json);
        } else if (response.status === 401) {
            alert("Token inválido. Faça login novamente.");
            localStorage.clear();
            window.location.href = "/login";
        }
    }

    const onLogOutClick = () => {
        localStorage.clear();
        window.location.href = "/login";
    }

    const clickChat = (chat) => {
        setChatSelecionado(chat);
        setIsLeftpanelOpen(false)
    }

    const chatGPT = async (message) => {
        const endpoint = "https://ai-testenpl826117277026.openai.azure.com/";
        const apiKey = "DCYQGY3kPmZXr0lh7xeCSEOQ5oiy1aMlN1GeEQd5G5cXjuLWorWOJQQJ99BCACYeBjFXJ3w3AAAAACOGol8N";
        const deploymentId = "gpt-4";
        const apiVersion = "2024-05-01-preview";
        const url = `${endpoint}/openai/deployments/${deploymentId}/chat/completions?api-version=${apiVersion}`;

        const data = {
            messages: [{ role: "user", content: message }],
            max_tokens: 50
        };

        const headers = {
            "Content-Type": "application/json",
            "api-key": apiKey
        };

        const response = await fetch(url, {
            method: "POST",
            headers,
            body: JSON.stringify(data)
        });

        if (response.ok) {
            const result = await response.json();
            return result.choices[0].message.content;
        }
    }

    const enviarMensagem = async (message) => {
        // Se não houver chat selecionado, cria um novo chat antes de enviar a mensagem
        let chatAtual = { ...chatSelecionado };

        if (!chatSelecionado) {
            chatAtual = await novoChat();
        }

        let userId = localStorage.getItem("meuId");

        let novaMensagemUsuario = {
            userId: crypto.randomUUID(),
            text: message,
            id: userId
        };

        // Atualiza cópia do chat selecionado
        let novoChatSelecionado = { ...chatAtual };
        novoChatSelecionado.messages.push(novaMensagemUsuario);
        setChatSelecionado(novoChatSelecionado);

        // Envia ao ChatGPT e recebe resposta
        let resposta = await chatGPT(message);

        let novaRespostaChatGPT = {
            userId: "chatbot",
            text: resposta,
            id: crypto.randomUUID()
        };

        novoChatSelecionado.messages.push(novaRespostaChatGPT);
        setChatSelecionado({ ...novoChatSelecionado });

        // Salva o chat atualizado no back-end
        let response = await fetch(
            `https://senai-gpt-api.azurewebsites.net/chats/${chatAtual.id}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("meuToken")
                },
                body: JSON.stringify(novoChatSelecionado)
            }
        );

        if (response.ok) {
            console.log("Chat atualizado com sucesso.");
        } else {
            console.log("Erro ao atualizar o chat.");
        }

        setUserMessage("");
        await getChats();
    }

    const novoChat = async () => {
        let nomeChat = prompt("Digite o nome do novo chat:");
        if (!nomeChat) {
            alert("Nome inválido.");
            return;
        }


setIsLeftpanelOpen(false)

        let userId = localStorage.getItem("meuId");
        let novoChatObj = {
            id: crypto.randomUUID(),
            chatTitle: nomeChat,
            messages: [],
            userId
        };

        setChatSelecionado(novoChatObj);
        setUserMessage("");

        let response = await fetch("https://senai-gpt-api.azurewebsites.net/chats", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("meuToken")
            },
            body: JSON.stringify(novoChatObj)
        });

        if (response.ok) {
            await getChats();
            return novoChatObj;
        } else {
            console.log("Erro ao criar o chat.");
        }
    }

    const toggleDarkMode = () => {

        setDarkMode(!darkMode); //inverter o valor do dark mode

        if (darkMode == true) {

            document.body.classList.remove("dark-mode");
        } else {

            document.body.classList.add("dark-mode");
        }

        localStorage.setItem("dark-mode", !darkMode);

    }

    return (
        <>
            <div className="container">
                <button

                    className="btn-toggle-panel"
                >
                    ☰

                </button>
                <header className={`left-panel ${isLeftpanelOpen == true}`} >
                    <div className="top">
                        <button className="btn-new-chat" onClick={() => novoChat()}>+ New chat</button>
                        {chats.map(chat => (
                            <button key={chat.id} className="btn-chat" onClick={() => clickChat(chat)}>
                                <img src={chatIcon} alt="ícone de chat." />
                                {chat.chatTitle}
                            </button>
                        ))}
                    </div>
                    <div className="bottom">
                        <button className="btn-chat">Clear conversations</button>
                        <button className="btn-chat">Light mode</button>
                        <button className="btn-chat">My account</button>
                        <button className="btn-chat">Updates & FAQ</button>
                        <button className="btn-chat" onClick={onLogOutClick}>Log out</button>
                    </div>
                </header>
                <main className="central-panel">
                    {chatSelecionado == null ? (
                        <>
                            <div className="chat-logo">
                                <img src={logo} alt="Logo do SenaiGPT." />
                            </div>
                            <div className="dicas-container">
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className="dicas-item">
                                        <h2>
                                            <img src={example} alt="Example icon." />
                                            Examples
                                        </h2>
                                        <p>Explique como um computador quântico funciona.</p>
                                        <p>Explique como um computador quântico funciona.</p>
                                        <p>Explique como um computador quântico funciona.</p>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="chat-container">
                                <div className="chat-header">
                                    <h2>{chatSelecionado.chatTitle}</h2>
                                </div>
                                <div className="chat-messages">
                                    {chatSelecionado.messages.map(message => (
                                        <p key={message.id} className={`message-item ${message.userId === "chatbot" ? "chatbot" : ""}`}>{message.text}</p>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                    <div className="input-container-1">
                        <img src={micIcon} alt="Microphone." />
                        <img src={imageIcon} alt="Image." />
                        <input
                            value={userMessage}
                            onChange={event => setUserMessage(event.target.value)}
                            placeholder="Type a message."
                            type="text"
                        />
                        <img onClick={() => enviarMensagem(userMessage)} src={sendIcon} alt="Send." />
                    </div>
                </main>
            </div>
        </>
    );
}

export default Chat;
