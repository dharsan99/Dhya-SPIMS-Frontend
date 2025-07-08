import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import your API functions here

const steps = [
  { label: 'Organization Details' },
  { label: 'Shift Timings' },
  { label: 'Machine List' },
];

export default function SetupWizard() {
  const [step, setStep] = useState(0);
  const [orgDetails] = useState({});
  const [shiftTimings] = useState({});
  const [machineList] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Example save functions (replace with your API)
  const saveOrgDetails = async (data: any) => {console.log(data)};
  const saveShiftTimings = async (data: any) => {console.log(data)};
  const saveMachineList = async (data: any) => {console.log(data);};
  const completeOnboarding = async () => {/* await api call to set tenant.onboarded = true */};

  const handleNext = async () => {
    setLoading(true);
    try {
      if (step === 0) await saveOrgDetails(orgDetails);
      if (step === 1) await saveShiftTimings(shiftTimings);
      if (step === 2) {
        await saveMachineList(machineList);
        await completeOnboarding();
        navigate('/dashboard');
        return;
      }
      setStep((s) => s + 1);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => setStep((s) => s - 1);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-lg bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-6 text-center">{steps[step].label}</h2>
        {/* Stepper */}
        <div className="flex justify-center mb-8">
          {steps.map((s, i) => (
            <div key={s.label} className={`mx-2 ${i === step ? 'font-bold text-blue-600' : 'text-gray-400'}`}>
              {s.label}
            </div>
          ))}
        </div>
        {/* Step Content */}
        {step === 0 && (
          <OrgDetailsForm />
        )}
        {step === 1 && (
          <ShiftTimingsForm />
        )}
        {step === 2 && (
          <MachineListForm />
        )}
        {/* Navigation */}
        <div className="flex justify-between mt-8">
          {step > 0 && (
            <button onClick={handleBack} className="px-4 py-2 bg-gray-300 rounded">Back</button>
          )}
          <button
            onClick={handleNext}
            className="px-4 py-2 bg-blue-600 text-white rounded"
            disabled={loading}
          >
            {loading ? 'Saving...' : step === steps.length - 1 ? 'Finish' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
}

// Dummy step components (replace with your real forms)
function OrgDetailsForm() {
  return <div>Org Details Form (implement fields here)</div>;
}
function ShiftTimingsForm() {
  return <div>Shift Timings Form (implement fields here)</div>;
}
function MachineListForm() {
  return <div>Machine List Form (implement fields here)</div>;
}