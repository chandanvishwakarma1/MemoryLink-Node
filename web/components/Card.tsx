import { Hourglass, LucideIcon, Sun } from "lucide-react"
import { Logo } from "./Logo"

interface CardProps{
    icon?: LucideIcon,
    title: string,
    body: string,
    custom?: boolean,
}
const Card = ({icon, title, body, icon: Icon, custom}:CardProps) => {
  return (
      <div className="max-w-80 h-fit space-y-3 p-6 rounded-xl text-txt-light bg-card-light dark:text-txt-dark dark:bg-card-dark">
        {custom ? (
          <Logo className="w-10 h-auto" strokeWidth={46} />
        ) : (Icon && <Icon />)}
        <h3 className="text-3xl font-semibold leading-tight">
          {title}
        </h3> 
        <p className="text-card-body-light dark:text-card-body-dark">
          {body}
        </p>
      </div>
  )
}

export default Card
