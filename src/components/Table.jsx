export default function Table() {
    return (
      <div className="bg-white rounded-xl shadow">
        <div className="p-4 border-b flex justify-between">
          <input
            placeholder="Search by name, email, phone..."
            className="border px-4 py-2 rounded-lg text-sm w-96"
          />
  
          <div className="flex gap-2">
            <button className="border px-4 py-2 rounded-lg text-sm">
              Export All
            </button>
            <button className="border px-4 py-2 rounded-lg text-sm">
              Export Selected
            </button>
          </div>
        </div>
  
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              {["Partner", "Contact", "Vehicle", "Documents", "Status", "Registered"].map(
                (h) => (
                  <th key={h} className="text-left px-4 py-3 font-medium">
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
  
          <tbody>
            <tr className="border-t">
              <td className="px-4 py-3">Vansh</td>
              <td className="px-4 py-3">8076750278</td>
              <td className="px-4 py-3">Toyota Fortuner</td>
              <td className="px-4 py-3 text-purple-600">View documents</td>
              <td className="px-4 py-3">
                <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs">
                  Approved
                </span>
              </td>
              <td className="px-4 py-3">Dec 26, 2025</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }