import Image from "next/image"

interface MockupProps {
  reverse?: boolean,
  title: string,
  body:string
}

const Mockup = ({ reverse, title, body }: MockupProps) => {
  return (
    <div
      className={`flex flex-col md:flex-row items-center justify-center gap-54 ${reverse ? "md:flex-row-reverse" : ""
        }`}
    >
      <Image
        src="/image.png"
        width={260}
        height={260}
        alt="mockup"
        className="rounded-xl"
      />

      <div className="max-w-70 h-fit space-y-3 bg-card-light dark:bg-card-dark p-6 rounded-xl text-txt-light dark:text-txt-dark">
        <h3 className="text-3xl font-semibold leading-tight">
          {title}
        </h3>
        <p className="text-card-body-light dark:text-card-body-dark">
          {body}
        </p>
      </div>
    </div>
  )
}

export default Mockup
