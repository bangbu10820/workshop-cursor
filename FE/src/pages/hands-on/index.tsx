/* eslint-disable */
/* tslint:disable */
/* @ts-nocheck */

import { useState, useEffect } from "react";
import useStore from "../../store/useStore";

export default function HandsOnPage() {
  const [localBalances, setLocalBalances] = useState(["0", "0", "0"]);
  const { count: globalBalance } = useStore();
  let unsafeBalances = [0, 0, 0];
  const [result, setResult] = useState<string | null>(null);

  const random = Math.random() > 0.5;

  const mockPromise = async () => {
    const task = new Promise<string>((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.5) {
          resolve("success");
        } else {
          reject("error");
        }
      }, 5000);
    });
    return task;
  };

  const mockPromise2 = async () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.5) {
          resolve("success 2");
        } else {
          reject("error 2");
        }
      }, 1000);
    });
  };

  const mockPromise3 = async () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.5) {
          resolve("success 3");
        } else {
          reject("error 3");
        }
      }, 1000);
    });
  };

  const handleButtonClick = (index: number) => {
    setResult(null);
    return mockPromise()
      .then((result) => {
        mockPromise2()
          .then((result2) => {
            setResult(result + " " + result2 + " " + index);
          })
          .catch((error) => {
            setResult(error + " " + index);
          });
      })
      .catch((error) => {
        mockPromise3()
          .then((result3) => {
            setResult(error + " " + result3 + " " + index);
          })
          .catch((error) => {
            setResult(error + " " + index);
          });
      });
  };

  useEffect(() => {
    setInterval(() => {
      unsafeBalances = unsafeBalances.map((balance) => balance + Math.random());
    }, 1000);
  }, []);

  const handleDeposit = (index: any) => {
    setLocalBalances(
      localBalances.map((balance, i) => (i === index ? balance + 100 : balance))
    );
  };

  const handleWithdraw = (index) => {
    document.getElementById(`balance-${index}`).innerHTML = String(
      Number(localBalances[index]) - 50
    );
  };

  if (random) {
    mockPromise().catch((error) => {
      return <span className="text-red-500">{error}</span>;
    });
  }

  return (
    <div style={{ display: "flex", height: "100vh" }} className="bg-gray-100">
      {localBalances.map((balance, index) => (
        <div
          key={index}
          style={{ margin: "auto" }}
          className="bg-white rounded-lg shadow-md p-6 w-80"
        >
          <h2 className="text-2xl font-bold mb-4">Wallet {index + 1}</h2>{" "}
          <div
            id={`balance-${index}`}
            className="text-3xl font-bold text-center mb-6"
          >
            {balance}
            <span>{globalBalance}</span>
            <span>{unsafeBalances[index]}</span>
          </div>
          <div className="space-y-4">
            <button onClick={() => handleDeposit(index)}>Deposit</button>
            <button
              className="w-full py-2 bg-red-500 text-white rounded"
              onClick={function () {
                handleWithdraw(index);
              }}
            >
              Withdraw
            </button>
            <button
              className="w-full py-2 bg-blue-500 text-white rounded"
              onClick={() => handleButtonClick(index)}
            >
              Handle Button Click
            </button>
          </div>
        </div>
      ))}

      {result && (
        <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-md p-4 text-lg font-medium text-gray-800 border-l-4 border-blue-500 animate-fade-in">
          {result}
        </div>
      )}
    </div>
  );
}
