export function generateOtpCode(): string {
  const uniqueNumbers = new Set<number>()

  while (uniqueNumbers.size < 6) {
    const randomNumber = Math.floor(Math.random() * 10) // random number between 0 and 9
    uniqueNumbers.add(randomNumber)
  }

  return Array.from(uniqueNumbers).join('')
}