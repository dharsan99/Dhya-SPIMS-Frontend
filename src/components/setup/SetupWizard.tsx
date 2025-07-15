// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import WizardStepper from './WizardStepper';
// import ShiftTimingsForm from './ShiftTimingsForm';
// import { ShiftTiming, OrgDetails, Department, Machine, Employee } from './types';

// // Step definitions
// const steps = [
//   { label: 'Organization Details', component: OrgDetailsForm },
//   { label: 'Shift Timings', component: ShiftTimingsForm },
//   { label: 'Departments', component: DepartmentsForm },
//   { label: 'Machine List', component: MachineListForm },
//   { label: 'Add Employees', component: AddEmployeesForm },
//   { label: 'Review & Complete', component: ReviewForm },
// ];

// export default function SetupWizard() {
//   const [step, setStep] = useState(0);
//   const [orgDetails, setOrgDetails] = useState<OrgDetails | {}>({});
//   const [shiftTimings, setShiftTimings] = useState<ShiftTiming[]>([]);
//   const [departments, setDepartments] = useState<Department[]>([]);
//   const [machineList, setMachineList] = useState<Machine[]>([]);
//   const [employees, setEmployees] = useState<Employee[]>([]);
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const saveOrgDetails = async (data: any) => {};
//   const saveShiftTimings = async (data: any) => {};
//   const saveDepartments = async (data: any) => {};
//   const saveMachineList = async (data: any) => {};
//   const saveEmployees = async (data: any) => {};
//   const completeOnboarding = async () => {};

//   const handleNext = async () => {
//     setLoading(true);
//     try {
//       if (step === 0) await saveOrgDetails(orgDetails);
//       if (step === 1) await saveShiftTimings(shiftTimings);
//       if (step === 2) await saveDepartments(departments);
//       if (step === 3) await saveMachineList(machineList);
//       if (step === 4) await saveEmployees(employees);
//       if (step === steps.length - 1) {
//         await completeOnboarding();
//         navigate('/dashboard');
//         return;
//       }
//       setStep((s) => s + 1);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleBack = () => setStep((s) => s - 1);
//   const StepComponent = steps[step].component;

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-start bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
//       {/* Stepper */}
//       <div className="w-full max-w-4xl px-4 pt-6">
//         <WizardStepper steps={steps} currentStep={step} />
//       </div>

//       {/* Wizard Card */}
//       <div className="w-full max-w-4xl px-4 mt-6">
//         <div className="bg-white dark:bg-gray-900 shadow-2xl border border-gray-200 dark:border-gray-700 rounded-3xl p-6 sm:p-8 flex flex-col h-[calc(100vh-140px)]">
//           {/* Title */}
//           <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-center text-gray-900 dark:text-white">
//             {steps[step].label}
//           </h2>
//           <hr className="border-gray-200 dark:border-gray-700 mb-4" />

//           {/* Step Content */}
//           <div className="flex-1 overflow-y-scroll pr-2">
//             {step === 1 ? (
//               <ShiftTimingsForm
//                 onDataChange={setShiftTimings}
//                 initialData={shiftTimings}
//               />
//             ) : (
//               <StepComponent />
//             )}
//           </div>

//           {/* Sticky Footer Buttons */}
//           <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
//             {step > 0 ? (
//               <button
//                 onClick={handleBack}
//                 className="px-4 py-2 text-sm font-medium bg-gray-100 text-gray-800 rounded hover:bg-gray-200 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 transition"
//               >
//                 Back
//               </button>
//             ) : (
//               <span />
//             )}
//             <button
//               onClick={handleNext}
//               className="px-5 py-2 text-sm font-semibold bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-50"
//               disabled={loading}
//             >
//               {loading ? 'Saving...' : step === steps.length - 1 ? 'Finish' : 'Next'}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// function OrgDetailsForm() {
//   return <div>Org Details Form (implement fields here)</div>;
// }
// function DepartmentsForm() {
//   return <div>Departments Form (implement fields here)</div>;
// }
// function MachineListForm() {
//   return <div>Machine List Form (implement fields here)</div>;
// }
// function AddEmployeesForm() {
//   return <div>Add Employees Form (implement fields here)</div>;
// }
// function ReviewForm() {
//   return <div>Review & Complete (show summary here)</div>;
// }
