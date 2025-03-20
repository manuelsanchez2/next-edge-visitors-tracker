import { deleteOldVisitors } from '@/drizzle/queries'

function DeleteButton() {
  return (
    <button
      onClick={async () => {
        console.log('Deleting old entries...')
        await deleteOldVisitors()
      }}
      className="bg-black border text-white px-2 py-1 rounded-md absolute right-3 bottom-3 cursor-pointer hover:bg-zinc-900"
    >
      Delete old entries
    </button>
  )
}
export default DeleteButton
