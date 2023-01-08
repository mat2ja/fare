import type { Prisma } from '@prisma/client'
import { StatusCodes } from 'http-status-codes'
import { db } from '~~/lib/db'
import { sendCustomError, sendInternalError, setResStatus } from '~~/server/utils'
import { validEntryType } from '~~/utils/server/transaction'

export default defineEventHandler(async (event) => {
  const data = await readBody<Prisma.TransactionUncheckedCreateInput>(event)

  if (!validEntryType(data)) {
    return sendCustomError(event, StatusCodes.BAD_REQUEST, 'Invalid entry type logic')
  }

  try {
    const entry = await db.transaction.create({ data })

    setResStatus(event, StatusCodes.CREATED)
    return entry
  } catch (err: unknown) {
    sendInternalError(event, err)
  }
})
