import { products } from '@/components/products'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export function FeeTable({ product: productKey }) {
  const product = products.find((p) => p.name.toLowerCase() === productKey?.toLowerCase())
  const fees = product?.fees

  if (!fees || fees.length === 0) {
    return null
  }

  return (
    <div className="not-prose my-8">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Instruction</TableHead>
            <TableHead>Payer</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Notes</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {fees.map((fee, index) => (
            <TableRow key={index}>
              <TableCell className="font-mono">{fee.instruction}</TableCell>
              <TableCell>{fee.payer}</TableCell>
              <TableCell className="font-mono">{fee.amount}</TableCell>
              <TableCell>{fee.notes || '-'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
