"use client";

import { useState } from "react";

const ServerEconomy = ({ economy }: { economy: number }) => {
  const [clicked, setClicked] = useState(true);

  return (
    <p
      className="text-2xl font-bold hover:underline cursor-pointer"
      onClick={() => setClicked(!clicked)}
    >
      {new Intl.NumberFormat("sv-SE", {
        style: "currency",
        currency: "SEK",
        notation: clicked ? "compact" : "standard",
      }).format(economy)}
    </p>
  );
};

export { ServerEconomy };
