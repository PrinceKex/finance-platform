import { db } from '@/db/db'
import { accounts, categories, transactions } from '@/db/schema'
import { convertAmountToMilliunits } from '@/lib/utils'
import { eachDayOfInterval, format } from 'date-fns'

const generateTransactionsForDay = (day: Date) => {
 const numTransations = Math.floor(Math.random() * 4) + 1
 // transaction per day
 for (let i = 0; i < numTransations; i++) {
  const category =
   SEED_CATEGORIES[Math.floor(Math.random() * SEED_CATEGORIES.length)]
  const isExpense = Math.random() > 0.6 //60% chance of being an expense

  const amount = generateRandomAmount(category)
  const formattedAmount = convertAmountToMilliunits(
   isExpense ? -amount : amount
  )

  SEED_TRANSACTION.push({
   id: `transaction_${format(day, 'yyyY-MM-dd')}_${i}`,
   accountId: SEED_ACCOUNTS[0].id,
   categoryId: category.id,
   amount: formattedAmount,
   payee: `Payee ${i}`,
   notes: `Note ${i}`,
   date: day,
  })
 }
}

const generateTransactions = () => {
 const days = eachDayOfInterval({ start: defaultFrom, end: defaultTo })
 days.forEach((day) => generateTransactions(day))
}

generateTransactions()

const main = async () => {
 try {
  // Reset db
  await db.delete(transactions).execute()
  await db.delete(accounts).execute()
  await db.delete(categories).execute()

  // seed categories
  await db.insert(categories).values(SEED_CATEGORIES).execute()

  // seed accounts
  await db.insert(accounts).values(SEED_ACCOUNTS).execute()
  // seed categories
  await db.insert(transactions).values(SEED_TRANSACTIONS).execute()
 } catch (error) {
  console.error('Error during seed:', error)
  process.exit(1)
 }
}
