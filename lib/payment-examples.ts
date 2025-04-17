// This file contains example payment confirmation messages for testing purposes

export const paymentExamples = {
  tigo: [
    `TIGO PESA
Confirmed. Tsh 1,000/= sent to Ibrahim Msambwe (0712815726) on 16/04/2023 at 10:15 AM. Transaction ID: TXN123456. New balance: Tsh 5,000/=. Fee: Tsh 100/=.`,

    `TIGO PESA CONFIRMATION
You have sent Tsh 1,000/= to Ibrahim Msambwe (0712815726). 
Date: 16/04/2023 10:15 AM
Reference: CAR123
Transaction ID: TXN123456
Fee: Tsh 100/=
New Balance: Tsh 5,000/=
Thank you for using Tigo Pesa.`,
  ],

  mpesa: [
    `M-PESA
Confirmed. Ksh 1,000 sent to Ibrahim Msambwe 0712815726 on 16/04/2023 at 10:15 AM. Transaction cost: Ksh 100. New M-PESA balance is Ksh 5,000. Transaction ID: NLJ123456.`,

    `M-PESA CONFIRMATION
You have sent Ksh 1,000 to Ibrahim Msambwe on 16/04/2023 at 10:15 AM.
Transaction ID: NLJ123456
Cost: Ksh 100
New Balance: Ksh 5,000
Thank you for using M-PESA.`,
  ],

  airtel: [
    `AIRTEL MONEY
Transaction successful. You have sent Tsh 1,000 to Ibrahim Msambwe (0712815726). Transaction ID: ATML123456. Date: 16/04/2023 10:15 AM. Fee: Tsh 100. New balance: Tsh 5,000.`,

    `AIRTEL MONEY CONFIRMATION
Transaction: Send Money
Amount: Tsh 1,000
To: Ibrahim Msambwe (0712815726)
Date: 16/04/2023 10:15 AM
Transaction ID: ATML123456
Fee: Tsh 100
New Balance: Tsh 5,000
Thank you for using Airtel Money.`,
  ],
}

export const getRandomPaymentExample = (provider: "tigo" | "mpesa" | "airtel" = "tigo") => {
  const examples = paymentExamples[provider]
  const randomIndex = Math.floor(Math.random() * examples.length)
  return examples[randomIndex]
}
