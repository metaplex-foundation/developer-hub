import { Fence } from '../Fence'

const Responce = ({ responce }) => {
  console.log(responce)
  return (
    <div className='w-full overflow-hidden'>
<Fence className="w-full" language="json">
      {JSON.stringify(responce, null, 2)}
    </Fence>
    </div>
    
  )
}

export default Responce
