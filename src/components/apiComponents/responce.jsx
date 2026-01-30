import { Fence } from '../Fence'

const Responce = ({ responce }) => {
  return (
    <div className="flex flex-col w-full overflow-hidden">
      <div className="mb-2 text-sm font-medium text-muted-foreground">Response</div>
      <Fence className="w-full" language="json">
        {JSON.stringify(responce, null, 2)}
      </Fence>
    </div>
  )
}

export default Responce
