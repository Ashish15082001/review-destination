import refreshPage from "@/actions/refresh-page";
import { connection } from "next/server";

export default async function RefreshButton() {
  await connection();
  return (
    <form action={refreshPage}>
      <button
        type="submit"
        className="text-gray-600 hover:text-gray-900 transition cursor-pointer"
      >
        refresh ({new Date().toLocaleTimeString()})
      </button>
    </form>
  );
}
