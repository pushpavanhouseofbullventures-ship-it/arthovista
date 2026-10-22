import { Phone, ArrowRight, ShieldCheck } from "lucide-react";
import { useConsultation } from "../context/ConsultationContext";

export default function StickyBar() {
  const { openConsultationModal } = useConsultation();

  return (
<<<<<<< HEAD
    <div className="bg-white text-slate-700 px-3 sm:px-6 py-1.5 sm:py-2 flex justify-between items-center text-xs border-b border-slate-200 shadow-2xs">
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <div className="flex items-center gap-2 min-w-0">
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="text-slate-600 font-medium truncate text-[11px] sm:text-xs flex items-center gap-1.5">
            <ShieldCheck size={13} className="text-amber-500 shrink-0 hidden sm:inline" />
            <span className="hidden md:inline">Official MSME Consultation Hub · </span>Live Support (Mon–Sat 9:30 AM–6:00 PM)
=======
    <div className="bg-slate-900 text-white px-4 sm:px-6 py-2 flex justify-between items-center text-xs border-b border-slate-800">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
          </span>
          <span className="text-slate-300 font-medium hidden sm:inline-flex items-center gap-1.5">
            <ShieldCheck size={13} className="text-amber-400" />
            Official MSME Consultation Hub · Live Support (Mon–Sat 9:30 AM–6:00 PM)
>>>>>>> origin/main
          </span>
        </div>
      </div>

<<<<<<< HEAD
      <div className="flex items-center gap-2 sm:gap-4 shrink-0 pl-2">
        <a
          href="tel:+919899902568"
          className="hidden md:flex items-center gap-1.5 text-slate-600 hover:text-primary-600 font-semibold transition-colors text-xs"
        >
          <Phone size={12} className="text-primary-600 shrink-0" />
          +91 98999 02568
        </a>

        <button
          onClick={() => openConsultationModal("General Consultation")}
          className="btn-3d inline-flex items-center gap-1 sm:gap-1.5 bg-gradient-to-r from-green-500 via-blue-500 to-green-500 hover:opacity-95 text-white font-bold text-[10px] sm:text-[11px] px-2.5 sm:px-3.5 py-1.5 rounded-lg transition-all cursor-pointer shadow-xs whitespace-nowrap"
        >
          <span>Free Consultation</span>
          <ArrowRight size={11} className="hidden sm:inline" />
=======
      <a
        href="tel:+919899902568"
        className="hidden md:flex items-center gap-1.5 text-slate-300 hover:text-white font-semibold transition-colors"
      >
        <Phone size={12} className="text-teal-400" />
        +91 98999 02568
      </a>

      <div className="flex items-center gap-4 shrink-0">
        <button
          onClick={() => openConsultationModal("General Consultation")}
          className="btn-3d inline-flex items-center gap-1.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-[11px] px-3 py-1.5 rounded-lg transition-all cursor-pointer"
        >
          <span>Free Consultation</span>
          <ArrowRight size={12} />
>>>>>>> origin/main
        </button>
      </div>
    </div>
  );
}
<<<<<<< HEAD

=======
>>>>>>> origin/main
