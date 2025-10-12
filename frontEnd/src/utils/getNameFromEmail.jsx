import React from "react";

const getNameFromEmail = (email) => {
  if (!email) return 'Guest';
  return email.split('@')[0];
};

export default getNameFromEmail;
