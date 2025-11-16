import React from 'react'

type Props = { value: string[], onChange: (v:string[])=>void }

export default function KeywordInput({ value, onChange }:Props){
  const [text,setText] = React.useState('')
  const add = ()=>{ if(!text.trim()) return; if(value.length>=10) return; onChange([...value, text.trim()]); setText('') }
  const remove = (i:number)=> onChange(value.filter((_,idx)=>idx!==i))
  return (
    <div>
      <div className='flex gap-2'>
        <input value={text} onChange={e=>setText(e.target.value)} className='flex-1 border px-3 py-2 rounded' placeholder='keyword (max 10)' />
        <button type='button' onClick={add} className='bg-gray-200 px-3 rounded'>Add</button>
      </div>
      <div className='flex gap-2 mt-2 flex-wrap'>
        {value.map((k,i)=> (
          <span key={i} className='bg-gray-100 px-3 py-1 rounded flex items-center gap-2'>
            {k}
            <button onClick={()=>remove(i)} className='text-xs text-red-600 ml-2'>x</button>
          </span>
        ))}
      </div>
    </div>
  )
}
