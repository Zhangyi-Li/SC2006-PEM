/** @format */
"use client";

import React, { useEffect } from "react";

const AutoReroute = () => {
  useEffect(() => {
    if (window.location.pathname === "/") {
      window.location.replace("/home");
    }

    if (window.location.pathname === "/login") {
      window.location.replace("/home");
    }
  }, []);

  return null;
};

export default AutoReroute;
