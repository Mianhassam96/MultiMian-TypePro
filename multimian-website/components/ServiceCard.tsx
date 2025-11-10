export default function ServiceCard({title, children}:{title:string; children:React.ReactNode}){
  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <h3 className="font-semibold mb-2">{title}</h3>
      <div className="text-sm text-gray-600">{children}</div>
    </div>
  )
}
