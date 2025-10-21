import React, { useState } from 'react'

const RegisterVoter = () => {
  const [form, setForm] = useState({
    name: '',
    school: 'SCOPE',
    emailId: '',
    profession: 'Student',
  })

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/admin/register-voter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(form),
        credentials: 'include'
      })
      const data = await res.json();
      console.log(data);
      if (data.success) {
        alert('Voter Registered Successfully');
        // use toast
      }
      else {
        alert('Error in registering voter');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onChange = (e) => {
    setForm({...form, [e.target.name]: e.target.value})
  }

  return (
    <div className="ml-64 p-10 min-h-screen bg-gray-50"> {/* pushes form to right of sidebar */}
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Register as Voter</h2>
        
        <form onSubmit={(e) => submitHandler(e)} className="space-y-5">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input 
              type="text"
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              name='name'
              value={form.name}
              onChange={(e) => onChange(e)}
            />
          </div>

          {/* School */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">School</label>
            <select 
              name="school"
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              onChange={(e) => onChange(e)}
              value={form.school}
            >
              <option value="SCOPE">SCOPE</option>
              <option value="SITE">SITE</option>
              <option value="HOT">HOT</option>
              <option value="SENSE">SENSE</option>
            </select>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email ID</label>
            <input 
              type="email"
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              name='emailId'
              onChange={(e) => onChange(e)}
              value={form.emailId}
            />
          </div>

          {/* Profession */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Profession</label>
            <select 
              name="profession"
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              onChange={(e) => onChange(e)}
              value={form.profession}
            >
              <option value="Student">Student</option>
              <option value="Professor">Faculty</option>
              <option value="Staff">Staff</option>
              <option value="Research Scholar">Research Scholar</option>
            </select>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button 
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition-colors"
            >
              Register Voter
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default RegisterVoter
