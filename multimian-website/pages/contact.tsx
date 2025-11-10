import { useState } from 'react'

export default function Contact(){
  const [name,setName] = useState('')
  const [email,setEmail] = useState('')
  const [message,setMessage] = useState('')
  const [status,setStatus] = useState<'idle'|'sending'|'sent'|'error'>('idle')

  async function submit(e:React.FormEvent){
    e.preventDefault()
    setStatus('sending')
    try{
      const res = await fetch('/api/contact',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name,email,message})})
      if(res.ok){ setStatus('sent') } else { setStatus('error') }
    }catch(err){ setStatus('error') }
  }

  return (
    <div className="max-w-xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Contact</h2>
      <form onSubmit={submit} className="space-y-4">
        <input className="w-full p-3 border rounded" placeholder="Name" value={name} onChange={e=>setName(e.target.value)} required />
        <input className="w-full p-3 border rounded" placeholder="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
        <textarea className="w-full p-3 border rounded" placeholder="Message" value={message} onChange={e=>setMessage(e.target.value)} rows={6} required />
        <div>
          <button className="px-4 py-2 bg-sky-600 text-white rounded" type="submit" disabled={status==='sending'}>
            {status==='sending' ? 'Sending…' : 'Send message'}
          </button>
        </div>
        {status==='sent' && <p className="text-green-600">Thanks — we received your message.</p>}
        {status==='error' && <p className="text-red-600">There was an error. Try again later.</p>}
      </form>
    </div>
  )
}
