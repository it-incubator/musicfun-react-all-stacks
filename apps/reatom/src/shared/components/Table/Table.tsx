import { clsx } from 'clsx'
import type { ComponentProps, ReactNode } from 'react'

import s from './Table.module.css'

/*
 * Table
 */

export type TableProps = {
  children: ReactNode
  className?: string
} & ComponentProps<'table'>

export const Table = ({ children, className, ...props }: TableProps) => {
  return (
    <table className={clsx(s.table, className)} {...props}>
      {children}
    </table>
  )
}

/*
 * TableHead
 */

export type TableHeadProps = {
  children: ReactNode
  className?: string
} & ComponentProps<'thead'>

export const TableHead = ({ children, className, ...props }: TableHeadProps) => {
  return (
    <thead className={clsx(s.tableHead, className)} {...props}>
      {children}
    </thead>
  )
}

/*
 * TableBody
 */

export type TableBodyProps = {
  children: ReactNode
  className?: string
} & ComponentProps<'tbody'>

export const TableBody = ({ children, className, ...props }: TableBodyProps) => {
  return (
    <tbody className={clsx(s.tableBody, className)} {...props}>
      {children}
    </tbody>
  )
}

/*
 * TableRow
 */

export type TableRowProps = {
  children: ReactNode
  className?: string
} & ComponentProps<'tr'>

export const TableRow = ({ children, className, ...props }: TableRowProps) => {
  return (
    <tr className={clsx(s.tableRow, className)} {...props}>
      {children}
    </tr>
  )
}

/*
 * TableHeaderCell
 */

export type TableHeaderCellProps = {
  children?: ReactNode
  className?: string
} & ComponentProps<'th'>

export const TableHeaderCell = ({ children, className, ...props }: TableHeaderCellProps) => {
  return (
    <th className={clsx(s.tableHeaderCell, className)} {...props}>
      {children}
    </th>
  )
}

/*
 * TableCell
 */

export type TableCellProps = {
  children: ReactNode
  className?: string
} & ComponentProps<'td'>

export const TableCell = ({ children, className, ...props }: TableCellProps) => {
  return (
    <td className={clsx(s.tableCell, className)} {...props}>
      {children}
    </td>
  )
}
