//Client-side modal


import { CheckIcon, CopyIcon, X } from "lucide-react";
import { useState } from "react";

interface ModalProps {
  onClose  : () => void
}
export default function Modal({ onClose }: ModalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText("https://memorylink.vercel.app");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert("Failed to copy");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-back-light dark:bg-back-dark p-9 rounded-3xl shadow-2xl max-w-sm w-fit  mx-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-bold text-txt-light dark:text-txt-dark bg-amber-100">MemoryLink</h1>
          {/* <div className="bg-back-dark dark:bg-back-light rounded-full p-1"> */}
          <button
          type="button"
            onClick={onClose}
            className="bg-back-dark dark:bg-back-light rounded-full p-1 hover:opacity-80 transition"
            aria-label="Close modal"
          >
            <X size={16} className="text-txt-dark dark:text-txt-light" />
          </button>
          {/* </div>   */}
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4">Thanks! You are added to waitlist.</h2>
          <p className="text-gray-600 mb-6">
            We'll let you know when a spot opens up.
          </p>
        </div>
        <div className="flex flex-col  gap-6">
          <h2 className="font-semibold">Tell your friends</h2>
          <div className="flex  items-center gap-4">
            <svg className="w-6 h-auto" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" ><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>

            <svg className="w-6 h-auto" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" ><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>

            <svg className="w-6 h-auto" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" /></svg>

            <svg className="w-6 h-auto" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M3.468 1.948C5.303 3.325 7.276 6.118 8 7.616c.725-1.498 2.698-4.29 4.532-5.668C13.855.955 16 .186 16 2.632c0 .489-.28 4.105-.444 4.692-.572 2.04-2.653 2.561-4.504 2.246 3.236.551 4.06 2.375 2.281 4.2-3.376 3.464-4.852-.87-5.23-1.98-.07-.204-.103-.3-.103-.218 0-.081-.033.014-.102.218-.379 1.11-1.855 5.444-5.231 1.98-1.778-1.825-.955-3.65 2.28-4.2-1.85.315-3.932-.205-4.503-2.246C.28 6.737 0 3.12 0 2.632 0 .186 2.145.955 3.468 1.948" />
            </svg>

            <svg className="w-6 h-auto" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854zm4.943 12.248V6.169H2.542v7.225zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248S2.4 3.226 2.4 3.934c0 .694.521 1.248 1.327 1.248zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016l.016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225z" />
            </svg>
          </div>
          <div className="flex items-center justify-between gap-2 bg-back-dark dark:bg-back-light py-3 px-6 rounded-full text-txt-dark dark:text-txt-light">
            <span className=" break-all text-sm">
              https://memorylink.vercel.app
            </span>

            <button
              onClick={handleCopy}
              className="p-2 rounded-lg hover:bg-white/10 dark:hover:bg-black/10 transition"
              aria-label="Copy link"
            >
              {copied ? (
                <CheckIcon
                  size={16} />
              ) : (
                <CopyIcon size={16} />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}