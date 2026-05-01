/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import type React from "react"

import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface RadioInputProps {
  title: string
  defaultValue?: string
  onChange?: (value: boolean) => void
  name?: string
  value: boolean
}

const RadioInput: React.FC<RadioInputProps> = ({ title, defaultValue = "false", onChange, value, name }) => {
  const handleValueChange = (newValue: string) => {
    // Convert string to boolean and call the onChange handler
    if (onChange) {
      onChange(newValue === "true")
    }
  }

  // Convert boolean value to string for RadioGroup
  const stringValue = value === true ? "true" : "false"

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <h1 className="font-semibold my-2 lg:my-4 text-blue-500 text-center md:text-start">{title}</h1>
      <RadioGroup value={stringValue} onValueChange={handleValueChange} name={name}>
        <div className="flex justify-center md:justify-start gap-4">
          <div className="flex items-center gap-2">
            <RadioGroupItem value="true" id={`${name}-yes`} />
            <Label htmlFor={`${name}-yes`}>Yes</Label>
          </div>

          <div className="flex items-center gap-2">
            <RadioGroupItem value="false" id={`${name}-no`} />
            <Label htmlFor={`${name}-no`}>No</Label>
          </div>
        </div>
      </RadioGroup>
    </div>
  )
}

export default RadioInput
