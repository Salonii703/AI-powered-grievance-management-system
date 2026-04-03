import React, { useEffect, useState } from "react";

const MyGrievances = () => {
  const [data, setData] = useState([]);

  // ⚠️ Replace with actual logged-in user later
  const userContact = localStorage.getItem("contact");

  useEffect(() => {
    if (!userContact) return;

    fetch(`http://localhost:5000/api/my-grievances?contact=${userContact}`)
      .then((res) => res.json())
      .then((resData) => setData(resData))
      .catch((err) => console.error(err));
  }, [userContact]);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">My Grievances</h1>

      {data.length === 0 ? (
        <p>No grievances found.</p>
      ) : (
        data.map((item: any, index) => (
          <div key={index} className="bg-white p-4 mb-4 shadow rounded">
            <h2 className="font-bold">{item.trackingId}</h2>
            <p>{item.text}</p>

            <p>
              📍 {item.city}, {item.area}
            </p>

            <p>Status: {item.status}</p>

            {item.image && (
              <img
                src={`http://localhost:5000/uploads/${item.image}`}
                className="mt-2 w-full max-h-48 object-cover"
              />
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default MyGrievances;