'use client';

import { FaClinicMedical } from 'react-icons/fa';

export default function EmergencyButton() {
  return (
    <a
      href="https://www.google.com/maps/search/veterinary+emergency+hospital+near+me"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 animate-pulse-slow group"
      title="Find Emergency Vet Near Me"
    >
      <FaClinicMedical className="text-2xl" />
      <span className="absolute right-full mr-3 bg-slate-900 text-white text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
        Emergency Vet
      </span>
    </a>
  );
}
