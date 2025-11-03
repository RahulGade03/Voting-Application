import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { setVoter, setAdmin } from '@/redux/authSlice'

const AddAdmin = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    name: '',
    school: 'SCOPE',
    emailId: '',
    access: 'NONE',
  })

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/admin/register-voter`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(form),
        credentials: 'include'
      })
      if (res.status == 401) {
        dispatch(setVoter(null));
        dispatch(setAdmin(null));
        return;
      }

      const data = await res.json();
      if (data?.success) {
        setForm({
          name: '',
          school: 'SCOPE',
          emailId: '',
          access: 'NONE',
        })
        toast.success(data?.message);
      }
      else {
        toast.error(data?.error);
      }
    } catch (error) {
      toast.error(error)
      console.log(error);
    }
    finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  return (
    <div className="ml-64 p-10 min-h-screen bg-gray-50"> {/* pushes form to right of sidebar */}
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Register as Admin</h2>

        <form onSubmit={(e) => submitHandler(e)} className="space-y-5">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              name='name'
              value={form.name}
              onChange={(e) => handleChange(e)}
            />
          </div>

          {/* School */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">School</label>
            <select
              name="school"
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              onChange={(e) => handleChange(e)}
              value={form.school}
            >
              <option value="SCOPE">SCOPE</option>
              <option value="SENSE">SENSE</option>
              <option value="SELECT">SELECT</option>
              <option value="SITE">SITE</option>
              <option value="HOT">HOT</option>
              <option value="SCE">SCE</option>
              <option value="SBST">SBST</option>
              <option value="SMEC">SMEC</option>
            </select>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email ID</label>
            <input
              type="email"
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              name='emailId'
              onChange={(e) => handleChange(e)}
              value={form.emailId}
            />
          </div>

          {/* Access */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Access</label>
            <select
              name="access"
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              onChange={(e) => handleChange(e)}
              value={form.access}
            >
              <option value="NONE" >NONE</option>
              <option value="SCOPE">SCOPE</option>
              <option value="SITE">SITE</option>
              <option value="HOT">HOT</option>
              <option value="SENSE">SENSE</option>
              <option value="ALL">ALL</option>
            </select>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading ? true : false}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition-colors"
            >
              {loading ? "Please wail..." : "Register Admin"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddAdmin