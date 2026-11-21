import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useConsultation } from "../context/ConsultationContext";

/**
 * Automatically triggers the free consultation modal 12 seconds after a visitor
 * arrives on the website for the first time.
 *
 * Built-in safeguards:
 * - Guarded against re-triggering across subsequent routes or refreshes in the same session (sessionStorage).
 * - Avoids interrupting the user if they've already manually engaged/opened the modal.
 * - Restricts execution strictly to public client website paths (never triggers on attendance/admin screens).
 */
export default function AutoConsultationTimer() {
  const { openConsultationModal, isOpen } = useConsultation();
  const location = useLocation();

  useEffect(() => {
    if (isOpen) {
      try {
        sessionStorage.setItem("arthovista_auto_consult_shown", "true");
      } catch (_) {}
    }
  }, [isOpen]);

  useEffect(() => {
    const isAttendanceRoute =
      location.pathname === '/login' ||
      location.pathname === '/forgot-password' ||
      location.pathname === '/verify-otp' ||
      location.pathname === '/reset-password' ||
      location.pathname.startsWith('/admin') ||
      location.pathname.startsWith('/employee');

    if (isAttendanceRoute) return;

    try {
      if (sessionStorage.getItem("arthovista_auto_consult_shown")) {
        return;
      }
    } catch (_) {}

    const timer = setTimeout(() => {
      try {
        const alreadyShown = sessionStorage.getItem("arthovista_auto_consult_shown");
        if (!alreadyShown) {
          sessionStorage.setItem("arthovista_auto_consult_shown", "true");
          openConsultationModal("Welcome Visitor — Free Advisory Session");
        }
      } catch (_) {
        openConsultationModal("Welcome Visitor — Free Advisory Session");
      }
    }, 12000);

    return () => clearTimeout(timer);
  }, [location.pathname, openConsultationModal]);

  return null;
}
