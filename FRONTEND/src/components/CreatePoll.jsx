import { setVoter, setAdmin } from '@/redux/authSlice';
import { setCreatedPolls } from '@/redux/pollSlice';
import { Dialog, DialogContent, DialogTitle, DialogOverlay, DialogDescription } from '@radix-ui/react-dialog';
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

const CreatePoll = ({ open, setOpen }) => {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    candidates: [],
    schools: [],
    endDate: '',
  });
  const [candInp, setCandInp] = useState('');

  const dispatch = useDispatch();
  const { admin } = useSelector((store) => store.auth);
  const { createdPolls } = useSelector((store) => store.polls);

  const changeHandler = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSchool = (e) => {
    if (e.target.checked) {
      setForm({ ...form, schools: [...form.schools, e.target.value] });
    } else {
      setForm({
        ...form,
        schools: form.schools.filter((school) => school !== e.target.value),
      });
    }
  };

  const handleCandidate = async () => {
    if (!candInp.trim()) return;
    setForm({
      ...form,
      candidates: [...form.candidates, candInp],
    });
    setCandInp('');
  };

  const removeCandidateHandler = (emailId) => {
    setForm({
      ...form,
      candidates: form.candidates.filter((cand) => cand !== emailId),
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/admin/create-poll`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
        setOpen(false);
        toast.success(data?.message);
        setForm({
          title: '',
          description: '',
          candidates: [],
          schools: [],
          endDate: '',
          createdBy: ''
        });
        const poll = data?.poll;
        const updatedPolls = [...createdPolls, poll];
        const updatedAdminPolls = [...admin.polls, poll.pollId];
        const updatedAdmin = { ...admin, polls: updatedAdminPolls };
        dispatch(setAdmin(updatedAdmin));
        dispatch(setCreatedPolls(updatedPolls));
      }
      else {
        throw new Error(data?.error);
      }
    } catch (error) {
      toast.error(error?.message);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogOverlay className="fixed inset-0 bg-black/20 backdrop-blur-md z-40" />
      <DialogContent
        onInteractOutside={() => setOpen(false)}
        className="fixed top-1/2 left-1/2 z-50 w-full max-w-2xl 
                   -translate-x-1/2 -translate-y-1/2
                   p-8 rounded-2xl shadow-2xl
                   bg-white dark:bg-zinc-900 space-y-6"
      >
        <DialogTitle className="text-2xl font-bold text-zinc-800 dark:text-zinc-100">
          Create a Poll
        </DialogTitle>

        <DialogDescription className="text-sm text-gray-500 dark:text-gray-400">
          Fill out the form below to create a new poll. Add candidates, select schools, and set an end date.
        </DialogDescription>

        <form onSubmit={submitHandler} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={changeHandler}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <input
              type="text"
              name="description"
              value={form.description}
              onChange={changeHandler}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>

          {/* Candidates */}
          <div>
            <label className="block text-sm font-medium mb-1">Candidates</label>
            <div className="flex gap-2">
              <input
                type="email"
                value={candInp}
                onChange={(e) => setCandInp(e.target.value)}
                placeholder="Candidate Email"
                className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-teal-500"
              />
              <button
                type="button"
                onClick={handleCandidate}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
              >
                Add
              </button>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {form.candidates.map((cand, index) => (
                <div
                  key={index}
                  onClick={() => removeCandidateHandler(cand)}
                  className="px-3 py-1 rounded-full bg-teal-100 dark:bg-teal-700 
                             text-teal-800 dark:text-white text-sm cursor-pointer
                             hover:bg-red-100 hover:text-red-600 transition"
                >
                  {cand} ✕
                </div>
              ))}
            </div>
          </div>

          {/* Schools */}
          <div>
            <label className="block text-sm font-medium mb-1">Eligible Schools</label>
            <div className="flex flex-wrap gap-4">
              {["SCOPE", "SENSE", "SITE", "SELECT", "SMEC", "SCE", "SBST", "HOT"].map((school) => (
                <label key={school} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    onChange={handleSchool}
                    value={school}
                    className="h-4 w-4"
                  />
                  {school}
                </label>
              ))}
            </div>
          </div>

          {/* End Date */}
          <div>
            <label className="block text-sm font-medium mb-1">End Date</label>
            <input
              type="date"
              name="endDate"
              value={form.endDate}
              onChange={changeHandler}
              className="p-2 border rounded-lg focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>

          {/* Submit */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading ? true : false}
              className="px-6 py-2 rounded-lg bg-teal-600 text-white font-medium hover:bg-teal-700"
            >
              {loading ? "Please wait..." : "Post Poll"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePoll;
