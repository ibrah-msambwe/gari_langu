"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { getRandomPaymentExample } from "@/lib/payment-examples"
import { Copy } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function PaymentExampleHelper() {
  const [provider, setProvider] = useState<"tigo" | "mpesa" | "airtel">("tigo")
  const [exampleMessage, setExampleMessage] = useState(getRandomPaymentExample("tigo"))
  const { toast } = useToast()

  const generateExample = () => {
    setExampleMessage(getRandomPaymentExample(provider))
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(exampleMessage)
    toast({
      title: "Copied to clipboard",
      description: "You can now paste this example message in the verification field",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Verification Example</CardTitle>
        <CardDescription>Use these example messages to test the payment verification system</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <Select value={provider} onValueChange={(value: "tigo" | "mpesa" | "airtel") => setProvider(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select provider" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tigo">Tigo Pesa</SelectItem>
              <SelectItem value="mpesa">M-Pesa</SelectItem>
              <SelectItem value="airtel">Airtel Money</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={generateExample}>Generate Example</Button>
        </div>

        <div className="rounded-md border p-4 bg-muted/50">
          <pre className="whitespace-pre-wrap text-sm">{exampleMessage}</pre>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" onClick={copyToClipboard} className="w-full">
          <Copy className="mr-2 h-4 w-4" />
          Copy to Clipboard
        </Button>
      </CardFooter>
    </Card>
  )
}
