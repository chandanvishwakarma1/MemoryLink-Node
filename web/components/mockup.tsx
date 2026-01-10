import Image from "next/image"

interface MockupProps {
  reverse?: boolean
}

const Mockup = ({ reverse }: MockupProps) => {
  return (
    <div
      className={`flex items-center justify-center gap-54 ${reverse ? "flex-row-reverse" : ""
        }`}
    >
      <Image
        src="/image.png"
        width={260}
        height={260}
        alt="mockup"
        className="rounded-xl"
      />

      <div className="max-w-70 h-fit space-y-3 bg-[#0a0a0a] p-6 rounded-xl text-white">
        <h3 className="text-3xl font-semibold leading-tight">
          Beyond the Group Chat
        </h3>
        <p className="text-[#a1a1aa]">
          Group chats are messy. Photos get buried under text and links. We give
          your memories a dedicated home where they can breathe.
        </p>
      </div>
    </div>
  )
}

export default Mockup
