import React, { useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAccount } from "wagmi";
import { useNavContext } from "@/src/context/navProvider";
import { shortenAddress } from "@/src/lib/address";
import { cn } from "@/src/lib/utils";

export const Sidebar = ({ paths = [] }) => {
  const { isOpen, isMobile, onClose } = useNavContext();
  const { address } = useAccount();
  const { pathname } = useLocation();

  const modalRef = useRef(null);

  useEffect(() => {
    const onDocumentClick = (event) => {
      if (!isMobile) return;
      const buttonEle = document.getElementById("modal-button");

      if (buttonEle?.contains(event.target)) return;
      if (modalRef.current?.contains(event.target)) return;
      onClose();
    };

    document.addEventListener("click", onDocumentClick);

    return () => {
      document.removeEventListener("click", onDocumentClick);
    };
  }, [isMobile, onClose]);

  return (
    <aside
      ref={modalRef}
      className={cn(
        "w-64 lg:h-screen min-w-[300px] flex flex-col h-screen bg-gray-100 fixed lg:sticky  bottom-0 top-0 overflow-y-auto p-8  z-50",
        {
          "animate-content-show left-0": isOpen,
          "animate-content-hide -left-96": !isOpen,
        }
      )}
    >
      <h2 className="text-2xl font-semibold italic">E-Voting</h2>

      <div className="border-y border-foreground/10 mt-8 py-3">
        <h2 className="font-medium">Your Wallet Address:</h2>
        <p className="text-foreground/60">
          {shortenAddress(address) || "NOT CONNECTED"}
        </p>
      </div>

      <div className="mt-10 grid gap-5">
        {paths.map(({ href, path, icon }, idx) => (
          <Link
            to={href}
            key={idx}
            className={cn(
              "group flex text-lg font-medium items-center gap-4 hover:bg-white rounded-md transition-all",
              {
                "bg-white": pathname.endsWith(href),
              }
            )}
          >
            <span className="group-hover:bg-primary/50 text-foreground p-2 rounded-md">
              {icon}
            </span>
            <p className="group-hover:text-foreground text-foreground/80">
              {path}
            </p>
          </Link>
        ))}
      </div>
    </aside>
  );
};
