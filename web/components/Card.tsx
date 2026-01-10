interface CardProps{
    icon: string,
    title: string,
    body: string,
}
const Card = ({icon, title, body}:CardProps) => {
  return (
      <div className="max-w-70 h-fit space-y-3 bg-[#0a0a0a] p-6 rounded-xl text-white">
        <h3 className="text-3xl font-semibold leading-tight">
          {title}
        </h3>
        <p className="text-[#a1a1aa]">
          {body}
        </p>
      </div>
  )
}

export default Card
