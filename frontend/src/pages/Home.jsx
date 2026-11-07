import { signInWithPopup } from "firebase/auth";
import React from "react";
import { auth, googleProvider } from "../../utils/firebase";
import api from "../../utils/axios";
import { FcGoogle } from "react-icons/fc";
import { useDispatch, useSelector } from "react-redux";
import { setUserdata } from "../redux/userSlice";
import SideBar from "../components/SideBar";
import ChatArea from "../components/ChatArea";
import Artifact from "../components/Artifact";

function Home() {
  const { userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const handleLogin = async (token) => {
    try {
      const { data } = await api.post("/api/auth/login", { token });
      dispatch(setUserdata(data));
    } catch (error) {
      console.log(error);
    }
  };

  const googleLogin = async () => {
    const data = await signInWithPopup(auth, googleProvider);
    const token = await data.user.getIdToken();
    console.log(token);
    await handleLogin(token);
    console.log(data);
  };
  return (
    <div className="h-screen  flex bg-[#0d0f14] text-white overflow-hidden">
      <SideBar />
      <ChatArea />
      <Artifact />

      {!userData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#08090d]/75 backdrop-blur-md px-4">
          <div className="relative w-full max-w-[380px] overflow-hidden rounded-3xl border border-white/[0.09] bg-[#10121a] shadow-[0_25px_80px_rgba(0,0,0,0.65)]">
            {/* Subtle top glow */}
            <div className="absolute -top-24 left-1/2 h-40 w-64 -translate-x-1/2 rounded-full bg-violet-600/20 blur-[70px]" />

            <div className="relative flex flex-col gap-7 p-8">
                
              {/* Logo */}
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-400/20 bg-gradient-to-br from-violet-500/20 to-indigo-500/10 shadow-lg shadow-violet-500/10">
                  <span className="text-2xl font-bold text-violet-300">T</span>
                </div>

                <div className="flex flex-col gap-2">
                  <h2 className="text-2xl font-bold tracking-tight text-white">
                    Welcome to{" "}
                    <span className="bg-gradient-to-r from-violet-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                      TyrantAI
                    </span>
                  </h2>

                  <p className="mx-auto max-w-[270px] text-sm leading-relaxed text-slate-400">
                    Your personal AI workspace. Sign in to start exploring and
                    creating.
                  </p>
                </div>
              </div>

              {/* Divider */}
              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-white/[0.08]" />
                <span className="text-[10px] font-medium uppercase tracking-[2px] text-slate-600">
                  Get started
                </span>
                <div className="h-px flex-1 bg-white/[0.08]" />
              </div>

              {/* Google Login */}
              <button
                className="group flex w-full items-center justify-center gap-3 rounded-xl border border-white/[0.12] bg-white py-3 text-sm font-semibold text-[#171717] shadow-lg shadow-black/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-gray-100 hover:shadow-xl active:translate-y-0 active:scale-[0.98] cursor-pointer"
                onClick={googleLogin}
              >
                <FcGoogle size={19} />
                Continue with Google
              </button>

              {/* Footer */}
              <p className="text-center text-[11px] leading-relaxed text-slate-600">
                Sign in to access your AI conversations and workspace.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
