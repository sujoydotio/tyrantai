import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import MessageBubble from "./MessageBubble";
import LoadingAnimation from "./LoadingAnimation";

function MessageList() {
  const { selectedConversation } = useSelector((state) => state.conversation);
  const { messages, isLoading } = useSelector((state) => state.message);
  const bottemRef = useRef(null);

  useEffect(() => {
    requestAnimationFrame(() => {
      bottemRef?.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    });
  }, [messages?.length, isLoading]);

  return (
    <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {messages.length == 0 || !selectedConversation ? (
        <div className="h-full flex flex-col items-center justify-center gap-4 text-center">
          <div className="relative flex flex-col items-center gap-4 text-center">
            {/* Logo */}
            {/* <div className="group flex h-[68px] w-[68px] items-center justify-center rounded-[22px] border border-violet-400/20 bg-gradient-to-br from-violet-500/20 via-indigo-500/10 to-[#13151c] shadow-[0_0_35px_rgba(139,92,246,0.12)] transition-all duration-300 hover:scale-105 hover:border-violet-400/40">
    <span className="bg-gradient-to-br from-violet-300 to-indigo-400 bg-clip-text text-3xl font-bold text-transparent">
      T
    </span>
  </div> */}

            {/* Heading */}
            <h1 className="text-[21px] font-bold tracking-tight bg-gradient-to-r from-violet-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
              TyrantAI
            </h1>

            {/* Main text */}
            <p className="text-2xl font-semibold leading-tight tracking-tight text-slate-200 sm:text-[20px]">
              How can I help you{" "}
              <span className="bg-gradient-to-r from-violet-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                today?
              </span>
            </p>

            {/* Subtitle */}
            <p className="max-w-[290px] text-[13px] leading-6 text-slate-500">
              Ask me anything — code, ideas, explanations, or just a quick
              question.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-2 mt-1">
            {[
              "Write a Netflix clone",
              "Explain Redis",
              "Build a dashboard",
            ].map((s, i) => (
              <button
                key={s}
                className="text-[12px] text-slate-400 bg-white/[0.04] border border-white/[0.07] px-3.5 py-1.5 rounded-lg hover:bg-white/[0.08] hover:text-slate-200 transition-colors duration-150 cursor-pointer"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          {messages?.map((msg, i) => (
            <div  key={msg._id || `${msg.role}-${i}`}>
              <MessageBubble
                role={msg?.role}
                content={msg?.content}
                images={msg.images || []}
              />
            </div>
          ))}

          {isLoading && <LoadingAnimation />}
        </div>
      )}
      <div ref={bottemRef} />
    </div>
  );
}

export default MessageList;
