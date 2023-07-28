import "./App.css";
import { useEffect, useState } from "react";
import React from "react";
import { format } from "date-fns";

function App() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [datetime, setDatetime] = useState("");
  const [description, setDescription] = useState("");
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    getTransactions().then(setTransactions);
  }, []);

  async function getTransactions() {
    // const url = "http://localhost:3500/api/transactions";
    const url = `${process.env.REACT_APP_API_URL}/transactions`;
    const response = await fetch(url);
    const data = await response.json();
    const sortedTransaction = data.sort((a, b) =>
      a.datetime > b.datetime ? -1 : a.datetime < b.datetime ? 1 : 0
    );
    return sortedTransaction;
  }

  function addNewTransaction(e) {
    e.preventDefault();
    const url = `${process.env.REACT_APP_API_URL}/transaction`;
    console.log(url);

    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        price,
        name,
        description,
        datetime,
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        if (json.error) {
          console.error("Server Error:", json.error);
        } else {
          console.log("Result:", json);
          setPrice("");
          setName("");
          setDatetime("");
          setDescription("");
          // setTransactions([...transactions, json]);
          const unsortedTransactions = [...transactions, json];
          setTransactions(
            unsortedTransactions.sort((a, b) =>
              a.datetime > b.datetime ? -1 : a.datetime < b.datetime ? 1 : 0
            )
          );
        }
      })
      .catch((error) => {
        console.error("Fetch Error:", error);
      });
  }

  let balance = 0;
  for (const transaction of transactions) {
    balance = balance + transaction.price;
  }

  // create cents
  balance = balance.toFixed(2);
  const fraction = balance.split(".")[1];
  // get the whole currency (exclude cents)
  balance = balance.split(".")[0];
  // Add commas for thousands separator
  balance = parseInt(balance).toLocaleString();

  return (
    <main>
      <h1>
        {balance < 0 ? `-RM ${Math.abs(balance)}` : `RM ${balance}`}
        <span>{fraction}</span>
      </h1>
      <form onSubmit={addNewTransaction}>
        <div className="basics">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={"Enter the item"}
            required
          />
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder={"Price (RM)"}
            required
          />
          <input
            value={datetime}
            onChange={(e) => setDatetime(e.target.value)}
            type="date"
            required
          />
        </div>
        <div className="description">
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={"Enter the description"}
            required
          />
        </div>
        <button type="submit">Add New Transactions</button>
      </form>
      <div className="transactions">
        {transactions.length > 0 &&
          transactions.map((transaction) => (
            <div className="transaction">
              <div className="left">
                <div className="name">{transaction.name}</div>
                <div className="description">{transaction.description}</div>
              </div>
              <div className="right">
                <div
                  className={
                    "price " + (transaction.price < 0 ? "red" : "green")
                  }
                >
                  {transaction.price}
                </div>
                <div className="datetime">
                  {format(new Date(transaction.datetime), "dd-MM-yyyy")}
                </div>
              </div>
            </div>
          ))}
      </div>
    </main>
  );
}

export default App;
