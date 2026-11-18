import { useState, useEffect, useMemo } from "react";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { useConsultation } from "../context/ConsultationContext";

/**
 * Genuine interactive marketing conversation between ArthoVista business advisors (Aman & Priya).
 * Features:
 * - Genuine, human-paced typing animation with natural micro-cadence.
 * - Live typing indicator ("Priya is typing... •••") before her response generates.
 * - 100% genuine visual appearance: no artificial eyelid blocks, no fake lip overlays,
 *   no floating sparkles. Authentic professional consultants.
 * - Clean speech bubbles aligned with speech tails pointing directly to each advisor.
 * - Interactive: clicking bubbles, buttons, or advisors opens the consultation modal.
 * - Responsive and accessible (prefers-reduced-motion supported).
 */

const CONVERSATIONS = [
  {
    id: 0,
    boyText: "Looking for Business Funding?",
    girlText: "Let's help grow your business with up to ₹10Cr!",
    badge: "Collateral-Free",
    cta: "Check Eligibility",
    leadTag: "Funding Inquiry",
  },
  {
    id: 1,
    boyText: "Need an MSME Loan?",
    girlText: "We are here to help with low interest rates!",
    badge: "Lowest ROI",
    cta: "Compare Rates",
    leadTag: "MSME Loan Inquiry",
  },
  {
    id: 2,
    boyText: "How can I Register My Business?",
    girlText: "Come to us, we'll get it done within 15 working days!",
    badge: "15-Day Setup",
    cta: "Start Registration",
    leadTag: "Company Registration Inquiry",
  },
  {
    id: 3,
    boyText: "Looking for Govt. Subsidies?",
    girlText: "Get up to 35% margin money under PMEGP & PMFME!",
    badge: "Up to 35% Subsidy",
    cta: "Explore Subsidies",
    leadTag: "Subsidy Scheme Inquiry",
  },
];

export default function MarketingConversation({ className = "" }) {
  const { openConsultationModal } = useConsultation();
  const [convIndex, setConvIndex] = useState(0);

  // Animation phase:
  // "BOY_TYPING" -> "BOY_PAUSE" (Priya typing indicator) -> "GIRL_TYPING" -> "HOLD" -> "TRANSITION"
  const [phase, setPhase] = useState("BOY_TYPING");
  const [boyCharCount, setBoyCharCount] = useState(0);
  const [girlCharCount, setGirlCharCount] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  const currentConv = CONVERSATIONS[convIndex];

  // Detect prefers-reduced-motion
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Genuine Typewriter State Machine
  useEffect(() => {
    if (reducedMotion) {
      setBoyCharCount(currentConv.boyText.length);
      setGirlCharCount(currentConv.girlText.length);
      setPhase("HOLD");
      const nextTimer = setTimeout(() => {
        setConvIndex((prev) => (prev + 1) % CONVERSATIONS.length);
      }, 5000);
      return () => clearTimeout(nextTimer);
    }

    let timer;

    if (phase === "BOY_TYPING") {
      if (boyCharCount < currentConv.boyText.length) {
        // Natural typing cadence with slight pause on punctuation/spaces
        const nextChar = currentConv.boyText[boyCharCount];
        const delay = nextChar === " " ? 45 : nextChar === "?" || nextChar === "," ? 90 : 35;
        timer = setTimeout(() => {
          setBoyCharCount((prev) => prev + 1);
        }, delay);
      } else {
        // Boy finished typing question; pause while Priya prepares her response
        timer = setTimeout(() => {
          setPhase("BOY_PAUSE");
        }, 500);
      }
    } else if (phase === "BOY_PAUSE") {
      // Genuine typing indicator duration before Priya writes
      timer = setTimeout(() => {
        setPhase("GIRL_TYPING");
      }, 750);
    } else if (phase === "GIRL_TYPING") {
      if (girlCharCount < currentConv.girlText.length) {
        const nextChar = currentConv.girlText[girlCharCount];
        const delay = nextChar === " " ? 40 : nextChar === "!" || nextChar === "," ? 85 : 30;
        timer = setTimeout(() => {
          setGirlCharCount((prev) => prev + 1);
        }, delay);
      } else {
        // Priya finished typing answer; hold for reading & interaction
        timer = setTimeout(() => {
          setPhase("HOLD");
        }, 400);
      }
    } else if (phase === "HOLD") {
      timer = setTimeout(() => {
        setPhase("TRANSITION");
      }, 4200);
    } else if (phase === "TRANSITION") {
      timer = setTimeout(() => {
        setConvIndex((prev) => (prev + 1) % CONVERSATIONS.length);
        setBoyCharCount(0);
        setGirlCharCount(0);
        setPhase("BOY_TYPING");
      }, 350);
    }

    return () => clearTimeout(timer);
  }, [phase, boyCharCount, girlCharCount, currentConv, reducedMotion]);

  const boyDisplayedText = useMemo(() => {
    return currentConv.boyText.slice(0, boyCharCount);
  }, [currentConv.boyText, boyCharCount]);

  const girlDisplayedText = useMemo(() => {
    return currentConv.girlText.slice(0, girlCharCount);
  }, [currentConv.girlText, girlCharCount]);

  const isBoyActiveSpeaker = phase === "BOY_TYPING";
  const isGirlActiveSpeaker = phase === "BOY_PAUSE" || phase === "GIRL_TYPING" || phase === "HOLD";
  const showGirlBubble = phase === "BOY_PAUSE" || phase === "GIRL_TYPING" || phase === "HOLD";

  const handleCtaClick = (e) => {
    e.stopPropagation();
    openConsultationModal(`Hero Advisor Lead: ${currentConv.leadTag} — ${currentConv.boyText}`);
  };

  return (
    <div
      data-testid="marketing-conversation-container"
      className={`w-full max-w-2xl mx-auto relative flex flex-col items-center select-none ${className}`}
      aria-label="Interactive MSME Advisors"
    >
      {/* ── GENUINE LIVE CONVERSATION SPEECH BUBBLES ── */}
      <div className="w-full relative z-20 flex flex-col gap-2.5 mb-3 min-h-[145px] sm:min-h-[155px] justify-end px-2 sm:px-4">
        {/* Aman's Question Bubble (Left-aligned over Aman) */}
        <div
          className={`w-full max-w-[88%] sm:max-w-[420px] self-start transition-all duration-300 ease-out ${phase === "TRANSITION"
            ? "opacity-0 -translate-y-2 scale-95"
            : "opacity-100 translate-y-0 scale-100"
            }`}
        >
          <div
            onClick={handleCtaClick}
            className={`cursor-pointer relative p-3 sm:p-3.5 rounded-2xl bg-white/95 backdrop-blur-md border shadow-md transition-all duration-300 hover:shadow-lg ${isBoyActiveSpeaker
              ? "border-blue-400 shadow-blue-500/10 ring-2 ring-blue-500/10"
              : "border-slate-200"
              }`}
          >
            {/* Header: Advisor Identity */}
            <div className="flex items-center justify-between gap-2 mb-1">
              <div className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${isBoyActiveSpeaker ? "bg-blue-600 animate-pulse" : "bg-blue-400"}`} />
                <span className="text-[11px] sm:text-xs font-bold text-slate-800">
                  Aman <span className="font-medium text-slate-500">· MSME Funding Advisor</span>
                </span>
              </div>
              {phase === "BOY_TYPING" && !reducedMotion && (
                <span className="text-[9px] sm:text-[10px] font-semibold text-blue-600 uppercase tracking-wider animate-pulse flex items-center gap-1">
                  <span>typing</span>
                  <span className="inline-block w-1 h-1 rounded-full bg-blue-600 animate-ping" />
                </span>
              )}
            </div>

            {/* Aman's Genuine Typewriter Text */}
            <p className="text-xs sm:text-[13px] md:text-sm font-semibold text-slate-800 leading-snug">
              {boyDisplayedText}
              {phase === "BOY_TYPING" && !reducedMotion && (
                <span className="inline-block w-0.5 h-3.5 bg-blue-600 ml-0.5 align-middle animate-pulse" />
              )}
            </p>

            {/* Speech Tail pointing accurately down to Aman */}
            <div className="absolute -bottom-1.5 left-10 sm:left-14 w-3.5 h-3.5 bg-white border-r border-b border-slate-200 rotate-45" />
          </div>
        </div>

        {/* Priya's Response Bubble (Right-aligned over Priya) */}
        {showGirlBubble && (
          <div
            className={`w-full max-w-[92%] sm:max-w-[460px] self-end transition-all duration-300 ease-out ${phase === "TRANSITION"
              ? "opacity-0 translate-y-2 scale-95"
              : "opacity-100 translate-y-0 scale-100 animate-fade-in"
              }`}
          >
            <div
              onClick={handleCtaClick}
              className={`cursor-pointer relative p-3 sm:p-3.5 rounded-2xl bg-white/95 backdrop-blur-md border shadow-md transition-all duration-300 hover:shadow-lg ${isGirlActiveSpeaker
                ? "border-teal-400 shadow-teal-500/10 ring-2 ring-teal-500/10"
                : "border-slate-200"
                }`}
            >
              {/* Header: Advisor Identity */}
              <div className="flex items-center justify-between gap-2 mb-1">
                <div className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${isGirlActiveSpeaker ? "bg-teal-600 animate-pulse" : "bg-teal-400"}`} />
                  <span className="text-[11px] sm:text-xs font-bold text-slate-800">
                    Priya <span className="font-medium text-slate-500">· Growth & Subsidy Specialist</span>
                  </span>
                </div>
                {phase === "BOY_PAUSE" && !reducedMotion ? (
                  <span className="text-[9px] sm:text-[10px] font-semibold text-teal-600 uppercase tracking-wider flex items-center gap-1">
                    <span>typing...</span>
                  </span>
                ) : phase === "GIRL_TYPING" && !reducedMotion ? (
                  <span className="text-[9px] sm:text-[10px] font-semibold text-teal-600 uppercase tracking-wider animate-pulse flex items-center gap-1">
                    <span>answering</span>
                    <span className="inline-block w-1 h-1 rounded-full bg-teal-600 animate-ping" />
                  </span>
                ) : null}
              </div>

              {/* Genuine Typing Indicator Dots while Priya prepares */}
              {phase === "BOY_PAUSE" && !reducedMotion ? (
                <div className="py-1 px-0.5 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-teal-500 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 rounded-full bg-teal-500 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 rounded-full bg-teal-500 animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              ) : (
                <>
                  {/* Priya's Genuine Typewriter Text */}
                  <p className="text-xs sm:text-[13px] md:text-sm font-semibold text-slate-800 leading-snug">
                    {girlDisplayedText}
                    {phase === "GIRL_TYPING" && !reducedMotion && (
                      <span className="inline-block w-0.5 h-3.5 bg-teal-600 ml-0.5 align-middle animate-pulse" />
                    )}
                  </p>

                  {/* Bottom Quick-Action CTA row */}
                  <div className="mt-2 pt-1.5 border-t border-slate-100 flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <ShieldCheck size={11} className="text-emerald-600" />
                      {currentConv.badge}
                    </span>

                    <button
                      type="button"
                      onClick={handleCtaClick}
                      className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-bold text-teal-700 hover:text-teal-900 transition-colors group cursor-pointer"
                    >
                      <span>{currentConv.cta}</span>
                      <ArrowRight size={11} className="transition-transform group-hover:translate-x-0.5" />
                    </button>
                  </div>
                </>
              )}

              {/* Speech Tail pointing accurately down to Priya */}
              <div className="absolute -bottom-1.5 right-10 sm:right-14 w-3.5 h-3.5 bg-white border-r border-b border-slate-200 rotate-45" />
            </div>
          </div>
        )}
      </div>

      {/* ── GENUINE ADVISORS (WITH ENEGO-STYLE SOFT BOTTOM GRADIENT BLUR) ── */}
      <div
        onClick={handleCtaClick}
        className="cursor-pointer relative flex items-end justify-center w-full px-2 pt-0 pb-0 -mt-1 group overflow-hidden"
        title="Click to consult with Aman & Priya"
      >
        {/* Soft Ambient Floor Shadow */}
        <div className="absolute bottom-0 inset-x-8 h-5 bg-slate-900/10 rounded-full blur-md -z-10 transform scale-y-50" />

        {/* ── AMAN (Boy Character) ── */}
        <div
          className={`relative w-[48%] sm:w-[50%] max-w-[220px] sm:max-w-[260px] flex-shrink-0 transition-transform duration-300 origin-bottom ${isBoyActiveSpeaker ? "scale-[1.02]" : "opacity-95 hover:opacity-100"
            }`}
          style={{
            maskImage: "linear-gradient(to bottom, rgba(0,0,0,1) 45%, rgba(0,0,0,0.8) 65%, rgba(0,0,0,0.2) 88%, rgba(0,0,0,0) 100%)",
            WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,1) 45%, rgba(0,0,0,0.8) 65%, rgba(0,0,0,0.2) 88%, rgba(0,0,0,0) 100%)",
          }}
        >
          {/* Subtle Ambient Halo when speaking */}
          {isBoyActiveSpeaker && (
            <div className="absolute inset-x-4 top-4 h-32 bg-blue-500/10 rounded-full blur-2xl -z-10 animate-pulse" />
          )}

          {/* Clean, High-Resolution Cutout */}
          <picture>
            <source srcSet="/marketing-boy.webp" type="image/webp" />
            <img
              src="/marketing-boy.png"
              alt="Aman - MSME Funding Consultant"
              className="w-full h-auto mr-48 object-contain block drop-shadow-md select-none pointer-events-none"
              loading="eager"
              draggable={false}
              onError={(e) => {
                if (!e.currentTarget.src.endsWith("/marketing-boy.png")) {
                  e.currentTarget.src = "/marketing-boy.png";
                }
              }}
            />
          </picture>
        </div>

        {/* ── PRIYA (Girl Character) ── */}
        <div
          className={`relative w-[48%] sm:w-[50%] max-w-[220px] sm:max-w-[260px] flex-shrink-0 -ml-8 sm:-ml-12 transition-transform duration-300 origin-bottom ${isGirlActiveSpeaker ? "scale-[1.02]" : "opacity-95 hover:opacity-100"
            }`}
          style={{
            maskImage: "linear-gradient(to bottom, rgba(0,0,0,1) 45%, rgba(0,0,0,0.8) 65%, rgba(0,0,0,0.2) 88%, rgba(0,0,0,0) 100%)",
            WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,1) 45%, rgba(0,0,0,0.8) 65%, rgba(0,0,0,0.2) 88%, rgba(0,0,0,0) 100%)",
          }}
        >
          {/* Subtle Ambient Halo when speaking */}
          {isGirlActiveSpeaker && (
            <div className="absolute inset-x-4 top-4 h-32 bg-teal-500/10 rounded-full blur-2xl -z-10 animate-pulse" />
          )}

          {/* Clean, High-Resolution Cutout */}
          <picture>
            <source srcSet="/marketing-girl.webp" type="image/webp" />
            <img
              src="/marketing-girl.png"
              alt="Priya - Growth & Subsidy Specialist"
              className="w-full h-auto ml-48 object-contain block drop-shadow-md select-none pointer-events-none"
              loading="eager"
              draggable={false}
              onError={(e) => {
                if (!e.currentTarget.src.endsWith("/marketing-girl.png")) {
                  e.currentTarget.src = "/marketing-girl.png";
                }
              }}
            />
          </picture>
        </div>

        {/* Bottom Soft Gradient Fade & Blur Overlay (Matches enego.co.in) */}
        <div className="absolute inset-x-0 bottom-0 h-24 sm:h-32 pointer-events-none bg-gradient-to-t from-white via-white/80 to-transparent z-10" />
      </div>
    </div>
  );
}
