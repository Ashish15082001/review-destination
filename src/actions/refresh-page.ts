"use server";

import { refresh } from "next/cache";

const refreshPage = async () => {
  refresh();
};

export default refreshPage;
