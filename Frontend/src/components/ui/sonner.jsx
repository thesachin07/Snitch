import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner";
import { HugeiconsIcon } from "@hugeicons/react"
import { CheckmarkCircle02Icon, InformationCircleIcon, Alert02Icon, MultiplicationSignCircleIcon, Loading03Icon } from "@hugeicons/core-free-icons"

const Toaster = ({
  ...props
}) => {
  const { theme = "system" } = useTheme()

  return (
   <Sonner
  theme={theme}
  position="top-right"
  className="toaster group"
  toastOptions={{
    classNames: {
      toast:
        "group toast w-[340px] rounded-none border border-[#e4e2df] bg-[#fbf9f6] text-[#1b1c1a] shadow-[0_12px_35px_rgba(0,0,0,0.08)]",
      title: "text-[11px] uppercase tracking-[0.18em] font-medium text-[#1b1c1a]",
      description: "text-xs text-[#7A6E63] mt-1",
      success: "border-[#C9A96E]",
      error: "border-[#b86b6b]",
      closeButton:
        "border-[#e4e2df] text-[#7A6E63] hover:bg-[#f5f3f0]",
    },
  }}
  {...props}
/>
  );
}

export { Toaster }
