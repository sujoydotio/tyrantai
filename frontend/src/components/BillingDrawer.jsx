import React from "react";
import { AnimatePresence, motion } from "motion/react";
import { Crown, X } from "lucide-react";
import { useSelector } from "react-redux";
import { createOrder } from "../features/createOrder";
import { verifyPayment } from "../features/verifyPayment";
function BillingDrawer({ open, onClose }) {
  const { userData } = useSelector((state) => state.user);

  const handleUpgrade = async (plan) => {
    try {
      const data = await createOrder(plan);
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data?.order?.amount,
        currency: data?.order?.currency,
        name: "TyrantAI",
        description: `${data?.plan?.name} Plan`,
        order_id: data?.order?.id,
        handler: async (response) => {
          try {
            const data = await verifyPayment(response);
            console.log(data);
          } catch (error) {
            console.log(error);
          }
        },
        theme: {
          color: "#4F46E5",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <AnimatePresence>
      {open && (
        <>
          {" "}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-40"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.25 }}
            className="fixed right-0 top-0 z-50 h-screen w-[380px] bg-[#0f1117] border-l border-white/10 shadow-2xl flex flex-col"
          >
            {/* Billing heading */}
            <div className="flex items-center justify-between border-b border-white/[0.07] bg-gradient-to-r from-[#151720] to-[#10121a] px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-amber-400/20 bg-amber-400/[0.08] shadow-lg shadow-amber-500/[0.05]">
                  <Crown
                    size={23}
                    strokeWidth={1.8}
                    className="text-amber-400"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <h2 className="text-lg font-semibold tracking-tight text-white">
                    Billing
                  </h2>
                  <p className="text-xs font-medium tracking-wide text-slate-500">
                    Plans & Credits
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                type="button"
                aria-label="Close billing"
                className="group flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.03] text-slate-400 transition-all duration-200 hover:border-violet-400/20 hover:bg-violet-500/10 hover:text-violet-300 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/50"
              >
                <X
                  size={18}
                  strokeWidth={1.8}
                  className="transition-transform duration-200 group-hover:rotate-90"
                />
              </button>
            </div>

            {/* Current plan showing div */}

            <div className="px-5 py-1">
              <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br from-[#191c28] via-[#131620] to-[#10121a] px-4 py-3 shadow-lg shadow-black/20 transition-all duration-300 hover:border-violet-400/20">
                {/* Subtle background glow */}
                <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-violet-500/[0.10] blur-3xl" />

                {/* Plan Header */}
                <div className="relative flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-[11px] font-semibold uppercase tracking-[1.8px] text-slate-500">
                      Current Subscription
                    </p>

                    <h3 className="text-xl font-bold capitalize tracking-tight text-white">
                      {userData?.plan || "free"}
                    </h3>

                    <span className="inline-flex items-center rounded-full border border-violet-400/20 bg-violet-500/10 px-2.5 py-1 text-[10px] font-medium text-violet-300">
                      Active Plan
                    </span>
                  </div>
                </div>

                {/* Credits Section */}
                <div className="relative mt-3 border-t border-white/[0.07] pt-3">
                  {(() => {
                    const credits = userData?.credits ?? 0;
                    const totalCredits = userData?.totalCredits ?? 100;

                    const remainingPercentage =
                      totalCredits > 0
                        ? Math.min(
                            100,
                            Math.max(0, (credits / totalCredits) * 100),
                          )
                        : 0;

                    return (
                      <>
                        <div className="mb-2 flex items-center justify-between">
                          <div className="flex flex-col gap-1">
                            <span className="text-xs font-medium text-slate-400">
                              Available Credits
                            </span>
                            <span className="text-[11px] text-slate-600">
                              Your current usage balance
                            </span>
                          </div>

                          <div className="text-right">
                            <span className="text-sm font-semibold tabular-nums text-white">
                              {credits}
                              <span className="text-slate-500">
                                {" "}
                                / {totalCredits}
                              </span>
                            </span>
                            <p className="mt-1 text-xs font-semibold text-violet-400">
                              {remainingPercentage.toFixed(1)}% remaining
                            </p>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="h-1 overflow-hidden rounded-full bg-white/[0.07]">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-400 shadow-[0_0_12px_rgba(139,92,246,0.35)] transition-all duration-700 ease-out"
                            style={{ width: `${remainingPercentage}%` }}
                          />
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>

            {/* Subscription */}

            <div
              className="flex-1 overflow-y-auto space-y-4 px-5 pb-6
  [scrollbar-width:none]
  [&::-webkit-scrollbar]:hidden"
            >
              {/* Starter Plan */}
              <div className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#141720] p-5 transition-all duration-300 hover:border-violet-400/30 hover:bg-[#171a25]">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-semibold text-white">
                      Starter Plan
                    </h3>
                    <p className="mt-1 text-xs text-slate-500">
                      Perfect for getting started
                    </p>
                  </div>

                  <span className="rounded-full border border-violet-400/30 bg-violet-500/15 px-3 py-1 text-[10px] font-semibold tracking-wide text-violet-300">
                    STARTER
                  </span>
                </div>

                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-3xl font-bold tracking-tight text-white">
                    ₹199
                  </span>
                  <span className="text-xs text-slate-500">/ plan</span>
                </div>

                <div className="my-4 h-px bg-white/[0.07]" />

                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  What's included
                </p>

                <div className="space-y-3">
                  {[
                    "500 AI credits",
                    "PDFs and Images and Document Analysis",
                    "AI-powered conversations",
                    "Code generation and explanations",
                  ].map((benefit) => (
                    <div key={benefit} className="flex items-center gap-2.5">
                      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-violet-500/10">
                        <span className="text-[11px] text-violet-400">✓</span>
                      </div>
                      <span className="text-xs text-slate-300">{benefit}</span>
                    </div>
                  ))}
                </div>

                <button
                  className="mt-6 w-full rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-900/20 transition-all duration-200 hover:from-violet-500 hover:to-indigo-500 hover:shadow-violet-500/20 active:scale-[0.98]"
                  onClick={() => handleUpgrade("starter")}
                >
                  Upgrade to Starter
                </button>
              </div>

              {/* Pro Plan */}
              <div className="group relative overflow-hidden rounded-2xl border border-violet-500/30 bg-gradient-to-b from-violet-500/[0.09] to-[#141720] p-5 shadow-lg shadow-violet-950/10 transition-all duration-300 hover:border-violet-400/50">
                {/* Recommended Badge */}
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-semibold text-white">
                      Pro Plan
                    </h3>
                    <p className="mt-1 text-xs text-slate-400">
                      For a powerful AI experience
                    </p>
                  </div>

                  <span className="rounded-full border border-violet-400/30 bg-violet-500/15 px-3 py-1 text-[10px] font-semibold tracking-wide text-violet-300">
                    POPULAR
                  </span>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold tracking-tight text-white">
                    ₹499
                  </span>
                  <span className="text-xs text-slate-500">/ plan</span>
                </div>

                <div className="my-4 h-px bg-white/[0.08]" />

                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Everything in Starter, plus
                </p>

                <div className="space-y-3">
                  {[
                    "1000 AI credits",
                    "Voice chat experience",
                    "More room for AI-powered tasks",
                  ].map((benefit) => (
                    <div key={benefit} className="flex items-center gap-2.5">
                      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-violet-500/15">
                        <span className="text-[11px] text-violet-300">✓</span>
                      </div>
                      <span className="text-xs text-slate-200">{benefit}</span>
                    </div>
                  ))}
                </div>

                <button
                  className="mt-6 w-full rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-900/20 transition-all duration-200 hover:from-violet-500 hover:to-indigo-500 hover:shadow-violet-500/20 active:scale-[0.98]"
                  onClick={() => handleUpgrade("pro")}
                >
                  Upgrade to Pro
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default BillingDrawer;
