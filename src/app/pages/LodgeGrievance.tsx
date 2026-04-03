import React, { useState } from "react";

const LodgeGrievance = () => {
  const [formData, setFormData] = useState({
    text: "",
    city: "",
    area: "",
    landmark: "",
    contact: "",
    anonymous: false,
    image: null as File | null,
  });

  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // 🔹 Handle text inputs
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      setFormData({
        ...formData,
        [name]: (e.target as HTMLInputElement).checked,
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // 🔹 Handle image upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // file size check
      if (file.size > 5 * 1024 * 1024) {
        alert("File size should be less than 5MB");
        return;
      }

      setFormData({ ...formData, image: file });

      const imageUrl = URL.createObjectURL(file);
      setPreview(imageUrl);
    }
  };

  // 🔹 Submit form
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formPayload = new FormData();

      formPayload.append("text", formData.text);
      formPayload.append("city", formData.city);
      formPayload.append("area", formData.area);
      formPayload.append("landmark", formData.landmark);
      formPayload.append("contact", formData.contact);
      formPayload.append("anonymous", String(formData.anonymous));

      if (formData.image) {
        formPayload.append("image", formData.image);
      }

      const res = await fetch("http://localhost:5000/api/grievance", {
        method: "POST",
        body: formPayload,
      });

      const data = await res.json();

      alert(`✅ Submitted!\nTracking ID: ${data.trackingId}`);
      if (formData.contact) {
        localStorage.setItem("contact", formData.contact);
      }
      // reset
      setFormData({
        text: "",
        city: "",
        area: "",
        landmark: "",
        contact: "",
        anonymous: false,
        image: null,
      });

      setPreview(null);

    } catch (err) {
      console.error(err);
      alert("❌ Submission failed");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-6">
      <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-2xl">

        <h2 className="text-3xl font-bold text-blue-800 text-center mb-2">
          Lodge Grievance
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Description */}
          <div>
            <label className="font-semibold">Grievance Details *</label>
            <textarea
              name="text"
              value={formData.text}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg mt-1"
              required
            />
          </div>

          {/* Location */}
          <input
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="City"
            className="w-full p-3 border rounded-lg"
            required
          />

          <input
            name="area"
            value={formData.area}
            onChange={handleChange}
            placeholder="Area / Locality"
            className="w-full p-3 border rounded-lg"
            required
          />

          <input
            name="landmark"
            value={formData.landmark}
            onChange={handleChange}
            placeholder="Landmark (optional)"
            className="w-full p-3 border rounded-lg"
          />

          {/* Upload Section */}
          <div>
            <label className="font-semibold block mb-2">
              Upload Image (optional)
            </label>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition">

              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="fileUpload"
              />

              <label htmlFor="fileUpload" className="cursor-pointer">
                <p className="text-gray-500">
                  Click to upload or browse image
                </p>
                <p className="text-sm text-gray-400">
                  PNG, JPG up to 5MB
                </p>
              </label>
            </div>

            {preview && (
              <div className="mt-4">
                <img
                  src={preview}
                  className="w-full max-h-64 object-cover rounded-lg border"
                />
                <button
                  type="button"
                  onClick={() => {
                    setPreview(null);
                    setFormData({ ...formData, image: null });
                  }}
                  className="text-red-500 text-sm mt-2"
                >
                  Remove Image
                </button>
              </div>
            )}
          </div>

          {/* Contact */}
          <input
            name="contact"
            value={formData.contact}
            onChange={handleChange}
            placeholder="Contact"
            className="w-full p-3 border rounded-lg"
          />

          {/* Anonymous */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="anonymous"
              checked={formData.anonymous}
              onChange={handleChange}
            />
            <label>Submit anonymously</label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-700 text-white py-3 rounded-lg font-bold hover:bg-blue-800"
          >
            {loading ? "Submitting..." : "Submit Grievance"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LodgeGrievance;