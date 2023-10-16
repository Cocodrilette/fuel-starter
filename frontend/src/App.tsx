import { useEffect, useState } from "react";
import "./App.css";
// Import the contract factory -- you can find the name in index.ts.
// You can also do command + space and the compiler will suggest the correct name.
import { CounterContractAbi__factory } from "./contracts";

// The address of the contract deployed the Fuel testnet
const CONTRACT_ID =
  "0x43090de3e7e9e69ddeb93817d2aa4261bcab7df71fe2e285f8249104d66b3f48";

function App() {
  const [connected, setConnected] = useState<boolean>(false);
  const [account, setAccount] = useState<string>("");
  const [counter, setCounter] = useState<number>(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      checkConnection();
      setLoaded(true);
    }, 200);
    if (connected) getCount();
  }, [connected]);

  async function connect() {
    if (window.fuel) {
      try {
        await window.fuel.connect();
        const [account] = await window.fuel.accounts();
        setAccount(account);
        setConnected(true);
      } catch (err) {
        console.log("error connecting: ", err);
      }
    }
  }

  async function checkConnection() {
    if (window.fuel) {
      const isConnected = await window.fuel.isConnected();
      if (isConnected) {
        const [account] = await window.fuel.accounts();
        setAccount(account);
        setConnected(true);
      }
    }
  }

  async function getCount() {
    if (window.fuel) {
      const wallet = await window.fuel.getWallet(account);
      const contract = CounterContractAbi__factory.connect(CONTRACT_ID, wallet);
      const { value } = await contract.functions.count().simulate();
      setCounter(value.toNumber());
    }
  }

  async function increment() {
    if (window.fuel) {
      const wallet = await window.fuel.getWallet(account);
      const contract = CounterContractAbi__factory.connect(CONTRACT_ID, wallet);
      // Creates a transactions to call the increment function
      // because it creates a TX and updates the contract state this requires the wallet to have enough coins to cover the costs and also to sign the Transaction
      try {
        await contract.functions.increment().txParams({ gasPrice: 1 }).call();
        getCount();
      } catch (err) {
        console.log("error sending transaction...", err);
      }
    }
  }

  async function decrement() {
    if (window.fuel) {
      const wallet = await window.fuel.getWallet(account);
      const contract = CounterContractAbi__factory.connect(CONTRACT_ID, wallet);

      try {
        await contract.functions.increment().txParams({ gasPrice: 1 }).call();
        getCount();
      } catch (error) {
        console.log("error sending transaction...", error);
      }
    }
  }

  if (!loaded) return null;

  return (
    <>
      <div className="App">
        {connected ? (
          <>
            <h3>Counter: {counter}</h3>
            <section id="buttons-section">
              <button style={buttonIncrementStyle} onClick={increment}>
                Increment
              </button>
              <button style={buttonDecrementStyle} onClick={increment}>
                Decrement
              </button>
            </section>
          </>
        ) : (
          <button style={buttonIncrementStyle} onClick={connect}>
            Connect
          </button>
        )}
      </div>
    </>
  );
}

export default App;

const buttonIncrementStyle = {
  borderRadius: "48px",
  marginTop: "10px",
  backgroundColor: "#03ffc8",
  fontSize: "20px",
  fontWeight: "600",
  color: "rgba(0, 0, 0, .88)",
  border: "none",
  outline: "none",
  height: "60px",
  width: "400px",
  cursor: "pointer",
};

const buttonDecrementStyle = {
  borderRadius: "48px",
  marginTop: "10px",
  backgroundColor: "rgb(255, 97, 97)",
  fontSize: "20px",
  fontWeight: "600",
  color: "rgba(0, 0, 0, .88)",
  border: "none",
  outline: "none",
  height: "60px",
  width: "400px",
  cursor: "pointer",
};
