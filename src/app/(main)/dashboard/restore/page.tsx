/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useEffect } from "react"
import { Home, RefreshCcw, RotateCcw, Database } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ScrollArea } from "@/components/ui/scroll-area"
import toast from "react-hot-toast"

export default function ManageRestore() {
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [logs, setLogs] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [restoreProgress, setRestoreProgress] = useState(0)
  const [showProgressDialog, setShowProgressDialog] = useState(false)
  const [selectedBackup, setSelectedBackup] = useState("")

  // Mock backup list - in a real application, this would be fetched from an API
  const backupList = ["Backup_2023-05-01_12:00:00", "Backup_2023-05-02_12:00:00", "Backup_2023-05-03_12:00:00"]

  useEffect(() => {
    if (isLoading) {
      const timer = setInterval(() => {
        setRestoreProgress((oldProgress) => {
          const newProgress = Math.min(oldProgress + 10, 100)
          if (newProgress === 100) {
            setIsLoading(false)
            setShowProgressDialog(false)
            setShowSuccess(true)
            setLogs([`Database restored successfully from ${selectedBackup} at ${new Date().toLocaleString()}`])
            clearInterval(timer)
          }
          return newProgress
        })
      }, 800)

      return () => {
        clearInterval(timer)
      }
    }
  }, [isLoading, selectedBackup])

  const handleRestore = () => {
    if (selectedBackup) {
      setOpenConfirmDialog(true)
    }
  }

  const handleConfirmRestore = async () => {
    setOpenConfirmDialog(false)
    setShowProgressDialog(true)
    setIsLoading(true)
    setRestoreProgress(0)

    // Call the restore API
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/restore`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ backupName: selectedBackup }),
      })

      const data = await response.json()
      if (response.ok) {
        toast.success("Database restore successfully!")
        setLogs([`Database restore started for ${selectedBackup} at ${new Date().toLocaleString()}`])
      } else {
        throw new Error(data.message || "Restore failed")
      }
    } catch (error:any) {
      setLogs([`Error: ${error.message}`])
    }
  }

  const handleRefresh = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }

  return (
   <div className="bg-white p-8 rounded-md ">
 <div className="container mx-auto mt-8 ">
      {/* Breadcrumb Navigation */}
      <nav className="mb-6 flex items-center space-x-2 text-sm text-muted-foreground">
        <a href="/dashboard" className="flex items-center hover:text-foreground">
          <Home className="mr-2 h-4 w-4" />
          Dashboard
        </a>
        <span>/</span>
        <a href="/logs-backup" className="flex items-center hover:text-foreground">
          <Database className="mr-2 h-4 w-4" />
          Logs & Backup
        </a>
        <span>/</span>
        <span className="flex items-center text-foreground">
          <RotateCcw className="mr-2 h-4 w-4" />
          Manage Restore
        </span>
      </nav>

      <h1 className="mb-6 text-3xl font-semibold">Manage Restore</h1>

      {/* Backup Selection */}
      <div className="mb-6">
        <Select onValueChange={setSelectedBackup} value={selectedBackup}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Backup" />
          </SelectTrigger>
          <SelectContent>
            {backupList.map((backup) => (
              <SelectItem key={backup} value={backup}>
                {backup}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Action Buttons */}
      <div className="mb-6 flex space-x-4">
        <Button onClick={handleRestore} disabled={isLoading || !selectedBackup}>
          {isLoading ? (
            <>
              <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
              Restoring...
            </>
          ) : (
            "Restore Database"
          )}
        </Button>
        <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
          <RefreshCcw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* Logs Display */}
      <ScrollArea className="h-[200px] rounded-md border p-4">
        {logs.length > 0 ? (
          logs.map((log, index) => (
            <p key={index} className="text-sm text-muted-foreground">
              {log}
            </p>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">No restore logs found</p>
        )}
      </ScrollArea>

      {/* Confirmation Dialog */}
      <Dialog open={openConfirmDialog} onOpenChange={setOpenConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Database Restore</DialogTitle>
            <DialogDescription>
              Are you sure you want to restore the database from the backup "{selectedBackup}"? This process will
              overwrite the current database and cannot be interrupted once started.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenConfirmDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmRestore}>Confirm Restore</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Progress Dialog */}
      <Dialog open={showProgressDialog} onOpenChange={setShowProgressDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Database Restore in Progress</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Progress value={restoreProgress} className="w-full" />
            <p className="mt-2 text-center text-sm text-muted-foreground">{`${Math.round(restoreProgress)}%`}</p>
            <p className="mt-2 text-center">Please wait while the database is being restored...</p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Success Notification */}
      {showSuccess && (
        <Alert className="mt-4">
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>Database restored successfully!</AlertDescription>
        </Alert>
      )}
    </div>
   </div>
  )
}

