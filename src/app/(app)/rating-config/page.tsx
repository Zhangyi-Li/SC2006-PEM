/** @format */
"use client";

import React, { useState } from "react";
import { RatingConfig } from "./components/RatingConfig";
import NotificationTimer from "@/components/NotificationTimer";

const page = () => {
  return (
    <>
      <div>
        <RatingConfig />
        <NotificationTimer />
      </div>
    </>
  );
};

export default page;
