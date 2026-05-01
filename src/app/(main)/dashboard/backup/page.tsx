/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Home, RefreshCcw, Database, Save } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
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

export default function ManageBackup() {
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [logs, setLogs] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [backupProgress, setBackupProgress] = useState(0)
  const [showProgressDialog, setShowProgressDialog] = useState(false)

  useEffect(() => {
    if (isLoading) {
      const timer = setInterval(() => {
        setBackupProgress((oldProgress) => {
          const newProgress = Math.min(oldProgress + 10, 100)
          if (newProgress === 100) {
            setIsLoading(false)
            setShowProgressDialog(false)
            setShowSuccess(true)
            setLogs(["Backup completed successfully at " + new Date().toLocaleString()])
            clearInterval(timer)
          }
          return newProgress
        })
      }, 800)

      return () => {
        clearInterval(timer)
      }
    }
  }, [isLoading])

  const handleBackup = () => {
    setOpenConfirmDialog(true)
  }

  const handleConfirmBackup = async () => {
    setOpenConfirmDialog(false)
    setShowProgressDialog(true)
    setIsLoading(true)
    setBackupProgress(0)

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_API_URL}/backup`)
      if (response.status === 200) {
        toast.success(`Backup completed successfully at ${new Date().toLocaleString()}`)
      } else {
        toast.error(`Failed to backup at ${new Date().toLocaleString()}`)
      }
    } catch (error:any) {
      console.error("Backup failed:", error)
      setIsLoading(false)
      setShowProgressDialog(false)
      setLogs(["Backup failed at " + new Date().toLocaleString() + " - " + error.message])
    }
  }

  const handleRefresh = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className=" mx-auto mt-8 bg-white p-8 rounded-md">
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
          <Save className="mr-2 h-4 w-4" />
          Manage Backup
        </span>
      </nav>

      <h1 className="mb-6 text-3xl font-semibold">Manage Backup</h1>

      {/* Action Buttons */}
      <div className="mb-6 flex space-x-4">
        <Button onClick={handleBackup} disabled={isLoading}>
          {isLoading ? (
            <>
              <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
              Backing up...
            </>
          ) : (
            "Manual Backup"
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
          <p className="text-sm text-muted-foreground">No logs found</p>
        )}
      </ScrollArea>

      {/* Confirmation Dialog */}
      <Dialog open={openConfirmDialog} onOpenChange={setOpenConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Backup</DialogTitle>
            <DialogDescription>
              Are you sure you want to perform a manual backup? This process cannot be interrupted once started.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenConfirmDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmBackup}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Progress Dialog */}
      <Dialog open={showProgressDialog} onOpenChange={setShowProgressDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Backup in Progress</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Progress value={backupProgress} className="w-full" />
            <p className="mt-2 text-center">Backup Progress: {backupProgress}%</p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Success Notification */}
      {showSuccess && (
        <Alert className="mt-4">
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>Backup Completed Successfully!</AlertDescription>
        </Alert>
      )}
    </div>
  )
}

