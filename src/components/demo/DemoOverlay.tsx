import React, { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useDemo, GLOBAL_TOTAL_STEPS, PHASE_OFFSETS, persistPhaseToStorage } from '@/contexts/DemoContext';
import { setDemoMode } from '@/data/demoData';

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));
const waitForEl = (sel: string, ms = 5000) =>
  new Promise<HTMLElement | null>(resolve => {
    const el = document.querySelector(sel) as HTMLElement | null;
    if (el) return resolve(el);
    let elapsed = 0;
    const iv = setInterval(() => {
      elapsed += 150;
      const found = document.querySelector(sel) as HTMLElement | null;
      if (found || elapsed >= ms) { clearInterval(iv); resolve(found); }
    }, 150);
  });

interface CutoutRect { x: number; y: number; w: number; h: number }

export function DemoOverlay() {
  const { demoState, nextStep, previousStep, exitDemo, setPhase, setDemoUser } = useDemo();
  const navigate = useNavigate();
  const [cutout, setCutout] = useState<CutoutRect | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [busy, setBusy] = useState(false);
  const retryRef = useRef<ReturnType<typeof setTimeout>>();
  const observerRef = useRef<MutationObserver | null>(null);
  // Flag to suppress the target-click listener when WE click the element programmatically
  const programmaticClickRef = useRef(false);

  const currentStep = demoState.steps[demoState.currentStep];
  const isCentered = !currentStep?.target;

  // ── Cutout tracking ──
  const updateCutout = useCallback(() => {
    if (!currentStep?.target) { setCutout(null); return; }
    const el = document.querySelector(currentStep.target) as HTMLElement | null;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const pad = 6;
    setCutout({ x: r.left - pad, y: r.top - pad, w: r.width + pad * 2, h: r.height + pad * 2 });
  }, [currentStep?.target]);

  useEffect(() => {
    if (!demoState.isActive || !currentStep) return;
    updateCutout();
    let attempts = 0;
    const tryFind = () => {
      if (attempts++ > 30 || !currentStep.target) return;
      const el = document.querySelector(currentStep.target);
      if (el) {
        updateCutout();
        const r = el.getBoundingClientRect();
        if (r.bottom > window.innerHeight - 80 || r.top < 80)
          { el.scrollIntoView({ behavior: 'smooth', block: 'center' }); setTimeout(updateCutout, 500); }
        return;
      }
      retryRef.current = setTimeout(tryFind, 200);
    };
    retryRef.current = setTimeout(tryFind, 200);
    observerRef.current = new MutationObserver(() => updateCutout());
    observerRef.current.observe(document.body, { childList: true, subtree: true });
    window.addEventListener('scroll', updateCutout, true);
    window.addEventListener('resize', updateCutout);
    return () => {
      clearTimeout(retryRef.current);
      observerRef.current?.disconnect();
      window.removeEventListener('scroll', updateCutout, true);
      window.removeEventListener('resize', updateCutout);
    };
  }, [demoState.isActive, demoState.currentStep, demoState.phase, currentStep, updateCutout]);

  // ── Target click listener (user clicks the highlighted element) ──
  useEffect(() => {
    if (!demoState.isActive || !currentStep?.target) return;
    const el = document.querySelector(currentStep.target) as HTMLElement | null;
    if (!el) return;
    const handler = () => {
      // Ignore clicks we triggered ourselves
      if (programmaticClickRef.current) { programmaticClickRef.current = false; return; }
      setTimeout(() => handleNext(true), 50);
    };
    el.addEventListener('click', handler, { once: true });
    return () => el.removeEventListener('click', handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [demoState.isActive, demoState.currentStep, demoState.phase, currentStep?.target, cutout]);

  // ── Tooltip positioning ──
  useEffect(() => {
    const tw = 400; const th = 180;
    if (isCentered || !cutout) {
      setTooltipPos({ x: window.innerWidth / 2 - tw / 2, y: window.innerHeight / 2 - th / 2 });
      return;
    }
    const pos = currentStep?.position ?? 'bottom';
    let x = 0, y = 0;
    switch (pos) {
      case 'top':    x = cutout.x + cutout.w / 2 - tw / 2; y = cutout.y - th - 16; break;
      case 'left':   x = cutout.x - tw - 16;               y = cutout.y + cutout.h / 2 - th / 2; break;
      case 'right':  x = cutout.x + cutout.w + 16;         y = cutout.y + cutout.h / 2 - th / 2; break;
      default:       x = cutout.x + cutout.w / 2 - tw / 2; y = cutout.y + cutout.h + 16; break;
    }
    x = Math.max(16, Math.min(x, window.innerWidth - tw - 16));
    y = Math.max(16, Math.min(y, window.innerHeight - th - 16));
    setTooltipPos({ x, y });
  }, [cutout, isCentered, currentStep?.position]);

  // Helper: programmatic click that won't trigger our own target listener
  const safeClick = (sel: string) => {
    const el = document.querySelector(sel) as HTMLElement | null;
    if (!el) return;
    programmaticClickRef.current = true;
    el.click();
  };

  // ── handleNext ──
  const handleNext = useCallback(async (userInitiated = false) => {
    if (busy || !currentStep) return;
    setBusy(true);
    try {
      switch (currentStep.id) {

        // ═══ LANDING ═══
        case 'welcome-demo': {
          setDemoMode(true);
          localStorage.setItem('demo-user-type', 'sponsor');
          setDemoUser('sponsor');
          window.dispatchEvent(new CustomEvent('demo-user-changed', { detail: { userType: 'sponsor' } }));
          persistPhaseToStorage('sponsor-tour', 'sponsor');
          setPhase('sponsor-tour');
          await sleep(150);
          navigate('/dashboard');
          return;
        }

        // ═══ SPONSOR TOUR ═══
        case 'sponsor-dashboard': {
          nextStep();
          return;
        }

        case 'sponsor-find-creators': {
          if (!userInitiated) safeClick('[data-demo="find-creators"]');
          await waitForEl('[data-demo="campaign-dialog"]');
          await sleep(300);
          nextStep();
          return;
        }

        case 'sponsor-campaign-form': {
          window.dispatchEvent(new Event('demo-fill-campaign'));
          await sleep(600);
          nextStep();
          return;
        }

        case 'sponsor-campaign-submit': {
          if (!userInitiated) safeClick('[data-demo="campaign-submit"]');
          await waitForEl('[data-demo="first-match"]', 15000);
          await sleep(300);
          nextStep();
          return;
        }

        case 'sponsor-match-result': {
          // Read the handle BEFORE closing (button is inside the dialog)
          const analyzeBtn = document.querySelector('[data-demo="first-match-analyze"]') as HTMLElement | null;
          const handle = analyzeBtn?.dataset?.demoHandle || '@mkbhd';
          // Close dialog, then navigate to discover
          window.dispatchEvent(new Event('demo-close-dialog'));
          await sleep(300);
          navigate(`/discover?handle=${encodeURIComponent(handle)}`);
          await sleep(400);
          nextStep();
          return;
        }

        case 'sponsor-analyze': {
          // Click the Analyze Creator button and wait for results
          if (!userInitiated) safeClick('[data-demo="analyze-button"]');
          // Wait for real API results (up to 90s)
          await waitForEl('[data-demo="niche-results"]', 90000);
          await sleep(300);
          nextStep();
          return;
        }

        case 'sponsor-niches':
        case 'sponsor-transcripts': {
          nextStep();
          return;
        }

        case 'sponsor-analytics': {
          persistPhaseToStorage('transition', 'sponsor');
          setPhase('transition');
          await sleep(100);
          navigate('/');
          return;
        }

        // ═══ TRANSITION ═══
        case 'sponsor-transition': {
          localStorage.setItem('demo-user-type', 'creator');
          setDemoUser('creator');
          window.dispatchEvent(new CustomEvent('demo-user-changed', { detail: { userType: 'creator' } }));
          persistPhaseToStorage('creator-tour', 'creator');
          setPhase('creator-tour');
          await sleep(150);
          navigate('/dashboard');
          return;
        }

        // ═══ CREATOR TOUR ═══
        case 'creator-dashboard':
        case 'creator-ai-score':
        case 'creator-campaigns':
        case 'creator-marketplace':
        case 'creator-leaderboard':
        case 'creator-analytics': {
          nextStep();
          return;
        }

        case 'creator-matches': {
          if (!userInitiated) navigate('/matches');
          await sleep(300);
          nextStep();
          return;
        }

        case 'creator-swipe': {
          const card = document.querySelector('[data-demo="swipe-card-top"]') as HTMLElement | null;
          if (card) {
            card.style.transition = 'transform 0.8s cubic-bezier(.2,0,0,1), opacity 0.6s';
            card.style.transform = 'translateX(150%) rotate(20deg)';
            card.style.opacity = '0';
          }
          await sleep(1200);
          navigate('/dashboard');
          await sleep(400);
          nextStep();
          return;
        }

        case 'creator-messages': {
          setPhase('complete');
          return;
        }

        case 'demo-complete': {
          exitDemo();
          return;
        }

        default: { nextStep(); return; }
      }
    } finally { setBusy(false); }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [busy, currentStep, nextStep, navigate, setPhase, setDemoUser, exitDemo]);

  // ── Render ──
  if (!demoState.isActive || !currentStep) return null;
  const isFirstStep = demoState.currentStep === 0 && demoState.phase === 'landing';
  const isComplete = currentStep.id === 'demo-complete';
  const globalStep = (PHASE_OFFSETS[demoState.phase] ?? 0) + demoState.currentStep;

  return (
    <AnimatePresence>
      <motion.div className="fixed inset-0 z-[10000]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} style={{ pointerEvents: 'none' }}>
        <svg width="100%" height="100%" className="absolute inset-0" style={{ pointerEvents: 'none' }}>
          <defs>
            <mask id="demo-cutout-mask">
              <rect width="100%" height="100%" fill="white" />
              {cutout && <motion.rect animate={{ x: cutout.x, y: cutout.y, width: cutout.w, height: cutout.h }} transition={{ type: 'spring', stiffness: 300, damping: 30 }} rx={12} fill="black" />}
            </mask>
          </defs>
          <rect width="100%" height="100%" fill="rgba(0,0,0,0.7)" mask={cutout ? 'url(#demo-cutout-mask)' : undefined} />
        </svg>

        {cutout ? (<>
          <div className="fixed left-0 right-0 top-0" style={{ height: Math.max(0, cutout.y), pointerEvents: 'auto' }} />
          <div className="fixed left-0 right-0 bottom-0" style={{ top: cutout.y + cutout.h, pointerEvents: 'auto' }} />
          <div className="fixed left-0" style={{ top: cutout.y, width: Math.max(0, cutout.x), height: cutout.h, pointerEvents: 'auto' }} />
          <div className="fixed right-0" style={{ top: cutout.y, left: cutout.x + cutout.w, height: cutout.h, pointerEvents: 'auto' }} />
        </>) : (<div className="fixed inset-0" style={{ pointerEvents: 'auto' }} />)}

        <motion.div className="absolute z-[10001]" style={{ left: tooltipPos.x, top: tooltipPos.y, width: 400, pointerEvents: 'auto' }} initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} key={`${demoState.phase}-${demoState.currentStep}`} transition={{ duration: 0.3, ease: 'easeOut' }}>
          <Card className="bg-white/95 backdrop-blur-md border border-purple-200 shadow-2xl">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 pr-2">
                  <h3 className="text-base font-semibold text-gray-900 mb-1 leading-tight">{currentStep.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{currentStep.description}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={exitDemo} className="ml-2 text-gray-400 hover:text-gray-600 -mt-1 -mr-1"><X className="h-4 w-4" /></Button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">{globalStep + 1}/{GLOBAL_TOTAL_STEPS}</span>
                  <div className="flex gap-0.5">
                    {Array.from({ length: GLOBAL_TOTAL_STEPS }, (_, i) => (
                      <div key={i} className={`w-1.5 h-1.5 rounded-full transition-colors ${i <= globalStep ? 'bg-purple-500' : 'bg-gray-300'}`} />
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {!isFirstStep && demoState.currentStep > 0 && (
                    <Button variant="outline" size="sm" onClick={previousStep} className="text-xs px-2" disabled={busy}><ArrowLeft className="h-3 w-3" /></Button>
                  )}
                  <Button size="sm" onClick={() => handleNext(false)} disabled={busy} className="text-xs bg-purple-600 hover:bg-purple-700 px-3">
                    {busy ? <span className="animate-pulse">...</span> : isComplete ? 'Finish' : <>Next <ArrowRight className="h-3 w-3 ml-1" /></>}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="absolute top-4 right-4" style={{ pointerEvents: 'auto' }}>
          <Button variant="secondary" onClick={exitDemo} className="bg-white/90 hover:bg-white text-gray-900 shadow-lg">Exit Demo</Button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
