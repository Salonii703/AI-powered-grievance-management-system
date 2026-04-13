// import React, { useState } from "react";

// const LodgeGrievance = () => {
//   const [formData, setFormData] = useState({
//     text: "",
//     city: "",
//     area: "",
//     landmark: "",
//     contact: "",
//     anonymous: false,
//     image: null as File | null,
//   });

//   const [preview, setPreview] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);

//   // 🔹 Handle text inputs
//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     const { name, value, type } = e.target;

//     if (type === "checkbox") {
//       setFormData({
//         ...formData,
//         [name]: (e.target as HTMLInputElement).checked,
//       });
//     } else {
//       setFormData({ ...formData, [name]: value });
//     }
//   };

//   // 🔹 Handle image upload
//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       const file = e.target.files[0];

//       // file size check
//       if (file.size > 5 * 1024 * 1024) {
//         alert("File size should be less than 5MB");
//         return;
//       }

//       setFormData({ ...formData, image: file });

//       const imageUrl = URL.createObjectURL(file);
//       setPreview(imageUrl);
//     }
//   };

//   // 🔹 Submit form
//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const formPayload = new FormData();

//       formPayload.append("text", formData.text);
//       formPayload.append("city", formData.city);
//       formPayload.append("area", formData.area);
//       formPayload.append("landmark", formData.landmark);
//       formPayload.append("contact", formData.contact);
//       formPayload.append("anonymous", String(formData.anonymous));

//       if (formData.image) {
//         formPayload.append("image", formData.image);
//       }

//       const res = await fetch("http://localhost:8000/api/grievance", {
//         method: "POST",
//         body: formPayload,
//       });

//       const data = await res.json();

//       alert(`✅ Submitted!\nTracking ID: ${data.trackingId}`);
//       if (formData.contact) {
//         localStorage.setItem("contact", formData.contact);
//       }
//       // reset
//       setFormData({
//         text: "",
//         city: "",
//         area: "",
//         landmark: "",
//         contact: "",
//         anonymous: false,
//         image: null,
//       });

//       setPreview(null);

//     } catch (err) {
//       console.error(err);
//       alert("❌ Submission failed");
//     }

//     setLoading(false);
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 flex justify-center items-center p-6">
//       <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-2xl">

//         <h2 className="text-3xl font-bold text-blue-800 text-center mb-2">
//           Lodge Grievance
//         </h2>

//         <form onSubmit={handleSubmit} className="space-y-5">

//           {/* Description */}
//           <div>
//             <label className="font-semibold">Grievance Details *</label>
//             <textarea
//               name="text"
//               value={formData.text}
//               onChange={handleChange}
//               className="w-full p-3 border rounded-lg mt-1"
//               required
//             />
//           </div>

//           {/* Location */}
//           <input
//             name="city"
//             value={formData.city}
//             onChange={handleChange}
//             placeholder="City"
//             className="w-full p-3 border rounded-lg"
//             required
//           />

//           <input
//             name="area"
//             value={formData.area}
//             onChange={handleChange}
//             placeholder="Area / Locality"
//             className="w-full p-3 border rounded-lg"
//             required
//           />

//           <input
//             name="landmark"
//             value={formData.landmark}
//             onChange={handleChange}
//             placeholder="Landmark (optional)"
//             className="w-full p-3 border rounded-lg"
//           />

//           {/* Upload Section */}
//           <div>
//             <label className="font-semibold block mb-2">
//               Upload Image (optional)
//             </label>

//             <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition">

//               <input
//                 type="file"
//                 accept="image/*"
//                 onChange={handleFileChange}
//                 className="hidden"
//                 id="fileUpload"
//               />

//               <label htmlFor="fileUpload" className="cursor-pointer">
//                 <p className="text-gray-500">
//                   Click to upload or browse image
//                 </p>
//                 <p className="text-sm text-gray-400">
//                   PNG, JPG up to 5MB
//                 </p>
//               </label>
//             </div>

//             {preview && (
//               <div className="mt-4">
//                 <img
//                   src={preview}
//                   className="w-full max-h-64 object-cover rounded-lg border"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => {
//                     setPreview(null);
//                     setFormData({ ...formData, image: null });
//                   }}
//                   className="text-red-500 text-sm mt-2"
//                 >
//                   Remove Image
//                 </button>
//               </div>
//             )}
//           </div>

//           {/* Contact */}
//           <input
//             name="contact"
//             value={formData.contact}
//             onChange={handleChange}
//             placeholder="Contact (optional)"
//             className="w-full p-3 border rounded-lg"
//           />

//           {/* Anonymous */}
//           <div className="flex items-center gap-2">
//             <input
//               type="checkbox"
//               name="anonymous"
//               checked={formData.anonymous}
//               onChange={handleChange}
//             />
//             <label>Submit anonymously</label>
//           </div>

//           {/* Submit */}
//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-blue-700 text-white py-3 rounded-lg font-bold hover:bg-blue-800"
//           >
//             {loading ? "Submitting..." : "Submit Grievance"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default LodgeGrievance;



import React, { useState } from "react";

const API = 'http://localhost:8000'

const LodgeGrievance = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    state: "",
    district: "",
    pincode: "",
    
  });

  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch(`${API}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      setResult(data);

      if (!data.duplicate) {
        setFormData({ name: "", description: "", state: "", district: "", pincode: "" });
      }
    } catch (err) {
      setResult({ error: true });
    }

    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white shadow-xl rounded-2xl p-8">
        <h2 className="text-3xl font-bold text-blue-800 text-center mb-2">Lodge Grievance</h2>
        <p className="text-center text-gray-500 text-sm mb-8">Fill in the details below to submit your grievance</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block font-semibold mb-1 text-sm">Full Name *</label>
            <input name="name" value={formData.name} onChange={handleChange}
              placeholder="Your full name" required
              className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-200" />
          </div>

          <div>
            <label className="block font-semibold mb-1 text-sm">Grievance Description *</label>
            <textarea name="description" value={formData.description} onChange={handleChange}
              placeholder="Describe your grievance in detail..." required rows={4}
              className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-200" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-1 text-sm">State *</label>
              <input name="state" value={formData.state} onChange={handleChange}
                placeholder="e.g. Delhi" required
                className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-200" />
            </div>
            <div>
              <label className="block font-semibold mb-1 text-sm">District *</label>
              <input name="district" value={formData.district} onChange={handleChange}
                placeholder="e.g. South Delhi" required
                className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-200" />
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-1 text-sm">Pincode</label>
            <input name="pincode" value={formData.pincode} onChange={handleChange}
              placeholder="e.g. 110001"
              className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-200" />
          </div>
          
           {/* <div className="flex items-center gap-2">
             <input
               type="checkbox"
               name="anonymous"
               checked={formData.anonymous}
              onChange={handleChange}            />
              <label>Submit anonymously</label>
           </div> */}

          <button type="submit" disabled={loading}
            className="w-full bg-blue-800 text-white py-3 rounded-xl font-bold hover:bg-blue-900 transition-all">
            {loading ? "Submitting..." : "Submit Grievance"}
          </button>
        </form>

        {/* Result */}
        {result && !result.error && !result.duplicate && (
          <div className="mt-6 p-5 bg-green-50 border border-green-200 rounded-xl">
            <p className="font-bold text-green-800 text-lg mb-1">Grievance Submitted Successfully!</p>
            <p className="text-green-700 font-mono text-xl font-bold mb-3">{result.tracking_id}</p>
            <div className="grid grid-cols-2 gap-2 text-sm text-green-800">
              <div>Category: <b>{result.category}</b></div>
              <div>Priority: <b>{result.priority}</b></div>
              <div>Department: <b>{result.department}</b></div>
              <div>Due in: <b>{result.action_within}</b></div>
              <div className="col-span-2">Office: <b>{result.nearest_office}</b></div>
              <div className="col-span-2">Helpline: <b>{result.helpline}</b></div>
            </div>
          </div>
        )}

        {result?.duplicate && (
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-sm">
            <p className="font-bold text-yellow-800">Duplicate Detected</p>
            <p className="text-yellow-700">Similar to <b>{result.matched_with}</b> ({result.similarity_score}% match)</p>
          </div>
        )}

        {result?.error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
            Failed to submit. Make sure the backend is running at port 8000.
          </div>
        )}
      </div>
    </div>
  );
};

export default LodgeGrievance;