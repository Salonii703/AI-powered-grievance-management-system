import React, { useEffect, useState } from "react";

const AdminAllGrievances = () => {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/admin/all")
      .then((res) => res.json())
      .then((resData) => setData(resData))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-blue-800 mb-6">
        All Grievances 
      </h1>

      {data.length === 0 ? (
        <p>No grievances found</p>
      ) : (
        <div className="grid gap-6">
          {data.map((item, index) => (
            <div
              key={index}
              className="bg-white p-5 rounded-xl shadow-md"
            >
              <div className="flex justify-between mb-2">
                <h2 className="font-bold text-lg text-blue-700">
                  {item.trackingId}
                </h2>
                <span className="text-sm bg-yellow-100 px-3 py-1 rounded">
                  {item.status}
                </span>
              </div>

              <p className="text-gray-700 mb-3">{item.text || "No details provided"}</p>

              <p className="text-sm text-gray-500">
                📍 {item.area || "N/A"}, {item.city || "N/A"}
              </p>

              {item.landmark && (
                <p className="text-sm text-gray-400">
                  Landmark: {item.landmark || "N/A"}
                </p>
              )}

                {!item.anonymous && item.contact && (
                <p className="text-sm text-gray-600">
                    📞 Contact: {item.contact}
                </p>
                )}

                {item.anonymous && (
                <p className="text-sm text-gray-500 italic">
                    Submitted anonymously
                </p>
                )}

              {item.image && (
                <img
                  src={`http://localhost:5000/uploads/${item.image}`}
                  className="mt-3 w-full max-h-60 object-cover rounded"
                />
              )}

              <p className="text-xs text-gray-400 mt-3">
                {new Date(item.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminAllGrievances;