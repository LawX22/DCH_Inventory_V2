import { FaClipboardList } from "react-icons/fa";
import Header from "./Header";

const RequestBoard = () => {
  const requests = [
    { id: 1, requester: "John Doe", status: "Pending", date: "2025-03-21" },
    { id: 2, requester: "Jane Smith", status: "Approved", date: "2025-03-20" },
    { id: 3, requester: "Mark Lee", status: "Rejected", date: "2025-03-19" },
  ];

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <Header />
      <div className="flex items-center gap-2 bg-white p-4 rounded-lg shadow-md">
        <FaClipboardList className="text-blue-500 text-2xl" />
        <h1 className="text-xl font-semibold text-gray-700">Request Board</h1>
      </div>

      {/* Request Table */}
      <div className="mt-6 bg-white p-4 rounded-lg shadow-md">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 p-2">ID</th>
              <th className="border border-gray-300 p-2">Requester</th>
              <th className="border border-gray-300 p-2">Status</th>
              <th className="border border-gray-300 p-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => (
              <tr key={request.id} className="text-center">
                <td className="border border-gray-300 p-2">{request.id}</td>
                <td className="border border-gray-300 p-2">
                  {request.requester}
                </td>
                <td
                  className={`border border-gray-300 p-2 font-semibold ${request.status === "Pending" ? "text-yellow-500" : request.status === "Approved" ? "text-green-500" : "text-red-500"}`}
                >
                  {request.status}
                </td>
                <td className="border border-gray-300 p-2">{request.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RequestBoard;
