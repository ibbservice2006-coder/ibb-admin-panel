import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Code, Copy, Play, CheckCircle, AlertCircle } from 'lucide-react'
import { useState } from 'react'

export default function SQLPreview({ sql, isValid, errors, onExecute }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(sql)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <Code className="h-4 w-4" />
            Generated SQL
            {isValid ? (
              <Badge className="bg-gray-700 hover:bg-gray-600 text-white gap-1">
                <CheckCircle className="h-3 w-3" />
                Valid
              </Badge>
            ) : (
              <Badge variant="destructive" className="gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.length} errors
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              disabled={!sql}
            >
              {copied ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </>
              )}
            </Button>
            <Button className="bg-gray-700 hover:bg-gray-600 text-white"
              size="sm"
              onClick={onExecute}
              disabled={!isValid || !sql}
            >
              <Play className="h-4 w-4 mr-2" />
              Execute
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* SQL Code */}
        <div className="relative">
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-xs font-mono">
            <code>{sql || '-- No query generated yet'}</code>
          </pre>
        </div>

        {/* Errors */}
        {!isValid && errors.length > 0 && (
          <div className="space-y-2">
            <div className="text-sm font-semibold text-destructive">Validation Errors:</div>
            <ul className="space-y-1">
              {errors.map((error, index) => (
                <li key={index} className="text-xs text-destructive flex items-start gap-2">
                  <AlertCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                  <span>{error}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
